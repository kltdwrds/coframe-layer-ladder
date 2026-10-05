Null: 15 held-out runs that used the base prompt; mean 4.65, sd 0.20, range 4.04-4.81.
Smallest lift this design detects at 80% power: ~0.32. Lift = mean of iterations 1-4 minus the null mean; p = one-sided permutation vs the null (a screen, not a test).
Format: 14/16 final held-out outputs break the 3-line format (mean judge score 4.80).

layer | mean held-out, iters 1-4 | lift vs base mean | p | learning $ (update calls) | total $ | tokens
--|--|--|--|--|--|--
baseline (base prompt throughout) | 4.72 | +0.07 | - | 0.0000 | 0.045 | 83789
lesson_in_context | 4.81 | +0.16 | 0.010 | 0.0004 | 0.049 | 100622
prompt_rewrite (base prompt throughout) | 4.75 | +0.10 | - | 0.0260 | 0.071 | 136328
retrieved_fewshot | 4.76 | +0.11 | 0.081 | 0.0000 | 0.045 | 87975

prompt_rewrite: 0 of 4 candidates accepted; candidate minus incumbent train score: [-0.084, -0.115, -0.084, -1.052]
