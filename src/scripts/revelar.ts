function ativarRevelacao() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
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

if (window.scrollY > 0) {
  ativarRevelacao();
} else {
  window.addEventListener('scroll', ativarRevelacao, { once: true, passive: true });
}
