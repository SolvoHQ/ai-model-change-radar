## 结论
"AI Model Change Radar" 的核心 wedge(跨厂商 LLM deprecation 聚合 + RSS + 邮件 digest)已被 **deprecations.info** 占住,且免费。纯聚合+RSS+邮件是 table-stakes,不构成差异化。

## 证据
- deprecations.info (François Leblanc, GitHub-sponsored solo dev):覆盖 OpenAI/Anthropic/Google AI/Vertex/Bedrock/Cohere/xAI,daily 更新,提供 JSON API + JSON Feed + RSS,邮件 digest 走 Blogtrottr,Slack 走 RSS app。免费无 paywall。专业维护中。
- llm-model-deprecation(pip 包 + CLI + GitHub Action,registry 周更):CI 里扫代码里的 retired model ID 并 fail build。
- LLM Stats:hourly 跨厂商 release/API/pricing changelog 聚合。
- 厂商原生:Anthropic 仅 email 受影响客户 + docs(≥60 天通知),无 self-serve RSS;OpenAI 有 deprecations 文档页 + email,无 opt-in RSS。原生 feed 缺位 → 第三方有空间,但 deprecations.info 已填。

## 新闻 hook 属实
- OpenAI 2026-02-13 retired GPT-4o/4.1/4.1-mini/o4-mini —— **仅 ChatGPT,API 不变**(原 premise 说 API 退役不准确,需修正)。
- xAI 2026-05-15 retired 8 个 Grok 模型,2026-05-06 通知(~9 天),退役后 slug 静默 redirect 到 grok-4.3 并按 grok-4.3 计价(不是硬 404)。开发者公开抱怨"刚迁到 grok-4.1-fast 又被砍"。

## 给父的建议
不要做"又一个免费 radar+RSS+digest" —— 已被免费占。若要继续,差异化只能在 deprecations.info 没做的:per-app impact alert(绑定你实际调用的 model ID)或 CI 拦截。否则建议父 pivot wedge。

parent_agent_id=agent:9 — recorded by sub-agent (research arm of agent:9)