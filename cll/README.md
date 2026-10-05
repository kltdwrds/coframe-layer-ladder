# coframe-layer-ladder

Cheapest-layer ladder: which kind of "learning" improves LLM-generated landing-page copy most per dollar,
measured on held-out briefs, with an LLM judge that is checked against human scores.

Task: given a site brief (audience, goal, voice), write HEADLINE / SUBHEAD / CTA.
Data: 12 synthetic briefs, 8 train / 4 held-out (`data/briefs.json`). Held-out is never used by any update step.

## Layers
1. `lesson_in_context`: after each train pass, distill the worst outputs into one lesson, prepend recent lessons.
2. `prompt_rewrite`: GEPA-style. Propose a rewritten system prompt, re-score on train, accept only if train score rises.
3. `retrieved_fewshot`: keep train outputs scoring >= 4.0, retrieve the 2 most similar (token overlap) as examples.
Plus `baseline` (no learning) for reference.

## Judge
`data/rubric.json`: brand fit, specificity, claim safety, goal fit (1-5). Judge runs at temp 0, repeated `--judge-n` (3) times and averaged.
Baseline is re-run `--baseline-runs` (3) times; the spread is the noise floor. Gains below it are not real.
Judge-check: `hand_score make` samples 10 held-out outputs into a CSV; you score them blind-ish, then `hand_score agree` prints Pearson r, mean abs diff, within-1-point rate.

## Run
Backend is Cloudflare Workers AI through AI Gateway (OpenAI-compatible route, openai SDK). Put these in `cll/.env` or export them:
`CF_ACCOUNT_ID`, `CF_GATEWAY_NAME`, `CF_API_TOKEN` (Workers AI + AI Gateway Read; turn gateway logging on for the trace).

    ./run.sh --dry                 # call count, $ and neuron estimate, no calls, no creds needed
    ./run.sh                       # full run, plot, gain table, blind hand-score sheet, gateway trace
    .venv/bin/python -m ladder.hand_score agree   # after filling hand_score

Env: `GEN_MODEL` (@cf/meta/llama-3.1-8b-instruct-fp8; the requested non-fp8 build was deprecated by Cloudflare on 2026-05-30), `JUDGE_MODEL` (@cf/meta/llama-3.3-70b-instruct-fp8-fast). Use a different model for judge than generator on purpose.
Outputs in `results/`: `history.json`, `heldout_outputs.json`, `heldout_vs_iter.png`, `gain_per_dollar.md`, `edit_log.jsonl` (diagnoses, lessons,
rewrite candidates with accept/reject, few-shot bank adds), `hand_scores.csv` + `hand_scores_key.json`, `judge_agreement.md`,
`gateway_trace.jsonl` + `gateway_trace_summary.md`, `run.log`. Every request carries `cf-aig-metadata` (layer, iter, phase, brief, role).

## Cost
Default run is ~1,144 calls (284 gens, 8 updates, 852 judge calls): ~$0.26 at list price, ~24k neurons. Workers AI's free tier is
10k neurons/day, so a full run needs Workers Paid or `--iters 3 --judge-n 2` (~13.5k neurons, still over). `--dry` prints the estimate.

## Changes from the scaffold
Backend: `llm.py` points the openai client at `gateway.ai.cloudflare.com/v1/<acct>/<gateway>/workers-ai/v1` (the `/v1` is needed because
the SDK appends `/chat/completions`). The scaffold had no Anthropic-specific code; it was already OpenAI chat-completions with a system
message, which Workers AI accepts as-is. JSON mode (`response_format: json_object`) is supported; replies that arrive as an already-parsed
object are re-serialised. No stop sequences or tool calls were used. Prices are now Workers AI list prices.

Bugs fixed:
- `retrieved_fewshot` crashed after its first update: result records had no `audience`, which retrieval reads. Its similarity was also a
  mismatched Jaccard (brief+audience on top, brief only on the bottom).
