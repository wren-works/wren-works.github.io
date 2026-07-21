# 王婉婷 · AI Product Portfolio

面向 AI 产品经理 / 产品经理岗位的个人作品集。网站使用原生 HTML、CSS 和 JavaScript，适合直接发布到 GitHub Pages。

## 项目

1. **FollowUp Copilot**：将跨月的装修客户聊天整理成可追溯状态卡；已进入负责人受控真实试用。
2. **DecisionHelp**：将小红书、大众点评等平台的收藏截图整理成可编辑、可比较的地点候选。移动端 App 原型。
3. **AI Research Workflow**：从一次研究偏航出发，把开放探索与固定选项决策拆成两个 Skill，并通过同模型对照实验检验它们的价值和边界。原 NOMI 研究保留为项目起点与历史档案。

## 研究方法

- [Decision Research Loop](docs/decision-research-workflow.md)：一套待验证的通用决策研究工作流，已封装为仓库级 [Decision Research Skill](.agents/skills/decision-research/SKILL.md)，另有便于查看的 [Skill 中文审阅版](docs/decision-research-skill.zh-CN.md)。包含主张—证据账本、时效与反证检查、研究质量门槛及大小模型对照实验方案。
- [L1 同模型对照试验](experiments/decision-research-l1-pilot/README.zh-CN.md)：两个相互隔离的研究工作区、统一任务、固定输出目录和预注册评测表，用于比较同一模型有无 Skill 的表现。

## 本地查看

Markdown 内容通过 `fetch` 加载，不能直接双击 HTML 查看完整案例，需要在项目根目录启动静态服务器：

```powershell
python -m http.server 8765
```

然后访问 `http://127.0.0.1:8765/`。

## GitHub Pages

1. 将本目录作为仓库根目录提交到 GitHub。
2. 在仓库 `Settings → Pages` 中选择从主分支根目录发布。
3. 保留根目录的 `.nojekyll` 文件。
4. 发布后检查首页、两个案例页和 Markdown 支撑材料。

页面全部使用相对路径，兼容 `https://<user>.github.io/<repository>/` 形式的项目站点。

## 待补媒体

- DecisionHelp：已补充真实 App 流程截图与 35 秒核心链路录屏。
- 简历：已放入 `assets/resume.pdf`，首页和案例页均提供入口。
