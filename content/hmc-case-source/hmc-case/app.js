/* HMC case: vanilla JS; no API, storage, tracking, or external libraries. */
(() => {
  "use strict";
  const data = window.HMC_CASE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const safe = (value) => String(value).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
  function animate(el) {
    if (!el || reducedMotion.matches) return;
    el.classList.remove("is-changing");
    void el.offsetWidth;
    el.classList.add("is-changing");
  }

  // Small handoff diagram. Only the reader changes; the shared context is constant.
  let agentIndex = 0;
  let heroTimer = null;
  function chooseAgent(index) {
    agentIndex = ((index % data.agents.length) + data.agents.length) % data.agents.length;
    $$(".agent-button").forEach((button, i) => button.setAttribute("aria-pressed", String(i === agentIndex)));
    const figure = $("#handoff-figure");
    figure.dataset.agent = String(agentIndex);
    $("#handoff-reader").innerHTML = `<span class="status-dot"></span>${safe(data.agents[agentIndex])} 接手 · 读取同一份现状`;
    clearTimeout(heroTimer);
    figure.classList.remove("is-passing");
    if (!reducedMotion.matches) {
      void figure.offsetWidth;
      figure.classList.add("is-passing");
      heroTimer = setTimeout(() => figure.classList.remove("is-passing"), 900);
    }
  }
  $$(".agent-button").forEach((button) => button.addEventListener("click", () => chooseAgent(Number(button.dataset.agent))));
  $("#handoff-next").addEventListener("click", () => chooseAgent(agentIndex + 1));

  // Explicit approval gate. Playback always stops before a human decision.
  const flow = { step: 0, decision: null, playing: false, timer: null };
  const quote = "“之后可以比较我自己的判断和模型策略，但先记着，不一定现在做。”";
  function candidateMarkup(status = "PENDING", extraClass = "") {
    return `<div class="candidate-demo ${extraClass}">
      <div class="candidate-top"><span class="micro">RECORD CANDIDATE / #C-042</span><span class="candidate-status">${status}</span></div>
      <h4>比较个人判断与模型策略</h4><p>先保存为活跃点子，不自动进入执行事项。</p>
      <div class="candidate-meta"><span>TYPE <code>idea</code></span><span>SOURCE · snowcookie / 自动记录器</span></div>
      <blockquote>${quote}</blockquote></div>`;
  }
  function visualForStep() {
    if (flow.decision === "ignore" && flow.step === 2) return candidateMarkup("IGNORED", "is-ignored");
    switch (flow.step) {
      case 0: return `<div class="conversation-demo"><span class="micro">一段对话 / 脱敏示例</span><blockquote>${quote}</blockquote><p><span>可能值得保留</span><span>还不是任务</span></p></div>`;
      case 1: return candidateMarkup("PROPOSED");
      case 2: return candidateMarkup("HUMAN CHECK");
      case 3: return `<div class="append-demo"><span class="micro">RECORDS / APPEND ONLY</span>
        <div class="append-row"><span>PAST</span><b>已有的历史记录</b><small>原样保留</small></div>
        <div class="append-row"><span>PAST</span><b>已有的后续更新</b><small>原样保留</small></div>
        <div class="append-row fresh"><span>+ NEW</span><b>比较个人判断与模型策略</b><small>idea · 已采用</small></div>
      </div>`;
      case 4: return `<div class="final-context"><div class="candidate-top"><span class="micro">CURRENT CONTEXT</span><span class="candidate-status">UPDATED</span></div>
        <h4>点子留下了，范围也留下了。</h4><div class="final-item"><span>INCUBATING</span><b>比较个人判断与模型策略</b><i aria-hidden="true">✓</i></div>
        <p>先记着，不自动升级为执行任务。</p><p>其他 Agent 读取的是这份状态，而不是重新猜一遍原话。</p></div>`;
      default: return "";
    }
  }
  function flowAction(action, label, quiet = false) {
    return `<button type="button" data-flow-action="${action}" class="${quiet ? "quiet-action" : "light-action"}">${label}${quiet ? "" : '<span aria-hidden="true">→</span>'}</button>`;
  }
  function updatePlayControl() {
    const button = $("#flow-play");
    button.setAttribute("aria-pressed", String(flow.playing));
    button.disabled = flow.step === 4 || (flow.step === 2);
    $("#flow-play-icon").textContent = flow.playing ? "Ⅱ" : (flow.step >= 2 && flow.step !== 3 ? "·" : "▶");
    $("#flow-play-label").textContent = flow.playing ? "暂停播放" :
      flow.step === 4 ? "演示完成" :
      flow.step === 3 ? "播放最后一步" :
      flow.step === 2 ? (flow.decision === "ignore" ? "已忽略候选" : "等待你确认") : "播放到确认环节";
  }
  function stopFlow() {
    clearTimeout(flow.timer);
    flow.timer = null;
    flow.playing = false;
    updatePlayControl();
  }
  function renderFlow(withMotion = true) {
    const info = data.flow[flow.step];
    const ignored = flow.decision === "ignore" && flow.step === 2;
    $("#flow-counter").textContent = `${String(flow.step + 1).padStart(2, "0")} / 05`;
    $("#flow-kicker").textContent = ignored ? "CANDIDATE IGNORED" : info.kicker;
    $("#flow-time").textContent = info.time;
    $("#flow-stage-title").textContent = ignored ? "这次先不采用，也完全可以。" : info.title;
    $("#flow-description").textContent = ignored ? "候选被忽略，没有进入 Records，也没有改变 Current Context。自动提议不等于系统已经把它当成事实。" : info.description;
    $("#flow-visual").innerHTML = visualForStep();

    const committed = flow.decision === "approve" && flow.step >= 3;
    const projected = flow.decision === "approve" && flow.step >= 4;
    $("#flow-record-state").textContent = committed ? "追加 1 条 idea 记录" : "没有新增记录";
    $("#flow-context-state").textContent = projected ? "活跃点子已更新" : "保持原样";
    $("#flow-mode").textContent = projected ? "现状已更新" : committed ? "已追加记录，等待投影" : ignored ? "已忽略，正式状态未变" : "尚未写入正式状态";
    $("#flow-status").textContent = ignored ? "候选被忽略，历史与现状都没有被改动。" :
      projected ? "保留为点子，不自动变成执行事项。" :
      committed ? "历史已追加；下一步才是生成现状。" :
      flow.step === 2 ? "播放停在这里：采用或忽略，由你决定。" :
      flow.step === 1 ? "进入候选箱，不等于进入正式状态。" :
      "正式状态不会因为一句对话就改变。";
    $$(".flow-steps button").forEach((button, index) => {
      if (index === flow.step) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
      button.disabled = index > 2 && flow.decision !== "approve";
    });
    const actions = $("#flow-actions");
    if (ignored) {
      actions.innerHTML = flowAction("reset", "重来一次，试试采用", true);
    } else if (flow.step === 0) {
      actions.innerHTML = flowAction("next", "看看它会被记成什么");
    } else if (flow.step === 1) {
      actions.innerHTML = flowAction("next", "检查这条候选");
    } else if (flow.step === 2) {
      actions.innerHTML = flowAction("approve", "采用为点子") + flowAction("ignore", "忽略这条", true) + '<span class="action-hint">只操作本页示例</span>';
    } else if (flow.step === 3) {
      actions.innerHTML = flowAction("next", "看更新后的现状");
    } else {
      actions.innerHTML = flowAction("reset", "重新体验交接", true) + '<span class="action-hint">下一次也可以选择忽略</span>';
    }
    updatePlayControl();
    if (withMotion) animate($("#flow-stage"));
  }
  function resetFlow() {
    stopFlow();
    flow.step = 0;
    flow.decision = null;
    renderFlow();
  }
  function setFlowStep(step) {
    if (step < 0 || step > 4 || (step > 2 && flow.decision !== "approve")) return;
    flow.step = step;
    renderFlow();
  }
  function scheduleFlow() {
    clearTimeout(flow.timer);
    if (!flow.playing) return;
    flow.timer = setTimeout(() => {
      if (!flow.playing) return;
      setFlowStep(flow.step + 1);
      if (flow.step === 2 || flow.step === 4) stopFlow();
      else scheduleFlow();
    }, reducedMotion.matches ? 600 : 1350);
  }
  $("#flow-play").addEventListener("click", () => {
    if (flow.playing) { stopFlow(); return; }
    if (flow.step === 2 || flow.step === 4) return;
    flow.playing = true;
    updatePlayControl();
    scheduleFlow();
  });
  $("#flow-reset").addEventListener("click", resetFlow);
  $("#flow-actions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-flow-action]");
    if (!button) return;
    stopFlow();
    const action = button.dataset.flowAction;
    if (action === "reset") resetFlow();
    else if (action === "next") setFlowStep(flow.step + 1);
    else if (action === "approve" && flow.step === 2 && flow.decision === null) {
      flow.decision = "approve";
      setFlowStep(3);
    } else if (action === "ignore" && flow.step === 2 && flow.decision === null) {
      flow.decision = "ignore";
      renderFlow();
    }
    // The clicked button is replaced. Preserve a useful keyboard focus target.
    const nextAction = $("#flow-actions button");
    if (nextAction) nextAction.focus({ preventScroll: true });
  });
  $$(".flow-steps button").forEach((button) => button.addEventListener("click", () => {
    const target = Number(button.dataset.step);
    stopFlow();
    if (target <= 2) flow.decision = null; // Rewind the demonstration, not real data.
    setFlowStep(target);
  }));
  renderFlow(false);

  // Shared, keyboard-accessible tabs.
  function connectTabs(selector, callback) {
    const tabs = $$(selector);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => callback(tab));
      tab.addEventListener("keydown", (event) => {
        let target = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = tabs.length - 1;
        if (target === null) return;
        event.preventDefault();
        callback(tabs[target]);
        tabs[target].focus();
      });
    });
  }
  function activateTab(selector, selected) {
    $$(selector).forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }
  function selectRoute(tab) {
    const route = data.routes[tab.dataset.route];
    if (!route) return;
    activateTab(".source-tabs [role=tab]", tab);
    $("#route-panel").setAttribute("aria-labelledby", tab.id);
    $("#route-channel").textContent = route.channel;
    $("#route-title").innerHTML = route.title;
    $("#route-path").innerHTML = `<span>${safe(route.path[0])}</span><i aria-hidden="true">→</i><span>${safe(route.path[1])}</span>`;
    $("#route-description").textContent = route.description;
    animate($("#route-panel"));
  }
  connectTabs(".source-tabs [role=tab]", selectRoute);

  // Reliability examples: deterministic front-end illustrations, not a backend validator.
  const rule = { name: "retry", retry: "ready", late: false, batch: 0, timer: null, running: false };
  function verdict(badge, icon, title, detail) {
    $("#rule-badge").textContent = badge;
    $("#verdict-icon").textContent = icon;
    $("#verdict-title").textContent = title;
    $("#verdict-detail").textContent = detail;
  }
  function renderRetry() {
    const conflict = rule.retry === "conflict";
    const duplicate = rule.retry === "duplicate";
    const status = conflict ? "conflict" : duplicate ? "duplicate" : "待重发";
    $("#rule-visual").innerHTML = `<div class="retry-row"><span class="file-token">01</span><div><b>已保存的记录</b><small>来源 web-chat · 编号 0142</small></div><span class="mini-tag">已写入</span></div>
      <div class="retry-row incoming ${conflict ? "conflict" : duplicate ? "done" : ""}"><span class="file-token">01</span><div><b>${conflict ? "编号相同，内容却变了" : "同一条更新"}</b><small>${conflict ? "同来源 · 同编号 · 不同内容" : "同来源 · 同编号 · 同内容"}</small></div><span class="mini-tag">${status}</span></div>
      <div class="record-count"><span>正式记录数</span><b>1 <small>条</small></b><span>${conflict ? "原记录不被覆盖" : "不会因重试多一条"}</span></div>`;
    $("#rule-action-label").textContent = duplicate ? "再重发相同内容" : "重发相同内容";
    if (conflict) verdict("CONFLICT", "×", "有冲突，不能自动覆盖。", "保留原记录；同编号、不同内容不按正常重试接纳。");
    else if (duplicate) verdict("DUPLICATE", "✓", "识别到重复，仍然只有 1 条。", "安全重试，不多写一次，也不多生成一次状态变化。");
    else verdict("等待重试", "↳", "先有一条已写入的记录。", "点击重发，看看系统该怎么处理。");
  }
  function renderLate() {
    $("#rule-visual").innerHTML = `<div class="late-event current"><span class="time-pill">10:20</span><b>检查预测同步 · 已完成</b><small>当前状态</small></div>
      <div class="late-event past ${rule.late ? "arrived" : ""}"><span class="time-pill">09:00</span><b>检查预测同步 · 进行中</b><small>${rule.late ? "已进入历史" : "还在路上"}</small></div>
      <div class="late-result"><span>${rule.late ? "历史新增了旧事件" : "演示：旧更新晚于新更新抵达"}</span><b>${rule.late ? "现状仍是「已完成」" : "当前：已完成"}</b></div>`;
    $("#rule-action-label").textContent = rule.late ? "重置迟到情境" : "让旧消息抵达";
    if (rule.late) verdict("HISTORY +1 / STATE UNCHANGED", "✓", "历史补上了，现状没倒退。", "保留迟到记录，不把新状态改回去，投影游标也不回退。");
    else verdict("旧消息还在路上", "↳", "现状已经比这条消息更新。", "时刻与状态是解释顺序的示例，不代表真实项目进度。");
  }
  function renderBatch() {
    const rows = [
      { name: "第一条 · 有效更新", state: rule.batch >= 1 ? "accepted" : "", label: rule.batch >= 1 ? "accepted" : "waiting" },
      { name: "第二条 · 坏文件", state: rule.batch >= 2 ? "rejected" : "", label: rule.batch >= 2 ? "rejected" : "waiting" },
      { name: "第三条 · 有效更新", state: rule.batch >= 3 ? "accepted" : "", label: rule.batch >= 3 ? "accepted" : "waiting" }
    ];
    $("#rule-visual").innerHTML = `<div class="batch-files">${rows.map((row, i) =>
      `<div class="batch-file ${row.state}"><span>0${i + 1}</span><b>${row.name}</b><small>${row.label}</small></div>`).join("")}</div>
      <p class="batch-progress">${rule.batch} / 3 PROCESSED${rule.batch >= 2 ? " · 失败项保留拒绝原因" : ""}</p>`;
    $("#rule-action-label").textContent = rule.running ? "正在处理…" : rule.batch === 3 ? "重新演示这一批" : rule.batch > 0 ? "继续处理后续文件" : "处理这一批文件";
    $("#rule-action").disabled = rule.running;
    if (rule.batch === 3) verdict("2 ACCEPTED / 1 REJECTED", "✓", "失败一条，后面的照常处理。", "第二条单独回滚并留在 rejected，不阻断第三条。");
    else if (rule.batch === 2) verdict("FILE 02 REJECTED", "×", "第二条失败，记录原因。", "字段未通过校验；只回滚这条，继续处理后续文件。");
    else if (rule.batch === 1) verdict("FILE 01 ACCEPTED", "✓", "第一条已接纳。", "接下来处理第二条，不预先把整批都算作成功。");
    else verdict("等待导入", "↳", "三条示例里，有一条坏文件。", "点击处理，观察失败后是否还会继续。");
  }
  function renderRuleVisual(withMotion = true) {
    if (rule.name === "retry") renderRetry();
    else if (rule.name === "late") renderLate();
    else renderBatch();
    if (withMotion) animate($("#rule-visual"));
  }
  function stopBatch() {
    clearTimeout(rule.timer);
    rule.timer = null;
    rule.running = false;
    if (rule.name === "batch") renderBatch();
  }
  function runBatch() {
    if (rule.running) return;
    if (rule.batch >= 3) rule.batch = 0;
    if (reducedMotion.matches) {
      rule.batch = 3;
      renderBatch();
      return;
    }
    rule.running = true;
    renderBatch();
    function advance() {
      if (!rule.running || rule.name !== "batch") return;
      rule.batch += 1;
      if (rule.batch >= 3) rule.running = false;
      renderRuleVisual();
      if (rule.running) rule.timer = setTimeout(advance, 900);
    }
    rule.timer = setTimeout(advance, 550);
  }
  function selectRule(tab) {
    stopBatch();
    const name = tab.dataset.rule;
    if (!data.rules[name]) return;
    rule.name = name;
    rule.retry = "ready";
    rule.late = false;
    rule.batch = 0;
    activateTab(".rule-tabs [role=tab]", tab);
    $("#rule-panel").setAttribute("aria-labelledby", tab.id);
    const item = data.rules[name];
    $("#rule-code").textContent = item.code;
    $("#rule-title").innerHTML = item.title;
    $("#rule-description").textContent = item.description;
    $("#rule-action-label").textContent = item.action;
    $("#rule-action").disabled = false;
    $("#rule-alternate").hidden = !item.alternate;
    if (item.alternate) $("#rule-alternate").textContent = item.alternate;
    renderRuleVisual();
  }
  connectTabs(".rule-tabs [role=tab]", selectRule);
  $("#rule-action").addEventListener("click", () => {
    if (rule.name === "retry") { rule.retry = "duplicate"; renderRuleVisual(); }
    else if (rule.name === "late") { rule.late = !rule.late; renderRuleVisual(); }
    else runBatch();
  });
  $("#rule-alternate").addEventListener("click", () => {
    if (rule.name !== "retry") return;
    rule.retry = "conflict";
    renderRuleVisual();
  });

  // Pause demonstrations offscreen or in a hidden tab. Nothing runs by itself on load.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopFlow(); stopBatch(); }
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;
        if (entry.target.id === "flow-board") stopFlow();
        if (entry.target.id === "rule-panel") stopBatch();
      });
    }, { threshold: 0 });
    observer.observe($("#flow-board"));
    observer.observe($("#rule-panel"));
  }

  // Native scrolling; a thin reading indicator and section navigation.
  const navLinks = $$(".top-nav a");
  const navTargets = navLinks.map((link) => $(link.getAttribute("href")));
  let scrollFrame = false;
  function updateReading() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    $("#reading-progress").style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0})`;
    let activeIndex = -1;
    navTargets.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 170) activeIndex = index;
    });
    navLinks.forEach((link, index) => {
      link.classList.toggle("active", index === activeIndex);
      if (index === activeIndex) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
    });
    scrollFrame = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateReading); }
  }, { passive: true });
  function updateOrientations() {
    const mobile = window.matchMedia("(max-width:700px)").matches;
    $(".source-tabs").setAttribute("aria-orientation", mobile ? "horizontal" : "vertical");
    $(".rule-tabs").setAttribute("aria-orientation", mobile ? "vertical" : "horizontal");
  }
  window.addEventListener("resize", () => { updateOrientations(); updateReading(); });
  updateOrientations();
  updateReading();
})();
