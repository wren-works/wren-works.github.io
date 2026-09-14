/* No framework, network requests, storage, telemetry, or trading execution.
   Each demo is a local, explicitly labelled explanation of the case narrative. */
(() => {
  "use strict";
  const data = window.PAPER_CASE;
  if (!data || !Array.isArray(data.flow) || !data.rules) {
    console.warn("Paper Lab: interactive content is unavailable; the article remains readable.");
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.add("has-js");

  // Keep the article readable without JavaScript; only the explanations update here.
  const visualTemplates = {
    sources: `<div class="data-sources"><span>多个行情源</span><div class="visual-arrow" aria-hidden="true">↓</div><div class="source-stack"><span>日线数据</span><span>日线数据</span><span>日线数据</span></div><div class="visual-arrow" aria-hidden="true">↓</div><strong class="visual-result">粗筛后的候选集合</strong></div>`,
    candidates: `<div class="candidate-visual"><div class="candidate-matrix" aria-label="最多十二个候选位置">${Array.from({ length:12 },(_,i)=>`<span>#${String(i+1).padStart(2,"0")}</span>`).join("")}</div><div class="candidate-total"><strong>≤12</strong><small>候选数量上限</small></div></div>`,
    prediction: `<div class="prediction-paper"><header><b>prediction.v1</b><span>内容示意 · 非完整 Schema</span></header><div class="prediction-items"><span>入场条件</span><span>失效点</span><span>目标位</span><span>失效原因</span></div></div>`,
    validation: `<div class="validation-visual"><div class="validation-row">必需字段完整<span aria-label="通过">✓</span></div><div class="validation-row">价格关系成立<span aria-label="通过">✓</span></div><div class="validation-branches"><span class="accept-stamp">✓ accepted</span><span class="reject-note">不满足 → 拒绝，不进入撮合</span></div></div>`,
    broker: `<div class="broker-visual"><div class="minute-strip"><div><span>t</span><small>只读行情</small></div><div><span>t + 1m</span><small>再次轮询</small></div><div><span>t + 2m</span><small>再次轮询</small></div></div><div class="broker-result">行情 → 规则判断 → <strong>是否模拟成交</strong></div><p>时间间隔示意，不是实际运行日志。</p></div>`,
    rules: `<div class="rules-visual"><div><strong>T+1</strong><span>持仓锁定</span></div><div><strong>¥5</strong><span>每笔买卖佣金</span></div><div><strong>0.05%</strong><span>卖出印花税</span></div></div>`,
    files: `<div class="files-visual"><div class="file-card"><h4>state.json</h4><small>当前持仓状态</small><div class="file-lines" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="file-card"><h4>events.jsonl</h4><small>追加式事件流水</small><div class="file-lines append-lines" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div></div>`,
    comparison: `<div class="comparison-visual"><header>R<small>统一比较口径</small></header><div class="comparison-lanes"><div>实际持仓<i aria-hidden="true"></i></div><div>个人纸面<i aria-hidden="true"></i></div><div>模型策略<i aria-hidden="true"></i></div><div>基准<i aria-hidden="true"></i></div></div><p>同一把尺子，不代表相同结果；此处不展示收益数据。</p></div>`
  };

  let currentStep = 0;
  let playTimer = null;
  let hasPlayed = false;
  const stepButtons = $$("[data-step]");
  const playButton = $("#flow-play");
  const flowVisual = $("#flow-visual");

  const setText = (selector, text) => {
    const element = $(selector);
    if (element) element.textContent = String(text);
  };

  function updatePlayControl() {
    const isPlaying = playTimer !== null;
    playButton.setAttribute("aria-pressed", String(isPlaying));
    setText("#flow-play-icon", isPlaying ? "Ⅱ" : "▶");
    setText("#flow-play-label", isPlaying ? "暂停播放" : currentStep === data.flow.length - 1 ? "重新播放" : hasPlayed ? "继续播放" : "自动播放");
  }

  function pauseFlow() {
    if (playTimer !== null) window.clearInterval(playTimer);
    playTimer = null;
    updatePlayControl();
  }

  function selectStep(index, animate = true) {
    if (!Number.isInteger(index) || index < 0 || index >= data.flow.length) return;
    currentStep = index;
    const step = data.flow[index];
    const count = String(index + 1).padStart(2, "0");
    setText("#flow-count", `${count} / ${String(data.flow.length).padStart(2,"0")}`);
    setText("#flow-phase", step.phase);
    setText("#detail-kicker", step.kicker);
    setText("#detail-index", count);
    setText("#detail-title", step.title);
    setText("#detail-description", step.description);
    setText("#detail-foot-label", step.footLabel);
    setText("#detail-foot", step.foot);
    // The markup is a closed set of local templates, never an API or user input.
    flowVisual.innerHTML = visualTemplates[step.visual] || "";
    stepButtons.forEach((button, i) => {
      if (i === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.classList.toggle("completed", i < index);
    });
    $("#flow-prev").disabled = index === 0;
    $("#flow-next").disabled = index === data.flow.length - 1;
    flowVisual.classList.remove("changing");
    if (animate && !reducedMotion.matches) {
      void flowVisual.offsetWidth;
      flowVisual.classList.add("changing");
    }
    updatePlayControl();
  }

  stepButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      pauseFlow();
      selectStep(index);
    });
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % stepButtons.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + stepButtons.length) % stepButtons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = stepButtons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      pauseFlow();
      selectStep(next);
      stepButtons[next].focus({ preventScroll:true });
    });
  });
  $("#flow-prev").addEventListener("click", () => { pauseFlow(); selectStep(currentStep - 1); });
  $("#flow-next").addEventListener("click", () => { pauseFlow(); selectStep(currentStep + 1); });
  playButton.addEventListener("click", () => {
    if (playTimer !== null) { pauseFlow(); return; }
    if (currentStep === data.flow.length - 1) selectStep(0);
    hasPlayed = true;
    playTimer = window.setInterval(() => {
      if (currentStep >= data.flow.length - 1) { pauseFlow(); return; }
      selectStep(currentStep + 1);
      if (currentStep === data.flow.length - 1) pauseFlow();
    }, 4200);
    updatePlayControl();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pauseFlow(); });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) pauseFlow();
    }, { threshold:0 });
    observer.observe($("#flow"));
  }

  // Rule scenarios. Prices are illustrative constants, never market data.
  const ruleTemplates = {
    lock: `<div class="lock-visual"><div class="lock-timeline"><div class="day-node selected" data-day="0"><span>D</span><small>买入当日</small></div><div class="day-link" aria-hidden="true"></div><div class="day-node" data-day="1"><span>D+1</span><small>下一交易日</small></div></div><div class="lock-ticket"><div class="lock-symbol" aria-hidden="true"></div><div><b id="ticket-title">持仓锁定</b><small id="ticket-detail">即使触及失效点，当日也不能卖</small></div></div></div>`,
    gap: `<div class="gap-visual"><div class="gap-labels"><span>计划入场 entry<strong>¥10.00</strong></span><span>示意开盘价<strong id="open-price">¥9.90</strong></span></div><div class="price-rail" aria-hidden="true"><span class="entry-marker"></span><span class="open-marker"></span></div><div class="gap-formula">max(10.00, <span id="open-formula">9.90</span>)<br>= <strong id="fill-price">10.00</strong></div><p class="gap-explain">已满足突破买入条件 · 仅演示取价</p></div>`,
    conflict: `<div class="conflict-visual"><div class="candle-chart" role="img" aria-label="示意一分钟K线：最高价超过10.60止盈线，最低价低于9.80止损线，无法确定先后。"><div class="price-line target"><span>止盈 10.60</span></div><div class="price-line stop"><span>止损 9.80</span></div><div class="candle-wick"></div><div class="candle-body"></div><div class="touch-dot top"></div><div class="touch-dot bottom"></div></div><p>同一根 1 分钟 K 线 · 先后次序未知</p></div>`
  };
  let ruleKey = "lock";
  let ruleState = 0;
  const ruleTabs = $$("[data-rule][role='tab']");
  const stage = $("#rule-stage");

  function applyRuleState() {
    const state = data.rules[ruleKey].states[ruleState];
    stage.dataset.state = String(ruleState);
    setText("#scenario-badge", state.badge);
    setText("#rule-action-label", state.action);
    setText("#verdict-title", state.verdict);
    setText("#verdict-detail", state.detail);
    setText("#verdict-icon", state.icon);
    if (ruleKey === "lock") {
      $$("[data-day]").forEach((node) => node.classList.toggle("selected", Number(node.dataset.day) === ruleState));
      setText("#ticket-title", ruleState ? "锁仓解除" : "持仓锁定");
      setText("#ticket-detail", ruleState ? "仍需符合后续行情与退出条件" : "即使触及失效点，当日也不能卖");
    }
    if (ruleKey === "gap") {
      setText("#open-price", ruleState ? "¥10.40" : "¥9.90");
      setText("#open-formula", ruleState ? "10.40" : "9.90");
      setText("#fill-price", ruleState ? "10.40" : "10.00");
    }
  }

  function selectRule(key) {
    if (!Object.prototype.hasOwnProperty.call(data.rules, key)) return;
    ruleKey = key;
    ruleState = 0;
    const rule = data.rules[key];
    setText("#rule-code", rule.code);
    setText("#rule-title", rule.title);
    setText("#rule-description", rule.description);
    setText("#rule-disclaimer", rule.disclaimer);
    stage.dataset.rule = key;
    stage.dataset.state = "0";
    $("#rule-drawing").innerHTML = ruleTemplates[key] || "";
    $("#rule-panel").setAttribute("aria-labelledby", `tab-${key}`);
    ruleTabs.forEach((tab) => {
      const selected = tab.dataset.rule === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    applyRuleState();
  }
  ruleTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectRule(tab.dataset.rule));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % ruleTabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + ruleTabs.length) % ruleTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = ruleTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectRule(ruleTabs[next].dataset.rule);
      ruleTabs[next].focus({ preventScroll:true });
    });
  });
  $("#rule-action").addEventListener("click", () => {
    ruleState = 1 - ruleState;
    applyRuleState();
  });

  // Optional, user-triggered handoff animation. No endless motion loops.
  const handoff = $(".handoff-figure");
  $("#replay-handoff").addEventListener("click", () => {
    if (reducedMotion.matches) {
      // Focus provides a non-motion alternative to the same visual relationship.
      $("#replay-handoff").setAttribute("aria-label","模型交付交易假设，本地系统校验、撮合、记账");
      return;
    }
    handoff.classList.remove("playing");
    void handoff.offsetWidth;
    handoff.classList.add("playing");
  });
  handoff.addEventListener("animationend", (event) => {
    if (event.animationName === "system-highlight") handoff.classList.remove("playing");
  });

  // Native scrolling; never intercept wheel or touch events.
  const navLinks = $$(".top-nav a");
  const navTargets = navLinks.map((link) => $(link.getAttribute("href")));
  let frameRequested = false;
  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    $("#reading-progress").style.transform = `scaleX(${progress})`;
    let active = -1;
    navTargets.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= 180) active = i;
    });
    navLinks.forEach((link, i) => {
      link.classList.toggle("active", i === active);
      if (i === active) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    frameRequested = false;
  }
  function requestScrollUpdate() {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(updateScrollUI);
    }
  }
  window.addEventListener("scroll", requestScrollUpdate, { passive:true });
  window.addEventListener("resize", requestScrollUpdate, { passive:true });
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", () => handoff.classList.remove("playing"));
  }
  selectStep(0, false);
  selectRule("lock");
  updateScrollUI();
})();
