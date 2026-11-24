import foto768 from '../assets/retrato-768.webp';
import foto1200 from '../assets/retrato-1200.webp';
import foto1536 from '../assets/retrato-1536.webp';

export const retrato = {
  src: foto1200.src,
  srcset: [foto768, foto1200, foto1536].map(({ src, width }) => src + ' ' + width + 'w').join(', '),
  sizes: '(width > 900px) min(50vw, 64rem), 100vw',
  width: foto1536.width,
  height: foto1536.height,
};
