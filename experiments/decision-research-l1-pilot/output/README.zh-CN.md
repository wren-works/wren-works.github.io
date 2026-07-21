# 产出归档规则

本目录按“任务 → 条件 → 运行”组织，不再使用无法直接理解的 a/b/run-02。

```text
output/
  development/
    <task-id>/
      default/
        run-01/
          research-report.md
          run-metadata.md
      decision-research-v0.1|v0.2/
        run-01/
          research-report.md
          run-metadata.md
      excluded/
```

- research-report.md 是模型原始交付，只移动和重命名，不为作品集重写。
- run-metadata.md 记录模型、reasoning effort、耗时、调用方式和异常。
- excluded/ 保留污染、失败或不独立的运行，但不得混入正式对比。
- 任务已经用于 Skill 设计时放在 development/；未见任务才可进入 holdout/。

当前正式任务：

- discovery-01-ai-meeting-assistants：默认研究 vs Decision Research v0.1。
- discovery-02-smart-band：默认基线与 Decision Research v0.2 干净回归；旧污染运行单列排除。
- decision-01-eu-voice-architecture：默认研究 vs Decision Research v0.2。

具身智能三向比较已统一放入 experiments/explore-topic-pilot/output/development/discovery-03-embodied-intelligence/。
