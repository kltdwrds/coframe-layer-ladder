n=10 hand-scored held-out outputs (blind; judge scores hidden while scoring)

judge | pearson r | mean abs diff | within 1pt | bias (judge - hand)
--|--|--|--|--
deepseek-v4-pro-0813 | 0.53 | 0.90 | 60% | +0.88
llama-3.3-70b-instruct-fp8-fast | -0.45 | 2.04 | 20% | +2.04

row | layer | hand | deepseek-v4-pro-0813 | llama-3.3-70b-instruct-fp8-fast | your comment
--|--|--|--|--|--
0 | retrieved_fewshot | 3.0 | 2.88 | 4.42 | 
1 | retrieved_fewshot | 2.0 | 3.50 | 4.75 | 
2 | lesson_in_context | 4.0 | 4.38 | 4.75 | 
3 | baseline | 2.0 | 3.12 | 4.75 | 
4 | lesson_in_context | 3.0 | 3.12 | 4.75 | 
5 | prompt_rewrite | 1.0 | 3.25 | 5.00 | 
6 | lesson_in_context | 4.0 | 4.50 | 4.75 | 
7 | retrieved_fewshot | 3.0 | 3.38 | 4.75 | 
8 | prompt_rewrite | 2.0 | 4.00 | 4.75 | 
9 | baseline | 3.0 | 3.62 | 4.75 | 
