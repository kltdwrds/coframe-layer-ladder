noise floor (range of 7 base-prompt held-out runs): 0.71; base mean 4.56

layer | final held-out | gain vs base mean | outside noise band? | learning $ | total $ | gain per learning $ | tokens
--|--|--|--|--|--|--|--
baseline | 4.69 | +0.13 | no (inside band) | 0.0000 | 0.045 | n/a (free) | 83789
lesson_in_context | 4.88 | +0.32 | above band | 0.0004 | 0.049 | +867 | 100622
prompt_rewrite | 4.81 | +0.26 | above band | 0.0260 | 0.071 | +10 | 136328
retrieved_fewshot | 4.81 | +0.26 | above band | 0.0000 | 0.045 | n/a (free) | 87975
