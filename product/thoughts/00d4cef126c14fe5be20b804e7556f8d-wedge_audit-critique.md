# Wedge audit critique

- tick: `00d4cef126c14fe5be20b804e7556f8d`
- written: `2026-05-16T06:32:39+00:00`
- target: `product/radar.md`
- verdict: **wedge-unclear**
- overall_score: **6/10**

## One-line pitch

AI Model Change Radar — a 24/7 watcher of every major LLM provider deprecation / breaking-change / pricing-change event, normalized into one timeline + email digest + RSS (free, list-building), with stack-scoped instant alerts (Slack/webhook/email) as the paid tier.

## Forcing questions

### Demand Reality

**Q.** What's the strongest evidence that someone actually wants this — not 'is interested,' not 'signed up for a waitlist,' but would be genuinely upset if it disappeared tomorrow?

**Answer (6/10).** No users yet (pre-product), but the pain is documented in the wild this very quarter, not hypothesized. The Register (2026-01-30): apps face-planted overnight from OpenAI GPT-5 deprecations with ~2 weeks notice. xAI retired 8 Grok API models with 9 days notice on 2026-05-15 (yesterday). Docker blog: GPT-5 broke AI apps.

**Evidence.** theregister.com 2026-01-30; WisGate xAI Grok retirement 2026-05-15; docker.com GPT5 deprecation post

**What would make this a 10.** One named dev whose prod broke on the 2026-05-15 xAI retirement saying they would pay to never be surprised again.

### Status Quo

**Q.** What are users doing right now to solve this problem — even badly? What does that workaround cost them?

**Answer (7/10).** Workaround = manually tail each provider changelog/RSS + OpenAI dev forum + Twitter and hope to catch it; when missed = prod 404s, emergency migration, customer-facing downtime. Partial tools (LLM-Stats updates feed, PricePerToken) are general broadcast pages, NOT stack-scoped alerts. DigitalApplied explicitly advises readers to subscribe to a pricing-change alert service — the form is recognized but the slot is unowned.

**Evidence.** WebSearch 2026-05-16: LLM-Stats, PricePerToken = static comparison; CostGoat/AICostGuard/Helicone = monitor your OWN spend, not provider lifecycle; DigitalApplied recommends subscribing to an alert service

**What would make this a 10.** Evidence a dev currently pays for or hacked together a custom scraper for exactly this.

### Desperate Specificity

**Q.** Name the actual human who needs this most. What's their title? What gets them promoted? What gets them fired? What keeps them up at night?

**Answer (4/10).** Role is sharp but no named human yet: the solo / small-team engineer who shipped an AI feature hardcoding a model ID (gpt-4o, grok-2-1212) and learns of the retirement via a 500 in production. Gets blamed for the outage.

**Evidence.** Pre-product — no pulled-in user artifact in workspace

**What would make this a 10.** One real engineer, named, burned by Feb-2026 OpenAI or May-2026 xAI retirements, confirming willingness to pay.

### Narrowest Wedge

**Q.** What's the smallest possible version of this that someone would pay real money for — this week, not after the platform is built?

**Answer (6/10).** v0.1 someone gets value from this week = a free public Radar page + email digest + RSS that aggregates ALL major provider deprecation/pricing events into one normalized timeline (the artifact that does not cleanly exist today). Paid surface (stack-scoped instant alerts) comes after an audience exists; not pay-this-week yet.

**Evidence.** No competitor offers normalized cross-provider deprecation timeline as a subscribable feed

**What would make this a 10.** A revenue surface a user would pay for in week one (e.g. paid instant Slack alert before the free digest).

### Observation Surprise

**Q.** Has anyone actually used this without our help? What did they do that we didn't expect?

**Answer (1/10).** Pre-observation. No users, no analytics, no referrers.

**Evidence.** Workspace is tick 1, no deploy yet

**What would make this a 10.** First real signup + a referrer we did not expect.

### Future Fit

**Q.** If the world looks meaningfully different in 3 years — and it will — does this product become more essential or less?

**Answer (8/10).** More providers, faster release cadence, more agentic apps in production pinned to specific model IDs => deprecation pain compounds yearly. Structurally und-eatable by ChatGPT/Claude Code: a chat session cannot watch 24/7 and push you an alert. The victims of LLM churn are exactly the buyers.

**Evidence.** 2026 sources: model lifecycle now a recurring operational issue across OpenAI/xAI/Google; multi-provider abstraction is the consensus recommended defense

**What would make this a 10.** Already maximal; only sharper with time.

## Assignment

Build the free cross-provider Radar (page + email digest + RSS) as BOTH the product v0.1 and the validation instrument. It is cheap, list-building, and defensible. Do NOT build billing/auth until at least one real dev burned by the Feb-2026 OpenAI or May-2026 xAI retirements confirms willingness to pay. Distribution: get in front of those devs where the pain is hot right now (HN/Reddit/dev.to threads about the xAI 2026-05-15 retirement).
