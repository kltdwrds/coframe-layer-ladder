893 gateway log entries since 2026-10-05T03:54:42Z

layer | phase | role | model | calls | errors | cached | tokens in | tokens out | avg ms
--|--|--|--|--|--|--|--|--|--
baseline | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 1505 | 1405 | 4799
baseline | heldout | judge | deepseek-v4-pro-0813 | 41 | 1 | 0 | 16084 | 43565 | 25498
baseline | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 3060 | 2841 | 3979
baseline | train | judge | deepseek-v4-pro-0813 | 81 | 1 | 0 | 32280 | 81877 | 17810
baseline_noise | heldout | gen | llama-3.1-8b-instruct-fp8 | 12 | 0 | 0 | 903 | 913 | 3701
baseline_noise | heldout | judge | deepseek-v4-pro-0813 | 25 | 1 | 0 | 9802 | 24964 | 20508
control | ? | gen | llama-3.1-8b-instruct-fp8 | 4 | 0 | 0 | 753 | 227 | 3069
control | ? | judge | deepseek-v4-pro-0813 | 2 | 0 | 0 | 750 | 921 | 8629
control | ? | judge | llama-3.3-70b-instruct-fp8-fast | 12 | 0 | 0 | 4029 | 689 | 1952
lesson_in_context | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 5857 | 1516 | 4494
lesson_in_context | heldout | judge | deepseek-v4-pro-0813 | 40 | 0 | 0 | 16314 | 41269 | 17153
lesson_in_context | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 11764 | 2781 | 4004
lesson_in_context | train | judge | deepseek-v4-pro-0813 | 83 | 3 | 0 | 32134 | 85875 | 18321
lesson_in_context | update | update | llama-3.1-8b-instruct-fp8 | 4 | 0 | 0 | 1407 | 429 | 5691
prompt_rewrite | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 1801 | 2079 | 5128
prompt_rewrite | heldout | judge | deepseek-v4-pro-0813 | 42 | 2 | 0 | 17432 | 50979 | 22666
prompt_rewrite | rescore | gen | llama-3.1-8b-instruct-fp8 | 32 | 0 | 0 | 3640 | 3694 | 5765
prompt_rewrite | rescore | judge | deepseek-v4-pro-0813 | 66 | 2 | 0 | 28672 | 72257 | 20550
prompt_rewrite | train | gen | llama-3.1-8b-instruct-fp8 | 39 | 0 | 0 | 3578 | 3987 | 5878
prompt_rewrite | train | judge | deepseek-v4-pro-0813 | 84 | 2 | 0 | 35667 | 104841 | 22963
prompt_rewrite | update | update | llama-3.1-8b-instruct-fp8 | 4 | 0 | 0 | 1874 | 253 | 3733
retrieved_fewshot | heldout | gen | llama-3.1-8b-instruct-fp8 | 20 | 0 | 0 | 4811 | 1984 | 5470
retrieved_fewshot | heldout | judge | deepseek-v4-pro-0813 | 40 | 0 | 0 | 17254 | 47575 | 19579
retrieved_fewshot | train | gen | llama-3.1-8b-instruct-fp8 | 40 | 0 | 0 | 9370 | 3636 | 5043
retrieved_fewshot | train | judge | deepseek-v4-pro-0813 | 82 | 2 | 0 | 33896 | 95621 | 20035
