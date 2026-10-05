"""Collect run artifacts into deck/data.js for the presentation. Safe to re-run as results land.
Reads results_70b/ (run 1), results/ (run 2, if present), the calibration table and the judge-agreement key."""
import json, os, re, csv, statistics
def run(d):
    if not os.path.exists(f"{d}/history.json"): return None
    from .stats import summary
    S=summary(d); H=json.load(open(f"{d}/history.json")); h=H["history"]
    r=lambda x: None if x is None else round(x,3)
    layers={k:{"heldout":[r(x["heldout"]) for x in v],"train":[r(x["train"]) for x in v],
               **{a:(r(b) if isinstance(b,float) else b) for a,b in S["layers"][k].items()}} for k,v in h.items()}
    bank=sum(1 for l in open(f"{d}/edit_log.jsonl") if '"bank_add"' in l) if os.path.exists(f"{d}/edit_log.jsonl") else None
    return {"judge":S["judge"],"judge_n":S["judge_n"],"gen":H["gen_model"].split("/")[-1],"noise":[r(x) for x in S["null"]],
            "lo":r(S["lo"]),"hi":r(S["hi"]),"mu":r(S["mu"]),"sd":r(S["sd"]),"mde80":r(S["mde80"]),"layers":layers,
            "format_bad":S["format_bad"],"format_n":S["format_n"],"format_bad_mean":r(S["format_bad_mean"]),
            "criteria_values":S["criteria_values"],"total_usd":r(S["total_usd"]),"calls":S["calls"],"bank_adds":bank}
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
        if os.path.exists(f"{d}/crossjudge.json"):
            C=json.load(open(f"{d}/crossjudge.json")); by={(c["id"],c["out"]):c["other"]["score"] for c in C["rows"]}
            j[C["model"].split("/")[-1]]=round(by[(r["id"],r["output"])],2)
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
def crossjudge():
    pts=[]
    for d in ("results_70b","results"):
        if not os.path.exists(f"{d}/crossjudge.json"): continue
        C=json.load(open(f"{d}/crossjudge.json")); own=json.load(open(f"{d}/history.json"))["judge_model"].split("/")[-1]
        for r in C["rows"]:
            sc={own:r["score"],C["model"].split("/")[-1]:r["other"]["score"]}
            pts.append({"run":"run1" if d=="results_70b" else "run2","layer":r["layer"],"id":r["id"],
                        "j70":round(sc["llama-3.3-70b-instruct-fp8-fast"],3),"jds":round(sc["deepseek-v4-pro-0813"],3)})
    if not pts: return None
    def rank(a): s=sorted(a); return [s.index(x)+(a.count(x)-1)/2 for x in a]
    def rho(a,b):
        ra,rb=rank(a),rank(b); ma,mb=statistics.mean(ra),statistics.mean(rb)
        c=sum((x-ma)*(y-mb) for x,y in zip(ra,rb)); d=(sum((x-ma)**2 for x in ra)*sum((y-mb)**2 for y in rb))**.5
        return round(c/d,2) if d else None
    by={k:[p for p in pts if p["run"]==k] for k in ("run1","run2")}
    return {"points":pts,"rho_all":rho([p["j70"] for p in pts],[p["jds"] for p in pts]),
            "rho":{k:rho([p["j70"] for p in v],[p["jds"] for p in v]) for k,v in by.items() if v},
            "sd70":round(statistics.pstdev(p["j70"] for p in pts),2),"sdds":round(statistics.pstdev(p["jds"] for p in pts),2),
            "layer_means":{k:{L:{"j70":round(statistics.mean(p["j70"] for p in v if p["layer"]==L),2),"jds":round(statistics.mean(p["jds"] for p in v if p["layer"]==L),2)}
                              for L in {p["layer"] for p in v}} for k,v in by.items() if v}}
def control():
    p="results_control/control.json"
    if not os.path.exists(p): return None
    from .stats import summary, perm_p
    C=json.load(open(p))["rows"]; reps=sorted({r["rep"] for r in C}); out={"n_runs":len(reps),"format_ok":sum(r["fmt_ok"] for r in C),"n":len(C)}
    for d,k,tag in (("results_70b","llama-3.3-70b-instruct-fp8-fast","j70"),("results","deepseek-v4-pro-0813","jds")):
        S=summary(d); per=[statistics.mean(r["judges"][k]["score"] for r in C if r["rep"]==i) for i in reps]
        out[tag]={"mean":round(statistics.mean(per),3),"base_mu":round(S["mu"],3),"lift":round(statistics.mean(per)-S["mu"],3),"p":round(perm_p(per,S["null"]),3),
                  "criteria":{c:round(statistics.mean(r["judges"][k]["criteria"][c] for r in C),2) for c in ("brand_fit","specificity","claim_safety","goal_fit")}}
    return out
ABORTED_USD=0.19  # run 2's first attempt, stopped by a 429 after one evaluation pass (from its run.log)
def agree_stats(pts):
    if not pts: return None
    h=[p["hand"] for p in pts]; out={}
    for j in pts[0]["judges"]:
        v=[p["judges"][j] for p in pts]; mv,mh=statistics.mean(v),statistics.mean(h)
        c=sum((a-mv)*(b-mh) for a,b in zip(v,h)); d=(sum((a-mv)**2 for a in v)*sum((b-mh)**2 for b in h))**.5
        out["j70" if "70b" in j else "jds"]={"r":round(c/d,2) if d else None,"mad":round(statistics.mean(abs(a-b) for a,b in zip(v,h)),2),
            "bias":round(mv-mh,2),"within1":round(sum(abs(a-b)<=1 for a,b in zip(v,h))/len(h),2),"sd":round(statistics.pstdev(v),2)}
    out["n"]=len(pts); out["hand_sd"]=round(statistics.pstdev(h),2); return out
data={"run1":run("results_70b"),"run2":run("results"),"calib":calib(),"agree":agree("results"),"calib_usd":calib_usd(),"aborted_usd":ABORTED_USD,"cross":crossjudge(),"control":control(),"addons_usd":0.36}
data["agree_stats"]=agree_stats(data["agree"])
if data["run2"]: data["cost_total"]=round(data["run1"]["total_usd"]+data["run2"]["total_usd"]+data["calib_usd"]+ABORTED_USD+data["addons_usd"],2)
os.makedirs("deck",exist_ok=True)
open("deck/data.js","w").write("window.DATA="+json.dumps(data,indent=1)+";\n")
print("deck/data.js:",{k:(v is not None) for k,v in data.items()})
