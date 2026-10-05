"""make: pick 10 held-out outputs -> results/hand_scores.csv (blank hand_score column).
Judge scores and layer names go to results/hand_scores_key.json, not the CSV, so hand-scoring is blind.
rejudge MODEL: score the same sample with a second judge (stored in the key) for a judge-vs-judge-vs-human comparison.
agree: after you fill hand_score (1-5, same rubric), compute agreement for every judge in the key."""
import json, csv, random, sys, statistics
B={b["id"]:b for b in json.load(open("data/briefs.json"))}
if sys.argv[1]=="make":
    s=json.load(open("results/heldout_outputs.json")); random.seed(0); pick=random.sample(s,min(10,len(s)))
    w=csv.writer(open("results/hand_scores.csv","w",newline=""))
    w.writerow(["row","id","brief","audience","goal","voice","forbidden_claims","output","hand_score","comment"])
    key={}
    for i,r in enumerate(pick):
        b=B[r["id"]]
        w.writerow([i,r["id"],b["brief"],b["audience"],b["goal"],b["voice"],"; ".join(b["forbidden_claims"]),r["out"],"",""])
        key[i]={"layer":r["layer"],"judge_score":round(r["score"],2),"criteria":r["criteria"],"note":r["note"]}
    json.dump(key,open("results/hand_scores_key.json","w"),indent=2)
elif sys.argv[1]=="rejudge":
    from . import judge as J
    from .llm import USAGE
    J.JUDGE_MODEL=sys.argv[2]; key=json.load(open("results/hand_scores_key.json"))
    rows={r["row"]:r for r in csv.DictReader(open("results/hand_scores.csv"))}
    for i,k in key.items():
        r=J.judge(B[rows[i]["id"]],rows[i]["output"],3,{"layer":"rejudge","role":"judge","brief":rows[i]["id"]})
        k.setdefault("other_judges",{})[sys.argv[2]]={"judge_score":round(r["score"],2),"criteria":r["criteria"],"note":r["note"]}
    json.dump(key,open("results/hand_scores_key.json","w"),indent=2); print("rejudged",len(key),"with",sys.argv[2],f"${USAGE['usd']:.4f}")
else:
    key=json.load(open("results/hand_scores_key.json")); H=json.load(open("results/history.json"))
    rows=[r for r in csv.DictReader(open("results/hand_scores.csv")) if r["hand_score"].strip()]
    if len(rows)<3: raise SystemExit(f"only {len(rows)} hand scores filled in; need at least 3")
    h=[float(r["hand_score"]) for r in rows]; n=len(rows)
    judges={H["judge_model"]:[key[r["row"]]["judge_score"] for r in rows]}
    for m in key[rows[0]["row"]].get("other_judges",{}):
        judges[m]=[key[r["row"]]["other_judges"][m]["judge_score"] for r in rows]
    def stats(j):
        mj,mh=statistics.mean(j),statistics.mean(h); mad=statistics.mean(abs(a-b) for a,b in zip(j,h))
        cov=sum((a-mj)*(b-mh) for a,b in zip(j,h)); den=(sum((a-mj)**2 for a in j)*sum((b-mh)**2 for b in h))**.5
        return f"{cov/den if den else float('nan'):.2f} | {mad:.2f} | {sum(abs(a-b)<=1 for a,b in zip(j,h))/n:.0%} | {mj-mh:+.2f}"
    out=[f"n={n} hand-scored held-out outputs (blind; judge scores hidden while scoring)","",
         "judge | pearson r | mean abs diff | within 1pt | bias (judge - hand)","--|--|--|--|--"]
    out+=[f"{m.split('/')[-1]} | {stats(j)}" for m,j in judges.items()]
    names=[m.split('/')[-1] for m in judges]
    out+=["","row | layer | hand | "+" | ".join(names)+" | your comment","--|--|--|"+"--|"*len(names)+"--"]
    for i,r in enumerate(rows):
        out.append(f"{r['row']} | {key[r['row']]['layer']} | {h[i]:.1f} | "+" | ".join(f"{judges[m][i]:.2f}" for m in judges)+f" | {r['comment']}")
    open("results/judge_agreement.md","w").write("\n".join(out)+"\n"); print("\n".join(out))
