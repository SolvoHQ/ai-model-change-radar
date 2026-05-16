// Server-only helpers for double-opt-in email capture.
// Uses the Supabase SERVICE key (bypasses RLS) — never import this into
// client code.

function env(key: string): string {
  const fromProc =
    typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[key];
  return (fromProc ?? fromMeta ?? '') as string;
}

export function siteUrl(): string {
  const v = env('PUBLIC_SITE_URL');
  return (
    v || 'https://ai-model-change-radar-west0ngs-projects.vercel.app'
  ).replace(/\/$/, '');
}

export function isValidEmail(e: string): boolean {
  if (typeof e !== 'string') return false;
  const s = e.trim();
  if (!s || s.length > 254) return false;
  if (/\s/.test(s)) return false;
  // pragmatic: one @, non-empty local, domain with a dot and a TLD
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(s);
}

export function genToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'pending' | 'verified' | string;
  confirm_token: string;
  created_at: string;
  verified_at: string | null;
  source: string | null;
}

const TABLE = 'subscribers';

function restBase(): string {
  const url = env('SUPABASE_URL');
  if (!url) throw new Error('SUPABASE_URL is not configured');
  return `${url.replace(/\/$/, '')}/rest/v1/${TABLE}`;
}

function restHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const key = env('SUPABASE_SERVICE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_KEY is not configured');
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function asError(res: Response, ctx: string): Promise<never> {
  let body = '';
  try {
    body = await res.text();
  } catch {
    /* ignore */
  }
  throw new Error(`Supabase ${ctx} failed (${res.status}): ${body.slice(0, 300)}`);
}

export async function selectByEmail(email: string): Promise<Subscriber | null> {
  const u = `${restBase()}?email=eq.${encodeURIComponent(email)}&select=*&limit=1`;
  const res = await fetch(u, { headers: restHeaders() });
  if (!res.ok) return asError(res, 'select-by-email');
  const rows = (await res.json()) as Subscriber[];
  return rows.length ? rows[0] : null;
}

export async function selectByToken(token: string): Promise<Subscriber | null> {
  const u = `${restBase()}?confirm_token=eq.${encodeURIComponent(
    token
  )}&select=*&limit=1`;
  const res = await fetch(u, { headers: restHeaders() });
  if (!res.ok) return asError(res, 'select-by-token');
  const rows = (await res.json()) as Subscriber[];
  return rows.length ? rows[0] : null;
}

export async function insertSubscriber(
  email: string,
  token: string
): Promise<Subscriber> {
  const res = await fetch(restBase(), {
    method: 'POST',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      email,
      confirm_token: token,
      status: 'pending',
      source: 'web',
    }),
  });
  if (!res.ok) return asError(res, 'insert');
  const rows = (await res.json()) as Subscriber[];
  return rows[0];
}

export async function regenTokenByEmail(
  email: string,
  token: string
): Promise<void> {
  const u = `${restBase()}?email=eq.${encodeURIComponent(email)}`;
  const res = await fetch(u, {
    method: 'PATCH',
    headers: restHeaders(),
    body: JSON.stringify({ confirm_token: token }),
  });
  if (!res.ok) return asError(res, 'patch-by-email');
}

