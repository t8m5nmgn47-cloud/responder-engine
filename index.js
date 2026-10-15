// @sightline/responder-engine — Astro integration.
//
// A department site consumes this package with a ~6-line astro.config.mjs:
//
//   import engine from '@sightline/responder-engine';
//   export default defineConfig({ site, output: 'static', trailingSlash: 'always',
//     integrations: [engine({ template: 'department' })] });
//
// The integration (a) injects every page of the chosen template as a route,
// (b) aliases `@content/*` -> <site>/content/* and `@siteconfig` -> <site>/site.config.json
// so the template pages can import the site's data, and (c) relies on the layout
// importing the engine's global stylesheet (layouts/Base.astro imports ../styles/global.css),
// which yields byte-identical output to the pre-engine site.

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const PKG = '@sightline/responder-engine';

// Route tables per template. pattern -> file inside templates/<template>/.
// Patterns have no trailing slash; Astro applies the site's trailingSlash setting.
const TEMPLATES = {
  department: [
    ['/', 'index.astro'],
    ['/404', '404.astro'],
    ['/about', 'about.astro'],
    ['/accessibility', 'accessibility.astro'],
    ['/apparatus', 'apparatus.astro'],
    ['/community', 'community.astro'],
    ['/contact', 'contact.astro'],
    ['/escape-plan', 'escape-plan.astro'],
    ['/join', 'join.astro'],
    ['/members', 'members.astro'],
    ['/memorial', 'memorial.astro'],
    ['/news', 'news.astro'],
    ['/responses', 'responses.astro'],
    ['/safety', 'safety.astro'],
    ['/weather', 'weather.astro'],
    ['/support', 'support.astro'],
    ['/youth', 'youth.astro'],
  ],
};

export function templateRoutes(template) {
  const routes = TEMPLATES[template];
  if (!routes) throw new Error(`[${PKG}] unknown template "${template}". Known: ${Object.keys(TEMPLATES).join(', ')}`);
  return routes;
}

export default function engine(options = {}) {
  const template = options.template || 'department';
  const routes = templateRoutes(template);

  return {
    name: PKG,
    hooks: {
      'astro:config:setup'({ config, injectRoute, updateConfig, logger }) {
        const root = fileURLToPath(config.root);
        const contentDir = path.join(root, 'content');
        const siteConfig = path.join(root, 'site.config.json');

        if (!fs.existsSync(contentDir)) logger.warn(`no content/ directory at ${contentDir}`);
        if (!fs.existsSync(siteConfig)) logger.warn(`no site.config.json at ${siteConfig}`);

        // Optional review checklist (0.3.4): when content/review.json exists the template gets a /review page
        // and the draft banner links to it. `@review` resolves to the site's file, or to an empty stub so the
        // layout can import it unconditionally.
        const reviewFile = path.join(contentDir, 'review.json');
        const hasReview = fs.existsSync(reviewFile);
        const reviewAlias = hasReview ? reviewFile : fileURLToPath(new URL('./components/no-review.json', import.meta.url));

        updateConfig({
          vite: {
            resolve: {
              alias: [
                { find: /^@content\/(.*)$/, replacement: path.join(contentDir, '$1') },
                { find: '@siteconfig', replacement: siteConfig },
                { find: '@review', replacement: reviewAlias },
              ],
            },
          },
        });

        const all = hasReview ? [...routes, ['/review', 'review.astro']] : routes;
        for (const [pattern, file] of all) {
          injectRoute({
            pattern,
            entrypoint: `${PKG}/templates/${template}/${file}`,
            prerender: true,
          });
        }
      },
    },
  };
}
