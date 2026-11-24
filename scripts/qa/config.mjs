import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

export const url = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321/';
export const evidencias = resolve(process.env.EVIDENCIAS_DIR ?? 'evidencias');

export const navegadores = [
  { nome: 'Chrome', motor: chromium, opcoes: { channel: process.env.CHROME_CHANNEL ?? 'chrome' } },
  { nome: 'Firefox', motor: firefox },
  { nome: 'WebKit', motor: webkit },
];

export const larguras = [
  [320, 800], [360, 800], [390, 844], [430, 932], [768, 1024],
  [900, 1000], [1024, 768], [1280, 800], [1440, 900], [1920, 1080],
  [844, 390],
];

export async function salvarRelatorio(nome, resultado) {
  await mkdir(evidencias, { recursive: true });
  await writeFile(resolve(evidencias, nome), JSON.stringify(resultado, null, 2) + '\n');
}
