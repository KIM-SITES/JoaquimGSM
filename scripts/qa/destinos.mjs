import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { salvarRelatorio, url, navegadores } from './config.mjs';

const browser = await chromium.launch(navegadores[0].opcoes);
const resultados = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url);
  const projetos = await page.locator('.projeto').all();
  const contatos = await page.locator('a[href^="https://wa.me/"]').all();
  const destinos = ['fase-forma.vercel.app', 'lamina-chi.vercel.app', 'entrear.vercel.app'];
  const mensagem = 'Olá, Joaquim! Conheci seu portfólio e gostaria de conversar sobre um site para minha empresa.';
  assert.equal(projetos.length, destinos.length);
  assert.equal(contatos.length, 3);
  for (const contato of contatos) {
    const link = new URL(await contato.getAttribute('href'));
    assert.equal(link.pathname, '/5511942130020');
    assert.equal(link.searchParams.get('text'), mensagem);
  }
  const contato = page.getByRole('link', { name: /Falar no WhatsApp/ });

  for (const [index, link] of [...projetos, contato].entries()) {
    const nome = await link.getAttribute('href');
    const esperado = destinos[index] ?? 'api.whatsapp.com';
    if (index < destinos.length) {
      assert.equal(new URL(nome).host, esperado);
      assert.match(await link.getAttribute('aria-labelledby'), /nova-aba/);
    }
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.match(await link.getAttribute('rel'), /noopener noreferrer/);

    const respostas = [];
    const observar = (response) => {
      if (response.request().isNavigationRequest()) {
        respostas.push({ url: response.url(), http: response.status() });
      }
    };
    context.on('response', observar);
    try {
      const abreAba = page.waitForEvent('popup', { timeout: 30_000 });
      await link.click();
      const popup = await abreAba;
      try {
        await popup.waitForLoadState('domcontentloaded');
        const final = new URL(popup.url());
        assert.equal(final.host, esperado);
        if (link === contato) {
          assert.equal(final.searchParams.get('phone'), '5511942130020');
          assert.equal(final.searchParams.get('text'), mensagem);
        }
        const status = respostas.findLast((response) => response.url === final.href);
        assert.ok(status && status.http >= 200 && status.http < 300, 'Destino sem resposta de sucesso');
        resultados.push({ solicitado: nome, destino: final.href, titulo: await popup.title(), http: status.http, abriuNovaAba: true });
      } finally {
        await popup.close();
      }
    } finally {
      context.off('response', observar);
    }
  }
} finally {
  await browser.close();
  await salvarRelatorio('destinos.json', resultados);
}
console.log(resultados.map(({ destino, http }) => http + ' ' + new URL(destino).host).join('\n'));
