import json, statistics, matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
H=json.load(open("results/history.json")); h=H["history"]
# Noise floor: baseline extra runs plus every layer's iter 0 (all iter-0 runs use the identical base prompt).
noise=(H.get("baseline_noise") or [])+[v[0]["heldout"] for v in h.values()]
lo,hi,mu=min(noise),max(noise),statistics.mean(noise); floor=hi-lo
fig,ax=plt.subplots(figsize=(7,4))
iters=[x["iter"] for x in next(iter(h.values()))]
ax.fill_between(iters,lo,hi,color="grey",alpha=.2,label=f"baseline noise (n={len(noise)})")
for k,v in h.items():
    ax.plot([x["iter"] for x in v],[x["heldout"] for x in v],marker="o",label=k,ls="--" if k=="baseline" else "-")
ax.set_xlabel("iteration"); ax.set_ylabel("held-out judge score (1-5)"); ax.set_xticks(iters); ax.legend(fontsize=8); ax.grid(alpha=.3)
ax.set_title(f"judge {H['judge_model'].split('/')[-1]}, judge-n={H['judge_n']}",fontsize=9)
fig.tight_layout(); fig.savefig("results/heldout_vs_iter.png",dpi=150)
# Gain = final held-out minus the pooled base-prompt mean (less noisy than one iter-0 sample).
rows=[f"noise floor (range of {len(noise)} base-prompt held-out runs): {floor:.2f}; base mean {mu:.2f}","",
      "layer | final held-out | gain vs base mean | outside noise band? | learning $ | total $ | gain per learning $ | tokens","--|--|--|--|--|--|--|--"]
for k,v in h.items():
    g=v[-1]["heldout"]-mu; lu=v[-1]["update_usd_cum"]; d=v[-1]["usd_cum"]
    gp=f"{g/lu:+.0f}" if lu else "n/a (free)"
    rows.append(f"{k} | {v[-1]['heldout']:.2f} | {g:+.2f} | {'above band' if v[-1]['heldout']>hi else 'BELOW band' if v[-1]['heldout']<lo else 'no (inside band)'} | {lu:.4f} | {d:.3f} | {gp} | {v[-1]['tokens_cum']}")
open("results/gain_per_dollar.md","w").write("\n".join(rows)+"\n"); print("\n".join(rows))
