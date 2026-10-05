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
    export OPENAI_API_KEY=...
    python -m ladder.run --dry     # cost estimate, no calls
    ./run.sh                       # full run, plot, hand-score sheet
    python -m ladder.hand_score agree   # after filling hand_score

Env: `GEN_MODEL` (gpt-4o-mini), `JUDGE_MODEL` (gpt-4o). Use a different model for judge than generator on purpose.
Outputs: `results/history.json`, `heldout_outputs.json`, `heldout_vs_iter.png`, `gain_per_dollar.md`, `hand_scores.csv`.

## Cost
About 5 layer runs x 5 evals x 12 briefs = ~300 generations (mini) and ~900 judge calls (4o), plus prompt-rewrite re-scoring. Estimate $3-8. Use `--iters 3 --judge-n 2` to halve it.
Not yet run. Prices in `ladder/llm.py` are hardcoded, check them.

## Publish to GitHub
    git init && git add -A && git commit -m "Layer ladder demo scaffold"
    gh repo create coframe-layer-ladder --public --source=. --push
    # no gh CLI: create the empty repo on github.com, then
    # git remote add origin git@github.com:kltdwrds/coframe-layer-ladder.git && git branch -M main && git push -u origin main
