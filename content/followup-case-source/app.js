const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

let scrollQueued = false;
function updateScrollUI() {
  const root = document.documentElement;
  const total = root.scrollHeight - root.clientHeight;
  const progress = total > 0 ? root.scrollTop / total : 0;
  $("#progress").style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  scrollQueued = false;
}
addEventListener("scroll", () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });

const inputModes = {
  first: {
    kicker: "FIRST SETUP / BUILD THE CUSTOMER CARD",
    title: "第一次建库，先把零散信息整理成客户卡。",
    copy: "聊天截图和临时补充可能并不规整。AI 提取可用字段，高影响信息由负责人确认后保存。",
    aria: "第一次建库流程",
    steps: ["聊天截图 / 临时补充", "AI 提取客户信息", "高影响字段人工确认", "建立客户卡"],
  },
  ongoing: {
    kicker: "ONGOING / INCREMENTAL UPDATE",
    title: "之后更新，只处理新出现的内容。",
    copy: "微信出现新消息后，系统只读检查新增内容，按消息编号合并成业务会话摘要，再由负责人确认分类或关联对象。",
    aria: "后续更新流程",
    steps: ["微信出现新消息", "只读检查新增内容", "按消息编号增量合并", "生成业务会话摘要", "人工分类或关联对象"],
  },
};
const inputImplementations = {
  first: [
    ["输入整理", "接收聊天截图或临时补充；截图识别由视觉模型完成，文字输入直接进入结构化提取。"],
    ["AI 提取", "服务端按 customer-card-v0 结构提取房屋情况、预算、需求、沟通进展和下一步。"],
    ["人工确认", "金额、日期、姓名等高影响字段被标记出来，负责人确认后才保存。"],
    ["写入客户卡", "确认后的结构写入本地 SQLite 客户工作区，后续更新沿用同一个客户对象。"],
  ],
  ongoing: [
    ["检查变化", "Windows 定时任务比较微信数据库文件更新时间；没有变化时跳过重复解密和 ETL。"],
    ["只读刷新", "源数据变化后刷新本地只读镜像，不操作微信客户端，也不发送消息。"],
    ["增量合并", "导入器按会话与消息编号合并新增内容，避免每次重读全部历史。"],
    ["生成摘要", "规则层整理近 90 天业务会话的时间、消息数量和待回复状态。"],
    ["人工归类", "负责人把会话确认成工地客户、客户或工地，也可以改名或屏蔽。"],
  ],
};

function renderInputMode(mode) {
  const data = inputModes[mode];
  const demo = $(".input-demo");
  demo.dataset.inputMode = mode;
  $$(".input-mode-rail button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.inputMode === mode)));
  $("#input-kicker").textContent = data.kicker;
  $("#input-title").textContent = data.title;
  $("#input-copy").textContent = data.copy;
  const path = $("#input-path");
  path.setAttribute("aria-label", data.aria);
  path.innerHTML = data.steps.map((step, index) => `<li><button type="button" data-input-step="${index}"><span>${String(index + 1).padStart(2, "0")}</span><b>${step}</b></button></li>`).join("");
  path.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => renderInputStep(mode, Number(button.dataset.inputStep))));
  renderInputStep(mode, 0);
  if (!reducedMotion.matches) {
    $(".input-stage").classList.remove("changing");
    void $(".input-stage").offsetWidth;
    $(".input-stage").classList.add("changing");
  }
}
function renderInputStep(mode, index) {
  const details = inputImplementations[mode];
  const item = details[index] || details[0];
  $$("#input-path button").forEach((button, buttonIndex) => button.setAttribute("aria-current", buttonIndex === index ? "step" : "false"));
  $("#input-step-kicker").textContent = `IMPLEMENTATION / ${String(index + 1).padStart(2, "0")}`;
  $("#input-step-title").textContent = item[0];
  $("#input-step-copy").textContent = item[1];
}
$$(".input-mode-rail button").forEach((button) => button.addEventListener("click", () => renderInputMode(button.dataset.inputMode)));
renderInputMode("ongoing");

