model | defects caught (target crit <=2) | good mean | mediocre mean | defect mean | good-mediocre gap | score sd | json fails | repeat-inconsistent items | $ | tokens
--|--|--|--|--|--|--|--|--|--|--
llama-3.3-70b-instruct-fp8-fast | 7/7 | 4.85 | 3.56 | 2.39 | +1.29 | 1.17 | 0 | 0 | 0.0071 | 11702
deepseek-v4-pro-0813 | 7/7 | 4.90 | 2.50 | 1.88 | +2.40 | 1.38 | 0 | 9 | 0.1098 | 35477
glm-5.3 | 7/7 | 4.80 | 2.66 | 2.27 | +2.14 | 1.18 | 0 | 7 | 0.1143 | 32183

### @cf/meta/llama-3.3-70b-instruct-fp8-fast
brief | expected | target crit | overall
ledger-coffee | good | - | 4.75
ledger-coffee | claim_safety | 1 | 3.25
pillar-legal | good | - | 5.00
pillar-legal | claim_safety | 1 | 2.00
trailhead-gear | specificity | 1 | 2.50
kiln-fitness | brand_fit | 1 | 1.00
harbor-bank | good | - | 5.00
harbor-bank | goal_fit | 1 | 3.00
nimbus-ci | good | - | 4.75
petal-florist | good | - | 4.75
petal-florist | specificity | 1 | 3.00
sable-sleep | claim_safety | 1 | 2.00
ledger-coffee | mediocre | - | 4.00
kiln-fitness | mediocre | - | 3.50
nimbus-ci | mediocre | - | 3.25
sable-sleep | mediocre | - | 3.50

### @cf/deepseek-ai/deepseek-v4-pro-0813
brief | expected | target crit | overall
ledger-coffee | good | - | 5.00
ledger-coffee | claim_safety | 1 | 2.12
pillar-legal | good | - | 4.75
pillar-legal | claim_safety | 1 | 1.38
trailhead-gear | specificity | 1 | 1.38
kiln-fitness | brand_fit | 1 | 1.25
harbor-bank | good | - | 4.88
harbor-bank | goal_fit | 1 | 2.75
nimbus-ci | good | - | 5.00
petal-florist | good | - | 4.88
petal-florist | specificity | 1 | 2.50
sable-sleep | claim_safety | 1 | 1.75
ledger-coffee | mediocre | - | 2.38
kiln-fitness | mediocre | - | 2.75
nimbus-ci | mediocre | - | 2.00
sable-sleep | mediocre | - | 2.88

### @cf/zai-org/glm-5.3
brief | expected | target crit | overall
ledger-coffee | good | - | 4.88
ledger-coffee | claim_safety | 1 | 2.50
pillar-legal | good | - | 4.75
pillar-legal | claim_safety | 1 | 2.12
trailhead-gear | specificity | 1 | 2.25
kiln-fitness | brand_fit | 1 | 1.38
harbor-bank | good | - | 4.75
harbor-bank | goal_fit | 1 | 2.75
nimbus-ci | good | - | 4.88
petal-florist | good | - | 4.75
petal-florist | specificity | 1 | 3.00
sable-sleep | claim_safety | 1 | 1.88
ledger-coffee | mediocre | - | 2.62
kiln-fitness | mediocre | - | 2.50
nimbus-ci | mediocre | - | 2.25
sable-sleep | mediocre | - | 3.25
