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

Two full runs on Workers AI through AI Gateway: same generator (llama-3.1-8b-instruct-fp8) and code, different judge.
Then two controls. Artifacts: `results_70b/` (judge llama-3.3-70b, judge-n 3), `results/` (judge deepseek-v4-pro, judge-n 2),
`results_control/`, and `crossjudge.json` in each run dir. Total spend $3.99, including the calibration, the controls and one
aborted attempt. The presentation is `deck/` (`python -m ladder.deck_data` refreshes its numbers).

**Analysis rules** (`ladder/stats.py`):
- The null is every held-out run that used the base prompt: all baseline iterations, the extra baseline runs, each layer's
  iteration 0, and prompt-rewrite iterations before its first accepted candidate. Run 1 has 15 such runs, run 2 has 13.
- A layer's lift is its mean over iterations 1-4 minus the null mean. p is a one-sided permutation test against the null,
  used as a screen: 4 briefs and one generation per brief per run, so draws are not fully independent.
- At 80% power this design detects a lift of about 0.3 points. Effects smaller than that are not claimed.

### Headline
At this scale, **the judge decided the result, not the layer.** Swapping the judge moved base-prompt scores from 4.65 to 3.64.
No learned layer beat a one-line static prompt change. On the same outputs, the two judges barely agreed on which output was
better.

| | 70B judge | DeepSeek judge |
|---|---|---|
| Base-prompt mean (n) | 4.65 (15) | 3.64 (13) |
| Lesson in context, lift (p) | +0.16 (0.010) | +0.02 (0.45) |
| Prompt rewrite | base prompt throughout (0 of 4 accepted) | +0.07 (0.29), 1 of 4 accepted |
| Retrieved few-shot | +0.11 (0.08) | +0.01 (0.47) |
| **Static control: rubric + forbidden claims in the prompt** | +0.07 (0.31) | **+0.20 (0.004)** |
| Final outputs breaking the 3-line format (their mean score) | 14/16 (4.80) | 15/16 (3.68) |

### What holds up
1. **The 70B judge is saturated.** Every run-1 final output got 5 on brand fit and 5 on claim safety. Its scores have a
   spread of 0.13 against DeepSeek's 0.53 on the same outputs. This is consistent with leniency and score compression in
   rubric judges (Thakur et al. 2024). A Llama judge scoring Llama output may also prefer it (Panickssery et al. 2024); that
   is a hypothesis, not tested here.
2. **The spec beat the learners.** Under DeepSeek, putting the rubric and the brief's forbidden claims in the prompt scored
   +0.20 with no learning. The learned layers managed +0.01 to +0.07. The lessons mostly re-derived the rubric. The one
   accepted prompt rewrite was essentially "avoid absolute, unverifiable claims".
3. **Judges disagree on real outputs.** Calibration: on 16 known items, both judges rank every good item above every generic
   one and give the targeted criterion a 1 on every defect. Cross-judging: on the 32 actual final outputs, rank agreement is
   only Spearman 0.26 (run 1) and 0.16 (run 2). Ordering planted items correctly says little about ordering mid-quality ones.
4. **Temperature 0 is not deterministic, but it is not the main noise.** The 70B's repeats were identical on all 16
   calibration items, while DeepSeek's differed on 9 (consistent with Atil et al. 2024). Judge-repeat noise is only ~15% of
   the variance of a 4-brief mean in run 2. Generation and brief-to-brief variance dominate, so extra judge calls are the
   least useful place to spend.

5. **Against a human, the 70B judge told us nothing.** On 10 blind-scored run-2 outputs:

   | Judge vs hand | Pearson r | Mean abs diff |
   |---|---|---|
   | DeepSeek | +0.53 | 0.90 |
   | 70B | −0.45 | 2.04 |

   The 70B scored 9 of 10 at 4.75 or higher, including copy that invented "30%" and "25%" improvement figures, which the human scored 1. The hand scorer is the presenter, scored format as well, and used a shifted scale that was moved down 2 points; this affects bias, not correlation. n = 10, so the correlation is directional (95% CI about −0.15 to 0.87).

### Honest failures
- **The run-1 lesson lift did not replicate** under the second judge. Cross-judging does not settle why: DeepSeek also scores
  run 1's lesson outputs above that run's base-prompt outputs (3.78 vs 3.38), but with 4 briefs and one draw each, a small
  real effect and noise look the same. We claim neither.
- **Prompt rewrite (GEPA-inspired: one candidate, no Pareto selection, thin feedback) barely worked.** The 8B reflector
  returned hero copy or prompts locked to one train brief, in one case with "[Brand Name]" left in. A gym advert used as the
  system prompt scored within 0.08 of the real prompt on train, so the gate's rejections were mostly within one pass's noise.
  This is consistent with small optimisers failing the meta-task (Revisiting OPRO, 2024). ACE gets gains with one large model
  in every role, so the problem here is reflector size and feedback quality, not the layer as such.
- **The first analysis was wrong.** The noise band used 7 of the 15 base-prompt runs, and a final-iteration "gain". That made
  the base prompt look like it beat its own noise band. An adversarial review caught it, and `stats.py` replaces it.
- **Absolute thresholds import the judge's scale.** All 8 train outputs cleared the few-shot bar under the 70B, format breakers
  included.
- **Format went unpoliced.** The rubric has no format criterion, so outputs with preambles and markdown scored as high as clean
  ones. That belongs in code, not in a judge.
- **Infrastructure:** the requested `@cf/meta/llama-3.1-8b-instruct` was deprecated on 2026-05-30, so the fp8 build was used.
  Run 2's first attempt hit Workers AI per-minute limits. DeepSeek returned 14 transient HTTP 500s, all retried successfully.
  Kimi k2.6 was dropped as a judge because its reasoning overran the token budget and returned empty content.

### Caveats
12 synthetic briefs, one generator, one generation per brief per run. The calibration labels were written by the
experimenter. The decision to switch judges was made after seeing run 1's held-out ceiling, though calibration used train
briefs only. The judge-n differs between runs (3 vs 2); this hardly matters because the 70B's repeats were identical.

## Publish to GitHub
    git init && git add -A && git commit -m "Layer ladder demo scaffold"
    gh repo create coframe-layer-ladder --public --source=. --push
    # no gh CLI: create the empty repo on github.com, then
    # git remote add origin git@github.com:kltdwrds/coframe-layer-ladder.git && git branch -M main && git push -u origin main
