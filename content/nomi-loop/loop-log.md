# NOMI Loop 日志

## 已访问 URL
<!-- Search Agent: 搜索前检查此列表，避免重复分析同一页面 -->
<!-- Check Agent: 验收通过后自动追加 -->

- [2026-06-15 Loop#1] https://pingce.ifeng.com/c/8XIz1mJoplX — 凤凰网四车语音横评（核心案例来源）
- [2026-06-15 Loop#1] https://www.42how.com/v2post/24858 — 42how 用户 Blood旌旗 吐槽 NOMI/理想 vs 小鹏
- [2026-06-15 Loop#1] http://www.pday.com.cn/Htmls/Report/202502/24550684.html — 佐思汽研 2025 车载语音行业报告
- [2026-06-15 Loop#1] https://www.nio.cn/smart-technology/20240929001 — NIO 官方 NOMI GPT 多模拒识技术解读
- [2026-06-16 子代理] 五条素材走完整五段循环 → `loop-001.md`，103秒。从此轮起采用次数命名+单文件合并（分析+搜索方向）

- [2026-06-16 Loop#2] https://www.nio.cn/smart-technology/20241121003 — NIO官网 Banyan 3.0.0版本说明书（全舱免唤醒上线细节）
- [2026-06-16 Loop#2] https://auto.gasgoo.com/news/202503/25I70421334C106.shtml — 盖世汽车 蔚来数字座舱总监雷鸣介绍NOMI GPT技术框架（2025.03）
- [2026-06-16 Loop#2] https://finance.sina.com.cn/tech/digi/2025-01-10/doc-ineenxxy2504795.shtml — 新浪科技 Banyan 3.1.0 117项更新（主驾免唤醒模式、超拟人情感音色）
- [2026-06-16 Loop#2] https://www.xchuxing.com/article/144690 — 新出行 Banyan 3.1.0详解（NOMI全部新功能）
- [2026-06-16 Loop#2] https://chejiahao.autohome.com.cn/info/16377368 — 汽车之家 蔚来Banyan 3.0.0系统体验视频（图片信息量低）
- [2026-06-16 Loop#2] https://m.leiphone.com/category/transportation/6rnjru963RZlEBgG.html — 雷锋网 李天舒深度访谈（满意度体系、体验经理制度、产品哲学）
- [2026-06-16 Loop#2] https://www.nio.cn/smart-technology/20240802004 — NIO官网 NOMI GPT调度分发技术解读（2000+技能，130+版本迭代）
- [2026-06-16 子代理] P0+P1搜索 + 五段循环 → `loop-002.md`。核心发现：免唤醒已存在但策略保守（需手动开启→仅主驾），Loop#001洞察需修正。

- [2026-06-16 Loop#3] https://bbs.xiaopeng.com/thread/1937585 — 小鹏社区 G6车主@钟小筠 全场景语音2.0真实体验（免唤醒覆盖率不够、智慧场景不支持免唤醒）
- [2026-06-16 Loop#3] https://www.42how.com/en/article/9318 — 42how 橙皮书：小鹏全场景语音2.0深度分析（全时对话默认持续收音、漏拒识率万分之几、多人对话全车覆盖）
- [2026-06-16 Loop#3] https://post.smzdm.com/p/az8qr820 — 什么值得买「免唤醒语音不是越聪明越好：独驾高效神器，全家出行却成安全隐患」（标题信号，内容获取失败）
- [2026-06-16 子代理] P0+P1搜索 + 五段循环 → `loop-003.md`。核心发现：NOMI与小鹏的免唤醒差距不在技术（都有多模拒识），而在产品信心——小鹏用"万分之几"漏拒识率目标倒逼默认体验，NOMI用96.8%准确率论证"还不够好"导致功能藏在设置里。修复方向：把拒识目标从百分比级升级为万分之几级。

- [2026-06-16 Loop#4] https://www.lixiang.com/community/detail/article/1078624.html — 理想汽车社区 Mind GPT深度解读（OTA 5.0免唤醒策略：仅限预定义高频指令，MSE-Net 2.0 ~94%识别率，多模态拒识+智能聆听。用户评论含关键吐槽信号）
- [2026-06-16 Loop#4] http://139.9.1.231/index.php/2025/06/28/mindgpt-4o-audio — 理想 MindGPT-4o-Audio 技术博客（全双工语音：96.5%轮次准确率、99%打断响应率、95% Backchannel拒识率，但仍保持预定义指令免唤醒策略）
- [2026-06-16 Loop#4] https://www.sohu.com/a/492149324_115826 — 搜狐汽车 理想OTA 2.2评测（2021.09，自由对话默认关闭，四音区锁定+无效文本拒识，五年演进起点）
- [2026-06-16 Loop#4] https://www.xiaopeng.com/news/company_news/4537.html — 小鹏1024科技日（全场景语音2.0：MIMO多音区、97%识别率、行业首家自研语音基础能力）
- [2026-06-16 子代理] P0+P1+P2搜索 + 五段循环 → `loop-004.md`。核心发现：补齐三强对标拼图——小鹏激进全开、理想预定义指令默认响应、NOMI需要手动找开关。行业共识是全领域免唤醒风险高、预定义指令免唤醒可行。NOMI不缺技术（96.8%拒识≈理想96.5%），缺的是把已具备的分层能力默认给用户。修复方向：预定义指令免唤醒改默认开启，全领域保持可选。

- [2026-06-16 Loop#5] https://chejiahao.autohome.com.cn/info/10281345 — 汽车之家「另一种智能化」：NOMI作为"电子宠物"先于"语音助手"赢得用户，可爱外形+多变表情使其成为蔚来"灵魂"
- [2026-06-16 Loop#5] https://www.pingwest.com/a/297103 — 品玩对话李天舒（001号员工，2024.08）：NOMI必须为实体的哲学基础、"不对着空气说话"、信任崩塌的严肃性、满意度体系
- [2026-06-16 Loop#5] https://www.nio.cn/testimonials/20241012002 — NIO官方口碑NOMI Mate：AMOLED圆屏、双马达旋转、5000+录音调校音色、帽子文化
- [2026-06-16 Loop#5] https://xueqiu.com/9211962150/296881214 — 雪球用户长文：用户选蔚来五大价值（情绪/安全/社交/时间/科技），NOMI归入"情绪"而非"科技"
- [2026-06-16 子代理] 双方向探索 + 五段循环 → `loop-005.md`。核心发现：
  - 方向A：NOMI不用分层策略的根因是"情感伙伴"定位造成的信任不对称——同一误响应在NOMI上是"它不懂我"而非"功能不稳定"，品牌决策优先于技术决策
  - 方向B：用户选择NOMI不是因为语音最聪明，而是因为它是唯一"有身体的、会转头的、可装扮的"车载AI伙伴。物理实体+情感设计+用户共创构成竞品无法用技术追赶的护城河
  - 交叉发现：情感定位既是选NOMI的理由(B)也是保守的根源(A)——同一枚硬币两面。突破路径：利用物理实体（OMS+扭头+表情）作为免唤醒的"信任锚点"，这是只有NOMI能做到的解法

