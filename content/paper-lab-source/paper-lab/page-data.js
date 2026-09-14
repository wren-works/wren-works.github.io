/* Editable content for the two interactive explainers.
   All graphics and prices here are illustrative, not live records or returns. */
window.PAPER_CASE = {
  flow: [
    {
      phase: "收盘后",
      kicker: "MARKET DATA / 行情输入",
      title: "先拿到收盘后的日线数据。",
      description: "从多个行情源提取日线数据并做粗筛。不是让模型凭空选股，而是先准备这一轮判断可以使用的输入。",
      footLabel: "异常处理",
      foot: "数据缺失会记录降级，或停止发布，而不是假装输入完整。",
      visual: "sources"
    },
    {
      phase: "收盘后",
      kicker: "FEATURE PACKAGE / 特征数据包",
      title: "把候选标的，缩进一个数据包。",
      description: "生成最多包含 12 只候选标的的特征数据包，同时记录数据质量。模型拿到的是这一轮可以据此判断的材料。",
      footLabel: "一起交付",
      foot: "候选标的与数据质量一起记录。12 是候选数量上限，不是每次必须填满的目标。",
      visual: "candidates"
    },
    {
      phase: "模型判断",
      kicker: "PREDICTION / 交易假设",
      title: "判断必须写成可检查的计划。",
      description: "模型可以自行查询资料，之后按 prediction.v1 输出纯 JSON。每条预测写明入场条件、失效点、目标位和失效原因。",
      footLabel: "责任边界",
      foot: "到这里，模型的工作就结束了。后面的行情获取、校验、成交和记账交给本地系统。",
      visual: "prediction"
    },
    {
      phase: "本地校验",
      kicker: "VALIDATION / 接收前校验",
      title: "不是写了 JSON，就能进入模拟盘。",
      description: "本地系统检查字段和价格关系。通过后，预测才被标记为 accepted；字段缺失或价格关系不成立，都会被拒绝。",
      footLabel: "失败分支",
      foot: "不通过校验的预测，不进入纸面撮合。后续步骤展示的是通过校验的路径。",
      visual: "validation"
    },
    {
      phase: "交易时段",
      kicker: "PAPER BROKER / 纸面撮合",
      title: "让之后出现的行情，检验之前的判断。",
      description: "交易时段内，Paper Broker 每分钟读取一次行情，按规则判断是否模拟成交。行情是只读输入，不是模型可以改写的结果。",
      footLabel: "避免重复",
      foot: "重复轮询不会造成重复成交。盘中行情仍保留 Sina 优先、Eastmoney 备用。",
      visual: "broker"
    },
    {
      phase: "模拟成交",
      kicker: "TRADING RULES / 固定约束",
      title: "成交时，把交易限制和费用一起算上。",
      description: "T+1、佣金与印花税不是事后补充说明，而是撮合时就要执行的约束。模型的纸面策略不能绕过这些规则。",
      footLabel: "具体规则",
      foot: "还包括 100 股整手、仓位与风险上限，以及跳空和同分钟冲突时的保守处理。下方可以切换情境查看。",
      visual: "rules"
    },
    {
      phase: "本地记账",
      kicker: "LOCAL LEDGER / 状态与事件",
      title: "每次变化，都留下可检查的记录。",
      description: "持仓变化写入 state.json；事件流水写入追加式 events.jsonl。当前状态与变化记录都留在本地。",
      footLabel: "留下什么",
      foot: "不仅看最后赚了多少，也能回头检查这份结果是如何形成的。",
      visual: "files"
    },
    {
      phase: "统一比较",
      kicker: "COMPARISON / 统一评估口径",
      title: "用同一把尺子，看不同判断的结果。",
      description: "最后用统一的 R 口径，比较实际持仓、个人纸面、模型策略和基准。具体持仓与收益会再次打包给模型，进入下一轮。",
      footLabel: "仍有边界",
      foot: "这里演示的是比较口径，不是收益曲线。当前样本不能证明模型稳定盈利，也不能证明它能长期跑赢市场。",
      visual: "comparison"
    }
  ],
  rules: {
    lock: {
      code: "T+1 / HOLDING LOCK",
      title: "止损线到了，\n也不代表今天就能卖。",
      description: "买入当天锁仓，下一交易日才能止损、止盈或按收盘条件退出。不能在模拟盘里，偷偷给模型一次实盘没有的逃跑机会。",
      disclaimer: "示意情境，不对应真实持仓或历史成交。解锁不代表按前一天的价格自动卖出。",
      states: [
        {badge:"买入当日", action:"到下一交易日", verdict:"已触及失效点，但持仓仍被锁定", detail:"当日不卖出，不提前记一笔“成功止损”。", icon:"—"},
        {badge:"下一交易日", action:"回到买入当天", verdict:"锁仓解除，是否成交仍需看行情", detail:"之后的退出仍需符合条件，不按前一天的价格补成交。", icon:"✓"}
      ]
    },
    gap: {
      code: "GAP OPEN / CONSERVATIVE FILL",
      title: "开盘已经更贵，\n就不能按旧价格买。",
      description: "突破买入时，成交价取 entry 和开盘价中的较高值。价格跳过了原本的入场点，就不能在纸面上假装还买得到。",
      disclaimer: "价格为虚构示例。假设突破买入条件已满足；这里只演示取价，不含费用与仓位校验。",
      states: [
        {badge:"未跳空高开", action:"试试跳空高开", verdict:"取较高值：示意成交价 ¥10.00", detail:"entry 为 ¥10.00，开盘 ¥9.90；条件满足后按 entry 取价。", icon:"✓"},
        {badge:"跳空高开", action:"回到未跳空情境", verdict:"取较高值：示意成交价 ¥10.40", detail:"开盘已高于 entry，不能仍用 ¥10.00 美化成交。", icon:"✓"}
      ]
    },
    conflict: {
      code: "SAME-BAR CONFLICT / STOP FIRST",
      title: "同一分钟碰到两条线，\n不挑更好看的结果。",
      description: "一分钟行情无法确认止盈和止损谁先发生。同一根分钟 K 线同时触及两者时，按止损处理，不把未知的先后顺序算成模型的优势。",
      disclaimer: "K 线与价格为虚构示例。假设持仓已解锁，满足退出前提；不代表真实行情。",
      states: [
        {badge:"先后次序未知", action:"按保守规则处理", verdict:"同一分钟内，两条线都被触及", detail:"不能认定止盈先发生，也不能用有利的顺序倒推结果。", icon:"?"},
        {badge:"止损优先", action:"重看这个情境", verdict:"按止损处理，不记作止盈", detail:"这里选择的是止损分支，不猜测这一分钟里的真实先后。", icon:"—"}
      ]
    }
  }
};
