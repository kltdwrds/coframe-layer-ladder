Null: 13 held-out runs that used the base prompt; mean 3.64, sd 0.18, range 3.31-3.84.
Smallest lift this design detects at 80% power: ~0.29. Lift = mean of iterations 1-4 minus the null mean; p = one-sided permutation vs the null (a screen, not a test).
Format: 15/16 final held-out outputs break the 3-line format (mean judge score 3.68).

layer | mean held-out, iters 1-4 | lift vs base mean | p | learning $ (update calls) | total $ | tokens
--|--|--|--|--|--|--
baseline (base prompt throughout) | 3.77 | +0.13 | - | 0.0000 | 0.563 | 182617
lesson_in_context | 3.66 | +0.02 | 0.450 | 0.0003 | 0.572 | 199346
prompt_rewrite | 3.71 | +0.07 | 0.292 | 0.3260 | 1.013 | 329939
retrieved_fewshot | 3.66 | +0.01 | 0.465 | 0.0000 | 0.638 | 214147

prompt_rewrite: 1 of 4 candidates accepted; candidate minus incumbent train score: [-0.297, -0.547, 0.375, -0.25]
