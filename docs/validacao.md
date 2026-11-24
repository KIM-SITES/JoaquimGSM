# Validação da entrega

24/11/2026, horário de São Paulo. Validação local em Windows 10 Pro, Node.js 24.19.0, npm 11.17.0 e Astro 7.4.13.

| Critério | Resultado |
| --- | --- |
| Build estático e tipos | Passou. Uma página gerada. Astro Check retornou 0 erros, 0 avisos e 0 sugestões. |
| Retrato aprovado | Passou. Os três WebP conferem byte a byte com o pacote. Foto integral em 3:2 até 900 px. Rosto e cabelo preservados no recorte desktop. |
| Fidelidade visual | Conferida em 390 × 844, 768 × 1024 e 1440 × 900 com o mockup mobile aprovado e o protótipo revisado. |
| Responsividade | Passou. 33 cenários de viewport em Chrome 158, Firefox 159 e WebKit 27.2. Dez tamanhos de 320 a 1920 px e paisagem em 844 × 390 em cada navegador, sem overflow horizontal, falhas de imagem ou avisos no console. |
| Navegação e interação | Passou. Link de pular, âncoras, abertura do menu, Escape, devolução de foco, voltar ao topo, toque emulado e fallback sem JavaScript. Zoom real de 200% sob Chromium, sem overflow. |
| Movimento e semântica | Passou. Reduced motion remove a entrada e as transições decorativas. Um H1, hierarquia de seções, rótulos, textos alternativos e indicação de nova aba. |
| Acessibilidade | Passou nas verificações executadas. Axe WCAG 2.2 AA sem violações em 320, 390 e 1440 px. Alvos auditados de pelo menos 44 × 44 px. |
| Contraste | Amostragem do fundo renderizado em 390, 901, 1440 e 1920 px. Menores valores de 5,09:1 para texto normal e 6,85:1 para texto grande. Menor valor de 3,37:1 nas bordas verificadas dos controles. |
| Projetos demonstrativos | Passou. Três projetos com capturas reais, segmentos corretos e abertura em nova aba. Os três destinos responderam HTTP 200. |
| WhatsApp | Passou. Os três links têm o número e a mensagem aprovados. O botão de contato abriu o destino HTTP 200 com ambos os parâmetros. O teste terminou na abertura. |
| Conteúdo público | Passou. 15 arquivos em `dist/`, com um HTML, um CSS, um favicon e 12 WebP. |
| Testes automatizados | 39 passaram, incluindo o teste que reúne a matriz de 33 cenários. |

## Desempenho

Três execuções do Lighthouse 13.6.0 em modo mobile, Chrome headless e build servido em loopback. Medianas de laboratório.

| Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT | Transferência |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 100 | 100 | 100 | 1.355 ms | 0 | 0 ms | 213.729 B |

INP de campo, Safari em hardware Apple e celular físico ficaram fora desta rodada.

## Decisões visuais

- As três capas usam 16:10 para preservar a interface completa de cada captura. As variações WebP de 640 e 960 px reduzem a transferência em telas menores.
- O fundo escurece só na região de texto do hero desktop. Telas mais largas reservam altura suficiente para mostrar todo o rosto. As duas chamadas cabem lado a lado em 390 px e podem empilhar quando o espaço diminui.
- O fechamento mantém a chamada e o telefone em um botão de duas linhas. A abertura prioriza o nome, a mensagem e as chamadas do protótipo e omite a indicação decorativa de rolagem.
- A auditoria auxiliar de design sinalizou divergências de seu preset, incluindo seções de altura fixa, composição dos títulos e número de contato. A entrega segue as medidas fluidas, a hierarquia editorial e o número especificados no pacote.

## Arquivos de evidência

- mobile 390 × 844 · [hero](../evidencias/mobile-hero.png) · [página completa](../evidencias/mobile-pagina.png)
- tablet 768 × 1024 · [hero](../evidencias/tablet-hero.png) · [página completa](../evidencias/tablet-pagina.png)
- desktop 1440 × 900 · [hero](../evidencias/desktop-hero.png) · [página completa](../evidencias/desktop-pagina.png)
- desktop 1920 × 1080 · [hero](../evidencias/widescreen-hero.png) · [página completa](../evidencias/widescreen-pagina.png)
- [Matriz de responsividade](../evidencias/responsividade.json) · [axe](../evidencias/acessibilidade.json) · [zoom](../evidencias/zoom.json) · [contraste](../evidencias/contraste-pagina.json) · [controles e toque](../evidencias/controles.json)
- [Destinos externos](../evidencias/destinos.json) · [Medições do Lighthouse](../evidencias/desempenho.json) · [Relatório Lighthouse](../evidencias/lighthouse-3.report.html)

## Versionamento

A pasta de trabalho começou vazia e sem repositório. A contagem usa todo o histórico de `main` a partir de `b404140`. O arquivo de evidência lista os 30 hashes e mensagens na ordem de execução. [Histórico Git local](../evidencias/commits.txt)
