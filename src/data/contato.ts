const numero = '5511942130020';
const mensagem = 'Olá, Joaquim! Conheci seu portfólio e gostaria de conversar sobre um site para minha empresa.';

export const whatsapp = {
  telefone: '(11) 94213-0020',
  url: 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem),
} as const;
