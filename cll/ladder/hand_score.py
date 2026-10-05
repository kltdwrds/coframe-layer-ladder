"""make: pick 10 held-out outputs -> results/hand_scores.csv (blank hand_score column).
agree: after you fill hand_score (1-5), compute agreement with the judge."""
import json, csv, random, sys, statistics
if sys.argv[1]=="make":
    s=json.load(open("results/heldout_outputs.json")); random.seed(0); pick=random.sample(s,10)
    w=csv.writer(open("results/hand_scores.csv","w",newline="")); w.writerow(["layer","id","output","judge_score","hand_score"])
    for r in pick: w.writerow([r["layer"],r["id"],r["out"],round(r["score"],2),""])
else:
    rows=[r for r in csv.DictReader(open("results/hand_scores.csv")) if r["hand_score"].strip()]
    j=[float(r["judge_score"]) for r in rows]; h=[float(r["hand_score"]) for r in rows]
    n=len(rows); mad=statistics.mean(abs(a-b) for a,b in zip(j,h))
    mj,mh=statistics.mean(j),statistics.mean(h)
    cov=sum((a-mj)*(b-mh) for a,b in zip(j,h)); den=(sum((a-mj)**2 for a in j)*sum((b-mh)**2 for b in h))**.5
    # within-1-point agreement and Pearson r
    print(f"n={n} pearson_r={cov/den if den else float('nan'):.2f} mean_abs_diff={mad:.2f} within_1pt={sum(abs(a-b)<=1 for a,b in zip(j,h))/n:.0%}")
