#!/usr/bin/env bash
set -e
pip install -q -r requirements.txt
[ -z "$OPENAI_API_KEY" ] && { echo "set OPENAI_API_KEY"; exit 1; }
python -m ladder.run "$@"
python -m ladder.plot
python -m ladder.hand_score make
echo "Now fill hand_score in results/hand_scores.csv, then: python -m ladder.hand_score agree"
