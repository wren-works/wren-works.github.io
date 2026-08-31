# JD-Aligned Portfolio Refresh Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** 将作品集主线调整为 FollowUp + Portfolio Lab + AI Research Workflow，并补齐 AI PM 初筛最缺的 PRD、指标与 Eval 证据；保留无照片简历作为当前默认投递版。

**Architecture:** 在独立 Git worktree `/mnt/d/wangye-refresh` 的 `portfolio-jd-refresh` 分支中完成，不触碰原仓库的 CRLF 假改动。作品集仍为纯静态 GitHub Pages；新增 Portfolio Lab Case，DecisionHelp 降级为 More Projects，Research Workflow 只做证据升级，不虚构企业平台与多 Agent 能力。

**Tech Stack:** Static HTML/CSS/JS, GitHub Pages, existing Portfolio Lab Python/FastAPI artifacts, Markdown/CSV evidence.

---

## Task 1: Freeze current application materials

**Objective:** 固定当前无照片简历与作品集基线，避免后续改动覆盖可投版本。

**Files:**
- Copy: `/mnt/d/wangye/assets/resume-ai-pm-2026-08.pdf` → `/mnt/c/Users/kl681/Desktop/王婉婷-AI产品经理-2027届.pdf`
- Keep editable: `/mnt/d/wangye/assets/resume-ai-pm-2026-08.html`

**Verification:**
- PDF 存在且单页视觉验收通过。
- 不替换线上 `assets/resume.pdf`，直到用户确认。

## Task 2: Create Portfolio Lab Project Brief

**Objective:** 用真实事实整理 Portfolio Lab Case Brief，明确项目不是自动交易 Agent。

**Files:**
- Create: `content/portfolio-lab/brief.md`
- Reference: `/mnt/c/Users/kl681/Documents/Codex/2026-08-26/portfolio-lab/README.md`
- Reference: `/mnt/c/Users/kl681/Documents/Codex/2026-08-26/portfolio-lab/BRIEF.md`

**Required brief facts:**
- 从个人投资记录与 AI 纸面策略比较开始。
- 数据源：OKX 只读、Massive QQQ、Twelve Data XAU/USD、AKShare A股。
- 网页模型只生成结构化纸面预测；本地系统负责 schema/逻辑校验、同步、分钟行情、条件单、T+1、费用、账本与绩效。
- 真实资金红线：无任何真实下单接口。
- 关键修复：预测生成前历史分钟线过滤、未来 bar 过滤、同分钟止盈止损按止损优先、行情失败不猜成交。
- 当前数据：69 个自动测试；初始纸面资金与用户同步为 15,000 元；市场结果尚在积累，不能声称策略有效。

**Verification:**
- Brief 包含 why/goal/solution/value/limitations。
- 不出现“多 Agent”“自动炒股”“金融级已验证”等虚构表述。

## Task 3: Add Portfolio Lab Case page

**Objective:** 生成一页 6–8 分钟可读的 Case，展示复杂状态机与 AI/规则边界。

**Files:**
- Create: `content/portfolio-lab/index.html`
- Create: `content/portfolio-lab/portfolio-lab.css`
- Create: `content/portfolio-lab/assets/` screenshots/diagrams as needed
- Test: link and asset checks

**Page structure:**
1. Hero：让模型做判断，让确定性系统负责执行与记账。
2. Context：个人真实投资记录与“直觉 vs AI”验证需求。
3. Boundary：只读数据、纸面预测、无真实下单。
4. Architecture：行情源 → prediction.v1 → validation → accepted → minute polling → paper broker → scoreboard。
5. Product decisions：规则/模型分工、T+1、费用、幂等、异常降级。
6. Failure caught：历史分钟线导致时间穿越风险，如何通过测试发现并修复。
7. Current evidence：69 tests、真实 AKShare dry-run、分钟轮询、15,000 纸面资金。
8. Limits：策略结果未成熟、节假日日历待补、分钟 OHLC 非真实盘口。

