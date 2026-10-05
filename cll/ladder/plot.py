import json, sys, matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from .stats import summary
d=sys.argv[1] if len(sys.argv)>1 else "results"
S=summary(d); H=json.load(open(f"{d}/history.json")); h=H["history"]
fig,ax=plt.subplots(figsize=(7,4))
iters=[x["iter"] for x in next(iter(h.values()))]
ax.fill_between(iters,S["lo"],S["hi"],color="grey",alpha=.18,label=f"base-prompt range (n={len(S['null'])})")
ax.axhline(S["mu"],color="grey",lw=1,ls=":",label=f"base-prompt mean {S['mu']:.2f}")
for k,v in h.items():
    ax.plot([x["iter"] for x in v],[x["heldout"] for x in v],marker="o",label=k,ls="--" if S["layers"][k]["is_null"] else "-")
ax.set_xlabel("iteration"); ax.set_ylabel("held-out judge score (1-5)"); ax.set_xticks(iters); ax.legend(fontsize=7); ax.grid(alpha=.3)
ax.set_title(f"judge {S['judge']}, judge-n={S['judge_n']}  (dashed = base prompt throughout)",fontsize=9)
fig.tight_layout(); fig.savefig(f"{d}/heldout_vs_iter.png",dpi=150)
rows=[f"Null: {len(S['null'])} held-out runs that used the base prompt; mean {S['mu']:.2f}, sd {S['sd']:.2f}, range {S['lo']:.2f}-{S['hi']:.2f}.",
      f"Smallest lift this design detects at 80% power: ~{S['mde80']:.2f}. Lift = mean of iterations 1-4 minus the null mean; p = one-sided permutation vs the null (a screen, not a test).",
      f"Format: {S['format_bad']}/{S['format_n']} final held-out outputs break the 3-line format (mean judge score {S['format_bad_mean'] or 0:.2f}).","",
      "layer | mean held-out, iters 1-4 | lift vs base mean | p | learning $ (update calls) | total $ | tokens","--|--|--|--|--|--|--"]
for k,v in S["layers"].items():
    note=" (base prompt throughout)" if v["is_null"] else ""
    p="-" if v["p"] is None else f"{v['p']:.3f}"
    rows.append(f"{k}{note} | {v['post_mean']:.2f} | {v['lift']:+.2f} | {p} | {v['learn_usd']:.4f} | {v['total_usd']:.3f} | {v['tokens']}")
if "prompt_rewrite" in S["layers"]:
    r=S["layers"]["prompt_rewrite"]; rows+=["",f"prompt_rewrite: {r['accepted']} of {r['accepted']+r['rejected']} candidates accepted; candidate minus incumbent train score: {r['margins']}"]
open(f"{d}/gain_per_dollar.md","w").write("\n".join(rows)+"\n"); print("\n".join(rows))
