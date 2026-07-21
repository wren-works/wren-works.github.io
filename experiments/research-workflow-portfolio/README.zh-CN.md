# AI 研究工作流作品集材料

这是作品集页面的统一入口，不复制原始报告，只通过相对链接引用两个实验目录中的证据。

## 推荐阅读顺序

1. [案例叙事草稿](case-study-draft.zh-CN.md)
2. [原始证据索引](evidence-index.zh-CN.md)
3. [结构化结果表](results.csv)
4. [厚 Skill 迭代记录](../decision-research-l1-pilot/evaluation/iteration-v0.2.zh-CN.md)
5. [薄 Skill 设计依据](../explore-topic-pilot/design-rationale.zh-CN.md)
6. [决策任务盲审](../decision-research-l1-pilot/evaluation/decision-01-review.zh-CN.md)
7. [薄 Skill 三向评估](../explore-topic-pilot/evaluation/thin-run-01-review.zh-CN.md)

## 证据范围

- 4 个开发任务；
- 9 份纳入比较的报告；
- 1 份因读取并修订既有产出而排除、但仍保留的失败样本；
- 所有正式运行均使用 gpt-5.6-terra、high；
- 目前没有 token、成本或重复运行数据。

## 作品集可以声称

- 厚 Decision Research Skill 稳定增加了反证、验证条件和更新记录，但在开放研究中没有增加强洞察数量，并曾引入明显的篇幅与时间负担。
- 将工作流改为先区分 Discovery / Decision 模式后，开放题不再被强制包装成决策简报；这是回归信号，不是泛化证明。
- 在一项固定选项决策题中，厚 Skill 的可更新性得分更高，总分 36/36 对 35/36，代价是多 44 秒和约 19% 篇幅。
- 薄 Explore Topic Skill 在一项具身智能开发题中扩大了视角并产生 2–3 个更锋利的分支，同时没有观察到额外时间负担。

## 作品集不能声称

- 不能说 Skill 已经普遍优于 ChatGPT 或默认研究；
- 不能把开发题的一次运行解释为稳定模型能力；
- 不能把更长、来源更多或格式更完整直接等同于更有洞察；
- 不能把相反推荐中的任一方案写成已经由公开网页验证的正确答案。

## 发布前最低补充

- 选 1 个未参与 Skill 设计的新行业任务，至少重复 3 次；
- 最好加入小模型无 Skill / 有 Skill 两个条件，检验流程是否能替代部分模型能力；
- 页面中把“开发结果”“留出验证”明确分开；
- 若无法获得 token，用耗时、字符数和人工审阅负担作为不完整的成本代理，并明确限制。

现阶段材料已经足够发布为“过程型案例”：重点是如何把模糊质量转成可测假设、如何诚实处理失败结果，以及如何据此拆分两个不同优化目标的 Skill。
