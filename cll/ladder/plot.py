import json, matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
h=json.load(open("results/history.json"))["history"]
fig,ax=plt.subplots(figsize=(7,4))
for k,v in h.items(): ax.plot([x["iter"] for x in v],[x["heldout"] for x in v],marker="o",label=k)
ax.set_xlabel("iteration"); ax.set_ylabel("held-out judge score (1-5)"); ax.legend(); ax.grid(alpha=.3)
fig.tight_layout(); fig.savefig("results/heldout_vs_iter.png",dpi=150)
rows=["layer | gain (held-out) | $ spent | gain per $ | tokens","--|--|--|--|--"]
for k,v in h.items():
    g=v[-1]["heldout"]-v[0]["heldout"]; d=v[-1]["usd_cum"]
    rows.append(f"{k} | {g:+.2f} | {d:.2f} | {(g/d if d else 0):+.2f} | {v[-1]['tokens_cum']}")
open("results/gain_per_dollar.md","w").write("\n".join(rows)); print("\n".join(rows))
