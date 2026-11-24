import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const sites = [
  ['fase-forma', 'https://fase-forma.vercel.app'],
  ['lamina', 'https://lamina-chi.vercel.app'],
  ['entrear', 'https://entrear.vercel.app'],
];
const viewports = [
  { nome: 'desktop', width: 1440, height: 900 },
  { nome: 'mobile', width: 390, height: 844 },
];
const output = resolve(process.env.CAPTURA_DIR ?? 'capturas-candidatas');
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: 'chromium' });
const results = [];
try {
  for (const [id, url] of sites) {
    for (const { nome, ...viewport } of viewports) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: nome === 'mobile', hasTouch: nome === 'mobile' });
      const report = { id, url, viewport, erros: [] };
      page.on('pageerror', (error) => report.erros.push(error.message));
      try {
        const response = await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
        report.http = response?.status();
        if (!response?.ok()) throw new Error('Página indisponível');
        await page.evaluate(() => document.fonts.ready.then(() => true));
        const text = await page.locator('body').innerText();
        if (!text.trim() || /deployment_not_found|this page could not be found/i.test(text)) {
          throw new Error('Página vazia ou deploy indisponível');
        }
        // A transição de abertura e a mídia do hero pertencem ao site capturado.
        await page.waitForTimeout(2400);
        await page.evaluate(async () => {
          const images = Array.from(document.images).filter((image) => {
            const bounds = image.getBoundingClientRect();
            return bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > 0;
          });
          await Promise.race([
            Promise.allSettled(images.map((image) => image.decode())),
            new Promise((done) => setTimeout(done, 3000)),
          ]);
        });
        Object.assign(report, {
          urlFinal: page.url(),
          titulo: await page.title(),
          arquivo: id + '-' + nome + '.png',
          capturadoEm: new Date().toISOString(),
        });
        await page.screenshot({ path: resolve(output, report.arquivo) });
      } catch (error) {
        report.falha = error.message;
        process.exitCode = 1;
      } finally {
        results.push(report);
        console.log(id, nome, report.falha ?? report.titulo);
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  await writeFile(resolve(output, 'relatorio.json'), JSON.stringify(results, null, 2) + '\n');
}
