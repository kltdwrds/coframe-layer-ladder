import json, argparse, os, csv, random
from .llm import chat, GEN_MODEL, USAGE
from .judge import judge
from .layers import LAYERS
ap=argparse.ArgumentParser()
ap.add_argument("--iters",type=int,default=4)
ap.add_argument("--judge-n",type=int,default=3,help="judge repeats for noise")
ap.add_argument("--baseline-runs",type=int,default=3)
ap.add_argument("--dry",action="store_true",help="no API calls; print call/cost estimate")
a=ap.parse_args()
B=json.load(open("data/briefs.json"))
train=[b for b in B if b["split"]=="train"]; held=[b for b in B if b["split"]=="heldout"]
if a.dry:
    gen=len(LAYERS)*(a.iters+1)*12; jud=gen*a.judge_n
    print(f"~{gen} generations (mini) + ~{jud} judge calls (4o) + updates. Est. $3-6. No calls made."); raise SystemExit
def gen(layer,b):
    u=f"Brief: {b['brief']}\nAudience: {b['audience']}\nGoal: {b['goal']}\nVoice: {b['voice']}"
    return chat(GEN_MODEL,layer.system(b),u,temperature=0.7).strip()
def evaluate(layer,bs):
    res=[]
    for b in bs:
        o=gen(layer,b); j=judge(b,o,a.judge_n)
        res.append({"id":b["id"],"brief":b["brief"],"out":o,**j})
    return res
mean=lambda r:sum(x["score"] for x in r)/len(r)
hist={}; samples=[]; os.makedirs("results",exist_ok=True)
for L in LAYERS:
    layer=L(); hist[layer.name]=[]; usd0=USAGE["usd"]
    def train_score(prompt):
        class T: 
            def system(s,b): return prompt
        return mean(evaluate(T(),train))
    for it in range(a.iters+1):
        tr=evaluate(layer,train); ho=evaluate(layer,held)
        hist[layer.name].append({"iter":it,"train":mean(tr),"heldout":mean(ho),"usd_cum":USAGE["usd"]-usd0,"tokens_cum":USAGE["tokens"]})
        print(layer.name,it,f"train={mean(tr):.2f} held={mean(ho):.2f} ${USAGE['usd']-usd0:.2f}",flush=True)
        if it==a.iters: samples+= [{"layer":layer.name,**r} for r in ho]
        else: layer.update(tr,train_score)
# baseline noise: extra independent runs of baseline on held-out
from .layers import Baseline
noise=[mean(evaluate(Baseline(),held)) for _ in range(a.baseline_runs)]
json.dump({"history":hist,"baseline_noise":noise,"total_usd":USAGE["usd"]},open("results/history.json","w"),indent=2)
json.dump(samples,open("results/heldout_outputs.json","w"),indent=2)
print("baseline held-out noise across runs:",[round(x,2) for x in noise],"total $",round(USAGE["usd"],2))
