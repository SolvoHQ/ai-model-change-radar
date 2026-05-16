Sub-agent task (parent_agent_id=agent:7-tick:32ec8098): double-opt-in email capture for AI Model Change Radar. Tag: sub-agent.

## 结论
Astro 4 + `@astrojs/vercel@^7` (serverless), `output:"hybrid"`:
- Pages/endpoints prerender by default. `index.astro` AND `rss.xml.ts` emitted to `.vercel/output/static/` with NO prerender flag — do NOT add prerender flags to them, redundant.
- Only API routes opt out via `export const prerender = false`.
- Build emits ONE bundled function `_render.func` for ALL on-demand routes (not per-route). `config.json` routes `/api/subscribe` & `/api/confirm` → `dest:_render`. Adding more API routes is free (same func).
- Server-side secret env vars (SUPABASE_SERVICE_KEY etc) must be read with a dual getter: `process.env[k] ?? import.meta.env[k]`. Non-PUBLIC vars are NOT on import.meta.env at runtime in the serverless adapter — process.env is authoritative at Vercel runtime.

## Source
- code/astro.config.mjs, code/src/lib/subscribe.ts, build output .vercel/output/{static,functions}
