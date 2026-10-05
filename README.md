# coframe-layer-ladder

A one-night experiment on where a self-improving copywriting loop should store what it learns, and on how much the
answer depends on the judge.

A cheap generator (Llama 3.1 8B) writes landing-page hero copy for 12 synthetic site briefs (8 train, 4 held-out).
Three ways of storing lessons are compared against a no-learning baseline:
- a running lesson in the prompt
- a GEPA-inspired system-prompt rewrite
- retrieved few-shot winners

The comparison was run twice, with a free-tier judge (Llama 3.3 70B) and a stronger one (DeepSeek v4 Pro). Then come a
static rubric-in-prompt control, cross-judging of every final output, and blind hand scores. Everything runs on
Cloudflare Workers AI through AI Gateway. Total spend was $3.99.

**Presentation:** [The judge, not the layer, decided the result](https://qyvr.dev/@kyle/coframe-judge-ladder) (13 slides)
· **Write-up:** [cll/WRITEUP.md](cll/WRITEUP.md)
· **Method, fixes and full findings:** [cll/README.md](cll/README.md)
· **Companion to:** [Learn where labels are cheap](https://qyvr.dev/@kyle/coframe-harness-notes)

## Findings

- **The judge outweighed every layer.** Swapping the judge moved base-prompt scores from 4.65 to 3.64. The 70B gave every
  run-1 output 5/5 on brand fit and claim safety.
- **No learned layer beat a one-line spec.** Under DeepSeek, putting the rubric and the brief's forbidden claims into the
  prompt scored +0.20 (p ≈ 0.004). The learned layers scored +0.01 to +0.07.
- **The judges barely agree on real outputs.** Both order planted calibration items perfectly. On the same 32 real
  outputs, their rank agreement is Spearman 0.16–0.26.
- **Against blind hand scores (n = 10)**, DeepSeek r = +0.53 and the 70B r = −0.45. The 70B scored 9 of 10 outputs 4.75
  or higher, including copy that invented "30%" improvement figures, which the hand scorer gave a 1.
- **What failed:** the one apparent lift (lessons, run 1) did not replicate under the second judge. The 8B reflector could
  not do the prompt-rewrite task. The noise band in the first analysis was wrong until an adversarial review caught it.

Small scale: 4 held-out briefs, so this design detects lifts of about 0.3 points or more. The details and caveats are in
the write-up.

## Run it

```bash
cd cll
# put CF_ACCOUNT_ID, CF_GATEWAY_NAME, CF_API_TOKEN in cll/.env
./run.sh --dry                                                    # cost estimate, no calls
JUDGE_MODEL=@cf/deepseek-ai/deepseek-v4-pro-0813 ./run.sh --judge-n 2
```

Artifacts are committed under `cll/results_70b/`, `cll/results/` and `cll/results_control/`. The deck source is
`cll/deck/`; refresh its numbers with `python -m ladder.deck_data`.
