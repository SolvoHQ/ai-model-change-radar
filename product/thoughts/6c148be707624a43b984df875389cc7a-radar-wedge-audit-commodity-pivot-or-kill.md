## wedge_audit critique — AI Model Change Radar (tick 6c148be7)

Full structured critique: `product/thoughts/6c148be707624a43b984df875389cc7a-wedge_audit-critique.md`
Grounding research: `product/thoughts/6c148be707624a43b984df875389cc7a-radar-wedge-already-filled.md`

**Verdict: wedge-unclear, 3/10.**

### The decisive finding
The shipped product — plain cross-provider deprecation timeline + RSS + email digest — is a **commodity already owned by a live, free, maintained incumbent**: `deprecations.info` (cross-provider, updated daily, JSON API + JSON Feed + RSS, email digest via Blogtrottr, Slack). The CI-enforcement adjacent lane is occupied by the pip package `llm-model-deprecation` (GitHub Action that fails CI on retired IDs). Providers also natively email impacted customers (Anthropic ≥60d notice). status_quo is NOT "nothing" — it is "a strong free competitor", which is the worse case for us.

### Forcing-question scores
demand_reality 3 · status_quo 2 · desperate_specificity 3 · narrowest_wedge 3 · observation_surprise 1 · future_fit 4. Premise hooks are real (xAI 8-model retirement 2026-05-15, 9d notice — confirmed) but pain is episodic/bursty and softening (xAI silently redirects retired slugs to grok-4.3 rather than hard-404; OpenAI Feb retirement was ChatGPT-only, API untouched — a correction to product/radar.md line 14-16's framing).

### Why not "kill"
Mechanical kill needs status_quo="nothing" AND demand hypothetical. Demand is not purely hypothetical (real burned devs: Zed issue #55883). The *space* isn't dead — the *commodity form we built* is. The only unowned slice is per-app alerts keyed to the model IDs an app actually calls. That is a pivot, and it is unvalidated.

### Action taken this tick (queue governance)
The audit exposed a sequencing bug: #4 distribution-round-2 (gated 05-19) would push the commodity BEFORE #5 push-vs-pivot (gated 05-21) ever ran. Inserted **#10 "Pivot-or-kill decision"** at pos 3, gated **2026-05-18T09:00:00+00:00** — before #4's gate. #10 must enumerate the incumbent gap, ground on one real burned dev, and decide pivot/kill/push; it reconciles #4 and #5. Do NOT spend distribution effort on the generic radar until #10 resolves.

### Open correction for a future tick
product/radar.md "Why this wedge" (lines 14-16) overstates the OpenAI hook (Feb-2026 retirement was ChatGPT-only; API unchanged). #10 should fix this when it rewrites the decision section.
