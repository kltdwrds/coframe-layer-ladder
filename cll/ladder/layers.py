"""Three layers. Each has .system(brief) -> system prompt used for generation and
.update(train_results) -> adapts state after a train pass. Held-out is never shown to update()."""
import json
from .llm import chat, GEN_MODEL
LOG=[]  # diagnosis/edit log, written to results/edit_log.jsonl by run.py
BASE="You write landing-page hero copy. Output exactly: HEADLINE, SUBHEAD, CTA, each on its own line."
def words(s): return set(w for w in s.lower().split() if len(w)>3)
class Baseline:
    name="baseline"
    def system(self,b): return BASE
    def update(self,res,judge_score_fn=None): pass
class LessonInContext:
    name="lesson_in_context"
    def __init__(s): s.lessons=[]
    def system(s,b):
        if not s.lessons: return BASE
        return BASE+"\n\nLessons learned from past feedback:\n"+"\n".join("- "+l for l in s.lessons[-8:])
    def update(s,res,judge_score_fn=None):
        worst=sorted(res,key=lambda r:r["score"])[:3]
        fb="\n".join(f"score {r['score']:.1f} | {r['out']} | judge: {r['note']}" for r in worst)
        t=chat(GEN_MODEL,"You distill feedback into ONE short, general, reusable writing lesson (no brand names).",fb,temperature=0.3,
               max_tokens=120,meta={"layer":s.name,"phase":"update"})
        s.lessons.append(t.strip())
        LOG.append({"layer":s.name,"event":"lesson","diagnoses":[{"id":r["id"],"score":round(r["score"],2),"note":r["note"]} for r in worst],"lesson":t.strip()})
class PromptRewrite:
    """GEPA-style: propose a new system prompt from failures; accept only if train score rises."""
    name="prompt_rewrite"
    def __init__(s): s.prompt=BASE; s.best=None; s.accepted=0; s.rejected=0
    def system(s,b): return s.prompt
    def update(s,res,judge_score_fn=None):
        # Gate against the incumbent's score on this same train pass, not a stale running max:
        # a max of noisy single passes is biased upward and would reject nearly every candidate.
        cur=sum(r["score"] for r in res)/len(res); s.best=cur
        worst=sorted(res,key=lambda r:r["score"])[:3]
        fb="\n".join(f"score {r['score']:.1f} | {r['out']} | judge: {r['note']}" for r in worst)
        cand=chat(GEN_MODEL,"Rewrite the system prompt to fix the failures. Keep the output format line. Return only the new prompt.",
                  f"Current prompt:\n{s.prompt}\n\nFailures:\n{fb}",temperature=0.5,max_tokens=500,meta={"layer":s.name,"phase":"update"}).strip()
        if judge_score_fn is None: s.prompt=cand; return
        new=judge_score_fn(cand)  # re-score candidate on TRAIN only
        ok=new>s.best
        LOG.append({"layer":s.name,"event":"rewrite","diagnoses":[{"id":r["id"],"score":round(r["score"],2),"note":r["note"]} for r in worst],
                    "incumbent_train":round(cur,3),"candidate_train":round(new,3),"accepted":ok,"candidate":cand})
        if ok: s.prompt,s.best=cand,new; s.accepted+=1
        else: s.rejected+=1
class RetrievedFewShot:
    name="retrieved_fewshot"
    def __init__(s,k=2,thresh=4.0): s.bank=[]; s.k=k; s.thresh=thresh
    def system(s,b):
        if not s.bank: return BASE
        q=words(b["brief"]+" "+b["audience"])
        key=lambda e:words(e["brief"]+" "+e["audience"])
        sc=sorted(s.bank,key=lambda e:-len(q&key(e))/(1+len(q|key(e))))[:s.k]
        ex="\n\n".join(f"Brief: {e['brief']}\n{e['out']}" for e in sc)
        return BASE+"\n\nHighly rated examples:\n"+ex
    def update(s,res,judge_score_fn=None):
        for r in res:
            if r["score"]>=s.thresh and all(r["id"]!=e["id"] for e in s.bank):
                s.bank.append(r); LOG.append({"layer":s.name,"event":"bank_add","id":r["id"],"score":round(r["score"],2),"out":r["out"]})
LAYERS=[Baseline,LessonInContext,PromptRewrite,RetrievedFewShot]
