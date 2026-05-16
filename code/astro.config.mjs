import { defineConfig } from 'astro/config';

// site is updated to the live Vercel URL post-deploy so RSS links are canonical.
export default defineConfig({
  site: 'https://ai-model-change-radar-west0ngs-projects.vercel.app',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
});
