import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evidencias, salvarRelatorio, url } from './config.mjs';

const cli = fileURLToPath(new URL('../../node_modules/lighthouse/cli/index.js', import.meta.url));
const output = resolve(evidencias, 'lighthouse');
await mkdir(evidencias, { recursive: true });

const score = (category) => Math.round(category.score * 100);
const resultados = [];
for (const execucao of [1, 2, 3]) {
  const caminho = output + '-' + execucao;
  const flags = [url, '--quiet', '--chrome-flags=--headless', '--output=json', '--output=html', '--output-path=' + caminho];
  await new Promise((done, fail) => {
    const child = spawn(process.execPath, [cli, ...flags], { stdio: 'inherit' });
    child.on('error', fail);
    child.on('exit', (code) => code === 0 ? done() : fail(new Error('Lighthouse retornou ' + code)));
  });
  const report = JSON.parse(await readFile(caminho + '.report.json', 'utf8'));
  const { performance, accessibility, 'best-practices': boasPraticas, seo } = report.categories;
  const metricas = report.audits;
  resultados.push({
    execucao,
    lighthouse: report.lighthouseVersion,
    navegador: report.environment.hostUserAgent,
    coleta: report.fetchTime,
    forma: report.configSettings.formFactor,
    desempenho: score(performance),
    acessibilidade: score(accessibility),
    boasPraticas: score(boasPraticas),
    seo: score(seo),
    lcpMs: Math.round(metricas['largest-contentful-paint'].numericValue),
    cls: metricas['cumulative-layout-shift'].numericValue,
    tbtMs: Math.round(metricas['total-blocking-time'].numericValue),
    bytes: metricas['total-byte-weight'].numericValue,
  });
}
await salvarRelatorio('desempenho.json', resultados);
console.table(resultados.map(({ navegador, coleta, ...medidas }) => medidas));
