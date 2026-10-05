# Cheapest-layer ladder: companion write-up

## Thesis (one line)
At small scale the judge, not the lesson layer, decided the result: no learned layer beat writing the spec into the prompt, and two judges barely agreed on which output was better. Calibrate the evaluator, and give the loop what you already know, before comparing where it stores lessons.

## Setup
- **Task:** write HEADLINE / SUBHEAD / CTA for a site brief (audience, goal, voice, forbidden claims).
- **Data:** 12 synthetic briefs, 8 train and 4 held-out. Held-out briefs never reach any update step. The judge-calibration items use only train briefs, though the decision to switch judges came after seeing run 1's held-out ceiling.
- **Models:** Cloudflare Workers AI through AI Gateway (OpenAI-compatible route). Generator `llama-3.1-8b-instruct-fp8`, a deliberately cheap model with room to improve.
- **Judge:** rubric of brand fit, specificity, claim safety and goal fit (1-5 each), temp 0, repeated and averaged. Run 1 used `llama-3.3-70b-instruct-fp8-fast` (judge-n 3); run 2 used `deepseek-v4-pro-0813` (judge-n 2), chosen by calibration.
- **Protocol:** 4 learning iterations per layer, scoring train and held-out after each. The null pools every held-out run that used the base prompt (15 in run 1, 13 in run 2). A layer's lift is its mean over iterations 1-4 minus the null mean.
- **Trace:** every request carries gateway metadata (layer, iteration, phase, brief, role), and the AI Gateway logs are exported and joined back to the run.

## The three layers
1. **Lesson in context.** After each train pass, the 3 worst outputs and their judge notes are distilled into one lesson, and the most recent lessons are prepended to the system prompt. Cost: one cheap call per iteration.
2. **System-prompt rewrite (GEPA-inspired: one candidate, no Pareto selection).** A reflector proposes a new system prompt from the failures, and it is accepted only if it beats the incumbent's score on the same train pass. Cost: one call plus a full train re-score per iteration.
3. **Retrieved few-shot winners.** Train outputs scoring at least 4.0 go into a bank, and the 2 most similar by token overlap are retrieved as examples. Cost: no extra model calls, but every future prompt carries the examples.

## Judge-check
- **Before trusting a judge:** a 16-item calibration set on train briefs (5 good, 7 with one planted defect, 4 plausible but generic).
- **Cross-judge:** every final held-out output from both runs (32) re-scored by the other judge.
- **After the run:** 10 held-out outputs from run 2, hand-scored blind (judge scores hidden, briefs shown), then compared with both judges using Pearson r, mean absolute difference, within-1-point rate and bias.

HAND_SCORE_RESULTS (pending: fill once `python -m ladder.hand_score agree` has run)

## Results
| | 70B judge | DeepSeek judge |
|---|---|---|
| Base-prompt mean (n runs) | 4.65 (15) | 3.64 (13) |
| Lesson in context: lift over iterations 1-4 (p) | +0.16 (0.010) | +0.02 (0.45) |
| Prompt rewrite | 0 of 4 accepted, so base prompt throughout | +0.07 (0.29), 1 of 4 accepted |
| Retrieved few-shot | +0.11 (0.08) | +0.01 (0.47) |
| **Static control: rubric + forbidden claims in the prompt** | +0.07 (0.31) | **+0.20 (0.004)** |

- **Smallest detectable lift:** about 0.3 points at 80% power (4 held-out briefs). p is a one-sided permutation test against all base-prompt runs, used as a screen.
- **The judge outweighs every layer.** Swapping it moved base-prompt scores by about a point. The 70B gave every run-1 output 5/5 on brand fit and claim safety; its score spread was 0.13, against 0.53 for DeepSeek on the same outputs.
- **Judges disagree on real outputs.** On 16 known calibration items, both rank every good item above every generic one. On the 32 real outputs, rank agreement is Spearman 0.26 (run 1) and 0.16 (run 2).
- **Judge repeats are a small noise source.** They explain about 15% of the variance of a 4-brief mean; generation and brief-to-brief variance dominate.
- **Learning cost vs. inference tax.** Learning costs per run: lessons $0.0003-0.0004, few-shot $0, prompt rewrite $0.03-0.33 (its train re-scoring dominates). The inference tax is permanent: lessons make every generation prompt 3.6x longer, few-shot 2.8x.
- **Total spend:** $3.99 across two runs, calibration, the controls and one aborted attempt.

## What failed
- **The one apparent lift didn't replicate.** Lessons scored +0.16 under the 70B and +0.02 under DeepSeek. Cross-judging can't tell a small real effect from noise: DeepSeek also scores run 1's lesson outputs above its base-prompt outputs, but with 4 briefs and one draw each. We don't claim an effect.
- **Prompt rewrite (GEPA-inspired, not GEPA) barely worked.**
  - The 8B reflector produced hero copy, or prompts locked to one train brief ("[Brand Name]" left in).
  - A gym ad used as the system prompt scored within 0.08 of the real prompt on train, so the gate's rejections were mostly within one pass's noise.
  - Small optimizers failing at this meta-task is a known result (Revisiting OPRO, 2024). ACE succeeds with one large model plus informative feedback.
- **My first analysis was wrong.** The noise band used 7 of the 15 base-prompt runs, which made the unchanged base prompt look like it beat its own band. An adversarial review caught it before anyone saw it.
- **Format went unpoliced.** 14-15 of 16 final outputs broke the 3-line format and still scored like clean copy, because the rubric has no format criterion. Hard constraints belong in code.
- **The rubric was never shown to the generator,** so the learning layers spent their iterations rediscovering it. The static control shows how much that cost.

## 30-second pitch
"Your deck argues that every self-improving loop is capped by its evaluator. I built the smallest version of that tonight: three places to store a lesson, a noise floor, two judges, all on Workers AI for under four dollars.
- **The judge decided the result.** Swap a free-tier judge for a stronger one and every score moves by a point, several times bigger than any layer effect. On the same outputs, the two judges barely agree on which is better.
- **The cheapest layer was the spec.** Writing the rubric and banned claims into the prompt beat every learned layer.

So before a loop learns where to put lessons, calibrate the judge on known answers, evaluate with a different judge from the one giving feedback, and hand the loop what you already know. That's directly runnable on your approve/reject data."