const outputCases = {
  client: { kicker: "TODAY / 到期客户", title: "张隆 · 方案与预算比较中", desc: "提醒日期已到，需要确认客户最在意的预算差距。", badge: "今天", status: "方案与预算比较中", action: "确认对方最在意的预算差距", entry: "打开客户详情 / 回到原聊天" },
  reply: { kicker: "TODAY / 微信待回复", title: "朱朱推荐 · 3 天前收到新消息", desc: "会话已被识别为客户，需要先打开原聊天核对内容。", badge: "3 天前", status: "等待负责人回复", action: "确认这条消息是否需要继续推进", entry: "打开原聊天" },
  site: { kicker: "TODAY / 进行中工地", title: "建发书香府 · 现浇阶段", desc: "当前工地处于现浇阶段，需要确认现场完成情况。", badge: "进行中", status: "现浇 · 02 / 18", action: "确认现浇完成情况", entry: "打开工地详情" },
  review: { kicker: "TODAY / 待复核分类", title: "一条会话分类不确定", desc: "自动判断置信度较低，负责人需要确认它属于哪类业务对象。", badge: "待确认", status: "系统判断：客户", action: "改为工地客户 / 客户 / 工地 / 屏蔽", entry: "查看业务会话摘要" },
};
function renderOutputCase(key) {
  const item = outputCases[key];
  $("#task-title").textContent = item.title;
  $("#task-desc").textContent = item.desc;
  $("#task-badge").textContent = item.badge;
  $("#case-status").textContent = item.status;
  $("#case-action").textContent = item.action;
  $("#case-entry").textContent = item.entry;
  $(".task-head .micro").textContent = item.kicker;
  if (!reducedMotion.matches) {
    $("#actual-case-card").classList.remove("changing");
    void $("#actual-case-card").offsetWidth;
    $("#actual-case-card").classList.add("changing");
  }
}
$$(".filter-btn").forEach((button) => button.addEventListener("click", () => {
  $$(".filter-btn").forEach((item) => item.setAttribute("aria-pressed", "false"));
  button.setAttribute("aria-pressed", "true");
  renderOutputCase(button.dataset.filter);
}));
$$("[data-output-view]").forEach((button) => button.addEventListener("click", () => {
  const brief = button.dataset.outputView === "brief";
  $$("[data-output-view]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  $('.output-board').classList.toggle('brief', brief);
  $('.output-board').dataset.view = brief ? "brief" : "today";
}));

const siteStages = ["拆除", "现浇", "砌墙", "水电定位", "水电施工", "水电验收", "防水施工", "地暖施工", "木工吊顶", "泥工贴砖", "瓷砖验收", "美缝", "全屋定制进场测量", "磁粉、乳胶漆施工", "全屋定制安装", "开关面板、灯具安装", "磁粉、乳胶漆修补", "保洁"];
const ruler = $("#stage-ruler");
function setStage(number) {
  $$("button", ruler).forEach((button, index) => {
    button.classList.toggle("done", index + 1 < number);
    button.classList.toggle("current", index + 1 === number);
  });
  $("#stage-num").textContent = String(number).padStart(2, "0");
  $("#stage-label").textContent = siteStages[number - 1];
}
siteStages.forEach((stage, index) => {
  const number = index + 1;
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = String(number).padStart(2, "0");
  button.title = stage;
  button.setAttribute("aria-label", `查看环节 ${number}：${stage}`);
  button.addEventListener("click", () => setStage(number));
  ruler.appendChild(button);
});
setStage(2);

const ledgerViews = {
  advance: [["09.12", "材料款先行垫付", "示意金额"], ["09.10", "工人阶段结算", "示意金额"], ["垫账汇总", "按分类单独查看", ""]],
  expense: [["09.13", "水电材料支出", "示意金额"], ["09.11", "现场运输支出", "示意金额"], ["实际支出汇总", "按分类单独查看", ""]],
};
function renderLedger(key) {
  $("#ledger-sheet").innerHTML = ledgerViews[key].map((row, index) => index === 2
    ? `<div class="ledger-total"><span>${row[0]}</span><b>${row[1]}</b></div>`
    : `<div class="ledger-entry"><span>${row[0]}</span><b>${row[1]}</b><em>${row[2]}</em></div>`).join("");
}
$$(".ledger-tab").forEach((button) => button.addEventListener("click", () => {
  $$(".ledger-tab").forEach((item) => item.setAttribute("aria-pressed", "false"));
  button.setAttribute("aria-pressed", "true");
  renderLedger(button.dataset.ledger);
}));


const aiStages = {
  first: {
    label: "FIRST SETUP / 第一次建库", title: "先理解，再由人确认。",
    rows: { ai: ["主要负责", "截图、文字理解、客户卡整理", "major"], script: ["少量参与", "尚未进入持续更新", "minor"], rules: ["少量参与", "校验基础结构", "minor"], human: ["最终确认", "高影响字段与保存", "confirm"] },
  },
  ongoing: {
    label: "ONGOING / 进入日常之后", title: "稳定的部分，交给更确定的方式。",
    rows: { ai: ["按需参与", "新截图、零散文字、回复草稿", "assist"], script: ["主要负责", "微信只读增量同步", "major"], rules: ["主要负责", "到期、待回复、日报和工地提醒", "major"], human: ["最终决定", "分类修正、下一步、沟通与承诺", "confirm"] },
  },
};
function setAiStage(stage) {
  const data = aiStages[stage];
  const sticky = $("#ai-sticky");
  if (sticky.dataset.stage === stage) return;
  sticky.dataset.stage = stage;
  $("#ai-stage-label").textContent = data.label;
  $("#ai-stage-title").textContent = data.title;
  $$(".responsibility").forEach((row) => {
    const item = data.rows[row.dataset.role];
    row.dataset.level = item[2];
    $("b", row).textContent = item[0];
    $("small", row).textContent = item[1];
  });
}
const aiProgress = $("#ai-section-progress");
function updateAiByScroll() {
  if (!aiProgress || innerWidth <= 640) return;
  const rect = aiProgress.getBoundingClientRect();
  const midpoint = innerHeight * .52;
  const progress = Math.max(0, Math.min(1, (midpoint - rect.top) / Math.max(1, rect.height)));
  setAiStage(progress >= .5 ? "ongoing" : "first");
}
addEventListener("scroll", updateAiByScroll, { passive: true });
addEventListener("resize", updateAiByScroll);
setAiStage("first");
updateAiByScroll();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) scrollQueued = false;
});
updateScrollUI();
