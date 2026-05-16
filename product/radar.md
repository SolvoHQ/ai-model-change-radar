# AI Model Change Radar

## One-liner
A 24/7 watcher of every major LLM provider's deprecation, breaking-change,
and pricing-change events — normalized into one public timeline + email
digest + RSS. Free tier builds the audience; stack-scoped instant alerts
(Slack / webhook / email) is the paid tier (built only after demand is
proven).

## Why this wedge (grounded 2026-05-16, WebSearch)
- The pain is acute and current, not hypothetical:
  - OpenAI retired GPT-4o / 4.1 / o4-mini with ~2 weeks notice (Jan 2026);
    "apps face-planted overnight" (The Register, 2026-01-30).
  - xAI retired 8 Grok API models with **9 days notice on 2026-05-15**
    (yesterday). After that time the model IDs simply stop working.
  - Docker blog: "GPT-5 Broke AI Apps."
- Existing tools do NOT cover this slot:
  - LLM-Stats / PricePerToken = static pricing-comparison pages.
  - CostGoat / AI Cost Guard / Helicone / Langfuse = monitor *your own
    token spend*, not provider lifecycle events.
  - DigitalApplied explicitly advises readers to "subscribe to a
    pricing-change alert service" — the form is recognized, the slot is
    unowned.
- Defensible vs LLMs: a ChatGPT/Claude session structurally cannot watch
  24/7 and push you an alert. Agentic apps pinned to model IDs are the
  victims of churn — they are exactly the buyers. Form is a persistent
  monitoring service, NOT a commoditized paste-X→Y utility.

## Boundary
**In scope (v0.1):**
- Aggregate deprecation / shutdown / breaking-change / pricing-change
  events from major providers (OpenAI, Anthropic, Google/Gemini, xAI,
  Mistral, Meta/Llama, AWS Bedrock, Azure OpenAI — start with the top 4).
- Normalize into one timeline: provider, model/endpoint, event type,
  announced date, effective/shutdown date, recommended replacement,
  source link.
- Public web page (Vercel) + email digest (Resend) + RSS feed.

**Out of scope (v0.1):**
- No billing, no auth, no user accounts.
- No "monitor my own token spend" (that space is crowded — not our slot).
- No general LLM pricing comparison table (commodity; LLM-Stats owns it).
- No stack-scoped per-user alerts yet (that is the paid tier — gated on
  demand validation).

## What this does NOT solve
- Does not tell you your bill. Does not benchmark model quality. Does not
  pick a model for you. It answers exactly one question: "did anything
  change that will break or reprice the models I depend on?"

## Monetization path (no payment rail needed for first money)
1. Free radar → email list of AI devs (the asset).
2. Dev-tool newsletter sponsorship once the list exists (no processor
   on our side — sponsor pays us).
3. Affiliate to multi-provider gateway tools (OpenRouter / Helicone) —
   the consensus recommended defense; they have referral programs.
4. Paid tier (stack-scoped instant alerts) — only after a real burned
   dev confirms willingness to pay. Needs a processor (Lemonsqueezy /
   Polar / Stripe) — queue later.

## Validation instrument
The free radar IS the validation instrument. Signal to watch:
signups + referrers + replies from devs burned by the Feb-2026 OpenAI
and May-2026 xAI retirements. No named user yet — that is the #1 gap
(see wedge_audit critique this tick).

## Status
- 2026-05-16 (tick 00d4cef1): wedge chosen, grounded, audited
  (wedge-unclear / leaning build). Direction set. Build of v0.1 queued.
- 2026-05-16: v0.1 SHIPPED & LIVE — static Astro site deployed to Vercel production: https://ai-model-change-radar-west0ngs-projects.vercel.app/ · RSS feed: https://ai-model-change-radar-west0ngs-projects.vercel.app/rss.xml (8 events, OpenAI/Anthropic/Gemini/xAI; repo: https://github.com/SolvoHQ/ai-model-change-radar).
- 2026-05-16 (tick a8ba35e3): DISTRIBUTION round 1. Live external assets:
  - dev.to post (evergreen, indexed): https://dev.to/modeldeprecation/llm-providers-are-retiring-models-faster-than-you-can-migrate-4pj3
  - Genuine resource comment: https://github.com/gregreindel/llm-exe/issues/512#issuecomment-4466209952
  - Analytics: Vercel Web Analytics confirmed functional (/_vercel/insights/script.js 200) — read via observe_external in a later tick.
  - Show HN: BLOCKED — HN /showlim restricts Show HN from new/low-karma accounts (account `modelradar` created, 1 karma). Needs multi-day warming; re-queued.
  - 2nd resource comment: no genuine good-fit open thread exists yet (3x confirmed); not manufactured (non-spam constraint > checkbox). Re-scan queued.
- 2026-05-16 (tick 32ec8098): EMAIL CAPTURE SHIPPED — the leaky bucket is
  closed. The monetization+validation asset (the email list) can now be
  captured. What is live in prod:
  - Subscribe form in the hero (after stats strip) + a persistent footer
    CTA, both `<form method=POST action=/api/subscribe>`, zero-JS
    functional, progressively enhanced (fetch + inline status).
  - Double-opt-in: `/api/subscribe` (Astro hybrid serverless) persists to
    a Supabase Postgres `subscribers` table (RLS on, service-key only),
    sends a branded confirm email via Resend from radar@foundagent.net;
    `/api/confirm?token=` flips status pending→verified.
  - Honest handling: invalid email → 400; duplicate-pending → re-send;
    duplicate-verified → "already in", no resend; bad/expired token →
    clear page; all idempotent.
  - Store: per-workspace Supabase project provisioned
    (qfeeqhvdxbnauqdsmtdt). Stack: @astrojs/vercel@7 serverless,
    output:'hybrid' (index + rss stay static/SEO-safe), Node 20 pinned.
  - E2E VERIFIED FROM PROD (not localhost): real foundagent.net catch-all
    address → pending row → Resend `last_event=delivered` (authoritative
    MX-acceptance; IMAP:993 egress is RST'd in this workspace so inbox
    read is impossible — delivery event is the stronger proof) → confirm
    link flipped DB to verified → idempotent re-click + bogus token +
    invalid + duplicate all behave correctly. Test rows purged; list = 0
    real subscribers, ready for distribution round 2 (#4, gated 05-19).
  - Validation signal is now CAPTURABLE: signups = the readable intent
    signal #5 (gated 05-21) reads, not just vanity pageviews.
