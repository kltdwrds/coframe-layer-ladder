import json, argparse, os
from concurrent.futures import ThreadPoolExecutor
from .llm import chat, GEN_MODEL, JUDGE_MODEL, PRICE, NEURONS_PER_USD, USAGE
from .judge import judge
from .layers import LAYERS, LOG, Baseline
ap=argparse.ArgumentParser()
ap.add_argument("--iters",type=int,default=4)
ap.add_argument("--judge-n",type=int,default=3,help="judge repeats for noise")
ap.add_argument("--baseline-runs",type=int,default=3)
ap.add_argument("--dry",action="store_true",help="no API calls; print call/cost estimate")
a=ap.parse_args()
B=json.load(open("data/briefs.json"))
train=[b for b in B if b["split"]=="train"]; held=[b for b in B if b["split"]=="heldout"]
assert not {b["id"] for b in train}&{b["id"] for b in held}
if a.dry:
    # calls: every layer evals train+held each iter; lesson=1 call/update; rewrite=1 call + full train re-score/update; noise runs on held.
    nT,nH,J=len(train),len(held),a.judge_n
    gens=len(LAYERS)*(a.iters+1)*(nT+nH) + a.iters*(nT) + a.baseline_runs*nH
    upd=2*a.iters
    juds=gens*J
    # token assumptions per call (in,out), measured roughly from prompt sizes
    # judge (in,out) measured in results/judge_calibration.md; reasoning judges spend ~800 output tokens thinking
    JT={"@cf/meta/llama-3.3-70b-instruct-fp8-fast":(310,55),"@cf/deepseek-ai/deepseek-v4-pro-0813":(320,790),"@cf/zai-org/glm-5.3":(320,690)}
    tok={"gen":(250,50),"judge":JT.get(JUDGE_MODEL,(450,800)),"upd":(400,150)}
    def usd(m,n,k): pi,po=PRICE[m]; i,o=tok[k]; return n*(i*pi+o*po)/1e6
    d=usd(GEN_MODEL,gens,"gen")+usd(GEN_MODEL,upd,"upd")+usd(JUDGE_MODEL,juds,"judge")
    neu=d*NEURONS_PER_USD
    print(f"~{gens} generations + {upd} update calls ({GEN_MODEL}) + ~{juds} judge calls ({JUDGE_MODEL})")
    print(f"est. ${d:.2f} list price = ~{neu:,.0f} neurons (free tier: 10,000/day{'; OVER' if neu>10000 else ''}). No calls made.")
    raise SystemExit
def gen(layer,b,meta):
    u=f"Brief: {b['brief']}\nAudience: {b['audience']}\nGoal: {b['goal']}\nVoice: {b['voice']}"
    return chat(GEN_MODEL,layer.system(b),u,temperature=0.7,max_tokens=150,meta=meta).strip()
def evaluate(layer,bs,tag):
    # briefs run concurrently (pure I/O); order is preserved, and update() still runs between passes
    def one(b):
        m={**tag,"brief":b["id"]}
        o=gen(layer,b,{**m,"role":"gen"}); j=judge(b,o,a.judge_n,{**m,"role":"judge"})
        return {"id":b["id"],"brief":b["brief"],"audience":b["audience"],"out":o,**j}
    with ThreadPoolExecutor(8) as ex: return list(ex.map(one,bs))
mean=lambda r:sum(x["score"] for x in r)/len(r)
hist={}; samples=[]; os.makedirs("results",exist_ok=True)
def save(noise=None):
    json.dump({"history":hist,"baseline_noise":noise,"total_usd":USAGE["usd"],"total_tokens":USAGE["tokens"],"calls":USAGE["calls"],
               "gen_model":GEN_MODEL,"judge_model":JUDGE_MODEL,"judge_n":a.judge_n},open("results/history.json","w"),indent=2)
    json.dump(samples,open("results/heldout_outputs.json","w"),indent=2)
    with open("results/edit_log.jsonl","w") as f:
        for e in LOG: f.write(json.dumps(e)+"\n")
for L in LAYERS:
    layer=L(); hist[layer.name]=[]; usd0,tok0=USAGE["usd"],USAGE["tokens"]; upd_usd=0.0
    cur={"it":0}
    def train_score(prompt):
        class T:
            def system(s,b): return prompt
        return mean(evaluate(T(),train,{"layer":layer.name,"iter":cur["it"],"phase":"rescore"}))
    for it in range(a.iters+1):
        tr=evaluate(layer,train,{"layer":layer.name,"iter":it,"phase":"train"})
        ho=evaluate(layer,held,{"layer":layer.name,"iter":it,"phase":"heldout"})
        hist[layer.name].append({"iter":it,"train":mean(tr),"heldout":mean(ho),"usd_cum":USAGE["usd"]-usd0,
                                 "update_usd_cum":upd_usd,"tokens_cum":USAGE["tokens"]-tok0})
        print(layer.name,it,f"train={mean(tr):.2f} held={mean(ho):.2f} ${USAGE['usd']-usd0:.3f}",flush=True)
        if it==a.iters: samples+=[{"layer":layer.name,**r} for r in ho]
        else:
            u0=USAGE["usd"]; cur["it"]=it
            layer.update(tr,train_score)  # train results only; held-out never reaches update()
            upd_usd+=USAGE["usd"]-u0
    if isinstance(layer,LAYERS[2]): hist[layer.name][-1].update(accepted=layer.accepted,rejected=layer.rejected,final_prompt=layer.prompt)
    save()
# baseline noise: extra independent runs of baseline on held-out
noise=[mean(evaluate(Baseline(),held,{"layer":"baseline_noise","iter":i,"phase":"heldout"})) for i in range(a.baseline_runs)]
save(noise)
print("baseline held-out noise across runs:",[round(x,2) for x in noise],"total $",round(USAGE["usd"],3),"calls",USAGE["calls"])
