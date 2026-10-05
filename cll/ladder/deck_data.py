"""Collect run artifacts into deck/data.js for the presentation. Safe to re-run as results land.
Reads results_70b/ (run 1), results/ (run 2, if present), the calibration table and the judge-agreement key."""
import json, os, re, csv, statistics
def run(d):
    p=f"{d}/history.json"
    if not os.path.exists(p): return None
    H=json.load(open(p)); h=H["history"]
    noise=(H.get("baseline_noise") or [])+[v[0]["heldout"] for v in h.values()]
    mu=statistics.mean(noise)
    layers={k:{"heldout":[round(x["heldout"],3) for x in v],"train":[round(x["train"],3) for x in v],
               "final":round(v[-1]["heldout"],3),"gain":round(v[-1]["heldout"]-mu,3),
               "learn_usd":round(v[-1]["update_usd_cum"],4),"total_usd":round(v[-1]["usd_cum"],3),
               **({"accepted":v[-1].get("accepted"),"rejected":v[-1].get("rejected")} if "accepted" in v[-1] else {})}
            for k,v in h.items()}
    bank=sum(1 for l in open(f"{d}/edit_log.jsonl") if '"bank_add"' in l) if os.path.exists(f"{d}/edit_log.jsonl") else None
    return {"judge":H["judge_model"].split("/")[-1],"judge_n":H["judge_n"],"gen":H["gen_model"].split("/")[-1],
            "noise":[round(x,3) for x in noise],"lo":round(min(noise),3),"hi":round(max(noise),3),"mu":round(mu,3),
            "layers":layers,"total_usd":round(H["total_usd"],3),"calls":H.get("calls"),"bank_adds":bank}
def calib(p="results_70b/judge_calibration.md"):
    out=[]; cur=None
    for line in open(p):
        if line.startswith("### "): cur={"name":line[4:].strip().split("/")[-1],"items":[]}; out.append(cur)
        elif cur and re.match(r"^[a-z-]+ \| (good|mediocre|[a-z_]+) \|",line):
            b,e,_,s=[x.strip() for x in line.split("|")]
            if s not in("FAIL","overall"): cur["items"].append({"brief":b,"kind":"good" if e=="good" else "mediocre" if e=="mediocre" else "defect","score":float(s)})
    return out
def agree(d):
    k,c=f"{d}/hand_scores_key.json",f"{d}/hand_scores.csv"
    if not (os.path.exists(k) and os.path.exists(c)): return None
    key=json.load(open(k)); rows=[r for r in csv.DictReader(open(c)) if r["hand_score"].strip()]
    if not rows: return None
    H=json.load(open(f"{d}/history.json")); main=H["judge_model"].split("/")[-1]
    pts=[]
    for r in rows:
        kk=key[r["row"]]; j={main:kk["judge_score"]}
        j.update({m.split("/")[-1]:v["judge_score"] for m,v in kk.get("other_judges",{}).items()})
        pts.append({"row":r["row"],"layer":kk["layer"],"hand":float(r["hand_score"]),"judges":j,"comment":r["comment"]})
    return pts
def calib_usd(p="results_70b/gateway_trace.jsonl"):
    from .llm import PRICE
    PRICE={**PRICE,"@cf/moonshotai/kimi-k2.6":(0.95,4.0)}
    t=0.0
    for l in open(p):
        e=json.loads(l); m=e.get("metadata") or {}
        if isinstance(m,str): m=json.loads(m)
        if m.get("layer")=="calibrate":
            pi,po=PRICE.get(e["model"],(1.4,4.4)); t+=((e.get("tokens_in") or 0)*pi+(e.get("tokens_out") or 0)*po)/1e6
    return round(t,3)
ABORTED_USD=0.19  # run 2's first attempt, stopped by a 429 after one evaluation pass (from its run.log)
data={"run1":run("results_70b"),"run2":run("results"),"calib":calib(),"agree":agree("results"),"calib_usd":calib_usd(),"aborted_usd":ABORTED_USD}
if data["run2"]: data["cost_total"]=round(data["run1"]["total_usd"]+data["run2"]["total_usd"]+data["calib_usd"]+ABORTED_USD,2)
os.makedirs("deck",exist_ok=True)
open("deck/data.js","w").write("window.DATA="+json.dumps(data,indent=1)+";\n")
print("deck/data.js:",{k:(v is not None) for k,v in data.items()})
