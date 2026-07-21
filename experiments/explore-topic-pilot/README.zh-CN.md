# Explore Topic 薄 Skill 试跑

这个实验只做一件事：观察薄 Skill 是否能在自由研究中扩大探索空间，同时避免厚格式带来的重复和提前收敛。

## 打开方式

在 Codex 中把下面这个目录单独作为新工作区打开：

```text
D:\wangye\experiments\explore-topic-pilot\workspaces\research-thin
```

不要从 `D:\wangye` 根目录开始任务。根目录同时包含 `explore-topic` 和 `decision-research`，不能形成干净条件。

该工作区内只安装 `explore-topic`，不保存任务、评分规则或旧产出。新建对话后直接发送自然语言研究请求；如果要测试隐式触发，不要在提示中写 `$explore-topic`。

## 本轮最低记录

完成后保存：

- 实际发送的完整提示词；
- 模型与 reasoning effort；
- 大致耗时；
- `research-report.md`；
- 一句话主观判断：是否看到了默认研究不容易出现的新视角。

在下一次运行前，把产出移出工作区，避免后续对话读取旧报告。可归档到：

```text
output/development/discovery-03-embodied-intelligence/explore-topic/run-01/
```

## 有界停止规则

这一轮作为薄 Skill 的定性示范，不继续根据单篇报告反复改 Skill。只有出现触发失败、明显事实纪律退化、输出重新模板化，或完全没有打破首个框架等结构性问题，才进入下一次修改。

作品集当前可以陈述“设计假设与早期观察”，不能陈述薄 Skill 已普遍提升研究洞察。
