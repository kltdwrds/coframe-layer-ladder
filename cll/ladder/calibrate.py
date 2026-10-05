"""Pick a judge by test: hand-written copy on TRAIN briefs: 5 good, 7 with one planted defect, 4 plausible-but-mediocre.
A good judge sinks the targeted criterion (<=2) on defects, ranks mediocre between defects and good, and returns parseable JSON.
Obvious defects turned out easy for every judge; the mediocre items are where judges separate.
Usage: python -m ladder.calibrate MODEL [MODEL ...]  -> results/judge_calibration.md"""
import sys, json, statistics
from . import llm
from .judge import judge_once, KEYS
B={b["id"]:b for b in json.load(open("data/briefs.json")) if b["split"]=="train"}
# (brief id, expected: "good" or the criterion the defect should sink, copy)
SET=[
 ("ledger-coffee","good","Your desk deserves better beans\nSmall-batch roasts, shipped weekly and tasting notes for the curious. Brew your first bag on us-ish: $9 trial.\nStart my first bag"),
 ("ledger-coffee","claim_safety","The #1 coffee in the world, at your desk\nSmall-batch roasts shipped weekly to remote workers who care about taste.\nStart my first bag"),
 ("pillar-legal","good","Understand your contracts before you sign\nPlain-English review of the clauses founders most often miss, so your lawyer's time goes further.\nBook a 20-minute demo"),
 ("pillar-legal","claim_safety","Replaces your lawyer. Guaranteed compliance.\nUpload any contract and sign with total confidence, no attorney needed.\nBook a demo"),
 ("trailhead-gear","specificity","Quality products for every need\nDiscover our amazing selection, great prices and excellent service.\nShop now"),
 ("kiln-fitness","brand_fit","GET SHREDDED FAST!!! BEAST MODE ACTIVATED\nCRUSH YOUR LIMITS WITH THE MOST INSANE WORKOUTS EVER, NO EXCUSES, NO WEAKNESS!!!\nDOMINATE NOW"),
 ("harbor-bank","good","Savings that keep up with uneven paychecks\nSet aside a share of every client payment automatically, built for freelancers. FDIC insured through partner banks.\nOpen an account"),
 ("harbor-bank","goal_fit","Our story began with a freelancer\nRead about the founders, our values and the team behind the company.\nMeet the team"),
 ("nimbus-ci","good","CI that doesn't treat your monorepo like a punishment\nOnly rebuild what changed. Remote caching and parallel shards for 20-200 person eng teams.\nStart a free trial"),
 ("petal-florist","good","Forgot? Flowers in Chicago, today\nOrder by 2pm for same-day local delivery, hand-tied by neighborhood florists.\nPlace an order"),
 ("petal-florist","specificity","Make every moment special\nWe help you celebrate what matters most with care and quality.\nLearn more"),
 ("sable-sleep","claim_safety","Cures insomnia. Doctor recommended.\nOur weighted mask and wind-down audio fix sleep problems for good.\nStart 14-day trial"),
 # mediocre: on-topic and safe, but generic phrasing, weak CTA, or voice drift. Should land mid-scale, below "good".
 ("ledger-coffee","mediocre","Great coffee delivered to your door\nEnjoy fresh, high-quality coffee every week with our convenient subscription service.\nSign up today"),
 ("kiln-fitness","mediocre","Transform your fitness journey\nJoin our gym and achieve your goals with expert coaching and a supportive community.\nGet started"),
 ("nimbus-ci","mediocre","Faster builds for your team\nOur CI platform helps engineering teams ship code more quickly and efficiently.\nLearn more"),
 ("sable-sleep","mediocre","Sleep better tonight\nOur sleep mask and app help you relax and get the rest you deserve.\nTry it now"),
]
def run(model,n=2):
    llm.JUDGE_MODEL=model; import ladder.judge as J; J.JUDGE_MODEL=model
    u0,t0=llm.USAGE["usd"],llm.USAGE["tokens"]; rows=[]; fails=0; incons=0
    for bid,exp,copy in SET:
        rs=[]
        for _ in range(n):
            try: rs.append(judge_once(B[bid],copy,{"layer":"calibrate","role":"judge","brief":bid}))
            except Exception as e: fails+=1; print(" fail:",model,bid,str(e)[:120],flush=True)
        if not rs: rows.append((bid,exp,None,None)); continue
        incons+=len(rs)>1 and any(rs[0][k]!=rs[1][k] for k in KEYS)
        crit={k:statistics.mean(r[k] for r in rs) for k in KEYS}
        rows.append((bid,exp,crit,statistics.mean(crit.values())))
    ok=[r for r in rows if r[2]]
    good=[r[3] for r in ok if r[1]=="good"]; bad=[r for r in ok if r[1] not in("good","mediocre")]; med=[r[3] for r in ok if r[1]=="mediocre"]
    caught=sum(r[2][r[1]]<=2 for r in bad)
    return {"model":model,"caught":f"{caught}/{len(bad)}","good_mean":statistics.mean(good) if good else float("nan"),
            "defect_mean":statistics.mean(r[3] for r in bad) if bad else float("nan"),"med_mean":statistics.mean(med) if med else float("nan"),
            "all_sd":statistics.pstdev(r[3] for r in ok),"json_fail":fails,"inconsistent":incons,
            "usd":llm.USAGE["usd"]-u0,"tokens":llm.USAGE["tokens"]-t0,"rows":rows}
if __name__=="__main__":
    out=["model | defects caught (target crit <=2) | good mean | mediocre mean | defect mean | good-mediocre gap | score sd | json fails | repeat-inconsistent items | $ | tokens","--|--|--|--|--|--|--|--|--|--|--"]
    detail=[]
    for m in sys.argv[1:]:
        r=run(m); print(m,r["caught"],f"good {r['good_mean']:.2f} med {r['med_mean']:.2f} bad {r['defect_mean']:.2f}",flush=True)
        out.append(f"{m.split('/')[-1]} | {r['caught']} | {r['good_mean']:.2f} | {r['med_mean']:.2f} | {r['defect_mean']:.2f} | {r['good_mean']-r['med_mean']:+.2f} | {r['all_sd']:.2f} | {r['json_fail']} | {r['inconsistent']} | {r['usd']:.4f} | {r['tokens']}")
        detail+=["",f"### {m}","brief | expected | target crit | overall"]+[f"{b} | {e} | {('-' if not c else (c[e] if e not in('good','mediocre') else '-'))} | {('FAIL' if s is None else f'{s:.2f}')}" for b,e,c,s in r["rows"]]
    open("results/judge_calibration.md","w").write("\n".join(out+detail)+"\n"); print("\n".join(out))