**Do not:**
- 不加花哨动画、Google Fonts、假收益曲线、假用户评价。
- 不把网页模型叫作多 Agent。
- 不展示密钥、真实账户余额或可识别交易信息。

**Verification:**
- Desktop/mobile 无横向溢出。
- 所有链接与图片 200/存在。
- 页面文字与 Brief 一致。

## Task 4: Upgrade AI Research Workflow evidence

**Objective:** 保留现有叙事，补成可复核的 Eval Loop，而非假装企业平台。

**Files:**
- Modify: `content/research-workflow/index.html`
- Modify: `content/research-workflow/research.css`
- Create: `content/research-workflow/eval-summary.csv` or compact HTML table

**Add:**
- Eval Loop 图：任务 → 同模型多方案 → 规则检查/人工盲审 → Bad Case → Skill 迭代。
- 当前样本和限制：每种方式只跑一次的题明确标记；污染样本排除。
- 指标：强洞察数、耗时、事实门槛、可更新性；没有记录的 Token/成本保持“未记录”。
- 下一轮计划：10–20 个陌生任务，每种方式 3 次。

**Verification:**
- 不引入 LLM-as-a-Judge/Kappa 等未实际实现能力。
- 原有失败叙事保留，不粉饰结果。

## Task 5: Reorder portfolio navigation

**Objective:** 首页核心项目改为 FollowUp → Portfolio Lab → AI Research Workflow，DecisionHelp 进入 More Projects。

**Files:**
- Modify: `index.html`
- Modify: navigation in `content/renovation-followup/index.html`
- Modify: navigation in `content/portfolio-lab/index.html`
- Modify: navigation in `content/research-workflow/index.html`
- Add More Projects link/card for `content/decisionhelp/index.html`

**Verification:**
- 首页 15 秒内能看到三个项目分别证明：真实业务 / 复杂确定性执行 / Eval。
- DecisionHelp 仍可访问，不删除。
- 全站无 404。

## Task 6: Add one PRD sample

**Objective:** 补齐校招 PM 初筛最明确的规范交付物证据。

**Files:**
- Create: `content/portfolio-lab/portfolio-lab-paper-broker-prd.md`
- Link from Case page

**PRD must include:**
- 背景、目标、非目标。
- User story。
- prediction/order/position 状态机。
- 正常流、异常流、T+1、费用、行情失败、幂等。
- 指标：同步成功率、行情获取成功率、重复成交数必须为 0、纸面订单状态分布。
- 验收标准。
- 风险与回滚。

**Verification:**
- PRD 是产品文档，不是 README 复制。
- 每项验收可测试。

## Task 7: Add SQL/data evidence mini-track

**Objective:** 补基础数据分析证据，但不伪装为大规模线上 A/B 实战。

**Files:**
- Create: `experiments/pm-data-basics/README.md`
- Create: `experiments/pm-data-basics/schema.sql`
- Create: `experiments/pm-data-basics/queries.sql`
- Create: `experiments/pm-data-basics/sample.db` only if appropriate

**Queries:**
- 投递漏斗：有效岗位 → 投递 → 回复 → 面试。
- FollowUp 阶段漏斗的匿名/模拟 schema。
- Window function 示例。
- 留存/A-B 基础只写方法和模拟数据，明确非真实上线结果。

**Verification:**
- SQL 可在 SQLite 实际运行。
- README 区分真实数据、匿名数据、模拟数据。

## Task 8: Validation and local commit

**Objective:** 验收静态站、内容和证据，创建本地提交，不推送。

**Checks:**
- HTML link checker.
- Browser screenshot desktop/mobile.
- No secrets in repo.
- `git diff --check`.
- Review claims against source docs.

**Commit:**
```bash
git add index.html content/portfolio-lab content/research-workflow experiments/pm-data-basics docs/plans
 git commit -m "feat: align portfolio with AI product roles"
```

**Do not push** until user reviews the local preview.
