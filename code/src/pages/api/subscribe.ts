import type { APIRoute } from 'astro';
import {
  isValidEmail,
  genToken,
  selectByEmail,
  insertSubscriber,
  regenTokenByEmail,
  sendConfirmEmail,
  statusPage,
} from '../../lib/subscribe';

export const prerender = false;

type State = 'invalid' | 'pending' | 'resent' | 'already_verified' | 'error';

function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') || '').includes('application/json');
}

function reply(
  request: Request,
  opts: { ok: boolean; state: State; message: string; status: number }
): Response {
  const { ok, state, message, status } = opts;
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok, state, message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const tone =
    state === 'error' || state === 'invalid'
      ? 'error'
      : state === 'already_verified'
        ? 'warn'
        : 'ok';
  const title =
    state === 'error'
      ? 'Something broke'
      : state === 'invalid'
        ? 'Check that address'
        : state === 'already_verified'
          ? "You're already in"
          : 'Check your inbox';
  return new Response(statusPage({ title, message, tone }), {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  try {
    const form = await request.formData();
    email = String(form.get('email') ?? '')
      .trim()
      .toLowerCase();
  } catch {
    return reply(request, {
      ok: false,
      state: 'invalid',
      message: "We couldn't read that submission. Please try again.",
      status: 400,
    });
  }

  if (!isValidEmail(email)) {
    return reply(request, {
      ok: false,
      state: 'invalid',
      message: 'That doesn’t look like a valid email address.',
      status: 400,
    });
  }

  try {
    const existing = await selectByEmail(email);

    if (existing && existing.status === 'verified') {
      return reply(request, {
        ok: true,
        state: 'already_verified',
        message: "You're already confirmed — nothing to do.",
        status: 200,
      });
    }

    if (existing && existing.status === 'pending') {
      const token = genToken();
      await regenTokenByEmail(email, token);
      await sendConfirmEmail(email, token);
      return reply(request, {
        ok: true,
        state: 'resent',
        message: 'We re-sent your confirmation link — check your inbox.',
        status: 200,
      });
    }

    const token = genToken();
    await insertSubscriber(email, token);
    await sendConfirmEmail(email, token);
    return reply(request, {
      ok: true,
      state: 'pending',
      message:
        'Almost there — check your inbox and click the confirmation link.',
      status: 200,
    });
  } catch (err) {
    console.error('subscribe error:', err);
    return reply(request, {
      ok: false,
      state: 'error',
      message:
        "Couldn't process that just now — please try again in a moment.",
      status: 500,
    });
  }
};
