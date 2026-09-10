document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waForm');
  const year = document.getElementById('year');
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const reveals = document.querySelectorAll('.reveal');
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.getElementById('inicio');
  const formError = document.getElementById('formError');
  const servicioSelect = document.getElementById('servicio');
  const servicioNombre = document.getElementById('servicioNombre');
  const servicioPrecio = document.getElementById('servicioPrecio');
  const servicioDuracion = document.getElementById('servicioDuracion');
  const servicioDesc = document.getElementById('servicioDesc');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const whatsappNumber = '525534891247';
  const isHomePage = document.body.classList.contains('page-home');
  const isBookingPage = document.body.classList.contains('page-booking');
  let brandDocked = false;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const syncBookingOffer = () => {
    if (!servicioSelect) return;
    const option = servicioSelect.selectedOptions[0];
    if (!option) return;
    if (servicioNombre) servicioNombre.textContent = option.value;
    if (servicioPrecio) servicioPrecio.textContent = option.dataset.precio || '';
    if (servicioDuracion) servicioDuracion.textContent = option.dataset.duracion || '';
    if (servicioDesc) servicioDesc.textContent = option.dataset.desc || '';
  };

  if (servicioSelect) {
    const params = new URLSearchParams(window.location.search);
    const servicioParam = params.get('servicio');
    if (servicioParam) {
      const match = [...servicioSelect.options].find((opt) => opt.value === servicioParam);
      if (match) servicioSelect.value = servicioParam;
    }
    syncBookingOffer();
    servicioSelect.addEventListener('change', syncBookingOffer);
  }

  const sectionIds = navLinks
    .map((link) => link.getAttribute('href'))
    .filter(Boolean)
    .map((href) => href.slice(1));

  const clearHashFromUrl = () => {
    if (!window.location.hash) return;
    if (document.body.classList.contains('legal-page')) return;
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    clearHashFromUrl();
    return true;
  };

  // Menú y CTAs: scroll sin dejar # en la URL
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (document.body.classList.contains('legal-page')) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id);
    });
  });

  // Si alguien llega con #costos (u otra sección), hace scroll y limpia la URL
  if (isHomePage && window.location.hash) {
    const initialId = window.location.hash.slice(1);
    window.setTimeout(() => {
      scrollToSection(initialId);
    }, 50);
  }

  const setActiveNav = () => {
    if (!sectionIds.length) return;
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

  const setBrandDocked = (docked) => {
    if (docked === brandDocked) return;
    brandDocked = docked;
    document.body.classList.toggle('is-brand-docked', docked);
    header?.classList.toggle('is-hero-mode', !docked);
    header?.classList.toggle('is-scrolled', docked);
  };

  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 24;

    if (isHomePage && hero) {
      // Soft threshold: brand fades into the menu as the hero leaves view
      const threshold = Math.min(Math.max(hero.offsetHeight * 0.35, 160), 360);
      setBrandDocked(window.scrollY > threshold);
    } else {
      header.classList.toggle('is-scrolled', scrolled || isBookingPage || document.body.classList.contains('legal-page'));
    }

    setActiveNav();

    if (stickyCta && hero && window.innerWidth <= 780) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const pastHero = window.scrollY > heroBottom - 80;
      const show = pastHero && !document.body.classList.contains('is-nav-open');
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

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // Legal tabs
  const legalTabs = document.querySelectorAll('.legal-tab');
  const legalPanels = document.querySelectorAll('.legal-panel');

  const showLegalTab = (name) => {
    if (!legalTabs.length) return;
    const key = name === 'terminos' ? 'terminos' : 'aviso';
    legalTabs.forEach((tab) => {
      const active = tab.dataset.tab === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    legalPanels.forEach((panel) => {
      const active = panel.dataset.panel === key;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    if (window.location.hash.replace('#', '') !== key) {
      history.replaceState(null, '', `#${key}`);
    }
  };

  if (legalTabs.length) {
    const hash = window.location.hash.replace('#', '');
    showLegalTab(hash === 'terminos' ? 'terminos' : 'aviso');
    legalTabs.forEach((tab) => {
      tab.addEventListener('click', () => showLegalTab(tab.dataset.tab));
    });
    window.addEventListener('hashchange', () => {
      const next = window.location.hash.replace('#', '');
      showLegalTab(next === 'terminos' ? 'terminos' : 'aviso');
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
    const servicio = servicioSelect?.value || 'Consulta';
    const option = servicioSelect?.selectedOptions?.[0];
    const precio = option?.dataset?.precio || '';
    const duracion = option?.dataset?.duracion || '';
    const mensaje = document.getElementById('mensaje')?.value?.trim() || 'Quiero agendar una consulta en línea.';

    const text = `Hola Daniela, soy ${nombre}. Teléfono: ${telefono}. Quiero agendar: ${servicio} (${precio} MXN · ${duracion}, en línea). ${mensaje}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
});
