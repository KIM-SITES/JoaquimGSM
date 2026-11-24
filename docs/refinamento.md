# Refinamento artístico final

24/11/2026 · Base da comparação `a42983a`, com os 30 commits da entrega inicial.

## Alterações

- **Tipografia.** Comparei Arial e Manrope no mesmo layout em 390 e 1440 px. A Manrope deu formas mais distintas ao nome e aos títulos e preservou a leitura do corpo. Ajustei peso, entrelinha e espaçamento com um único WOFF2 latino variável de 24.532 B, hospedado localmente. [Licença SIL OFL 1.1](../public/fonts/OFL-Manrope.txt) · [Fonte no Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope)
- **Composição e cor.** Mantive o grafite como fundo dominante. O roxo dessaturado aparece na galeria e o azul acinzentado na seção de serviços. A FASE / FORMA agora ocupa a coluna esquerda de uma galeria assimétrica, com Lâmina e Entrear empilhadas à direita. Em 1440 px, sua área de imagem passou de aproximadamente 4,15 vezes a de cada outro projeto para 1,96 vez. As três capturas reais continuam em 16:10, com rótulos demonstrativos e o convite visível “Acessar site”.
- **Navegação.** “Conheça meus projetos” segue como ação principal, com uma seta para baixo. O segundo botão identifica o WhatsApp, com o mesmo número e a mesma mensagem. Ajustei espaçamento e escala do nome em tablet para manter os dois botões visíveis em 768 × 1024.
- **Movimento.** Os títulos e as capturas recebem uma entrada de 420 a 530 ms. O observador é iniciado na rolagem, e as microinterações usam transições breves. O HTML mantém o conteúdo visível desde a primeira renderização. A preferência por movimento reduzido desativa as animações.
- **Compartilhamento.** A capa JPEG de 1200 × 630 usa o retrato aprovado em paisagem e a identificação “Joaquim Moura” e “Desenvolvedor de sites”. O build com uma origem de teste confirmou o canonical, `og:url` e as URLs absolutas da capa para Open Graph e Twitter Card. [Capa social](../public/compartilhamento.jpg)

## Antes e depois

As imagens mostram a versão anterior à esquerda e a refinada à direita.

| Viewport | Comparação | O que mudou |
| --- | --- | --- |
| 390 × 844 | [Abertura](../evidencias/refinamento/comparacao/mobile-hero.png) · [Página](../evidencias/refinamento/comparacao/mobile-pagina.png) | Retrato integral 3:2. Tipografia mais aberta, duas chamadas lado a lado e galeria vertical. |
| 768 × 1024 | [Abertura](../evidencias/refinamento/comparacao/tablet-hero.png) · [Página](../evidencias/refinamento/comparacao/tablet-pagina.png) | As duas chamadas aparecem por inteiro na abertura. A foto continua com 768 × 512. |
| 1440 × 900 | [Abertura](../evidencias/refinamento/comparacao/desktop-hero.png) · [Página](../evidencias/refinamento/comparacao/desktop-pagina.png) | A galeria distribui melhor o destaque entre os três projetos. Os títulos mantêm o eixo editorial. |
| 1920 × 1080 | [Abertura](../evidencias/refinamento/comparacao/widescreen-hero.png) · [Página](../evidencias/refinamento/comparacao/widescreen-pagina.png) | Rosto e cabelo continuam inteiros no enquadramento desktop. Os alinhamentos da composição permanecem no mesmo eixo. |

## Testes

- `npm run check` e `npm run build` passaram. Astro Check retornou zero erros, avisos e sugestões.
- **41 testes passaram**, com 33 cenários de viewport em Chrome, Firefox e WebKit. A suíte cobriu 320 a 1920 px, paisagem, imagens, console, teclado, Escape, navegação sem JavaScript, zoom real de 200%, movimento reduzido e metadados da capa. [Matriz de responsividade](../evidencias/refinamento/depois/responsividade.json) · [Zoom](../evidencias/refinamento/depois/zoom.json)
- A análise axe de WCAG 2.2 AA registrou **zero violações** em 320, 390 e 1440 px. A amostragem do fundo renderizado mediu pelo menos **5,09:1** no texto normal e **6,6:1** no texto grande. As bordas dos controles auditados chegaram a um mínimo de **3,37:1**. Toque, foco, hover e ativação foram conferidos. [axe](../evidencias/refinamento/depois/acessibilidade.json) · [Contraste](../evidencias/refinamento/depois/contraste-pagina.json) · [Toque e bordas](../evidencias/refinamento/depois/controles.json) · [Estados](../evidencias/refinamento/depois/estados.json)
- Os três projetos e o destino do WhatsApp retornaram HTTP 200. O texto e o número foram conferidos no redirecionamento. O teste do WhatsApp terminou na abertura. [Destinos externos](../evidencias/refinamento/depois/destinos.json)
- A comparação com `a42983a` confirmou que os arquivos do retrato e das capturas dos projetos são idênticos aos da entrega inicial. O JPEG social é um arquivo separado.

## Desempenho

Medianas de três execuções por versão, Lighthouse 13.6.0 em modo mobile no mesmo Windows 10 Pro, Chrome headless e build estático servido em loopback.

| Métrica | Antes | Depois |
| --- | ---: | ---: |
| Desempenho | 100 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1.356 ms | 1.430 ms |
| CLS | 0 | 0 |
| TBT | 60 ms | 47 ms |
| Transferência | 213.729 B | 239.063 B |

Os escores individuais de desempenho foram **100, 100, 98**. A última execução registrou TBT de 162 ms. O maior CLS foi 0,0018. O LCP mediano aumentou 74 ms e a transferência cresceu 25.334 B, dos quais 24.532 B correspondem ao WOFF2. O CSS integrado ao HTML removeu uma requisição que bloqueava a renderização. O preload responsivo prioriza o retrato, e o observador de movimento só começa na primeira rolagem.

[Relatórios antes](../evidencias/refinamento/antes/desempenho.json) · [Relatórios depois](../evidencias/refinamento/depois/desempenho.json) · [Lighthouse HTML da execução mediana](../evidencias/refinamento/depois/lighthouse-2.report.html)

## Publicação e histórico

O build estático está em `dist/`. A origem pública definitiva fica centralizada em `PORTFOLIO_SITE_URL`. A renderização da prévia nas plataformas depende da publicação em um domínio acessível aos crawlers. Safari em hardware Apple, celular físico e INP de campo ficaram fora da validação local.

Os 30 commits anteriores permanecem na branch `main`. [Novos commits](../evidencias/refinamento/commits.txt) · [Instruções de execução e publicação](../README.md)
