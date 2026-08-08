document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waForm');
  const year = document.getElementById('year');
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const reveals = document.querySelectorAll('.reveal');
  const priceOptions = document.querySelectorAll('.price-option[data-servicio]');
  const servicioSelect = document.getElementById('servicio');
  const stickyCta = document.getElementById('stickyCta');
  const agenda = document.getElementById('agenda');
  const hero = document.getElementById('inicio');
  const formError = document.getElementById('formError');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const whatsappNumber = '525534891247';

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const sectionIds = navLinks
    .map((link) => link.getAttribute('href'))
    .filter(Boolean)
    .map((href) => href.slice(1));

  const setActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    let current = sectionIds[0];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= scrollPos) current = id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === `#${current}`);
    });
  };

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    setActiveNav();

    if (stickyCta && hero && agenda && window.innerWidth <= 780) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const agendaTop = agenda.getBoundingClientRect().top;
      const pastHero = window.scrollY > heroBottom - 80;
      const agendaVisible = agendaTop < window.innerHeight * 0.7;
      const show = pastHero && !agendaVisible && !document.body.classList.contains('is-nav-open');
      stickyCta.hidden = !show;
      stickyCta.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-sticky-cta', show);
    } else if (stickyCta) {
      stickyCta.hidden = true;
      stickyCta.classList.remove('is-visible');
      document.body.classList.remove('has-sticky-cta');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('is-nav-open');
    header?.classList.remove('is-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    onScroll();
  };

  const openNav = () => {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    document.body.classList.add('is-nav-open');
    header?.classList.add('is-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    if (stickyCta) {
      stickyCta.hidden = true;
      stickyCta.classList.remove('is-visible');
      document.body.classList.remove('has-sticky-cta');
    }
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

    nav.addEventListener('click', (event) => {
      if (event.target === nav) closeNav();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) closeNav();
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const aboutPortrait = document.querySelector('.about-portrait');
  if (aboutPortrait) aboutPortrait.classList.add('from-left');

  const aboutCopy = document.querySelector('.about-copy');
  if (aboutCopy) aboutCopy.classList.add('from-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    reveals.forEach((el, index) => {
      const parent = el.parentElement;
      const siblings = parent ? [...parent.children].filter((child) => child.classList.contains('reveal')) : [];
      const siblingIndex = siblings.indexOf(el);
      const delayIndex = siblingIndex >= 0 ? siblingIndex : index;
      el.classList.add(`delay-${(delayIndex % 6) + 1}`);
      observer.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  priceOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-servicio');
      if (servicioSelect && value) {
        const match = [...servicioSelect.options].find((opt) => opt.value === value);
        if (match) servicioSelect.value = value;
      }
    });
  });

  document.querySelectorAll('.is-soon').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
    });
  });

  if (!form) return;

  const showError = (message) => {
    if (!formError) return;
    formError.hidden = false;
    formError.textContent = message;
  };

  const clearError = () => {
    if (!formError) return;
    formError.hidden = true;
    formError.textContent = '';
    form.classList.remove('is-invalid');
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  };

  form.addEventListener('input', clearError);
  form.addEventListener('change', clearError);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();

    const nombreInput = document.getElementById('nombre');
    const privacy = document.getElementById('aceptoPrivacidad');
    const nombre = nombreInput?.value?.trim() || '';

    if (!nombre) {
      nombreInput?.classList.add('is-invalid');
      nombreInput?.focus();
      showError('Por favor escribe tu nombre para continuar.');
      return;
    }

    if (privacy && !privacy.checked) {
      form.classList.add('is-invalid');
      privacy.focus();
      showError('Debes aceptar el Aviso de Privacidad para continuar.');
      return;
    }

    const telefono = document.getElementById('telefono')?.value?.trim() || 'Sin teléfono';
    const servicio = document.getElementById('servicio')?.value || 'Consulta';
    const mensaje = document.getElementById('mensaje')?.value?.trim() || 'Quiero agendar una consulta en línea.';

    const text = `Hola Daniela, soy ${nombre}. Teléfono: ${telefono}. Quiero agendar una ${servicio} (en línea). ${mensaje}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});
