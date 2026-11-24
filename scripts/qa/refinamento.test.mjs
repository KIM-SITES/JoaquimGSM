import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { navegadores, url } from './config.mjs';

test('revelação acompanha a rolagem e mantém o conteúdo disponível em todos os modos', async (t) => {
  const browser = await chromium.launch(navegadores[0].opcoes);
  t.after(() => browser.close());

  const cenarios = [
    { reducedMotion: 'no-preference', javaScriptEnabled: true },
    { reducedMotion: 'reduce', javaScriptEnabled: true },
    { reducedMotion: 'no-preference', javaScriptEnabled: false },
  ];
  for (const opcoes of cenarios) {
    const page = await browser.newPage({ ...opcoes, viewport: { width: 390, height: 844 } });
    try {
      await page.goto(url);
      const titulo = page.locator('#processo [data-revelar]').first();
      const foto = page.locator('[data-revelar="imagem"]').first();
      assert.equal(await titulo.isVisible(), true);
      assert.equal(await titulo.getAttribute('data-revelado'), null);

      const animar = opcoes.javaScriptEnabled && opcoes.reducedMotion === 'no-preference';
      for (const [elemento, animacao] of [[foto, 'aparecer-captura'], [titulo, 'chegar']]) {
        await elemento.scrollIntoViewIfNeeded();
        if (animar) await elemento.locator('xpath=self::*[@data-revelado]').waitFor();
        assert.equal(await elemento.isVisible(), true);
        assert.equal(await elemento.evaluate((el) => getComputedStyle(el).animationName), animar ? animacao : 'none');
      }
    } finally {
      await page.close();
    }
  }
});

test('capa social e metadados funcionam com a origem configurada ou em prévia', async (t) => {
  const browser = await chromium.launch(navegadores[0].opcoes);
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.goto(url);
  const base = process.env.PORTFOLIO_SITE_URL?.trim();
  const local = '/compartilhamento.jpg';
  const capa = base ? new URL(local, base).href : local;
  const meta = (atributo, campo) => page.locator('meta[' + atributo + '="' + campo + '"]').getAttribute('content');

  assert.equal(await meta('property', 'og:image'), capa);
  assert.equal(await meta('name', 'twitter:image'), capa);
  assert.equal(await meta('name', 'twitter:card'), 'summary_large_image');
  assert.equal(await meta('property', 'og:image:width'), '1200');
  assert.equal(await meta('property', 'og:image:height'), '630');
  assert.match(await meta('property', 'og:image:alt'), /Joaquim Moura/);
  const canonical = await page.locator('link[rel="canonical"]').evaluateAll((links) => links.map((link) => link.href));
  assert.deepEqual(canonical, base ? [new URL('/', base).href] : []);

  const resposta = await page.request.get(new URL(local, url).href);
  assert.equal(resposta.status(), 200);
  const imagem = await sharp(await resposta.body()).metadata();
  assert.equal(imagem.format, 'jpeg');
  assert.equal(imagem.width, 1200);
  assert.equal(imagem.height, 630);
  const manropeAtiva = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some((fonte) => fonte.family === 'Manrope' && fonte.status === 'loaded');
  });
  assert.equal(manropeAtiva, true);
});
