# Joaquim Moura · Portfólio

Portfólio comercial de uma página para desenvolvimento de sites. Reúne a apresentação de Joaquim, três projetos demonstrativos, serviços, processo e contato pelo WhatsApp.

## Executar

Use Node.js 24. O requisito mínimo do Astro é 22.23.4. Instale as versões do arquivo de lock e inicie o servidor de desenvolvimento.

```sh
npm ci
npm run dev
```

Abra `http://localhost:4321/`. Para revisar o build de produção, encerre o servidor de desenvolvimento e execute:

```sh
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

## Validar

Com o servidor de prévia ativo, execute em outro terminal:

```sh
npx playwright install chromium firefox webkit
npm test
npm run qa:destinos
npm run qa:desempenho
```

O Playwright usa o Google Chrome instalado, Firefox e WebKit. Defina `CHROME_CHANNEL=chromium` para usar o Chromium do Playwright no lugar do Chrome. O Lighthouse usa o Chrome do ambiente e aceita `CHROME_PATH` para selecionar o executável. Os comandos de QA usam `PORTFOLIO_URL` quando definido e gravam resultados, imagens e relatórios em `evidencias/` por padrão. A abertura dos destinos depende de rede.

## Editar

| Conteúdo | Arquivo |
| --- | --- |
| Projetos, segmentos, URLs e textos alternativos | [src/data/projetos.ts](src/data/projetos.ts) |
| Número e mensagem do WhatsApp | [src/data/contato.ts](src/data/contato.ts) |
| Textos e layout das seções | [src/components](src/components) |
| Cores, tipografia e movimento | [src/styles](src/styles) |
| Metadados, favicon e referência da capa social | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) |

A galeria associa as imagens a cada projeto em [Projects.astro](src/components/Projects.astro). Para atualizar as capas, rode `npm run capturar` em ambiente com rede, revise o relatório e abra os PNGs em `capturas-candidatas/`. Depois de validar as capturas desktop, use `npm run otimizar:capturas` para gerar os WebP de 640, 960 e 1440 px.

## Publicação

`npm run build` gera o site estático em `dist/`. Em um projeto Vercel, selecione o preset Astro, Node.js 24, comando `npm run build` e saída `dist`. O build também pode ser servido por qualquer hospedagem estática na raiz do domínio.

Defina `PORTFOLIO_SITE_URL` no ambiente do build com a origem pública definitiva, incluindo o protocolo. Essa variável gera o canonical, o `og:url` e as URLs absolutas da capa para Open Graph e Twitter Card. Na prévia local, a capa usa o caminho `/compartilhamento.jpg`.

A [capa social](public/compartilhamento.jpg) tem 1200 × 630 px e usa o retrato aprovado. Para regenerá-la, execute `node scripts/gerar-capa.mjs` com Chromium instalado pelo Playwright.

A Manrope é distribuída com o site em um WOFF2 latino variável sob a licença SIL Open Font License 1.1. [Licença da fonte](public/fonts/OFL-Manrope.txt) · [Origem no Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope)

O pacote de referência fica em `materiais/`. As evidências ficam em `evidencias/`. As duas pastas ficam fora de `dist/`.

## Evidências

- [Relatório consolidado do refinamento](docs/refinamento.md)
- [Validação da versão inicial](docs/validacao.md)
- [Origem das capturas dos projetos](docs/capturas.md)
- [Histórico Git da versão inicial](evidencias/commits.txt)
