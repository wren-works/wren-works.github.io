/* Standalone mechanism demonstrations. No API calls, storage, analytics or real task writes. */
(() => {
  "use strict";
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
  const data = window.CASE_DATA;
  if (!data) return;
  document.documentElement.classList.add("js");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function renderHero(index) {
    const d = data.hero[index];
    $$(".hero-stop").forEach((b, i) => b.setAttribute("aria-pressed", String(i === index)));
    $$("[data-scene]").forEach(el => { el.hidden = Number(el.dataset.scene) !== index; });
    $("#hero-tag").textContent = d.tag;
    $("#hero-entry-title").textContent = d.title;
    $("#hero-desc").textContent = d.desc;
    $("#hero-foot").textContent = d.foot;
  }
  $$(".hero-stop").forEach(b => b.addEventListener("click", () => renderHero(Number(b.dataset.hero))));
  $("#hero-reset").addEventListener("click", () => renderHero(0));
  renderHero(0);

  /* One timer at most. Automatic progression never crosses a human confirmation gate. */
  const task = {step: 0, blocked: false, playing: false, timer: null};
  const gates = new Set([0, 2, 4]);
  function taskControls() {
    const gated = gates.has(task.step) || task.blocked;
    $("#task-play").disabled = gated;
    $("#task-play").textContent = task.playing ? "暂停" :
      task.step === 0 ? "等待排期" : task.step === 2 ? "等待确认" : task.step === 4 ? "已到结尾" : "播放后续";
    $("#task-play").setAttribute("aria-pressed", String(task.playing));
    $("#task-back").disabled = task.step === 0;
  }
  function stopTask() {
    clearTimeout(task.timer);
    task.timer = null;
    task.playing = false;
    taskControls();
  }
  function renderTask(step) {
    stopTask();
    task.step = Math.max(0, Math.min(step, data.task.length - 1));
    task.blocked = false;
    const d = data.task[task.step];
    const mapping = {
      "task-badge": d.badge, "task-plan": d.plan, "task-completed": d.completed,
      "task-note": d.note, "task-caption": d.caption, "task-view-title": d.title,
      "task-view-copy": d.copy, "task-gate": d.gate, "task-decision-note": d.decision,
      "task-action": d.action, "task-alt": d.alt
    };
    Object.entries(mapping).forEach(([id, value]) => $("#" + id).textContent = value);
    $("#task-action").disabled = false;
    $("#task-alt").hidden = !d.alt;
    $("#task-card").classList.toggle("is-complete", task.step >= 3);
    $$("#task-track li").forEach((li, i) => {
      li.classList.toggle("current", i === task.step);
      li.classList.toggle("passed", i < task.step);
      if (i === task.step) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    taskControls();
  }
  $("#task-action").addEventListener("click", () => renderTask(task.step === 4 ? 0 : task.step + 1));
  $("#task-alt").addEventListener("click", () => {
    stopTask();
    if (task.step === 0) {
      $("#task-decision-note").textContent = "已留在项目池：没有排期，也没有增加今天的任务。以后决定做时，再安排日期。";
    } else if (task.step === 2) {
      task.blocked = !task.blocked;
      $("#task-badge").textContent = task.blocked ? "卡住" : "进行中";
      $("#task-note").textContent = task.blocked ? "还缺一张实机截图（示意原因）" : data.task[2].note;
      $("#task-alt").textContent = task.blocked ? "继续处理" : "标记卡住";
      $("#task-action").disabled = task.blocked;
      $("#task-decision-note").textContent = task.blocked ?
        "原因留在补充说明里。仍未完成，也没有新增另一张任务；继续处理后再确认结果。" : data.task[2].decision;
      taskControls();
    }
  });
  $("#task-back").addEventListener("click", () => renderTask(task.step - 1));
  $("#task-reset").addEventListener("click", () => renderTask(0));
  $("#task-play").addEventListener("click", () => {
    if (task.playing) { stopTask(); return; }
    if (gates.has(task.step) || task.blocked) return;
    task.playing = true;
    taskControls();
    clearTimeout(task.timer);
    task.timer = setTimeout(() => {
      if (!task.playing) return;
      renderTask(task.step + 1); // both possible next steps are deliberate stop points.
    }, 3400);
  });
  renderTask(0);

  function calendar(mode) {
    const ticket = $("#calendar-ticket");
    $("#day-" + mode).appendChild(ticket);
    $("#plan-empty").hidden = mode === "plan";
    $("#done-empty").hidden = mode === "done";
    $("#ticket-detail").textContent = mode === "plan" ? "原计划 · 周二" : "实际完成 · 周三";
    $("#calendar-message").textContent = mode === "plan" ?
      "按原计划看：这件事安排在周二。实际完成仍是周三，两个字段并存，记录没有被改写。" :
      "按实际完成日回看：成果在周三。原计划“周二”仍保留，没有新增第二条记录。";
    $$("[data-calendar]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.calendar === mode)));
  }
  $$("[data-calendar]").forEach(b => b.addEventListener("click", () => calendar(b.dataset.calendar)));

  function route(name) {
    const d = data.routes[name];
    $$(".map-node").forEach(n => n.classList.toggle("active", d.nodes.includes(n.id.slice(5))));
    $$(".map-connect > path").forEach(n => n.classList.toggle("active", d.paths.includes(n.id.slice(5))));
    $("#route-title").textContent = d.title;
    $("#route-copy").textContent = d.copy;
    $$("[data-route]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.route === name)));
  }
  $$("[data-route]").forEach(b => b.addEventListener("click", () => route(b.dataset.route)));

  let receiptTimer = null;
  let receiptPending = false;
  function receiptReset() {
    clearTimeout(receiptTimer);
    receiptPending = false;
    $("#receipt-state").textContent = "已确认";
    $("#receipt-retry").disabled = true;
    $("#receipt-fail").disabled = false;
    $("#receipt-status").textContent = "失败演示只改变档案确认状态，左侧任务不会变回“未完成”。";
  }
  function receiptFail() {
    clearTimeout(receiptTimer);
    receiptPending = false;
    $("#receipt-state").textContent = "待重试";
    $("#receipt-retry").disabled = false;
    $("#receipt-fail").disabled = true;
    $("#receipt-status").textContent = "确认失败，但任务已经完成。保留 DEMO-01 的身份，等待重试，不复制一张新任务。";
  }
  function pauseReceipt() {
    if (!receiptPending) return;
    receiptFail();
    $("#receipt-status").textContent = "演示已暂停，仍保留原任务。回到这里后可再次重试。";
  }
  $("#receipt-fail").addEventListener("click", receiptFail);
  $("#receipt-retry").addEventListener("click", () => {
    if (receiptPending) return;
    clearTimeout(receiptTimer);
    receiptPending = true;
    $("#receipt-retry").disabled = true;
    $("#receipt-state").textContent = "重试中…";
    $("#receipt-status").textContent = "仍然使用 DEMO-01。任务数量保持 1，不因一次重试而增加。";
    receiptTimer = setTimeout(() => {
      receiptPending = false;
      $("#receipt-state").textContent = "已确认";
      $("#receipt-fail").disabled = false;
      $("#receipt-status").textContent = "档案确认已回来。任务仍为已完成，编号还是 DEMO-01，记录仍只有一份。";
    }, reduced.matches ? 250 : 1000);
  });
  $("#receipt-reset").addEventListener("click", receiptReset);

  function pet(state) {
    if (state === "lift" && $("#desktop").dataset.state === "lift") state = "edge";
    const d = data.pet[state];
    $("#desktop").dataset.state = state;
    $("#pet-mark").textContent = d.mark;
    $("#pet-label").textContent = d.label;
    $("#pet-description").textContent = d.desc;
    $$("[data-pet]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.pet === state)));
  }
  $$("[data-pet]").forEach(b => b.addEventListener("click", () => pet(b.dataset.pet)));

  /* Arrow keys move focus and selection inside switch groups; native buttons handle Enter/Space. */
  $$('[role="group"]').forEach(group => {
    group.addEventListener("keydown", event => {
      const buttons = $$("button", group).filter(b => !b.disabled && !b.hidden);
      const current = buttons.indexOf(document.activeElement);
      if (current < 0 || !["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
      event.preventDefault();
      let index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 :
        (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[index].focus();
      buttons[index].click();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopTask(); pauseReceipt(); }
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) return;
        if (entry.target.id === "task-lab") stopTask();
        if (entry.target.id === "receipt-area") pauseReceipt();
      });
    }, {threshold: 0});
    observer.observe($("#task-lab"));
    observer.observe($("#receipt-area"));
  }
  reduced.addEventListener("change", () => {
    stopTask();
  });

  let scrollScheduled = false;
  const navLinks = $$(".nav a");
  const sections = navLinks.map(a => $(a.getAttribute("href")));
  function readingState() {
    const doc = document.documentElement;
    const distance = doc.scrollHeight - doc.clientHeight;
    const ratio = distance > 0 ? doc.scrollTop / distance : 0;
    $("#reading-progress").style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    let active = -1;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= 170) active = i; });
    navLinks.forEach((a, i) => {
      a.classList.toggle("active", i === active);
      if (i === active) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    scrollScheduled = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(readingState); }
  }, {passive:true});
  window.addEventListener("resize", readingState);
  readingState();
})();
