/**
 * Google Analytics GA4
 * 1) Entra a https://analytics.google.com
 * 2) Crea una propiedad GA4 para tu sitio
 * 3) Copia el ID de medición (formato G-XXXXXXXXXX)
 * 4) Pégalo abajo reemplazando el valor
 */
(function () {
  const GA_MEASUREMENT_ID = 'G-NHQWXLS2DP';

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);
})();
