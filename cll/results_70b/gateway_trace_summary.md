1281 gateway log entries since 2026-10-05T01:11:04Z

layer | phase | role | model | calls | errors | cached | tokens in | tokens out | avg ms
--|--|--|--|--|--|--|--|--|--
baseline | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 1505 | 1378 | 4002
baseline | heldout | judge | llama-3.3-70b-instruct-fp8-fast | 60 | 0 | 0 | 20859 | 3501 | 2060
baseline | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 3060 | 3207 | 4683
baseline | train | judge | llama-3.3-70b-instruct-fp8-fast | 120 | 0 | 0 | 42936 | 7343 | 2039
baseline_noise | heldout | gen | llama-3.1-8b-instruct-fp8 | 12 | 0 | 0 | 903 | 1022 | 4177
baseline_noise | heldout | judge | llama-3.3-70b-instruct-fp8-fast | 36 | 0 | 0 | 13092 | 1986 | 2000
calibrate | ? | judge | deepseek-v4-pro-0813 | 33 | 1 | 0 | 11632 | 23845 | 12460
calibrate | ? | judge | llama-3.3-70b-instruct-fp8-fast | 56 | 0 | 0 | 17244 | 3244 | 1882
calibrate | ? | judge | kimi-k2.6 | 13 | 0 | 0 | 3774 | 19013 | 45282
calibrate | ? | judge | glm-5.3 | 32 | 0 | 0 | 9108 | 23075 | 29296
calibrate | ? | probe | deepseek-v4-pro-0813 | 1 | 0 | 0 | 114 | 116 | 4470
calibrate | ? | probe | kimi-k2.6 | 1 | 0 | 0 | 43 | 464 | 12585
calibrate | ? | probe | glm-5.3 | 1 | 0 | 0 | 44 | 549 | 10019
lesson_in_context | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 5469 | 1733 | 4411
lesson_in_context | heldout | judge | llama-3.3-70b-instruct-fp8-fast | 60 | 0 | 0 | 21942 | 3640 | 2133
lesson_in_context | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 10988 | 3507 | 4641
lesson_in_context | train | judge | llama-3.3-70b-instruct-fp8-fast | 120 | 0 | 0 | 43842 | 7418 | 2211
lesson_in_context | update | update | llama-3.1-8b-instruct-fp8 | 4 | 0 | 0 | 1706 | 377 | 5514
prompt_rewrite | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 1505 | 1758 | 4687
prompt_rewrite | heldout | judge | llama-3.3-70b-instruct-fp8-fast | 60 | 0 | 0 | 22005 | 3542 | 1898
prompt_rewrite | rescore | gen | llama-3.1-8b-instruct-fp8 | 32 | 0 | 0 | 3136 | 3659 | 6165
prompt_rewrite | rescore | judge | llama-3.3-70b-instruct-fp8-fast | 96 | 0 | 0 | 37671 | 5838 | 2041
prompt_rewrite | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 3060 | 2961 | 4219
prompt_rewrite | train | judge | llama-3.3-70b-instruct-fp8-fast | 120 | 0 | 0 | 42180 | 7271 | 2022
prompt_rewrite | update | update | llama-3.1-8b-instruct-fp8 | 4 | 0 | 0 | 1552 | 190 | 2936
retrieved_fewshot | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 4165 | 1252 | 3362
retrieved_fewshot | heldout | judge | llama-3.3-70b-instruct-fp8-fast | 60 | 0 | 0 | 20466 | 3488 | 1931
retrieved_fewshot | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 8181 | 2453 | 3642
retrieved_fewshot | train | judge | llama-3.3-70b-instruct-fp8-fast | 120 | 0 | 0 | 40641 | 7329 | 2159
