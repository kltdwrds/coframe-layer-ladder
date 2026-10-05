(function () {
  var D = window.DATA || {};
  var NS = "http://www.w3.org/2000/svg";
  var NAMES = { baseline: "Baseline", lesson_in_context: "Lesson in context", prompt_rewrite: "Prompt rewrite", retrieved_fewshot: "Retrieved few-shot" };
  var ORDER = ["baseline", "lesson_in_context", "prompt_rewrite", "retrieved_fewshot"];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(n, a, parent) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; }
  function txt(n, a, s, parent) { var e = el(n, a, parent); e.textContent = s; return e; }
  function f2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function fp(p) { return p < 0.01 ? p.toFixed(3) : p.toFixed(2); }
  function sign(x) { return (x >= 0 ? "+" : "−") + f2(Math.abs(x)); }

  // ---------- tooltip ----------
  function tipFor(box) {
    var t = document.createElement("div"); t.className = "tip"; box.appendChild(t);
    return {
      show: function (html, evt) {
        t.innerHTML = html; t.classList.add("on");
        var r = box.getBoundingClientRect(), x = evt.clientX - r.left + 12, y = evt.clientY - r.top - 10;
        if (x + t.offsetWidth > r.width) x = x - t.offsetWidth - 24;
        t.style.left = x + "px"; t.style.top = Math.max(0, y - t.offsetHeight) + "px";
      },
      hide: function () { t.classList.remove("on"); }
    };
  }

  // ---------- held-out score vs iteration, with baseline noise band ----------
  function lineChart(box, run) {
    if (!run) return;
    var W = 640, H = 330, L = 44, R = 150, T = 14, B = 40, pw = W - L - R, ph = H - T - B;
    var all = run.noise.slice(); ORDER.forEach(function (k) { if (run.layers[k]) all = all.concat(run.layers[k].heldout); });
    var lo = Math.floor((Math.min.apply(null, all) - 0.1) * 4) / 4, hi = Math.min(5, Math.ceil((Math.max.apply(null, all) + 0.1) * 4) / 4);
    var n = 0; ORDER.forEach(function (k) { if (run.layers[k]) n = Math.max(n, run.layers[k].heldout.length); });
    var x = function (i) { return L + pw * i / Math.max(1, n - 1); }, y = function (v) { return T + ph * (hi - v) / (hi - lo); };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Held-out judge score by iteration for each layer, judge " + run.judge + ", with the baseline noise band." }, box);
    for (var v = lo; v <= hi + 1e-9; v += 0.25) {
      el("line", { x1: L, x2: L + pw, y1: y(v), y2: y(v), "class": "grid" }, svg);
      txt("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end", "class": "tick" }, v.toFixed(2), svg);
    }
    for (var i = 0; i < n; i++) txt("text", { x: x(i), y: T + ph + 18, "text-anchor": "middle", "class": "tick" }, i, svg);
    txt("text", { x: L + pw / 2, y: H - 4, "text-anchor": "middle", "class": "axis-title" }, "learning iteration", svg);
    el("rect", { x: L, width: pw, y: y(run.hi), height: Math.max(1, y(run.lo) - y(run.hi)), "class": "band anim-fade" }, svg);
    el("line", { x1: L, x2: L + pw, y1: y(run.mu), y2: y(run.mu), stroke: "var(--graphite)", "stroke-dasharray": "2 3", "class": "anim-fade" }, svg);
    txt("text", { x: L + 6, y: y(run.lo) - 6, "class": "band-label anim-fade" }, "range of " + run.noise.length + " base-prompt runs · dotted = their mean " + f2(run.mu), svg);
    var tip = tipFor(box), labels = [];
    ORDER.forEach(function (k, si) {
      var s = run.layers[k]; if (!s) return;
      var d = s.heldout.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
      var p = el("path", { d: d, "class": "series anim-line s-" + k }, svg);
      if (s.is_null && k !== "baseline") p.setAttribute("stroke-dasharray", "5 4");
      p.dataset.len = "1";
      s.heldout.forEach(function (v, i) {
        var c = el("circle", { cx: x(i), cy: y(v), r: 4.5, "class": "dot anim-fade s-" + k }, svg);
        var hit = el("circle", { cx: x(i), cy: y(v), r: 12, fill: "transparent" }, svg);
        hit.addEventListener("mousemove", function (e) { tip.show("<b>" + NAMES[k] + "</b><br><span class=k>iteration</span> " + i + " · <span class=k>held-out</span> " + f2(v) + "<br><span class=k>train</span> " + f2(s.train[i]), e); });
        hit.addEventListener("mouseleave", tip.hide);
      });
      labels.push({ k: k, y: y(s.heldout[s.heldout.length - 1]), v: s.heldout[s.heldout.length - 1], nul: s.is_null && k !== "baseline" });
    });
    // direct labels at line ends, nudged apart
    labels.sort(function (a, b) { return a.y - b.y; });
    for (var j = 1; j < labels.length; j++) if (labels[j].y - labels[j - 1].y < 16) labels[j].y = labels[j - 1].y + 16;
    labels.forEach(function (l) { txt("text", { x: L + pw + 10, y: l.y + 4, "class": "lbl anim-fade" }, NAMES[l.k] + (l.nul ? " (base prompt)" : ""), svg); });
    dataTable(box, ["layer"].concat(Array.from({ length: n }, function (_, i) { return "iter " + i; })),
      ORDER.filter(function (k) { return run.layers[k]; }).map(function (k) { return [NAMES[k]].concat(run.layers[k].heldout.map(f2)); }));
  }

  // ---------- judge calibration: dot strip per judge ----------
  function stripChart(box, cal, compact) {
    if (!cal || !cal.length) return;
    var W = 640, rowH = compact ? 46 : 74, L = compact ? 120 : 170, R = 20, T = 8, B = 34, H = T + rowH * cal.length + B, pw = W - L - R;
    var x = function (v) { return L + pw * (v - 1) / 4; };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Calibration scores from each judge for good, mediocre and defective copy on a 1 to 5 scale." }, box);
    [1, 2, 3, 4, 5].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: T + rowH * cal.length, "class": "grid" }, svg);
      txt("text", { x: x(v), y: T + rowH * cal.length + 18, "text-anchor": "middle", "class": "tick" }, v, svg);
    });
    var tip = tipFor(box);
    var off = { good: -0.28, mediocre: 0, defect: 0.28 };
    cal.forEach(function (m, r) {
      var cy = T + rowH * r + rowH / 2;
      txt("text", { x: L - 14, y: cy + 4, "text-anchor": "end", "class": "lbl" }, m.name.replace("-instruct-fp8-fast", "").replace("-0813", ""), svg);
      var seen = {};
      m.items.forEach(function (it) {
        var key = it.kind + it.score, nth = seen[key] = (seen[key] || 0) + 1;  // stack identical scores so none hide
        var yy = cy + off[it.kind] * rowH + (nth - 1) * (compact ? 4 : 5) * (nth % 2 ? 1 : -1);
        var xx = x(it.score) + (nth - 1) * 3;
        var c = el("circle", { cx: xx, cy: yy, r: compact ? 5 : 6, "class": "dot anim-dot k-" + it.kind }, svg);
        c.dataset.dx = (x(5) - xx).toFixed(1);
        var hit = el("circle", { cx: xx, cy: yy, r: 10, fill: "transparent" }, svg);
        hit.addEventListener("mousemove", function (e) { tip.show("<b>" + m.name + "</b><br>" + it.brief + " · <span class=k>" + it.kind + "</span> · " + f2(it.score), e); });
        hit.addEventListener("mouseleave", tip.hide);
      });
      ["mediocre"].forEach(function (k) {
        var xs = m.items.filter(function (i) { return i.kind === k; }).map(function (i) { return i.score; });
        if (!xs.length || compact) return;
        var mean = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
        el("line", { x1: x(mean), x2: x(mean), y1: cy - 14, y2: cy + 14, stroke: "var(--ink)", "stroke-width": 2, "class": "anim-fade" }, svg);
        txt("text", { x: x(mean) + 6, y: cy - 10, "class": "lbl muted anim-fade" }, "mediocre mean " + f2(mean), svg);
      });
    });
    txt("text", { x: L + pw / 2, y: H - 2, "text-anchor": "middle", "class": "axis-title" }, "judge score (1–5)", svg);
    if (!compact) dataTable(box, ["judge", "kind", "brief", "score"], [].concat.apply([], cal.map(function (m) { return m.items.map(function (i) { return [m.name, i.kind, i.brief, f2(i.score)]; }); })));
  }

  // ---------- gain vs noise, both runs ----------
  function gainChart(box, runs) {
    var W = 640, rowH = 30, L = 170, R = 70, T = 20, gap = 26;
    var blocks = runs.filter(function (r) { return r.run; });
    var ROWS = ORDER.concat(D.control ? ["control"] : []);
    var H = T + blocks.length * (ROWS.length * rowH + gap) + 24, pw = W - L - R;
    function rowData(b, k) { if (k !== "control") return b.run.layers[k]; var c = D.control[b.tag]; return c && { lift: c.lift, p: c.p, post_mean: c.mean, learn_usd: 0, is_null: false }; }
    var ext = 0.1; blocks.forEach(function (b) { ROWS.forEach(function (k) { var s = rowData(b, k); if (s) ext = Math.max(ext, Math.abs(s.lift)); }); ext = Math.max(ext, b.run.mde80); });
    ext = Math.ceil(ext * 10) / 10;
    var x = function (v) { return L + pw * (v + ext) / (2 * ext); };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Final held-out gain over the pooled base-prompt mean, per layer, for each judge, with the noise range." }, box);
    var tip = tipFor(box), y0 = T;
    blocks.forEach(function (b) {
      var top = y0, bot = y0 + ROWS.length * rowH;
      txt("text", { x: 0, y: top - 6, "class": "lbl muted" }, "Judge: " + b.run.judge.replace("-instruct-fp8-fast", "").replace("-0813", ""), svg);
      el("rect", { x: x(-b.run.mde80), width: x(b.run.mde80) - x(-b.run.mde80), y: top, height: bot - top, "class": "band anim-fade" }, svg);
      el("line", { x1: x(0), x2: x(0), y1: top, y2: bot, "class": "axis" }, svg);
      ROWS.forEach(function (k, i) {
        var s = rowData(b, k); if (!s) return;
        var cy = top + i * rowH + rowH / 2;
        txt("text", { x: L - 12, y: cy + 4, "text-anchor": "end", "class": "lbl" + (k === "control" ? " muted" : "") }, k === "control" ? "Rubric in prompt (static)" : NAMES[k], svg);
        var x1 = Math.min(x(0), x(s.lift)), w = Math.abs(x(s.lift) - x(0));
        var r = el("rect", { x: x1, y: cy - 7, width: Math.max(2, w), height: 14, rx: 3, "class": (k === "control" ? "s-control" : "s-" + k) + " anim-fade" }, svg);
        txt("text", { x: (s.lift >= 0 ? x(s.lift) + 6 : x(s.lift) - 6), y: cy + 4, "text-anchor": s.lift >= 0 ? "start" : "end", "class": "lbl" }, sign(s.lift) + (s.p != null ? "  p=" + fp(s.p) : s.is_null ? "  (base prompt)" : ""), svg);
        var hit = el("rect", { x: L, y: cy - rowH / 2, width: pw, height: rowH, fill: "transparent" }, svg);
        hit.addEventListener("mousemove", function (e) { tip.show("<b>" + (k === "control" ? "Rubric + forbidden claims in the prompt (no learning)" : NAMES[k]) + "</b><br><span class=k>mean held-out, iters 1–4</span> " + f2(s.post_mean) + " · <span class=k>lift</span> " + sign(s.lift) + (s.p != null ? " · <span class=k>p</span> " + s.p.toFixed(3) : "") + "<br><span class=k>learning cost</span> $" + s.learn_usd.toFixed(4) + (s.accepted != null ? "<br><span class=k>rewrites accepted</span> " + s.accepted + " of " + (s.accepted + s.rejected) : ""), e); });
        hit.addEventListener("mouseleave", tip.hide);
      });
      y0 = bot + gap + 14;
    });
    [-ext, 0, ext].forEach(function (v) { txt("text", { x: x(v), y: H - 4, "text-anchor": "middle", "class": "tick" }, (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1), svg); });
  }

  // ---------- judge vs human scatter ----------
  function scatter(box, pts) {
    if (!pts || !pts.length) { box.innerHTML = '<div class="pending">Hand scores not in yet. This chart fills itself from results/hand_scores.csv once Kyle has scored the 10 blind samples.</div>'; return; }
    var judges = Object.keys(pts[0].judges), cls = ["k-mediocre", "k-good"];
    var W = 420, H = 380, L = 44, R = 16, T = 12, B = 44, pw = W - L - R, ph = H - T - B;
    var x = function (v) { return L + pw * (v - 1) / 4; }, y = function (v) { return T + ph * (5 - v) / 4; };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Judge score against hand score for each sampled output." }, box);
    [1, 2, 3, 4, 5].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: T + ph, "class": "grid" }, svg); el("line", { x1: L, x2: L + pw, y1: y(v), y2: y(v), "class": "grid" }, svg);
      txt("text", { x: x(v), y: T + ph + 18, "text-anchor": "middle", "class": "tick" }, v, svg);
      txt("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end", "class": "tick" }, v, svg);
    });
    el("line", { x1: x(1), y1: y(1), x2: x(5), y2: y(5), stroke: "var(--graphite)", "stroke-dasharray": "4 4" }, svg);
    txt("text", { x: L + pw / 2, y: H - 6, "text-anchor": "middle", "class": "axis-title" }, "hand score", svg);
    txt("text", { x: 12, y: T + ph / 2, "text-anchor": "middle", "class": "axis-title", transform: "rotate(-90 12 " + (T + ph / 2) + ")" }, "judge score", svg);
    var tip = tipFor(box);
    judges.forEach(function (j, ji) {
      pts.forEach(function (p) {
        var c = el("circle", { cx: x(p.hand + (ji - 0.5) * 0.06), cy: y(p.judges[j]), r: 6, "class": "dot anim-fade " + cls[ji % 2] }, svg);
        var hit = el("circle", { cx: x(p.hand), cy: y(p.judges[j]), r: 11, fill: "transparent" }, svg);
        hit.addEventListener("mousemove", function (e) { tip.show("<b>" + j + "</b><br><span class=k>row</span> " + p.row + " · " + p.layer + "<br><span class=k>hand</span> " + p.hand + " · <span class=k>judge</span> " + f2(p.judges[j]) + (p.comment ? "<br>" + p.comment : ""), e); });
        hit.addEventListener("mouseleave", tip.hide);
      });
    });
    var lg = document.createElement("div"); lg.className = "legend";
    lg.innerHTML = judges.map(function (j, ji) { return '<span><i class="dot" style="background:var(' + (ji % 2 ? "--arm-b" : "--arm-a") + ')"></i>' + j + "</span>"; }).join("");
    box.insertBefore(lg, box.firstChild);
  }

  function crossChart(box, c) {
    if (!c) return;
    var W = 460, H = 380, L = 46, R = 16, T = 12, B = 44, lo = 2, hi = 5, pw = W - L - R, ph = H - T - B;
    var x = function (v) { return L + pw * (v - lo) / (hi - lo); }, y = function (v) { return T + ph * (hi - v) / (hi - lo); };
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "The same 32 held-out outputs scored by both judges: the 70B along x, DeepSeek along y." }, box);
    [2, 3, 4, 5].forEach(function (v) {
      el("line", { x1: x(v), x2: x(v), y1: T, y2: T + ph, "class": "grid" }, svg); el("line", { x1: L, x2: L + pw, y1: y(v), y2: y(v), "class": "grid" }, svg);
      txt("text", { x: x(v), y: T + ph + 18, "text-anchor": "middle", "class": "tick" }, v, svg);
      txt("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end", "class": "tick" }, v, svg);
    });
    el("line", { x1: x(lo), y1: y(lo), x2: x(hi), y2: y(hi), stroke: "var(--graphite)", "stroke-dasharray": "4 4" }, svg);
    txt("text", { x: L + pw / 2, y: H - 6, "text-anchor": "middle", "class": "axis-title" }, "llama-3.3-70b score", svg);
    txt("text", { x: 12, y: T + ph / 2, "text-anchor": "middle", "class": "axis-title", transform: "rotate(-90 12 " + (T + ph / 2) + ")" }, "deepseek-v4-pro score", svg);
    var tip = tipFor(box);
    c.points.forEach(function (p, i) {
      var jx = ((i * 7) % 5 - 2) * 0.012;  // tiny deterministic jitter: the 70B's scores pile up on a few values
      el("circle", { cx: x(p.j70 + jx), cy: y(p.jds), r: 5.5, "class": "dot anim-fade " + (p.run === "run1" ? "k-mediocre" : "k-good") }, svg);
      var hit = el("circle", { cx: x(p.j70 + jx), cy: y(p.jds), r: 10, fill: "transparent" }, svg);
      hit.addEventListener("mousemove", function (e) { tip.show("<b>" + (p.run === "run1" ? "Run 1 output" : "Run 2 output") + "</b> · " + NAMES[p.layer] + "<br>" + p.id + "<br><span class=k>70B</span> " + f2(p.j70) + " · <span class=k>DeepSeek</span> " + f2(p.jds), e); });
      hit.addEventListener("mouseleave", tip.hide);
    });
    var lg = document.createElement("div"); lg.className = "legend";
    lg.innerHTML = '<span><i class="dot" style="background:var(--arm-a)"></i>run 1 outputs</span><span><i class="dot" style="background:var(--arm-b)"></i>run 2 outputs</span>';
    box.insertBefore(lg, box.firstChild);
    dataTable(box, ["run", "layer", "brief", "70B", "DeepSeek"], c.points.map(function (p) { return [p.run, NAMES[p.layer], p.id, f2(p.j70), f2(p.jds)]; }));
  }

  function dataTable(box, head, rows) {
    var d = document.createElement("details"); d.className = "data";
    d.innerHTML = "<summary>Data</summary><table><tr>" + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" +
      rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
    box.appendChild(d);
  }

  // ---------- numbers in prose: data-k="run2.layers.lesson_in_context.gain|sign" ----------
  function bind() {
    document.querySelectorAll("[data-k]").forEach(function (n) {
      var parts = n.dataset.k.split("|"), v = parts[0].split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D);
      if (v == null) { n.textContent = n.dataset.pending || "…"; n.classList.add("muted"); return; }
      var fmt = parts[1];
      n.textContent = /\.p$/.test(parts[0]) && typeof v === "number" ? fp(v) : fmt === "sign" ? sign(v) : fmt === "usd" ? "$" + Number(v).toFixed(2) : fmt === "usd4" ? "$" + Number(v).toFixed(4) : fmt === "int" ? String(v) : typeof v === "number" ? f2(v) : v;
    });
    document.querySelectorAll("[data-if]").forEach(function (n) {
      var v = n.dataset.if.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D);
      if (v == null) n.style.display = "none";
    });
    document.querySelectorAll("[data-unless]").forEach(function (n) {
      var v = n.dataset.unless.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D);
      if (v != null) n.style.display = "none";
    });
  }

  // ---------- animation: replay when a slide becomes active ----------
  function prime(slide) {
    slide.classList.remove("play");
    slide.querySelectorAll(".anim-line").forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 0; if (!len) return;
      p.style.transition = "none"; p.style.strokeDasharray = len + " " + len; p.style.strokeDashoffset = reduce ? 0 : len;
    });
    slide.querySelectorAll(".anim-dot").forEach(function (c) { c.style.transition = "none"; c.style.transform = reduce ? "none" : "translateX(" + c.dataset.dx + "px)"; });
  }
  function play(slide) {
    void slide.offsetWidth;
    slide.classList.add("play");
    slide.querySelectorAll(".anim-line").forEach(function (p) {
      p.style.transition = ""; p.style.strokeDashoffset = 0;
      p.addEventListener("transitionend", function f() { if (!p.classList.contains("s-baseline")) p.style.strokeDasharray = "none"; else p.style.strokeDasharray = ""; p.removeEventListener("transitionend", f); });
    });
    slide.querySelectorAll(".anim-dot").forEach(function (c, i) { c.style.transition = ""; c.style.transitionDelay = (i % 16) * 35 + "ms"; c.style.transform = "translateX(0)"; });
  }

  // ---------- build ----------
  function build() {
    document.querySelectorAll("[data-chart]").forEach(function (box) {
      var t = box.dataset.chart;
      if (t === "line1") lineChart(box, D.run1);
      else if (t === "line2") { if (D.run2) lineChart(box, D.run2); else box.innerHTML = '<div class="pending">Run 2 in progress.</div>'; }
      else if (t === "strip") stripChart(box, D.calib);
      else if (t === "strip-title") stripChart(box, (D.calib || []).filter(function (m) { return /70b|deepseek/.test(m.name); }), true);
      else if (t === "gain") gainChart(box, [{ run: D.run1, tag: "j70" }, { run: D.run2, tag: "jds" }]);
      else if (t === "cross") crossChart(box, D.cross);
      else if (t === "scatter") scatter(box, D.agree);
    });
    bind();
  }
  build();

  // ---------- navigation (same behavior as the first deck) ----------
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var count = document.getElementById("count"), prev = document.getElementById("prev"), next = document.getElementById("next"), progress = document.getElementById("progress");
  var current = 0;
  function fromHash() { var n = parseInt((location.hash || "").replace("#", ""), 10); return isNaN(n) ? 0 : Math.min(Math.max(n - 1, 0), slides.length - 1); }
  function show(i) {
    current = Math.min(Math.max(i, 0), slides.length - 1);
    slides.forEach(function (s, k) { var on = k === current; s.classList.toggle("active", on); s.setAttribute("aria-hidden", on ? "false" : "true"); });
    count.textContent = (current + 1) + " of " + slides.length;
    prev.disabled = current === 0; next.disabled = current === slides.length - 1;
    progress.style.width = ((current + 1) / slides.length * 100) + "%";
    if (history.replaceState) history.replaceState(null, "", "#" + (current + 1));
    prime(slides[current]); requestAnimationFrame(function () { play(slides[current]); });
  }
  var presenting = window.matchMedia("(min-width: 761px) and (min-aspect-ratio: 4/5)");
  function applyMode() {
    if (presenting.matches) show(current);
    else slides.forEach(function (s) { s.removeAttribute("aria-hidden"); prime(s); play(s); });
  }
  current = fromHash(); applyMode();
  if (presenting.addEventListener) presenting.addEventListener("change", applyMode);
  prev.addEventListener("click", function () { show(current - 1); });
  next.addEventListener("click", function () { show(current + 1); });
  document.addEventListener("keydown", function (e) {
    if (!presenting.matches || e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); show(current + 1); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); show(current - 1); }
    else if (k === "Home") { e.preventDefault(); show(0); }
    else if (k === "End") { e.preventDefault(); show(slides.length - 1); }
  });
  var sx = null;
  document.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) { if (sx === null || !presenting.matches) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1)); });
  window.addEventListener("hashchange", function () { if (presenting.matches) show(fromHash()); });
})();
