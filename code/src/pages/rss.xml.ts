import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { events, meta } from '../lib/data';

export async function GET(context: APIContext) {
  const site = (meta.site_url || context.site?.toString() || 'https://ai-model-change-radar.vercel.app').replace(/\/$/, '');

  return rss({
    title: meta.title,
    description: meta.tagline,
    site,
    items: events.map((e) => {
      const pub = e.announced_date || e.effective_date;
      const [y, m, d] = pub.split('-').map(Number);
      return {
        title: `${e.provider}: ${e.title}`,
        link: e.source_url,
        pubDate: new Date(Date.UTC(y, m - 1, d)),
        description:
          `${e.impact} Replacement: ${e.replacement} Source: ${e.source_url}`,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
