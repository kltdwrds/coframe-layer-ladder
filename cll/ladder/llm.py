import os, json, re
from openai import OpenAI
GEN_MODEL=os.getenv("GEN_MODEL","gpt-4o-mini")
JUDGE_MODEL=os.getenv("JUDGE_MODEL","gpt-4o")
# USD per 1M tokens (in, out). Edit if prices change.
PRICE={"gpt-4o-mini":(0.15,0.60),"gpt-4o":(2.50,10.00)}
_c=None; USAGE={"usd":0.0,"tokens":0}
def client():
    global _c
    if _c is None: _c=OpenAI()
    return _c
def chat(model,system,user,temperature=0.7,json_mode=False):
    kw={"response_format":{"type":"json_object"}} if json_mode else {}
    r=client().chat.completions.create(model=model,temperature=temperature,
        messages=[{"role":"system","content":system},{"role":"user","content":user}],**kw)
    u=r.usage; pi,po=PRICE.get(model,(2.5,10))
    USAGE["usd"]+=(u.prompt_tokens*pi+u.completion_tokens*po)/1e6
    USAGE["tokens"]+=u.prompt_tokens+u.completion_tokens
    return r.choices[0].message.content
def parse_json(t):
    m=re.search(r"\{.*\}",t,re.S); return json.loads(m.group(0))
