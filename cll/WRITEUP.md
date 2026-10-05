# Cheapest-layer ladder: companion write-up

## Thesis (one line)
Where a self-improving loop stores its lessons matters less than whether its evaluator can tell good from merely plausible. Calibrate the judge before you compare layers.

## Setup
- **Task:** write HEADLINE / SUBHEAD / CTA for a site brief (audience, goal, voice, forbidden claims).
- **Data:** 12 synthetic briefs, 8 train and 4 held-out. Held-out briefs never reach any update step and were not used to pick the judge.
- **Models:** Cloudflare Workers AI through AI Gateway (OpenAI-compatible route). Generator `llama-3.1-8b-instruct-fp8`, a deliberately cheap model with room to improve.
- **Judge:** rubric of brand fit, specificity, claim safety and goal fit (1-5 each), temp 0, repeated and averaged. Run 1 used `llama-3.3-70b-instruct-fp8-fast` (judge-n 3); run 2 used `deepseek-v4-pro-0813` (judge-n 2), chosen by calibration.
- **Protocol:** 4 learning iterations per layer, scoring train and held-out after each. The baseline gets 3 extra held-out runs, and these are pooled with every layer's iteration 0 (same prompt) to form the noise band.
- **Trace:** every request carries gateway metadata (layer, iteration, phase, brief, role), and the AI Gateway logs are exported and joined back to the run.

## The three layers
1. **Lesson in context.** After each train pass, the 3 worst outputs and their judge notes are distilled into one lesson, and the most recent lessons are prepended to the system prompt. Cost: one cheap call per iteration.
2. **System-prompt rewrite (GEPA-style).** A reflector proposes a new system prompt from the failures, and it is accepted only if it beats the incumbent's score on the same train pass. Cost: one call plus a full train re-score per iteration.
3. **Retrieved few-shot winners.** Train outputs scoring at least 4.0 go into a bank, and the 2 most similar by token overlap are retrieved as examples. Cost: zero extra model calls.

## Judge-check
- **Before trusting a judge:** a 16-item calibration set on train briefs (5 good, 7 with one planted defect, 4 plausible but generic).
- **After the run:** 10 held-out outputs, hand-scored blind (judge scores hidden, briefs shown), then compared with both judges using Pearson r, mean absolute difference, within-1-point rate and bias.

## Results
RESULTS_PLACEHOLDER

## What failed
FAILED_PLACEHOLDER

## 30-second pitch
PITCH_PLACEHOLDER
