import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const candidatos = resolve(process.env.CAPTURA_DIR ?? 'capturas-candidatas');
const destino = resolve('src/assets/projetos');
await mkdir(destino, { recursive: true });

for (const id of ['fase-forma', 'lamina', 'entrear']) {
  const imagem = sharp(resolve(candidatos, id + '-desktop.png'));
  const { width, height } = await imagem.metadata();
  if (width !== 1440 || height !== 900) {
    throw new Error(id + ': a captura precisa ter 1440×900');
  }

  for (const largura of [640, 960, 1440]) {
    const arquivo = id + (largura === 1440 ? '' : '-' + largura) + '.webp';
    await imagem.clone().resize({ width: largura }).webp({ quality: 87, effort: 6 }).toFile(resolve(destino, arquivo));
  }
}
