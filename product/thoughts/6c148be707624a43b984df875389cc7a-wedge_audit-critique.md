# Wedge audit critique

- tick: `6c148be707624a43b984df875389cc7a`
- written: `2026-05-16T09:03:39+00:00`
- target: `product/radar.md`
- verdict: **wedge-unclear**
- overall_score: **3/10**

## One-line pitch

A free public cross-provider LLM deprecation/breaking/pricing timeline + RSS + email digest, list-as-asset, monetized via dev-newsletter sponsorship + gateway affiliate.

## Forcing questions

### Demand Reality

**Q.** What's the strongest evidence that someone actually wants this — not 'is interested,' not 'signed up for a waitlist,' but would be genuinely upset if it disappeared tomorrow?

**Answer (3/10).** Model churn pain is real but episodic/bursty, not a sustained daily wound — and we have ZERO evidence anyone would be upset if OUR radar vanished (0 subscribers, 0 referrer signal). The xAI 2026-05-15 retirement burned real devs (Zed shipped a fix issue), but xAI now SILENTLY redirects retired slugs to grok-4.3 at grok-4.3 pricing rather than hard-404, which softens the break. OpenAI's Feb-2026 retirement backlash was muted (0.1% usage, API untouched).

**Evidence.** product/thoughts/6c148be707624a43b984df875389cc7a-radar-wedge-already-filled.md; github.com/zed-industries/zed/issues/55883; docs.x.ai/developers/migration/may-15-retirement

**What would make this a 10.** One named dev who, after deprecations.info already exists, still says 'that generic feed didn't save me — I need X' and signs up / replies.

### Status Quo

**Q.** What are users doing right now to solve this problem — even badly? What does that workaround cost them?

**Answer (2/10).** The status quo is NOT 'nothing' — it is a strong, free, maintained competitor. deprecations.info (solo dev, GitHub-sponsored) is a near-exact match: cross-provider (OpenAI/Anthropic/Google/Vertex/Bedrock/Cohere/xAI), updated daily, JSON API + JSON Feed + RSS, email digest via Blogtrottr, Slack via RSS, copy-paste Python/TS/Ruby snippets. Adjacent: llm-model-deprecation (pip+CLI+GitHub Action that fails CI on retired IDs) and LLM Stats (hourly changelog). The workaround for a dev costs ~0: subscribe to a free feed that already exists. Providers also email impacted customers natively (Anthropic >=60d, OpenAI email).

**Evidence.** https://deprecations.info/ ; https://platform.claude.com/docs/en/about-claude/model-deprecations ; sub-agent research report this tick

**What would make this a 10.** A documented reason the free incumbent's coverage materially fails a real dev (missed event, wrong replacement, no per-app scoping) that our form structurally fixes.

### Desperate Specificity

**Q.** Name the actual human who needs this most. What's their title? What gets them promoted? What gets them fired? What keeps them up at night?

**Answer (3/10).** Still a category, not a person, w.r.t. OUR product. Closest real exemplar: a Zed engineer who filed 'Update xAI model list ahead of May 15 retirement' — but they SELF-SERVED (shipped their own fix), they did not need a radar. No named human has used or asked for ai-model-change-radar specifically.

**Evidence.** github.com/zed-industries/zed/issues/55883; product/radar.md line 65 already flags 'No named user yet — #1 gap'

**What would make this a 10.** A real burned dev (name/handle) who looked at deprecations.info, found it insufficient for their pinned-model app, and told us what they actually need.

### Narrowest Wedge

**Q.** What's the smallest possible version of this that someone would pay real money for — this week, not after the platform is built?

**Answer (3/10).** The narrowest version of the SHIPPED product — plain cross-provider radar + RSS + email digest — is now a commodity that a free maintained incumbent already ships. The only differentiation candidates are (a) per-app impact alerts keyed to the model IDs an app actually calls, or (b) CI enforcement — but (b) is already occupied by llm-model-deprecation (pip + GitHub Action). So the defensible narrow wedge has shrunk to ONE unproven slice: 'scan your repo / API usage -> alert only on the models YOU call, with a migration diff.' That is no longer what we built; it is a pivot, and it is unvalidated.

**Evidence.** deprecations.info feature surface; PyPI llm-model-deprecation; our current build is the commodity layer (product/radar.md Status)

**What would make this a 10.** A scoped per-app-alert MVP that one real dev confirms they'd pay for / wire into their pipeline this week.

### Observation Surprise

**Q.** Has anyone actually used this without our help? What did they do that we didn't expect?

**Answer (1/10).** Pre-observation. 0 subscribers, distribution round 1 produced one dev.to post + one GitHub comment, no measured referrer/signup behaviour yet. Nothing surprising because nobody is being watched doing anything.

**Evidence.** product/radar.md Status; product/log.md (email capture shipped this tick, list = 0 real subscribers)

**What would make this a 10.** One real session: a dev hits the site from a real referrer and subscribes, or replies to the dev.to post asking for a feature.

### Future Fit

**Q.** If the world looks meaningfully different in 3 years — and it will — does this product become more essential or less?

**Answer (4/10).** Mixed-to-weak. Model churn will continue (tailwind), BUT the acute pain is being smoothed from multiple sides: providers now give longer notice + email impacted customers (Anthropic >=60d), xAI silently redirects instead of hard-breaking, and a free maintained aggregator + a CI-failing pip package already exist. The generic-radar form gets LESS essential over time as the ecosystem self-heals. Only the per-app/CI-scoped form has a credible 3y story, and that lane is partly occupied.

**Evidence.** Anthropic deprecation policy (>=60d notice); xAI silent-redirect behaviour; deprecations.info + llm-model-deprecation both actively maintained

**What would make this a 10.** Evidence that per-app model-dependency drift becomes a worsening, structurally-unowned problem as agentic apps pin more model IDs.

## Assignment

STOP treating the plain radar as the product — it is a commodity already owned by a free, maintained incumbent (deprecations.info: RSS+JSON API+email digest+Slack, updated daily). Before distribution round 2 (#4, gated 05-19) spends ANY effort pushing the commodity, the push-vs-pivot decision (#5) must run FIRST and must answer one concrete question: does the ONE unowned slice — per-app alerts keyed to the model IDs an app actually calls (repo/API-usage scan -> 'you call grok-4-fast, retires in 9 days, here is the migration diff') — get a yes from one real burned dev? Action for the next strategic tick: (1) enumerate exactly what deprecations.info + llm-model-deprecation do and do NOT do; (2) find one named dev (e.g. reply on the Zed xAI issue thread or an HN/Reddit migration-pain post) and ask if per-app scoped alerting is wanted; (3) only if yes, pivot the build to that and re-scope #4 around it; if no, kill the wedge. Distributing the generic radar before this is pushing a me-too free feed.
