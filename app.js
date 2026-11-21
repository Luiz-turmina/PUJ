/* app.js — monta o documento a partir de data.js e liga o movimento. */
(function () {
  "use strict";
  var D = window.PUJ_DATA;
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAS_GSAP = !!window.gsap && !!window.ScrollTrigger && !REDUCE;
  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  var nf = new Intl.NumberFormat("pt-BR");
  function pct(n, d) {
    var dd = d == null ? 1 : d;
    return (n * 100).toLocaleString("pt-BR", { minimumFractionDigits: dd, maximumFractionDigits: dd }) + "%";
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- totais a partir da planilha ---------- */
  var rows = D.planilha.filter(function (r) { return r.incluir; });
  function sum(k) { return rows.reduce(function (a, r) { return a + (r[k] || 0); }, 0); }
  var M = {
    leads: sum("leads"), atividades: sum("atividades"), realizadas: sum("realizadas"),
    finalizados: sum("finalizados"), perdidos: sum("perdidos"), ganhos: sum("ganhos"),
    ligacoes: sum("ligacoes"), ligSig: sum("ligSig"), emails: sum("emails"),
    social: sum("social"), pesquisas: sum("pesquisas"), contratos: D.contratos
  };
  M.ganhos = D.reunioes.length;
  var sigBase = rows.reduce(function (a, r) { return a + (r.ligSigPct ? r.ligSig / (r.ligSigPct / 100) : 0); }, 0);
  var ligSigPct = sigBase ? M.ligSig / sigBase : 0;

  function ratio(a, b) { return M[b] ? M[a] / M[b] : 0; }

  /* funil: leads → finalizados → ganhos → contratos */
  var F = [
    { etapa: "Leads em cadência", valor: M.leads },
    { etapa: "Leads finalizados", valor: M.finalizados },
    { etapa: D.rotuloGanho, valor: M.ganhos },
    { etapa: "Contratos fechados", valor: M.contratos }
  ];

  /* ---------- cabeçalho ---------- */
  document.title = D.cliente + " × BLU — " + D.titulo.replace(/:$/, "") + " " + D.tituloDestaque.replace(/\.$/, "");
  $("#hero-periodo").textContent = D.periodo;
  $("#hero-title").innerHTML =
    '<span class="line"><span>' + esc(D.titulo) + "</span></span>" +
    '<span class="line"><span><em>' + esc(D.tituloDestaque) + "</em></span></span>";
  $("#hero-lede").textContent = D.lede;
  $("#foot-left").textContent = D.razaoSocial + " × BLU";
  if (D.demo) $("#demo-badge").hidden = false;

  /* ---------- KPIs ---------- */
  var RESUMO = D.resumo.map(function (r) {
    if (r.tipo === "taxa") {
      return { rot: r.rotulo, count: +(ratio(r.para, r.de) * 100).toFixed(1), dec: 1, suf: "%", nota: r.nota };
    }
    return { rot: r.rotulo || (r.chave === "ganhos" ? D.rotuloGanho : r.chave), count: M[r.chave], dec: 0, suf: "", nota: r.nota };
  });
  function numHTML(it) {
    return '<span data-count="' + it.count + '" data-dec="' + it.dec + '">0</span>' + (it.suf ? "<small>" + it.suf + "</small>" : "");
  }
  $("#hero-kpis").innerHTML = D.aberturaResumo.map(function (i) {
    var it = RESUMO[i];
    return '<div class="hero-kpi"><div class="num">' + numHTML(it) + '</div><div class="cap">' + esc(it.rot) + "</div></div>";
  }).join("");
  $("#kpi-grid").innerHTML = RESUMO.map(function (it) {
    return '<div class="kpi"><div class="mono rot">' + esc(it.rot) + '</div><div class="num">' + numHTML(it) + '</div><p class="nota">' + esc(it.nota || "") + "</p></div>";
  }).join("");

  /* ---------- funil ---------- */
  var max = F[0].valor || 1;
  $("#funnel").innerHTML = F.map(function (s, i) {
    var w = Math.max((s.valor / max) * 100, 1.5);
    var chip = i > 0 ? '<span class="f-chip">↓ ' + pct(F[i - 1].valor ? s.valor / F[i - 1].valor : 0) + "</span>" : "";
    return '<li class="f-row">' + chip + '<div class="f-name">' + esc(s.etapa) + '</div><div class="f-track"><div class="f-bar" style="width:' + w + '%"></div></div>' +
      '<div class="f-val"><span data-count="' + s.valor + '" data-dec="0">0</span></div></li>';
  }).join("");
  $("#funnel-note").textContent = D.funilNota || "";

  /* ---------- esforço por canal ---------- */
  var totCanais = D.canais.reduce(function (a, c) { return a + M[c.chave]; }, 0) || 1;
  var maxCanal = Math.max.apply(null, D.canais.map(function (c) { return M[c.chave]; }));
  $("#esforco-lede").textContent =
    nf.format(M.realizadas) + " atividades foram registradas no CRM. Estas são as quatro frentes de contato; as barras mostram o volume de cada uma.";
  $("#canais").innerHTML = D.canais.map(function (c) {
    var v = M[c.chave];
    return '<div class="b-row"><div class="b-name">' + esc(c.rotulo) + '</div><div class="b-track"><div class="b-fill" style="width:' + (v / maxCanal) * 100 + '%"></div></div>' +
      '<div class="b-val"><b>' + nf.format(v) + "</b>" + pct(v / totCanais, 0) + "</div></div>";
  }).join("");
  $("#ligsig").innerHTML =
    '<div class="cn-num"><span data-count="' + M.ligSig + '" data-dec="0">0</span></div>' +
    '<p><strong>ligações significativas</strong>, ' + pct(ligSigPct, 1) + " das ligações foram classificadas pelo CRM como conversa efetiva.</p>";

  /* ---------- teses, janela ---------- */
  $("#teses-list").innerHTML = D.teses.map(function (t) {
    return '<article class="tese"><div class="tese-sig" aria-hidden="true">' + esc(t.sigla) + "</div><h3>" + esc(t.titulo) + "</h3><p>" + esc(t.texto) + "</p><ul>" +
      t.pontos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></article>";
  }).join("");
  $("#janela").innerHTML = '<span class="mono">' + esc(D.janela.rotulo) + "</span><p>" + esc(D.janela.texto) + "</p>";

  /* ---------- jornada ---------- */
  $("#tl").innerHTML =
    '<span class="tl-rail" aria-hidden="true"><span class="tl-fill"></span></span>' +
    D.jornada.map(function (e) {
      return '<li class="tl-item' + (e.destaque ? " is-key" : "") + '"><div class="tl-date mono">' + esc(e.data) + '</div><span class="tl-dot" aria-hidden="true"></span>' +
        '<div class="tl-body"><h3>' + esc(e.titulo) + "</h3><p>" + esc(e.texto) + "</p></div></li>";
    }).join("");


  /* ---------- ritmo mensal ---------- */
  var MS = D.mensal;
  function monthIdx(iso) { var m = +iso.slice(5, 7); return { 8: 0, 9: 1, 10: 2, 11: 3 }[m]; }
  var ganhosMes = MS.meses.map(function () { return 0; });
  D.reunioes.forEach(function (r) { var i = monthIdx(r.termino); if (i != null) ganhosMes[i]++; });
  var maxAtiv = Math.max.apply(null, MS.atividades);
  var pico = ganhosMes.indexOf(Math.max.apply(null, ganhosMes));
  $("#ritmo-lede").textContent =
    "Atividades registradas no CRM e reuniões agendadas, mês a mês. " + MS.meses[pico] + " foi o mês de pico, com " + ganhosMes[pico] + " das " + D.reunioes.length + " reuniões.";
  $("#months").innerHTML = MS.meses.map(function (m, i) {
    var parcial = i === MS.parcial;
    return '<div class="mcol' + (parcial ? " is-partial" : "") + '"><div class="mval"><span data-count="' + MS.atividades[i] + '" data-dec="0">0</span></div>' +
      '<div class="mplot"><div class="mbar" style="height:' + (MS.atividades[i] / maxAtiv) * 100 + '%"></div></div>' +
      '<div class="mname mono">' + esc(m) + (parcial ? "<br><em>" + esc(MS.parcialNota) + "</em>" : "") + "</div>" +
      '<div class="mgan"><b>' + ganhosMes[i] + "</b> " + (ganhosMes[i] === 1 ? "reunião" : "reuniões") + "</div></div>";
  }).join("");
  $("#months-note").textContent = "Barras: atividades registradas por David e Luiz no CRM. Abaixo de cada mês: reuniões agendadas (pela data de término da cadência).";

  /* ---------- perfil (abas) ---------- */
  function contar(fn) { var o = {}; D.reunioes.forEach(function (r) { var k = fn(r); o[k] = (o[k] || 0) + 1; }); return Object.keys(o).map(function (k) { return { rotulo: k, valor: o[k] }; }).sort(function (a, b) { return b.valor - a.valor; }); }
  var PERFIL = {
    "Tese": contar(function (r) { return r.tese; }),
    "Estado": contar(function (r) { return r.uf || "Não informado"; })
  };
  var dims = Object.keys(PERFIL), curDim = dims[0];
  function renderBars(animate) {
    var list = PERFIL[curDim], total = D.reunioes.length, m = Math.max.apply(null, list.map(function (x) { return x.valor; }));
    $("#perfil-bars").innerHTML = list.map(function (it) {
      return '<div class="b-row"><div class="b-name">' + esc(it.rotulo) + '</div><div class="b-track"><div class="b-fill" style="width:' + (it.valor / m) * 100 + '%"></div></div>' +
        '<div class="b-val"><b>' + nf.format(it.valor) + "</b>" + pct(it.valor / total, 0) + "</div></div>";
    }).join("");
    if (animate && HAS_GSAP) {
      gsap.from("#perfil-bars .b-fill", { scaleX: 0, duration: 1, ease: "power3.out", stagger: 0.07 });
      gsap.from("#perfil-bars .b-row", { opacity: 0, y: 10, duration: 0.5, stagger: 0.05 });
    }
  }
  $("#perfil-tabs").innerHTML = dims.map(function (d, i) { return '<button class="tab' + (i ? "" : " on") + '" role="tab" type="button" data-d="' + esc(d) + '">' + esc(d) + "</button>"; }).join("");
  $("#perfil-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab"); if (!b) return;
    curDim = b.getAttribute("data-d");
    $$(".tab").forEach(function (t) { t.classList.toggle("on", t === b); });
    renderBars(true);
  });
  renderBars(false);

  /* ---------- reuniões (tabela + filtro por tese) ---------- */
  function br(iso) { return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4); }
  var LISTA = D.reunioes.slice().sort(function (a, b) { return a.termino < b.termino ? -1 : a.termino > b.termino ? 1 : a.empresa.localeCompare(b.empresa, "pt-BR"); });
  var TESES = ["Todas"].concat(["IPI", "PAT", "IPI e PAT"].filter(function (t) { return LISTA.some(function (r) { return r.tese === t; }); }));
  var curTese = "Todas";
  function renderTable(animate) {
    var rows = LISTA.filter(function (r) { return curTese === "Todas" || r.tese === curTese; });
    $("#reun-table tbody").innerHTML = rows.map(function (r) {
      var sit = r.contrato ? "Contrato" : "Agendada";
      return "<tr><td>" + esc(r.empresa) + '</td><td><span class="tese-tag">' + esc(r.tese) + "</span></td><td>" + esc(r.uf || "—") + "</td><td>" + br(r.termino) + '</td><td><span class="pill ' + sit + '">' + (r.contrato ? "Contrato" : "Reunião agendada") + "</span></td></tr>";
    }).join("");
    if (animate && HAS_GSAP) gsap.from("#reun-table tbody tr", { opacity: 0, y: 12, duration: 0.45, stagger: 0.03, ease: "power2.out" });
  }
  function cntTese(t) { return t === "Todas" ? LISTA.length : LISTA.filter(function (r) { return r.tese === t; }).length; }
  $("#reun-lede").textContent = LISTA.length + " empresas com reunião agendada, na ordem em que a cadência terminou. Nomes de contatos e telefones ficam fora deste documento.";
  $("#reun-chips").innerHTML = TESES.map(function (t, i) { return '<button class="chip' + (i ? "" : " on") + '" type="button" data-t="' + esc(t) + '">' + esc(t) + " (" + cntTese(t) + ")</button>"; }).join("");
  $("#reun-chips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    curTese = b.getAttribute("data-t");
    $$(".chip").forEach(function (c) { c.classList.toggle("on", c === b); });
    renderTable(true);
  });
  renderTable(false);

  /* ---------- aprendizados, próximos passos, fontes ---------- */
  $("#aprendizados-cards").innerHTML = D.aprendizados.map(function (a) { return '<article class="card"><span class="tag"></span><h3>' + esc(a.titulo) + "</h3><p>" + esc(a.texto) + "</p></article>"; }).join("");
  $("#proximos-list").innerHTML = D.proximosPassos.map(function (a) { return '<li class="step"><h3>' + esc(a.titulo) + "</h3><p>" + esc(a.texto) + "</p></li>"; }).join("");
  $("#fontes").innerHTML = D.fontes.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");

  /* ---------- método (acordeão) ---------- */
  $$("#layers .layer").forEach(function (b) {
    function open() { $$("#layers .layer").forEach(function (o) { o.classList.toggle("is-open", o === b); o.setAttribute("aria-expanded", o === b); }); }
    b.addEventListener("click", open);
    b.addEventListener("mouseenter", open);
  });

  /* ---------- rail + progresso ---------- */
  var secs = $$("[data-label]");
  var rail = $("#rail");
  rail.innerHTML = secs.map(function (s) { return '<button type="button" data-t="' + s.id + '"><span class="name">' + esc(s.getAttribute("data-label")) + '</span><span class="tick"></span></button>'; }).join("");
  rail.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    document.getElementById(b.getAttribute("data-t")).scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });
  });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$("button", rail).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-t") === e.target.id); });
      rail.classList.toggle("on-paper", e.target.classList.contains("paper"));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(function (s) { spy.observe(s); });

  var bar = $("#progress"), ticking = false;
  function prog() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")"; ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true });
  prog();

  /* ---------- contadores ---------- */
  function countTo(node) {
    var to = +node.getAttribute("data-count"), dec = +node.getAttribute("data-dec") || 0;
    function fmt(v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    if (REDUCE) { node.textContent = fmt(to); return; }
    var t0 = null, dur = 1500;
    function f(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      node.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(f); else node.textContent = fmt(to);
    }
    requestAnimationFrame(f);
  }
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { countTo(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (n) { cio.observe(n); });

  /* ---------- movimento (GSAP) ---------- */
  function splitWords(root) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p; w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(root);
  }

  if (HAS_GSAP) {
    /* abertura: escudo se desenha, título sobe em máscara, depois o resto */
    var outline = $(".sh-outline"), chevs = $$(".sh-chev");
    [outline].concat(chevs).forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(outline, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0)
      .to(chevs, { strokeDashoffset: 0, duration: 1.4, stagger: 0.18, ease: "power2.inOut" }, 0.5)
      .from("#hero-logos > *", { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.1)
      .from("#hero-periodo", { y: 14, opacity: 0, duration: 0.7 }, 0.45)
      .from("#hero-title .line > span", { yPercent: 115, duration: 1.1, stagger: 0.12, ease: "power4.out" }, 0.55)
      .from("#hero-lede", { y: 20, opacity: 0, duration: 0.9 }, 1.1)
      .from(".hero-kpi", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.25)
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, 1.8);

    gsap.to("#hero-shield", { yPercent: -62, scale: 1.12, opacity: 0, ease: "none", scrollTrigger: { trigger: "#abertura", start: "top top", end: "bottom top", scrub: true } });

    /* títulos de seção: palavra a palavra em máscara */
    $$(".split").forEach(function (h) {
      splitWords(h);
      gsap.from($$(".w > span", h), { yPercent: 112, duration: 1, ease: "power4.out", stagger: 0.045, scrollTrigger: { trigger: h, start: "top 85%", once: true } });
    });

    /* blocos que entram */
    gsap.utils.toArray(".lede:not(.hero .lede), .layers, .kpi, .tese, .janela, .callout-num, .card, .step, .sources, .paper-note, .tabs, .chips, .table-wrap").forEach(function (n) {
      gsap.from(n, { y: 34, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 90%", once: true } });
    });

    $$(".sec-side .label").forEach(function (l) {
      gsap.from(l, { clipPath: "inset(0 100% 0 0)", duration: 1, ease: "power3.out", scrollTrigger: { trigger: l, start: "top 90%", once: true } });
    });

    /* siglas IPI / PAT: contorno que "acende" ao entrar */
    $$(".tese-sig").forEach(function (s) {
      gsap.from(s, { opacity: 0, xPercent: -6, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: s, start: "top 90%", once: true } });
    });

    /* jornada: linha que se preenche com a rolagem + eventos que entram */
    gsap.to(".tl-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#tl", start: "top 65%", end: "bottom 65%", scrub: 0.4 } });
    $$(".tl-item").forEach(function (it) {
      gsap.from(it.querySelectorAll(".tl-date, .tl-body"), { y: 28, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: it, start: "top 85%", once: true } });
      ScrollTrigger.create({ trigger: it, start: "top 65%", onToggle: function (self) { it.classList.toggle("is-past", self.isActive || self.progress === 1); } });
    });

    /* funil: barras crescem em cascata */
    ScrollTrigger.create({
      trigger: "#funnel", start: "top 75%", once: true,
      onEnter: function () {
        gsap.from("#funnel .f-bar", { scaleX: 0, duration: 1.3, ease: "power4.out", stagger: 0.16 });
        gsap.from("#funnel .f-name, #funnel .f-val", { opacity: 0, y: 10, duration: 0.7, stagger: 0.05, delay: 0.15 });
        gsap.from("#funnel .f-chip", { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.16, delay: 0.6, ease: "back.out(2)" });
      }
    });

    /* barras de canais */
    ScrollTrigger.create({ trigger: "#canais", start: "top 80%", once: true, onEnter: function () {
      gsap.from("#canais .b-fill", { scaleX: 0, duration: 1.2, ease: "power3.out", stagger: 0.1 });
      gsap.from("#canais .b-row", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 });
    } });


    /* ritmo: colunas crescem de baixo para cima */
    ScrollTrigger.create({ trigger: "#months", start: "top 80%", once: true, onEnter: function () {
      gsap.from("#months .mbar", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.4, ease: "power4.out", stagger: 0.14 });
      gsap.from("#months .mname, #months .mgan", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08, delay: 0.5 });
    } });

    /* perfil e tabela na primeira entrada */
    ScrollTrigger.create({ trigger: "#perfil-bars", start: "top 80%", once: true, onEnter: function () {
      gsap.from("#perfil-bars .b-fill", { scaleX: 0, duration: 1.2, ease: "power3.out", stagger: 0.08 });
    } });
    ScrollTrigger.create({ trigger: "#reun-table", start: "top 85%", once: true, onEnter: function () {
      gsap.from("#reun-table tbody tr", { opacity: 0, x: -16, duration: 0.6, stagger: 0.035, ease: "power2.out" });
    } });

    /* luz que segue o cursor na abertura */
    var spot = $("#hero-spot");
    $("#abertura").addEventListener("pointermove", function (e) {
      var r = e.currentTarget.getBoundingClientRect();
      spot.style.setProperty("--mx", e.clientX - r.left + "px");
      spot.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }
})();
