import { defineConfig } from 'astro/config';

const endereco = process.env.PORTFOLIO_SITE_URL?.trim();
const site = endereco ? new URL(endereco) : undefined;
if (site && (!['http:', 'https:'].includes(site.protocol) || site.href !== site.origin + '/')) {
  throw new Error('PORTFOLIO_SITE_URL deve conter a origem HTTP ou HTTPS do portfólio.');
}

export default defineConfig({
  site: site?.href,
  output: 'static',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
