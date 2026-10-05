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
   3.812,
   3.844,
   3.312,
   3.531,
   3.75,
   3.469,
   3.375,
   3.656
  ],
  "lo": 3.312,
  "hi": 3.844,
  "mu": 3.642,
  "sd": 0.182,
  "mde80": 0.292,
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
    "lift": 0.132,
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
    "lift": 0.022,
    "p": 0.45,
    "is_null": false,
    "final": 3.844,
    "learn_usd": 0.0,
    "total_usd": 0.572,
    "tokens": 199346
   },
   "prompt_rewrite": {
    "heldout": [
     3.75,
     3.375,
     3.656,
     4.0,
     3.812
    ],
    "train": [
     3.75,
     3.797,
     3.516,
     3.938,
     3.938
    ],
    "post_mean": 3.711,
    "lift": 0.069,
    "p": 0.292,
    "is_null": false,
    "final": 3.812,
    "learn_usd": 0.326,
    "total_usd": 1.013,
    "tokens": 329939,
    "accepted": 1,
    "rejected": 3,
    "margins": [
     -0.297,
     -0.547,
     0.375,
     -0.25
    ]
   },
   "retrieved_fewshot": {
    "heldout": [
     3.469,
     3.5,
     3.875,
     3.812,
     3.438
    ],
    "train": [
     3.719,
     3.844,
     3.969,
     3.797,
     3.781
    ],
    "post_mean": 3.656,
    "lift": 0.014,
    "p": 0.465,
    "is_null": false,
    "final": 3.438,
    "learn_usd": 0.0,
    "total_usd": 0.638,
    "tokens": 214147
   }
  },
  "format_bad": 15,
  "format_n": 16,
  "format_bad_mean": 3.683,
  "criteria_values": {
   "brand_fit": [
    3,
    4,
    4.5,
    5
   ],
   "specificity": [
    1.5,
    2,
    2.5,
    3,
    3.5
   ],
   "claim_safety": [
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5
   ],
   "goal_fit": [
    3.5,
    4,
    4.5,
    5
   ]
  },
  "total_usd": 2.897,
  "calls": 861,
  "bank_adds": 4
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
 "agree": [
  {
   "row": "0",
   "layer": "retrieved_fewshot",
   "hand": 3.0,
   "judges": {
    "deepseek-v4-pro-0813": 2.88,
    "llama-3.3-70b-instruct-fp8-fast": 4.42
   },
   "comment": ""
  },
  {
   "row": "1",
   "layer": "retrieved_fewshot",
   "hand": 2.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.5,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "2",
   "layer": "lesson_in_context",
   "hand": 4.0,
   "judges": {
    "deepseek-v4-pro-0813": 4.38,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "3",
   "layer": "baseline",
   "hand": 2.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.12,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "4",
   "layer": "lesson_in_context",
   "hand": 3.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.12,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "5",
   "layer": "prompt_rewrite",
   "hand": 1.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.25,
    "llama-3.3-70b-instruct-fp8-fast": 5
   },
   "comment": ""
  },
  {
   "row": "6",
   "layer": "lesson_in_context",
   "hand": 4.0,
   "judges": {
    "deepseek-v4-pro-0813": 4.5,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "7",
   "layer": "retrieved_fewshot",
   "hand": 3.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.38,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "8",
   "layer": "prompt_rewrite",
   "hand": 2.0,
   "judges": {
    "deepseek-v4-pro-0813": 4.0,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  },
  {
   "row": "9",
   "layer": "baseline",
   "hand": 3.0,
   "judges": {
    "deepseek-v4-pro-0813": 3.62,
    "llama-3.3-70b-instruct-fp8-fast": 4.75
   },
   "comment": ""
  }
 ],
 "calib_usd": 0.321,
 "aborted_usd": 0.19,
 "cross": {
  "points": [
   {
    "run": "run1",
    "layer": "baseline",
    "id": "orbit-hr",
    "j70": 4.75,
    "jds": 2.625
   },
   {
    "run": "run1",
    "layer": "baseline",
    "id": "fern-vet",
    "j70": 4.75,
    "jds": 4.0
   },
   {
    "run": "run1",
    "layer": "baseline",
    "id": "quill-edu",
    "j70": 4.5,
    "jds": 3.625
   },
   {
    "run": "run1",
    "layer": "baseline",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 3.25
   },
   {
    "run": "run1",
    "layer": "lesson_in_context",
    "id": "orbit-hr",
    "j70": 4.75,
    "jds": 3.125
   },
   {
    "run": "run1",
    "layer": "lesson_in_context",
    "id": "fern-vet",
    "j70": 5,
    "jds": 4
   },
   {
    "run": "run1",
    "layer": "lesson_in_context",
    "id": "quill-edu",
    "j70": 5,
    "jds": 3.875
   },
   {
    "run": "run1",
    "layer": "lesson_in_context",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 4.125
   },
   {
    "run": "run1",
    "layer": "prompt_rewrite",
    "id": "orbit-hr",
    "j70": 4.75,
    "jds": 2.625
   },
   {
    "run": "run1",
    "layer": "prompt_rewrite",
    "id": "fern-vet",
    "j70": 5,
    "jds": 4.375
   },
   {
    "run": "run1",
    "layer": "prompt_rewrite",
    "id": "quill-edu",
    "j70": 4.75,
    "jds": 3.25
   },
   {
    "run": "run1",
    "layer": "prompt_rewrite",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 3.375
   },
   {
    "run": "run1",
    "layer": "retrieved_fewshot",
    "id": "orbit-hr",
    "j70": 5,
    "jds": 3.125
   },
   {
    "run": "run1",
    "layer": "retrieved_fewshot",
    "id": "fern-vet",
    "j70": 4.75,
    "jds": 4.25
   },
   {
    "run": "run1",
    "layer": "retrieved_fewshot",
    "id": "quill-edu",
    "j70": 4.75,
    "jds": 3.75
   },
   {
    "run": "run1",
    "layer": "retrieved_fewshot",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 3.75
   },
   {
    "run": "run2",
    "layer": "baseline",
    "id": "orbit-hr",
    "j70": 4.75,
    "jds": 3.125
   },
   {
    "run": "run2",
    "layer": "baseline",
    "id": "fern-vet",
    "j70": 4.75,
    "jds": 4.625
   },
   {
    "run": "run2",
    "layer": "baseline",
    "id": "quill-edu",
    "j70": 4.75,
    "jds": 4
   },
   {
    "run": "run2",
    "layer": "baseline",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 3.625
   },
   {
    "run": "run2",
    "layer": "lesson_in_context",
    "id": "orbit-hr",
    "j70": 4.75,
    "jds": 3.125
   },
   {
    "run": "run2",
    "layer": "lesson_in_context",
    "id": "fern-vet",
    "j70": 4.75,
    "jds": 3.375
   },
   {
    "run": "run2",
    "layer": "lesson_in_context",
    "id": "quill-edu",
    "j70": 4.75,
    "jds": 4.375
   },
   {
    "run": "run2",
    "layer": "lesson_in_context",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 4.5
   },
   {
    "run": "run2",
    "layer": "prompt_rewrite",
    "id": "orbit-hr",
    "j70": 5,
    "jds": 3.25
   },
   {
    "run": "run2",
    "layer": "prompt_rewrite",
    "id": "fern-vet",
    "j70": 5,
    "jds": 4.25
   },
   {
    "run": "run2",
    "layer": "prompt_rewrite",
    "id": "quill-edu",
    "j70": 4.75,
    "jds": 3.75
   },
   {
    "run": "run2",
    "layer": "prompt_rewrite",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 4.0
   },
   {
    "run": "run2",
    "layer": "retrieved_fewshot",
    "id": "orbit-hr",
    "j70": 4.417,
    "jds": 2.875
   },
   {
    "run": "run2",
    "layer": "retrieved_fewshot",
    "id": "fern-vet",
    "j70": 4.75,
    "jds": 3.375
   },
   {
    "run": "run2",
    "layer": "retrieved_fewshot",
    "id": "quill-edu",
    "j70": 4.667,
    "jds": 4
   },
   {
    "run": "run2",
    "layer": "retrieved_fewshot",
    "id": "mason-solar",
    "j70": 4.75,
    "jds": 3.5
   }
  ],
  "rho_all": 0.16,
  "rho": {
   "run1": 0.26,
   "run2": 0.16
  },
  "sd70": 0.13,
  "sdds": 0.53,
  "layer_means": {
   "run1": {
    "prompt_rewrite": {
     "j70": 4.81,
     "jds": 3.41
    },
    "lesson_in_context": {
     "j70": 4.88,
     "jds": 3.78
    },
    "retrieved_fewshot": {
     "j70": 4.81,
     "jds": 3.72
    },
    "baseline": {
     "j70": 4.69,
     "jds": 3.38
    }
   },
   "run2": {
    "prompt_rewrite": {
     "j70": 4.88,
     "jds": 3.81
    },
    "lesson_in_context": {
     "j70": 4.75,
     "jds": 3.84
    },
    "retrieved_fewshot": {
     "j70": 4.65,
     "jds": 3.44
    },
    "baseline": {
     "j70": 4.75,
     "jds": 3.84
    }
   }
  }
 },
 "control": {
  "n_runs": 5,
  "format_ok": 4,
  "n": 20,
  "j70": {
   "mean": 4.721,
   "base_mu": 4.651,
   "lift": 0.069,
   "p": 0.306,
   "criteria": {
    "brand_fit": 4.95,
    "specificity": 4.03,
    "claim_safety": 4.9,
    "goal_fit": 5
   }
  },
  "jds": {
   "mean": 3.844,
   "base_mu": 3.642,
   "lift": 0.202,
   "p": 0.004,
   "criteria": {
    "brand_fit": 4.33,
    "specificity": 2.25,
    "claim_safety": 4.17,
    "goal_fit": 4.62
   }
  }
 },
 "addons_usd": 0.36,
 "agree_stats": {
  "jds": {
   "r": 0.53,
   "mad": 0.9,
   "bias": 0.88,
   "within1": 0.6,
   "sd": 0.52
  },
  "j70": {
   "r": -0.45,
   "mad": 2.04,
   "bias": 2.04,
   "within1": 0.2,
   "sd": 0.13
  },
  "n": 10,
  "hand_sd": 0.9
 },
 "cost_total": 3.99
};