- `prompt_rewrite` gated candidates against a running max of noisy single train passes (winner's curse, so it rejects almost everything).
  It now compares against the incumbent's score on the same iteration's train pass.
- `tokens_cum` was the global running total, not per layer.
- `--dry` ignored the prompt-rewrite re-scoring and baseline noise runs and printed a hard-coded "$3-6".
- The plot had no noise band. It now shades the range of every base-prompt held-out run (3 extra baseline runs plus each layer's iter 0, which all use the same prompt).
- Gain per dollar now divides by learning cost (update calls plus re-scoring) rather than total cost, which is dominated by evaluation that every layer pays equally. Gain is measured against the pooled base mean, not one noisy iter-0 sample.
- Hand-scoring was not blind: the CSV showed the judge score. It also omitted the brief, so a human could not score brand or goal fit. Judge scores now go to a separate key file.
- Judge parsing crashed on non-JSON replies and accepted out-of-range or string scores. It now retries once and clamps to 1-5.
- New: `edit_log.jsonl` (the diagnosis/edit log), per-request gateway metadata, checkpointing after each layer, and `ladder/trace.py` for gateway logs.

Not changed (by design, noted as caveats): the generator is never shown `forbidden_claims` (only the judge is), so claim safety
is something layers must learn. Judge repeats at temp 0 mostly measure server nondeterminism, not judge variance.

## Findings (Oct 2026 run)

Two full runs on Workers AI through AI Gateway, same generator (llama-3.1-8b-instruct-fp8), same code, different judge.
Artifacts: `results_70b/` (judge llama-3.3-70b-instruct-fp8-fast) and `results/` (judge deepseek-v4-pro-0813).

### 1. The free-tier judge capped the loop (run 1)
Baseline held-out scored 4.56 of 5 on average (7 base-prompt runs), with a noise range of 0.71. Final held-out:
baseline 4.69, lesson 4.88, rewrite 4.81, few-shot 4.81. Three layers finish "above the band", but only by 0.06-0.13,
on one 4-brief draw, and the band's lower edge comes from a single outlier (lesson layer's iteration 0, before any
learning, at 4.04). **No gain in run 1 is distinguishable from noise.** The judge gave 5.0 to copy with a preamble,
markdown and a five-line layout, because the rubric has no format criterion.

### 2. Picking the judge by test (`ladder/calibrate.py`, train briefs only)
16 hand-written items: 5 good, 7 with one planted defect, 4 plausible but generic.

judge | defects caught | good | mediocre | defect | good-mediocre gap | repeat-inconsistent at temp 0 | $/call
--|--|--|--|--|--|--|--
llama-3.3-70b | 7/7 | 4.85 | 3.56 | 2.39 | +1.29 | 0/16 | 0.0002
deepseek-v4-pro | 7/7 | 4.90 | 2.50 | 1.88 | +2.40 | 9/16 | 0.0034
glm-5.3 | 7/7 | 4.80 | 2.66 | 2.27 | +2.14 | 7/16 | 0.0036

Every judge catches obvious defects. They differ on *mediocre* copy: the 70B scores generic copy that would fit any
business at 3.56 (one item at 4.0), which is why run 1 had no headroom. Its temp-0 repeats were identical on all
16 items, so the scaffold's 3x judge averaging bought nothing on that judge. The DeepSeek judge varies at temp 0, so
averaging does reduce noise there. Caveat: I wrote these labels, so this is a sanity check; the hand scores are the
independent test. kimi-k2.6 was dropped: its reasoning overran the token budget on the rubric prompt and returned
empty content.

### 3. Honest failures
- **Prompt rewrite never fired (run 1: 0 of 4 accepted).** The 8B rewriter returned hero copy instead of a prompt, or
  prompts locked to one train brief ("...for a savings account designed for freelancers"). Each candidate scored lower
  on train, and the gate rejected it. The accept-only-if-better gate was the only thing preventing harm, and the line
  on the plot is just the base prompt plus noise. A GEPA-style reflective edit needs a reflector stronger than the
  model it is editing.
- **The lesson distiller ignored "ONE short lesson"** and wrote numbered lists with preambles. The content was
  sensible (be specific, avoid absolute claims, make the CTA direct).
- **The few-shot bank was not selective under the lenient judge.** All 8 train outputs cleared the 4.0 threshold,
  including format-breaking ones, so judge leniency flowed straight into what the layer learned from.
- **Requested generator was gone.** `@cf/meta/llama-3.1-8b-instruct` was deprecated 2026-05-30 and returned 410; the
  fp8 build of the same model was used instead.

RUN2_PLACEHOLDER

## Publish to GitHub
    git init && git add -A && git commit -m "Layer ladder demo scaffold"
    gh repo create coframe-layer-ladder --public --source=. --push
    # no gh CLI: create the empty repo on github.com, then
    # git remote add origin git@github.com:kltdwrds/coframe-layer-ladder.git && git branch -M main && git push -u origin main
