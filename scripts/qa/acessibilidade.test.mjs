import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { navegadores, salvarRelatorio, url } from './config.mjs';

const resultadosAxe = [];
for (const { nome, motor, opcoes } of navegadores) {
  test(nome + ': teclado, menu e navegação sem JavaScript', async () => {
    const browser = await motor.launch(opcoes);
    try {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      await page.goto(url);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').getAttribute('href'), '#principal');
      assert.equal(await page.locator(':focus').evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'principal');

      await page.getByRole('button', { name: 'Abrir menu' }).focus();
      await page.keyboard.press('Space');
      assert.equal(await page.getByRole('button', { name: 'Fechar menu' }).getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Projetos');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator(':focus').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#menu-principal').isVisible(), false);

      for (const destino of ['projetos', 'sobre', 'processo', 'contato']) {
        await page.getByRole('button', { name: 'Abrir menu' }).click();
        await page.locator('#menu-principal a[href="#' + destino + '"]').focus();
        await page.keyboard.press('Enter');
        assert.equal(new URL(page.url()).hash, '#' + destino);
        assert.equal(await page.locator(':focus').getAttribute('id'), destino);
        assert.equal(await page.locator('#menu-principal').isVisible(), false);
      }

      const topo = page.getByRole('link', { name: 'Voltar ao topo' });
      await topo.focus();
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#inicio');
      assert.equal(await page.evaluate(() => scrollY), 0);
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.locator('#menu-principal').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.menu-toggle').isVisible(), false);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#menu-principal').waitFor({ state: 'hidden' });
      await page.close();

      const fallback = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      await fallback.goto(url);
      assert.equal(await fallback.getByRole('navigation').getByRole('link').count(), 4);
      assert.equal(await fallback.locator('.menu-toggle').isVisible(), false);
      await fallback.getByRole('navigation').getByRole('link', { name: 'Contato' }).click();
      assert.equal(new URL(fallback.url()).hash, '#contato');
      assert.equal(await fallback.getByRole('link', { name: /Falar no WhatsApp/ }).isVisible(), true);
      await fallback.close();
    } finally {
      await browser.close();
    }
  });
}

test('axe WCAG 2.2 AA, estrutura e alvos em desktop e mobile', async () => {
  const browser = await chromium.launch(navegadores[0].opcoes);
  try {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.goto(url);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main > section').count(), 5);
      assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
      if (width <= 900) await page.getByRole('button', { name: 'Abrir menu' }).click();
      const resultado = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const alvos = await page.locator('a:visible:not(.skip-link), button:visible').evaluateAll((elements) =>
        elements.filter((element) => {
          const { width, height } = element.getBoundingClientRect();
          return width < 44 || height < 44;
        }).map((element) => element.textContent.trim()));
      resultadosAxe.push({ width, regrasAprovadas: resultado.passes.length, violacoes: resultado.violations, itensManuais: resultado.incomplete.map(({ id }) => id), alvos });
      await page.close();
    }
    await salvarRelatorio('acessibilidade.json', resultadosAxe);
    for (const { width, violacoes, alvos } of resultadosAxe) {
      assert.deepEqual(violacoes.map(({ id, nodes }) => ({ id, alvos: nodes.map(({ target }) => target) })), [], 'axe em ' + width);
      assert.deepEqual(alvos, [], 'áreas de toque em ' + width);
    }
  } finally {
    await browser.close();
  }
});

test('zoom de navegador de 200% preserva o fluxo e a navegação', async () => {
  const extensao = fileURLToPath(new URL('./extensao-zoom/', import.meta.url));
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    viewport: null,
    args: ['--window-size=1440,900', '--disable-extensions-except=' + extensao, '--load-extension=' + extensao],
  });
  try {
    const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
    const page = context.pages()[0];
    await page.goto(url);
    const antes = await page.evaluate(() => devicePixelRatio);
    const zoom = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.setZoom(tab.id, 2);
      return chrome.tabs.getZoom(tab.id);
    });
    assert.equal(zoom, 2);
    await page.waitForFunction((dpr) => devicePixelRatio >= dpr * 2, antes);
    const medidas = await page.evaluate(() => ({
      viewport: innerWidth,
      documento: document.documentElement.scrollWidth,
      menu: !!document.querySelector('.menu-toggle').getClientRects().length,
    }));
    assert.ok(medidas.documento <= medidas.viewport);
    assert.equal(medidas.menu, true);
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Contato' }).click();
    assert.equal(new URL(page.url()).hash, '#contato');
    await salvarRelatorio('zoom.json', { zoom, ...medidas });
  } finally {
    await context.close();
  }
});
