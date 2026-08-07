document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waForm');
  const year = document.getElementById('year');
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const reveals = document.querySelectorAll('.reveal');
  const priceOptions = document.querySelectorAll('.price-option[data-servicio]');
  const servicioSelect = document.getElementById('servicio');
  const whatsappNumber = '525534891247';

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      if (isOpen) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el, index) => {
      el.classList.add(`delay-${(index % 3) + 1}`);
      observer.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  priceOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-servicio');
      if (servicioSelect && value) {
        servicioSelect.value = value;
      }
    });
  });

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value?.trim() || 'Cliente';
    const telefono = document.getElementById('telefono')?.value?.trim() || 'Sin teléfono';
    const servicio = document.getElementById('servicio')?.value || 'Consulta';
    const mensaje = document.getElementById('mensaje')?.value?.trim() || 'Quiero agendar una consulta.';

    const text = `Hola Daniela, soy ${nombre}. Teléfono: ${telefono}. Quiero agendar una ${servicio}. ${mensaje}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});
