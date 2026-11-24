interface Projeto {
  id: string;
  nome: string;
  segmento: string;
  descricao: string;
  url: `https://${string}`;
  alt: string;
  demonstrativo: true;
}

export const projetos = [
  {
    id: 'fase-forma',
    nome: 'FASE / FORMA',
    segmento: 'Iluminação, elétrica e automação.',
    descricao: 'Uma experiência sobre luz, espaço e percepção.',
    url: 'https://fase-forma.vercel.app',
    alt: 'Página inicial de FASE / FORMA com iluminação indireta quente em uma sala e o título “O invisível sustenta”.',
    demonstrativo: true,
  },
  {
    id: 'lamina',
    nome: 'Lâmina Piscinas',
    segmento: 'Piscinas, projeto e lazer.',
    descricao: 'Apresentação visual de ambientes e serviços.',
    url: 'https://lamina-chi.vercel.app',
    alt: 'Página inicial de Lâmina com uma piscina diante de um jardim e o título “Piscinas, entre luz e paisagem”.',
    demonstrativo: true,
  },
  {
    id: 'entrear',
    nome: 'Entrear Climatização',
    segmento: 'Climatização.',
    descricao: 'Serviços apresentados com clareza e personalidade.',
    url: 'https://entrear.vercel.app',
    alt: 'Página inicial de Entrear com o título “Conforto tem medida” e fotos de ambientes climatizados.',
    demonstrativo: true,
  },
] as const satisfies readonly Projeto[];

export type ProjetoId = (typeof projetos)[number]['id'];
