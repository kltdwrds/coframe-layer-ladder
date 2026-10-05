window.DATA={
 "run1": {
  "judge": "llama-3.3-70b-instruct-fp8-fast",
  "judge_n": 3,
  "gen": "llama-3.1-8b-instruct-fp8",
  "noise": [
   4.333,
   4.75,
   4.625,
   4.708,
   4.042,
   4.688,
   4.75
  ],
  "lo": 4.042,
  "hi": 4.75,
  "mu": 4.557,
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
    "final": 4.688,
    "gain": 0.131,
    "learn_usd": 0.0,
    "total_usd": 0.045
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
    "final": 4.875,
    "gain": 0.318,
    "learn_usd": 0.0004,
    "total_usd": 0.049
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
    "final": 4.812,
    "gain": 0.256,
    "learn_usd": 0.026,
    "total_usd": 0.071,
    "accepted": 0,
    "rejected": 4
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
    "final": 4.812,
    "gain": 0.256,
    "learn_usd": 0.0,
    "total_usd": 0.045
   }
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
   3.531
  ],
  "lo": 3.5,
  "hi": 3.531,
  "mu": 3.516,
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
    "final": 3.844,
    "gain": 0.328,
    "learn_usd": 0.0,
    "total_usd": 0.563
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
    "final": 3.844,
    "gain": 0.328,
    "learn_usd": 0.0003,
    "total_usd": 0.572
   }
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
