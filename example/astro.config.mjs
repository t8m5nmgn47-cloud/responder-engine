import { defineConfig } from 'astro/config';
import engine from '@sightline/responder-engine';
export default defineConfig({ site: 'https://example-fire.vercel.app', output: 'static', trailingSlash: 'always', integrations: [engine({ template: 'department' })] });
