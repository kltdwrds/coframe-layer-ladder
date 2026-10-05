"""Shared analysis for plot.py and deck_data.py. No model calls.
Null = every held-out run that used the base prompt: all baseline iterations, the extra baseline runs, every layer's
iteration 0, and prompt-rewrite iterations before its first accepted candidate. Layer effect = mean of iterations 1..N
minus the null mean, with a one-sided permutation p-value against the null pool (approximate: draws share the same
4 briefs and a layer's iterations are not fully independent, so treat p as a screen, not a test)."""
import json, os, re, random, statistics as st
KEYS=["brand_fit","specificity","claim_safety","goal_fit"]
def load(d):
    H=json.load(open(f"{d}/history.json"))
    log=[json.loads(l) for l in open(f"{d}/edit_log.jsonl")] if os.path.exists(f"{d}/edit_log.jsonl") else []
    return H,log
def base_draws(H,log):
    h=H["history"]; draws=[x["heldout"] for x in h.get("baseline",[])]+list(H.get("baseline_noise") or [])
    draws+=[v[0]["heldout"] for k,v in h.items() if k!="baseline"]
    rw=[e for e in log if e["event"]=="rewrite"]
    if "prompt_rewrite" in h:
        # rewrite update i happens after iteration i; iterations 1..first_accept still use the base prompt
        first=next((i for i,e in enumerate(rw) if e["accepted"]),None)
        upto=len(h["prompt_rewrite"])-1 if first is None else first
        draws+=[x["heldout"] for x in h["prompt_rewrite"][1:upto+1]]
    return draws
def perm_p(post,null,R=20000,seed=0):
    rnd=random.Random(seed); pool=null+post; n=len(post); m=st.mean(post); c=0
    for _ in range(R):
        rnd.shuffle(pool); c+=st.mean(pool[:n])>=m-1e-12
    return c/R
def fmt_ok(out):
    lines=[l for l in out.splitlines() if l.strip()]
    return len(lines)==3 and not re.search(r"\*\*|^#|^\s*here\b",out,re.I|re.M)
def summary(d):
    H,log=load(d); h=H["history"]; null=base_draws(H,log)
    mu,sd=st.mean(null),(st.stdev(null) if len(null)>1 else 0.0)
    rw=[e for e in log if e["event"]=="rewrite"]
    layers={}
    for k,v in h.items():
        post=[x["heldout"] for x in v[1:]]
        is_null=k=="baseline" or (k=="prompt_rewrite" and not any(e["accepted"] for e in rw))
        layers[k]={"post_mean":st.mean(post) if post else None,"lift":(st.mean(post)-mu) if post else None,
                   "p":None if (is_null or not post) else perm_p(post,null),"is_null":is_null,
                   "final":v[-1]["heldout"],"learn_usd":v[-1]["update_usd_cum"],"total_usd":v[-1]["usd_cum"],"tokens":v[-1]["tokens_cum"]}
    if "prompt_rewrite" in layers: layers["prompt_rewrite"].update(accepted=sum(e["accepted"] for e in rw),rejected=sum(not e["accepted"] for e in rw),
        margins=[round(e["candidate_train"]-e["incumbent_train"],3) for e in rw])
    S=json.load(open(f"{d}/heldout_outputs.json")) if os.path.exists(f"{d}/heldout_outputs.json") else []
    crit={c:sorted({s["criteria"][c] for s in S}) for c in KEYS} if S else {}
    bad=[s for s in S if not fmt_ok(s["out"])]
    return {"judge":H["judge_model"].split("/")[-1],"judge_n":H["judge_n"],"null":null,"mu":mu,"sd":sd,"lo":min(null),"hi":max(null),
            # smallest lift detectable at 80% power, alpha .05, comparing 4 post-learning draws with the null pool
            "mde80":2.8*sd*((1/4+1/max(1,len(null)))**.5),
            "layers":layers,"criteria_values":crit,"format_bad":len(bad),"format_n":len(S),
            "format_bad_mean":st.mean(s["score"] for s in bad) if bad else None,"total_usd":H["total_usd"],"calls":H.get("calls")}
