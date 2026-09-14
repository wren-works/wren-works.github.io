/* Editable explanatory copy. All examples are page-local simulations, not HMC API calls. */
window.HMC_CASE_DATA = {
  agents: ["Hermes", "Codex", "Web Chat"],
  flow: [
    { kicker: "CONVERSATION SIGNAL", time: "14:07:12", title: "先是一句“以后再说”。",
      description: "对话里出现一个可能值得跨会话保留的变化。它是一个想法，还不是现在就要执行的任务。" },
    { kicker: "CANDIDATE PROPOSED", time: "14:07:14", title: "把想法整理出来，但先别算数。",
      description: "记录器提出一个 idea 候选，附上原话和来源。此时它只在候选箱里，不会触碰正式状态。" },
    { kicker: "HUMAN APPROVAL", time: "14:08:03", title: "先确认：我说的是这个意思吗？",
      description: "检查原话、来源和范围。确认的是“保留为点子”，不是“立刻开始执行”。你可以采用，也可以忽略。" },
    { kicker: "RECORD ACCEPTED", time: "14:08:04", title: "确认以后，才追加一条正式记录。",
      description: "候选通过统一的 Agent Sync 协议写入 Records。旧记录保留，新记录接在后面，不静默改写过去。" },
    { kicker: "CONTEXT PROJECTED", time: "14:08:04", title: "下一位 Agent，从这里接着读。",
      description: "Current Context 根据记录更新。这个想法进入活跃点子，仍然不是执行事项；其他 Agent 从同一份现状继续。" }
  ],
  routes: {
    hermes: { channel: "LOCAL / AGENT API", title: "本地的 Agent，<br>从 Agent API 进来。",
      path: ["Hermes", "Agent API"],
      description: "Hermes 主动同步结构化更新，经过统一的来源、权限与字段校验后，进入 Records，再投影成当前状态。" },
    codex: { channel: "LOCAL / AGENT API", title: "换成 Codex，<br>仍用同一套记录语义。",
      path: ["Codex", "Agent API"],
      description: "Codex 也通过 Agent API 留下结构化更新。入口不需要另造一套记忆；写入与后续投影遵循同样的规则。" },
    web: { channel: "PRIVATE GITHUB BRIDGE", title: "云端不能直连本机，<br>就走受限的桥。",
      path: ["私有仓库 Inbox", "本地导入器"],
      description: "网页端把短 JSON 放进私有仓库 Inbox。本地导入器取回后，固定来源并校验，再进入统一的记录流程。" }
  },
  rules: {
    retry: { code: "IDEMPOTENCY / 幂等", title: "送了两次，<br>也只能算一次。",
      description: "同来源、同记录编号、同内容，返回 duplicate；编号相同却换了内容，就报冲突，不能顺手覆盖。",
      action: "重发相同内容", alternate: "试试同编号、不同内容" },
    late: { code: "EVENT ORDER / 迟到事件", title: "旧消息到了，<br>现状不能跟着倒退。",
      description: "旧记录仍然进入历史，但不能把同一对象的新状态改回过去，也不能让投影游标回退。记录收到得晚，不等于发生得新。",
      action: "让旧消息抵达", alternate: null },
    batch: { code: "INBOX ISOLATION / 逐条处理", title: "坏了一条，<br>别把后面的都堵住。",
      description: "失败条目单独回滚并进入 rejected，留下原因。后续文件继续处理，不让一个坏文件阻断整批 Inbox。",
      action: "处理这一批文件", alternate: null }
  }
};
