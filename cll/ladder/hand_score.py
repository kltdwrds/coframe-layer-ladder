"""make: pick 10 held-out outputs -> results/hand_scores.csv (blank hand_score column).
Judge scores and layer names go to results/hand_scores_key.json, not the CSV, so hand-scoring is blind.
agree: after you fill hand_score (1-5, same rubric), compute agreement with the judge."""
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
else:
    key=json.load(open("results/hand_scores_key.json"))
    rows=[r for r in csv.DictReader(open("results/hand_scores.csv")) if r["hand_score"].strip()]
    if len(rows)<3: raise SystemExit(f"only {len(rows)} hand scores filled in; need at least 3")
    j=[key[r["row"]]["judge_score"] for r in rows]; h=[float(r["hand_score"]) for r in rows]
    n=len(rows); mad=statistics.mean(abs(a-b) for a,b in zip(j,h))
    mj,mh=statistics.mean(j),statistics.mean(h)
    cov=sum((a-mj)*(b-mh) for a,b in zip(j,h)); den=(sum((a-mj)**2 for a in j)*sum((b-mh)**2 for b in h))**.5
    out=[f"n={n} pearson_r={cov/den if den else float('nan'):.2f} mean_abs_diff={mad:.2f} within_1pt={sum(abs(a-b)<=1 for a,b in zip(j,h))/n:.0%} bias(judge-hand)={mj-mh:+.2f}",
         "","row | layer | judge | hand | diff | judge note | your comment","--|--|--|--|--|--|--"]
    for r,a,b in sorted(zip(rows,j,h),key=lambda t:-abs(t[1]-t[2])):
        k=key[r["row"]]; out.append(f"{r['row']} | {k['layer']} | {a:.2f} | {b:.1f} | {a-b:+.2f} | {k['note']} | {r['comment']}")
    open("results/judge_agreement.md","w").write("\n".join(out)+"\n"); print("\n".join(out))
