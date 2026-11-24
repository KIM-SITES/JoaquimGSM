import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { evidencias, larguras, navegadores, salvarRelatorio, url } from './config.mjs';

test('larguras, paisagem, imagens e console em Chrome, Firefox e WebKit', async (t) => {
  const resultados = [];
  await salvarRelatorio('responsividade.json', resultados);
  for (const { nome, motor, opcoes } of navegadores) {
    const browser = await motor.launch(opcoes);
    try {
      for (const [width, height] of larguras) {
        await t.test(nome + ' ' + width + '×' + height, async () => {
          const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
          const erros = [];
          page.on('pageerror', (e) => erros.push(e.message));
          page.on('console', (message) => {
            if (message.type() === 'error' || message.type() === 'warning') erros.push(message.text());
          });
          page.on('response', (response) => {
            if (response.status() >= 400) erros.push(response.status() + ' ' + response.url());
          });
          try {
            const response = await page.goto(url);
            assert.equal(response?.status(), 200);
            await page.locator('.retrato').evaluate((image) => image.decode());
            const layout = await page.evaluate(() => {
              const foto = document.querySelector('.retrato');
              const conteudo = document.querySelector('.hero-conteudo');
              const caixa = foto.getBoundingClientRect();
              const excesso = [...document.querySelectorAll('h1, h2, h3, p:not(.skip-link), nav a, .botao')]
                .filter((element) => {
                  if (!element.getClientRects().length) return false;
                  const range = document.createRange();
                  range.selectNodeContents(element);
                  return [...range.getClientRects()].some((r) => r.right > innerWidth + 1 || r.left < -1);
                })
                .map((element) => element.textContent.trim());
              return {
                largura: document.documentElement.scrollWidth,
                excesso,
                proporcao: caixa.width / caixa.height,
                encaixe: getComputedStyle(foto).objectFit,
                filtro: getComputedStyle(foto).filter,
                fotoAcima: caixa.bottom <= conteudo.getBoundingClientRect().top + 0.5,
                prioridade: foto.getAttribute('fetchpriority'),
                animacao: getComputedStyle(conteudo).animationName,
              };
            });
            assert.ok(layout.largura <= width, 'rolagem horizontal');
            assert.deepEqual(layout.excesso, [], 'texto ultrapassou o viewport');
            assert.equal(layout.filtro, 'none');
            assert.equal(layout.animacao, 'none');
            assert.equal(layout.prioridade, 'high');
            if (width <= 900) {
              assert.ok(Math.abs(layout.proporcao - 1.5) < 0.02, 'retrato mobile fora de 3:2');
              assert.equal(layout.encaixe, 'contain');
              assert.equal(layout.fotoAcima, true);
              assert.equal(await page.locator('.menu-toggle').isVisible(), true);
            } else {
              assert.equal(layout.encaixe, 'cover');
              assert.equal(await page.locator('.menu-toggle').isVisible(), false);
              assert.equal(await page.locator('nav .link-contato').isVisible(), false);
            }
            if (width === 390) {
              const [principal, secundario] = await page.locator('.acoes a').all();
              assert.equal((await principal.boundingBox()).y, (await secundario.boundingBox()).y, 'CTAs devem caber na mesma linha em 390px');
            }

            const nomeCaptura = nome === 'Chrome' && new Map([[390, 'mobile'], [768, 'tablet'], [1440, 'desktop']]).get(width);
            if (nomeCaptura) await page.screenshot({ path: resolve(evidencias, nomeCaptura + '-hero.png') });
            const cards = await page.locator('.captura img').all();
            assert.equal(cards.length, 3);
            for (const imagem of cards) {
              assert.equal(await imagem.getAttribute('loading'), 'lazy');
              await imagem.scrollIntoViewIfNeeded();
              const medida = await imagem.evaluate(async (img) => {
                await img.decode();
                return [img.naturalWidth, img.naturalHeight, img.width, img.height];
              });
              assert.ok(medida[0] > 0 && Math.abs(medida[0] / medida[1] - medida[2] / medida[3]) < 0.015);
            }
            if (nomeCaptura) {
              await page.evaluate(() => scrollTo(0, 0));
              await page.screenshot({ path: resolve(evidencias, nomeCaptura + '-pagina.png'), fullPage: true });
            }
            assert.deepEqual(erros, [], 'erros ou avisos no console ou nos recursos');
            resultados.push({ navegador: nome, versao: browser.version(), viewport: width + '×' + height, status: 'passou' });
          } finally {
            await page.close();
          }
        });
      }
    } finally {
      await browser.close();
      await salvarRelatorio('responsividade.json', resultados);
    }
  }
});
