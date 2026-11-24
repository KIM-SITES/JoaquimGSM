const reduzido = matchMedia('(prefers-reduced-motion: reduce)');

if (!reduzido.matches && 'IntersectionObserver' in window) {
  const observador = new IntersectionObserver((registros) => {
    for (const registro of registros) {
      if (registro.isIntersecting) {
        registro.target.setAttribute('data-revelado', '');
        observador.unobserve(registro.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -24px' });

  document.querySelectorAll('[data-revelar]').forEach((elemento) => observador.observe(elemento));
}
