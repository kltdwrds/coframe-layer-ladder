#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# Cloudflare creds: export them, or put CF_ACCOUNT_ID / CF_GATEWAY_NAME / CF_API_TOKEN in cll/.env (git-ignored).
[ -f .env ] && { set -a; . ./.env; set +a; }
DRY=0; case " $* " in *" --dry "*) DRY=1;; esac
[ $DRY = 1 ] || for v in CF_ACCOUNT_ID CF_GATEWAY_NAME CF_API_TOKEN; do [ -n "${!v:-}" ] || { echo "set $v"; exit 1; }; done
[ -d .venv ] || python3 -m venv .venv
. .venv/bin/activate
pip install -q -r requirements.txt
mkdir -p results
START=$(date -u +%Y-%m-%dT%H:%M:%SZ)
python -m ladder.run "$@" 2>&1 | tee results/run.log
[ $DRY = 1 ] && exit 0
python -m ladder.plot results
python -m ladder.hand_score make
python -m ladder.trace "$START" || echo "gateway trace export failed (logging off or token lacks AI Gateway Read?)"
echo "Now fill hand_score in results/hand_scores.csv, then: python -m ladder.hand_score agree"
