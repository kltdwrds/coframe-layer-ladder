window.DATA={
 "run1": {
  "judge": "llama-3.3-70b-instruct-fp8-fast",
  "judge_n": 3,
  "gen": "llama-3.1-8b-instruct-fp8",
  "noise": [
   4.708,
   4.75,
   4.75,
   4.688,
   4.688,
   4.333,
   4.75,
   4.625,
   4.042,
   4.688,
   4.75,
   4.688,
   4.812,
   4.688,
   4.812
  ],
  "lo": 4.042,
  "hi": 4.812,
  "mu": 4.651,
  "sd": 0.203,
  "mde80": 0.319,
  "layers": {
   "baseline": {
    "heldout": [
     4.708,
     4.75,
     4.75,
     4.688,
     4.688
    ],
    "train": [
     4.875,
     4.771,
     4.323,
     4.708,
     4.625
    ],
    "post_mean": 4.719,
    "lift": 0.067,
    "p": null,
    "is_null": true,
    "final": 4.688,
    "learn_usd": 0.0,
    "total_usd": 0.045,
    "tokens": 83789
   },
   "lesson_in_context": {
    "heldout": [
     4.042,
     4.812,
     4.75,
     4.812,
     4.875
    ],
    "train": [
     4.76,
     4.594,
     4.677,
     4.823,
     4.677
    ],
    "post_mean": 4.812,
    "lift": 0.161,
    "p": 0.01,
    "is_null": false,
    "final": 4.875,
    "learn_usd": 0.0,
    "total_usd": 0.049,
    "tokens": 100622
   },
   "prompt_rewrite": {
    "heldout": [
     4.688,
     4.688,
     4.812,
     4.688,
     4.812
    ],
    "train": [
     4.74,
     4.677,
     4.469,
     4.75,
     4.719
    ],
    "post_mean": 4.75,
    "lift": 0.099,
    "p": null,
    "is_null": true,
    "final": 4.812,
    "learn_usd": 0.026,
    "total_usd": 0.071,
    "tokens": 136328,
    "accepted": 0,
    "rejected": 4,
    "margins": [
     -0.084,
     -0.115,
     -0.084,
     -1.052
    ]
   },
   "retrieved_fewshot": {
    "heldout": [
     4.75,
     4.75,
     4.729,
     4.75,
     4.812
    ],
    "train": [
     4.552,
     4.49,
     4.812,
     4.646,
     4.635
    ],
    "post_mean": 4.76,
    "lift": 0.109,
    "p": 0.081,
    "is_null": false,
    "final": 4.812,
    "learn_usd": 0.0,
    "total_usd": 0.045,
    "tokens": 87975
   }
  },
  "format_bad": 14,
  "format_n": 16,
  "format_bad_mean": 4.804,
  "criteria_values": {
   "brand_fit": [
    5
   ],
   "specificity": [
    4,
    5
   ],
   "claim_safety": [
    5
   ],
   "goal_fit": [
    4,
    5
   ]
  },
  "total_usd": 0.219,
  "calls": 1144,
  "bank_adds": 8
 },
 "run2": {
  "judge": "deepseek-v4-pro-0813",
  "judge_n": 2,
  "gen": "llama-3.1-8b-instruct-fp8",
  "noise": [
   3.5,
   3.75,
   3.75,
   3.75,
   3.844,
   3.531
  ],
  "lo": 3.5,
  "hi": 3.844,
  "mu": 3.688,
  "sd": 0.138,
  "mde80": 0.25,
  "layers": {
   "baseline": {
    "heldout": [
     3.5,
     3.75,
     3.75,
     3.75,
     3.844
    ],
    "train": [
     3.859,
     3.703,
     3.469,
     3.641,
     3.547
    ],
    "post_mean": 3.773,
    "lift": 0.086,
    "p": null,
    "is_null": true,
    "final": 3.844,
    "learn_usd": 0.0,
    "total_usd": 0.563,
    "tokens": 182617
   },
   "lesson_in_context": {
    "heldout": [
     3.531,
     3.438,
     3.688,
     3.688,
     3.844
    ],
    "train": [
     3.672,
     3.922,
     3.953,
     3.781,
     3.906
    ],
    "post_mean": 3.664,
    "lift": -0.023,
    "p": 0.616,
    "is_null": false,
    "final": 3.844,
    "learn_usd": 0.0,
    "total_usd": 0.572,
    "tokens": 199346
   }
  },
  "format_bad": 7,
  "format_n": 8,
  "format_bad_mean": 3.75,
  "criteria_values": {
   "brand_fit": [
    3,
    4,
    4.5,
    5
   ],
   "specificity": [
    2,
    2.5,
    3,
    3.5
   ],
   "claim_safety": [
    2,
    3,
    3.5,
    4,
    5
   ],
   "goal_fit": [
    4,
    4.5,
    5
   ]
  },
  "total_usd": 1.134,
  "calls": 364,
  "bank_adds": 0
 },
 "calib": [
  {
   "name": "llama-3.3-70b-instruct-fp8-fast",
   "items": [
    {
     "brief": "ledger-coffee",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "ledger-coffee",
     "kind": "defect",
     "score": 3.25
    },
    {
     "brief": "pillar-legal",
     "kind": "good",
     "score": 5.0
    },
    {
     "brief": "pillar-legal",
     "kind": "defect",
     "score": 2.0
    },
    {
     "brief": "trailhead-gear",
     "kind": "defect",
     "score": 2.5
    },
    {
     "brief": "kiln-fitness",
     "kind": "defect",
     "score": 1.0
    },
    {
     "brief": "harbor-bank",
     "kind": "good",
     "score": 5.0
    },
    {
     "brief": "harbor-bank",
     "kind": "defect",
     "score": 3.0
    },
    {
     "brief": "nimbus-ci",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "petal-florist",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "petal-florist",
     "kind": "defect",
     "score": 3.0
    },
    {
     "brief": "sable-sleep",
     "kind": "defect",
     "score": 2.0
    },
    {
     "brief": "ledger-coffee",
     "kind": "mediocre",
     "score": 4.0
    },
    {
     "brief": "kiln-fitness",
     "kind": "mediocre",
     "score": 3.5
    },
    {
     "brief": "nimbus-ci",
     "kind": "mediocre",
     "score": 3.25
    },
    {
     "brief": "sable-sleep",
     "kind": "mediocre",
     "score": 3.5
    }
   ]
  },
  {
   "name": "deepseek-v4-pro-0813",
   "items": [
    {
     "brief": "ledger-coffee",
     "kind": "good",
     "score": 5.0
    },
    {
     "brief": "ledger-coffee",
     "kind": "defect",
     "score": 2.12
    },
    {
     "brief": "pillar-legal",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "pillar-legal",
     "kind": "defect",
     "score": 1.38
    },
    {
     "brief": "trailhead-gear",
     "kind": "defect",
     "score": 1.38
    },
    {
     "brief": "kiln-fitness",
     "kind": "defect",
     "score": 1.25
    },
    {
     "brief": "harbor-bank",
     "kind": "good",
     "score": 4.88
    },
    {
     "brief": "harbor-bank",
     "kind": "defect",
     "score": 2.75
    },
    {
     "brief": "nimbus-ci",
     "kind": "good",
     "score": 5.0
    },
    {
     "brief": "petal-florist",
     "kind": "good",
     "score": 4.88
    },
    {
     "brief": "petal-florist",
     "kind": "defect",
     "score": 2.5
    },
    {
     "brief": "sable-sleep",
     "kind": "defect",
     "score": 1.75
    },
    {
     "brief": "ledger-coffee",
     "kind": "mediocre",
     "score": 2.38
    },
    {
     "brief": "kiln-fitness",
     "kind": "mediocre",
     "score": 2.75
    },
    {
     "brief": "nimbus-ci",
     "kind": "mediocre",
     "score": 2.0
    },
    {
     "brief": "sable-sleep",
     "kind": "mediocre",
     "score": 2.88
    }
   ]
  },
  {
   "name": "glm-5.3",
   "items": [
    {
     "brief": "ledger-coffee",
     "kind": "good",
     "score": 4.88
    },
    {
     "brief": "ledger-coffee",
     "kind": "defect",
     "score": 2.5
    },
    {
     "brief": "pillar-legal",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "pillar-legal",
     "kind": "defect",
     "score": 2.12
    },
    {
     "brief": "trailhead-gear",
     "kind": "defect",
     "score": 2.25
    },
    {
     "brief": "kiln-fitness",
     "kind": "defect",
     "score": 1.38
    },
    {
     "brief": "harbor-bank",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "harbor-bank",
     "kind": "defect",
     "score": 2.75
    },
    {
     "brief": "nimbus-ci",
     "kind": "good",
     "score": 4.88
    },
    {
     "brief": "petal-florist",
     "kind": "good",
     "score": 4.75
    },
    {
     "brief": "petal-florist",
     "kind": "defect",
     "score": 3.0
    },
    {
     "brief": "sable-sleep",
     "kind": "defect",
     "score": 1.88
    },
    {
     "brief": "ledger-coffee",
     "kind": "mediocre",
     "score": 2.62
    },
    {
     "brief": "kiln-fitness",
     "kind": "mediocre",
     "score": 2.5
    },
    {
     "brief": "nimbus-ci",
     "kind": "mediocre",
     "score": 2.25
    },
    {
     "brief": "sable-sleep",
     "kind": "mediocre",
     "score": 3.25
    }
   ]
  }
 ],
 "agree": null,
 "calib_usd": 0.321,
 "aborted_usd": 0.19,
 "cost_total": 1.86
};
