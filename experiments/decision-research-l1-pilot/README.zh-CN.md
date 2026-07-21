# Decision Research 同模型对照实验

> 当前厚 Skill：v0.2  
> 日期：2026-07-20  
> 证据等级：探索性开发结果，不足以形成稳定泛化结论

## 目录职责

```text
decision-research-l1-pilot/
  prompts/       唯一任务文本与实际用户提示
  workspaces/    隔离执行环境，不保留旧产出
  output/        按任务、条件、运行归档的原始报告与元数据
  evaluation/    评分规则、盲审、迭代记录和历史附件
```

归档统一使用：

```text
output/development/<task-id>/<condition>/run-01/
  research-report.md
  run-metadata.md
```

条件名称直接写明工作流，不再使用 a/b。盲审时的 Alpha/Beta 与 X/Y 映射仍保存在评估文档中。

## 已有任务

| 顺序 | 任务 | 正式条件 | 状态 |
| --- | --- | --- | --- |
| 1 | AI 会议助手自由研究 | default / decision-research-v0.1 | 已找回原始报告；用于修改 Skill |
| 2 | 智能手环自由研究 | default / decision-research-v0.2 | v0.2 干净回归；另保留 1 个污染排除样本 |
| 3 | 具身智能自由研究 | default / decision-research-v0.2 / explore-topic | 已迁至 explore-topic-pilot 统一三向比较 |
| 4 | 欧盟会议助手语音架构决策 | default / decision-research-v0.2 | 已完成盲审 |

所有正式运行均使用 gpt-5.6-terra、high。统一指标与作品集叙事见 ../research-workflow-portfolio/。

## 运行规则

1. 每个新题使用唯一 task ID，不复用输出路径。
2. 保存实际发送的自然语言 prompt，不用工作区隐藏任务补充条件。
3. 固定模型、reasoning effort、网页搜索、权限、截止日期和预算。
4. 每次填写 run-metadata.md；无法取得的数据保持缺失，不估算。
5. 读取过旧输出、重试异常或权限不同的运行保留在 excluded/，不进入正式均值。
6. 用于修改 Skill 的题目标记为 development；未见任务才可作为 holdout。
7. 随机性条件至少重复 3 次后，才讨论稳定提升。

目录细则见 [output/README.zh-CN.md](output/README.zh-CN.md)。完整迭代依据见 [evaluation/iteration-v0.2.zh-CN.md](evaluation/iteration-v0.2.zh-CN.md)。