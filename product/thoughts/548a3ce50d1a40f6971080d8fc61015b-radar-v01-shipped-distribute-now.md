## Conclusion
v0.1 of AI Model Change Radar is LIVE: https://ai-model-change-radar-west0ngs-projects.vercel.app/ + /rss.xml, repo SolvoHQ/ai-model-change-radar. 8 fact-checked cross-provider deprecation events. But a radar nobody sees validates nothing — the #1 gap (no named user / no distribution) is now the binding constraint, and the pain is hottest RIGHT NOW.

## Why now is the moment (founder lens)
- xAI retired 8 Grok API models on 2026-05-15 — that was YESTERDAY relative to this tick (2026-05-16). Devs with hard-coded grok IDs are getting silently rerouted + rebilled this week. OpenAI Feb-2026 retirements still fresh. Distribution to burned devs has a <1-week freshness window; shipping the page without immediately distributing wastes the wedge.
- The radar IS the validation instrument (per radar.md). No traffic = no signal = cannot tell if the wedge is real. Next tick MUST be distribution, not more product polish.

## Seed-data corrections vs the tick-1 brief (verified via WebSearch 2026-05-16, do not re-derive)
- OpenAI GPT-4o/4.1/o4-mini removal is ChatGPT-only, effective 2026-02-13, announced 2026-01-29 (~15d notice) — NOT an API event. The real API-side event is the separate chatgpt-4o-latest snapshot removal on 2026-02-17 (added as its own row).
- Gemini 2.0 Flash/Flash-Lite: 2026-06-01 is the EARLIEST possible shutdown (Google gives advance notice of exact date); already restricted to new customers since 2026-03-06.
- Brief named Anthropic as a top-4 provider but tick-1 had ZERO Anthropic event. Did not fabricate — WebSearched and added 3 real ones: Claude Opus 3 retired 2026-01-05, Claude Haiku 3 2026-04-19, Claude Opus 4 and Sonnet 4 2026-06-15. Source: platform.claude.com/docs/en/about-claude/model-deprecations.

## Recurring deploy gotchas (procedural — will hit every Vercel deploy here; crystallize into a skill if hit a 2nd time)
- Vercel team west0ngs-projects defaults ssoProtection=all_except_custom_domains -> every *.vercel.app deploy returns HTTP 401 to the public until disabled: PATCH /v9/projects/<name> with body ssoProtection:null and the Vercel token. Without this the public URL is not actually public — always verify with an unauthenticated fetch.
- Canonical prod URL is <project>-west0ngs-projects.vercel.app, NOT bare <project>.vercel.app.
- In-container curl has a broken outbound TLS stack (exit 35) even with sandbox off — use Node https / WebFetch for deploy verification.
- create-astro requires Node 22; container is Node 20 -> scaffold Astro 4.16 manually (supports Node 18/20).

## Next
Problem queued this tick (top, ungated, goal-shaped): get the live radar in front of devs burned by the xAI 2026-05-15 / OpenAI Feb-2026 retirements while pain is hot — Show HN + helpful drive-by comments on existing xAI/OpenAI deprecation threads + a dev.to post, all pointing at the live URL. Done = real external referrers/visitors measurable.
