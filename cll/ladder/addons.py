"""Two controls the adversarial review asked for. No held-out brief influences anything; these only score.
crossjudge DIR MODEL N : re-score DIR's final held-out outputs with another judge -> DIR/crossjudge.json
control REPS           : base prompt + rubric + the brief's forbidden claims, generated REPS times per held-out brief,
                         each output scored by BOTH judges -> results_control/control.json"""
import json, os, sys, statistics as st
from concurrent.futures import ThreadPoolExecutor
from .llm import chat, GEN_MODEL, USAGE
from .judge import judge, RUB
from .layers import BASE
from .stats import fmt_ok
J70="@cf/meta/llama-3.3-70b-instruct-fp8-fast"; JDS="@cf/deepseek-ai/deepseek-v4-pro-0813"; JN={J70:3,JDS:2}
B={b["id"]:b for b in json.load(open("data/briefs.json"))}
def crossjudge(d,model,n):
    S=json.load(open(f"{d}/heldout_outputs.json"))
    def one(r): return {**{k:r[k] for k in ("layer","id","out","score")},"other":judge(B[r["id"]],r["out"],n,{"layer":"crossjudge","role":"judge","brief":r["id"]},model)}
    with ThreadPoolExecutor(4) as ex: rows=list(ex.map(one,S))
    json.dump({"model":model,"n":n,"rows":rows},open(f"{d}/crossjudge.json","w"),indent=2)
    a=[r["score"] for r in rows]; b=[r["other"]["score"] for r in rows]
    print(d,"rescored",len(rows),"with",model.split("/")[-1],f"mean {st.mean(a):.2f} -> {st.mean(b):.2f}",f"${USAGE['usd']:.3f}")
def control(reps):
    held=[b for b in B.values() if b["split"]=="heldout"]
    def sysp(b): return (BASE+"\n\nYou will be scored 1-5 on each of these criteria:\n"+"\n".join(f"- {k}: {v}" for k,v in RUB["criteria"].items())
                         +"\n\nNever make any of these claims: "+"; ".join(b["forbidden_claims"]))
    def one(job):
        rep,b=job; m={"layer":"control","iter":rep,"brief":b["id"]}
        u=f"Brief: {b['brief']}\nAudience: {b['audience']}\nGoal: {b['goal']}\nVoice: {b['voice']}"
        o=chat(GEN_MODEL,sysp(b),u,temperature=0.7,max_tokens=150,meta={**m,"role":"gen"}).strip()
        return {"rep":rep,"id":b["id"],"out":o,"fmt_ok":fmt_ok(o),
                "judges":{j.split("/")[-1]:judge(b,o,JN[j],{**m,"role":"judge"},j) for j in (J70,JDS)}}
    with ThreadPoolExecutor(4) as ex: rows=list(ex.map(one,[(r,b) for r in range(reps) for b in held]))
    os.makedirs("results_control",exist_ok=True)
    json.dump({"system_prompt_example":sysp(held[0]),"rows":rows},open("results_control/control.json","w"),indent=2)
    for j in (J70,JDS):
        k=j.split("/")[-1]; per=[st.mean(r["judges"][k]["score"] for r in rows if r["rep"]==i) for i in range(reps)]
        print("control",k,"per-run held-out means",[round(x,2) for x in per],f"mean {st.mean(per):.3f}")
    print("format ok",sum(r["fmt_ok"] for r in rows),"/",len(rows),f"${USAGE['usd']:.3f}")
if __name__=="__main__":
    if sys.argv[1]=="crossjudge": crossjudge(sys.argv[2],sys.argv[3],int(sys.argv[4]))
    else: control(int(sys.argv[2]))
