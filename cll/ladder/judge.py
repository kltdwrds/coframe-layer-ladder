import json, os, statistics
from .llm import chat, parse_json, JUDGE_MODEL
RUB=json.load(open("data/rubric.json"))
SYS="You are a strict marketing copy reviewer. Score only against the rubric. Reply JSON only."
KEYS=list(RUB["criteria"])
def judge_once(brief,out,meta=None):
    u=f"""Rubric:\n{json.dumps(RUB)}\n\nBrief:\n{json.dumps(brief)}\n\nCopy:\n{out}\n
Return JSON: {{"brand_fit":int,"specificity":int,"claim_safety":int,"goal_fit":int,"note":"one sentence on the biggest weakness"}}"""
    for attempt in range(2):
        try:
            r=parse_json(chat(JUDGE_MODEL,SYS,u,temperature=0.0,json_mode=True,max_tokens=int(os.getenv('JUDGE_MAX_TOKENS','4000')),meta=meta))
            r.update({k:min(5,max(1,int(float(r[k])))) for k in KEYS})
            return r
        except (ValueError,KeyError,TypeError) as e:
            if attempt: raise
def judge(brief,out,n=1,meta=None):
    rs=[judge_once(brief,out,meta) for _ in range(n)]
    means={k:statistics.mean(r[k] for r in rs) for k in KEYS}
    return {"score":statistics.mean(means.values()),"criteria":means,"note":rs[0].get("note",""),
            "judge_spread":max(statistics.mean(r[k] for k in KEYS) for r in rs)-min(statistics.mean(r[k] for k in KEYS) for r in rs)}
