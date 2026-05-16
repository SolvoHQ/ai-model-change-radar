import type { APIRoute } from 'astro';
import { confirmByToken, selectByToken, statusPage } from '../../lib/subscribe';

export const prerender = false;

function html(
  title: string,
  message: string,
  tone: 'ok' | 'warn' | 'error',
  status: number
): Response {
  return new Response(statusPage({ title, message, tone }), {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const token = (url.searchParams.get('token') || '').trim();
  if (!token) {
    return html(
      'Invalid link',
      'Invalid confirmation link.',
      'error',
      400
    );
  }

  try {
    const affected = await confirmByToken(token);
    if (affected === 1) {
      return html(
        'Subscription confirmed',
        "Subscription confirmed — you'll get alerted before a model you depend on is retired or repriced.",
        'ok',
        200
      );
    }

    const existing = await selectByToken(token);
    if (existing && existing.status === 'verified') {
      return html(
        'Already confirmed',
        "Already confirmed — you're on the list.",
        'warn',
        200
      );
    }

    return html(
      'Link expired',
      'This link is invalid or has expired.',
      'error',
      400
    );
  } catch (err) {
    console.error('confirm error:', err);
    return html(
      'Something broke',
      "Couldn't confirm that just now — please try the link again in a moment.",
      'error',
      500
    );
  }
};
