import os, json, re, time
from openai import OpenAI
# Backend: Cloudflare Workers AI through AI Gateway, via its OpenAI-compatible route.
# The SDK appends /chat/completions, so base_url ends in /workers-ai/v1.
# @cf/meta/llama-3.1-8b-instruct was deprecated 2026-05-30; the fp8 build is the same model, quantised.
GEN_MODEL=os.getenv("GEN_MODEL","@cf/meta/llama-3.1-8b-instruct-fp8")
JUDGE_MODEL=os.getenv("JUDGE_MODEL","@cf/meta/llama-3.3-70b-instruct-fp8-fast")
# USD per 1M tokens (in, out), Workers AI list price ($0.011 / 1k neurons). Edit if prices change.
PRICE={"@cf/meta/llama-3.1-8b-instruct-fp8":(0.152,0.287),"@cf/meta/llama-3.3-70b-instruct-fp8-fast":(0.293,2.253),
       "@cf/deepseek-ai/deepseek-v4-pro-0813":(1.32,3.96),"@cf/moonshotai/kimi-k2.6":(0.95,4.0),"@cf/zai-org/glm-5.3":(1.4,4.4)}
NEURONS_PER_USD=1000/0.011
_c=None; USAGE={"usd":0.0,"tokens":0,"calls":0}
def env(k):
    v=os.getenv(k)
    if not v: raise SystemExit(f"missing env var {k} (need CF_ACCOUNT_ID, CF_GATEWAY_NAME, CF_API_TOKEN)")
    return v
def client():
    global _c
    if _c is None:
        base=f"https://gateway.ai.cloudflare.com/v1/{env('CF_ACCOUNT_ID')}/{env('CF_GATEWAY_NAME')}/workers-ai/v1"
        # Same token twice: Authorization for Workers AI, cf-aig-authorization for an authenticated gateway.
        _c=OpenAI(base_url=base,api_key=env("CF_API_TOKEN"),max_retries=4,timeout=120,
                  default_headers={"cf-aig-authorization":f"Bearer {env('CF_API_TOKEN')}"})
    return _c
def chat(model,system,user,temperature=0.7,json_mode=False,max_tokens=400,meta=None):
    kw={"response_format":{"type":"json_object"}} if json_mode else {}
    # cf-aig-metadata tags each request so the gateway log can be joined back to layer/iter/brief.
    hdr={"cf-aig-metadata":json.dumps(meta)} if meta else None
    r=client().chat.completions.create(model=model,temperature=temperature,max_tokens=max_tokens,
        messages=[{"role":"system","content":system},{"role":"user","content":user}],extra_headers=hdr,**kw)
    u=r.usage; pi,po=PRICE.get(model,(0.293,2.253))
    USAGE["usd"]+=(u.prompt_tokens*pi+u.completion_tokens*po)/1e6
    USAGE["tokens"]+=u.prompt_tokens+u.completion_tokens; USAGE["calls"]+=1
    c=r.choices[0].message.content or ""  # reasoning models can return None if max_tokens runs out mid-thought
    # Workers AI json_object mode can hand back an already-parsed object
    return c if isinstance(c,str) else json.dumps(c)
def parse_json(t):
    m=re.search(r"\{.*\}",t,re.S)
    if not m: raise ValueError(f"no JSON in judge reply: {t[:200]!r}")
    return json.loads(m.group(0))
