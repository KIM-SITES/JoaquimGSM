import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const [retrato, fonte] = await Promise.all([
  readFile(new URL('../src/assets/retrato-1200.webp', import.meta.url), 'base64'),
  readFile(new URL('../public/fonts/manrope-latin.woff2', import.meta.url), 'base64'),
]);

const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<style>
  @font-face {
    font-family: Manrope;
    src: url("data:font/woff2;base64,${fonte}") format("woff2");
    font-weight: 400 800;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #242322;
    color: #f3f0eb;
    font-family: Manrope, Arial, sans-serif;
  }
  main {
    display: grid;
    grid-template-columns: 460px 740px;
    align-items: center;
    min-height: 630px;
    background: linear-gradient(115deg, #242322 18%, #302b2e 100%);
  }
  header { padding-left: 58px; }
  header::before {
    content: '';
    display: block;
    width: 36px;
    height: 3px;
    margin-bottom: 26px;
    background: #f2d34f;
  }
  h1 {
    margin: 0;
    font-size: 91px;
    font-weight: 780;
    letter-spacing: -0.065em;
    line-height: 0.93;
  }
  p {
    margin: 28px 0 0;
    color: #e1dcd7;
    font-size: 28px;
    font-weight: 650;
  }
  img { display: block; width: 100%; height: auto; }
</style>
<main>
  <header>
    <h1>Joaquim<br>Moura</h1>
    <p>Desenvolvedor de sites</p>
  </header>
  <img src="data:image/webp;base64,${retrato}" width="1200" height="800" alt="Retrato de Joaquim Moura">
</main>
</html>`);
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.locator('img').evaluate((imagem) => imagem.decode());
  await page.screenshot({
    type: 'jpeg',
    quality: 90,
    path: fileURLToPath(new URL('../public/compartilhamento.jpg', import.meta.url)),
  });
} finally {
  await browser.close();
}
