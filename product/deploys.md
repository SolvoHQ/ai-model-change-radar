# Deploys

## ai-model-change-radar

- **2026-05-16** — Host: **Vercel** (chosen: Astro static site, zero-config,
  built-in @astrojs/rss; default host per deploy skill).
  - Production URL: https://ai-model-change-radar-west0ngs-projects.vercel.app/
  - RSS: https://ai-model-change-radar-west0ngs-projects.vercel.app/rss.xml
  - Vercel project: `ai-model-change-radar` (team `west0ngs-projects`).
    Initially auto-named `code` from the dir, renamed via
    `vercel project rename`.
  - Notes / gotchas:
    - `create-astro` requires Node 22; container is Node 20. Scaffolded
      package.json manually with Astro 4.16 (Node 18/20 supported).
    - Vercel CLI in non-interactive mode requires explicit `--scope`
      (`west0ngs-projects`) — no default team applied.
    - **Deployment Protection blocker**: the team enables `ssoProtection`
      (`all_except_custom_domains`) by default, so every `*.vercel.app`
      deployment returned HTTP 401 to the public. Disabled via API:
      `PATCH /v9/projects/ai-model-change-radar` with
      `{"ssoProtection": null}`. Site public after that.
    - No bare `ai-model-change-radar.vercel.app` subdomain (not owned by
      team); canonical is the `-west0ngs-projects` alias. astro `site`
      config + events.json `meta.site_url` set to the real alias so RSS
      links are canonical.
    - In-container `curl` fails outbound TLS (egress proxy: "unexpected
      eof while reading"); verified instead via Node `https` (works) and
      the WebFetch tool.