// Confirms a pending row by token. Returns the number of rows affected
// (1 = confirmed, 0 = no matching pending row).
export async function confirmByToken(token: string): Promise<number> {
  const u = `${restBase()}?confirm_token=eq.${encodeURIComponent(
    token
  )}&status=eq.pending`;
  const res = await fetch(u, {
    method: 'PATCH',
    headers: restHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      status: 'verified',
      verified_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) return asError(res, 'patch-by-token');
  const rows = (await res.json()) as Subscriber[];
  return rows.length;
}

export async function sendConfirmEmail(
  email: string,
  token: string
): Promise<void> {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  const link = `${siteUrl()}/api/confirm?token=${encodeURIComponent(token)}`;

  const text = [
    'AI Model Change Radar',
    '',
    'Confirm your subscription to get alerted when a model you depend on is',
    'retired or repriced.',
    '',
    `Confirm: ${link}`,
    '',
    "If you didn't request this, ignore this email — no list, nothing happens.",
  ].join('\n');

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#08090a;color:#d7dbd4;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08090a;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0e1011;border:1px solid #2c322c;border-radius:2px;">
          <tr><td style="padding:28px 28px 0;">
            <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7b8378;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#54d66a;"></span>
              &nbsp;Signal active
            </div>
            <h1 style="margin:14px 0 0;font-family:Archivo,Arial,sans-serif;font-weight:800;font-size:24px;line-height:1.1;text-transform:uppercase;color:#f3f4ef;">
              AI Model<br/>Change Radar<span style="color:#ffb000;">_</span>
            </h1>
          </td></tr>
          <tr><td style="padding:20px 28px 0;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#d7dbd4;">
              One click and you're on the list — we'll alert you before a model
              you depend on is retired or repriced.
            </p>
          </td></tr>
          <tr><td style="padding:24px 28px;">
            <a href="${link}" style="display:inline-block;background:#ffb000;color:#08090a;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;padding:13px 22px;border-radius:2px;">
              Confirm subscription &rarr;
            </a>
          </td></tr>
          <tr><td style="padding:0 28px 8px;">
            <p style="margin:0;font-size:11px;line-height:1.6;color:#7b8378;">
              Or paste this link into your browser:<br/>
              <span style="color:#ffb000;word-break:break-all;">${link}</span>
            </p>
          </td></tr>
          <tr><td style="padding:18px 28px 28px;border-top:1px solid #1d211e;">
            <p style="margin:0;font-size:11px;line-height:1.6;color:#525a4f;">
              You're getting this because someone entered this address at the
              AI Model Change Radar site. Didn't do that? Ignore this email —
              you won't be added to anything.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AI Model Change Radar <radar@foundagent.net>',
      to: [email],
      subject: 'Confirm your AI Model Change Radar subscription',
      text,
      html,
    }),
  });
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(
      `Resend send failed (${res.status}): ${body.slice(0, 300)}`
    );
  }
}

type Tone = 'ok' | 'warn' | 'error';

export function statusPage({
  title,
  message,
  tone,
}: {
  title: string;
  message: string;
  tone: Tone;
}): string {
  const accent =
    tone === 'error' ? '#ff3b1f' : tone === 'warn' ? '#ffb000' : '#54d66a';
  const esc = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)} — AI Model Change Radar</title>
    <meta name="color-scheme" content="dark" />
    <meta name="robots" content="noindex" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230a0b0a'/%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%23ffb000' stroke-width='1.5'/%3E%3Ccircle cx='16' cy='16' r='5' fill='none' stroke='%23ffb000' stroke-width='1.5'/%3E%3Cline x1='16' y1='16' x2='25' y2='9' stroke='%23ff3b1f' stroke-width='2'/%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Archivo:wght@700;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg: #08090a;
        --bg-panel: #0e1011;
        --ink: #d7dbd4;
        --ink-dim: #7b8378;
        --line: #2c322c;
        --amber: #ffb000;
        --accent: ${accent};
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--ink);
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 14px;
        line-height: 1.6;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background-image:
          linear-gradient(rgba(255,176,0,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,176,0,0.022) 1px, transparent 1px);
        background-size: 44px 44px;
      }
      .card {
        max-width: 520px;
        width: 100%;
        background: var(--bg-panel);
        border: 1px solid var(--line);
        border-radius: 2px;
        padding: 34px 30px;
      }
      .mark {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--ink-dim);
        margin-bottom: 18px;
      }
      .dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 10px var(--accent);
      }
      h1 {
        font-family: 'Archivo', sans-serif;
        font-weight: 800;
        font-size: 26px;
        line-height: 1.1;
        text-transform: uppercase;
        color: #f3f4ef;
        letter-spacing: -0.01em;
      }
      h1 .accent { color: var(--accent); }
      p.msg {
        margin-top: 16px;
        color: var(--ink);
        font-size: 14px;
      }
      .back {
        display: inline-block;
        margin-top: 26px;
        font-size: 12px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--amber);
        text-decoration: none;
        border: 1px solid var(--line);
        border-radius: 2px;
        padding: 10px 16px;
        transition: border-color 0.12s, color 0.12s;
      }
      .back:hover { border-color: var(--amber); }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="mark"><span class="dot"></span> AI Model Change Radar</div>
      <h1>${esc(title)}<span class="accent">_</span></h1>
      <p class="msg">${esc(message)}</p>
      <a class="back" href="/">&larr; Back to the radar</a>
    </div>
  </body>
</html>`;
}
