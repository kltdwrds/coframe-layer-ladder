"""Export AI Gateway logs for this run -> results/gateway_trace.jsonl + results/gateway_trace_summary.md.
Needs gateway logging on and a token with AI Gateway Read. Usage: python -m ladder.trace <run-start ISO time>"""
import os, sys, json, urllib.request, urllib.parse, collections
from .llm import env
acct,gw,tok=env("CF_ACCOUNT_ID"),env("CF_GATEWAY_NAME"),env("CF_API_TOKEN")
since=sys.argv[1] if len(sys.argv)>1 else None
logs=[]; page=1
while True:
    q={"per_page":50,"page":page,"order_by":"created_at","order_by_direction":"asc"}
    if since: q["start_date"]=since
    url=f"https://api.cloudflare.com/client/v4/accounts/{acct}/ai-gateway/gateways/{gw}/logs?"+urllib.parse.urlencode(q)
    d=json.load(urllib.request.urlopen(urllib.request.Request(url,headers={"Authorization":f"Bearer {tok}"})))
    if not d.get("success"): raise SystemExit(f"gateway logs API error: {d.get('errors')}")
    logs+=d["result"]
    if len(d["result"])<50: break
    page+=1
with open("results/gateway_trace.jsonl","w") as f:
    for l in logs: f.write(json.dumps(l)+"\n")
def meta(l):
    m=l.get("metadata") or {}
    return json.loads(m) if isinstance(m,str) else m
agg=collections.defaultdict(lambda:{"calls":0,"errors":0,"cached":0,"tok_in":0,"tok_out":0,"ms":0})
for l in logs:
    m=meta(l); k=(m.get("layer","?"),m.get("phase","?"),m.get("role","update"),l.get("model","?"))
    a=agg[k]; a["calls"]+=1; a["errors"]+=not l.get("success",True); a["cached"]+=bool(l.get("cached"))
    a["tok_in"]+=l.get("tokens_in") or 0; a["tok_out"]+=l.get("tokens_out") or 0; a["ms"]+=l.get("duration") or 0
rows=[f"{len(logs)} gateway log entries since {since}","","layer | phase | role | model | calls | errors | cached | tokens in | tokens out | avg ms","--|--|--|--|--|--|--|--|--|--"]
for (ly,ph,ro,mo),a in sorted(agg.items()):
    rows.append(f"{ly} | {ph} | {ro} | {mo.split('/')[-1]} | {a['calls']} | {a['errors']} | {a['cached']} | {a['tok_in']} | {a['tok_out']} | {a['ms']//max(1,a['calls'])}")
open("results/gateway_trace_summary.md","w").write("\n".join(rows)+"\n"); print("\n".join(rows))
