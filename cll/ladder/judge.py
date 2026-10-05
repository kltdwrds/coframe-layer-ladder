import json, statistics
from .llm import chat, parse_json, JUDGE_MODEL
RUB=json.load(open("data/rubric.json"))
SYS="You are a strict marketing copy reviewer. Score only against the rubric. Reply JSON only."
def judge_once(brief,out):
    u=f"""Rubric:\n{json.dumps(RUB)}\n\nBrief:\n{json.dumps(brief)}\n\nCopy:\n{out}\n
Return JSON: {{"brand_fit":int,"specificity":int,"claim_safety":int,"goal_fit":int,"note":"one sentence on the biggest weakness"}}"""
    return parse_json(chat(JUDGE_MODEL,SYS,u,temperature=0.0,json_mode=True))
def judge(brief,out,n=1):
    rs=[judge_once(brief,out) for _ in range(n)]
    keys=list(RUB["criteria"])
    means={k:statistics.mean(r[k] for r in rs) for k in keys}
    return {"score":statistics.mean(means.values()),"criteria":means,"note":rs[0].get("note","")}
