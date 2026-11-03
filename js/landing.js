/**
 * TarkiPay - landing.js
 * Inyecta secuencialmente las secciones 01 a 06 en index.html
 * y configura animaciones de scroll mediante IntersectionObserver.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const sections = [
    { id: 'hero-container', path: 'components/landing_sections/01_hero.html' },
    { id: 'problema-container', path: 'components/landing_sections/02_problema.html' },
    { id: 'solucion-container', path: 'components/landing_sections/03_solucion.html' },
    { id: 'beneficios-container', path: 'components/landing_sections/04_beneficios.html' },
    { id: 'como-funciona-container', path: 'components/landing_sections/05_como_funciona.html' },
    { id: 'cta-final-container', path: 'components/landing_sections/06_cta_final.html' }
  ];

  for (const section of sections) {
    await loadSection(section.id, section.path);
  }

  initScrollAnimations();
});

/**
 * Carga e inserta un archivo HTML de sección en el elemento destino
 * @param {string} containerId 
 * @param {string} path 
 */
async function loadSection(containerId, path) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Error ${response.status} cargando ${path}`);
    }
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`[Landing] Error al inyectar sección ${path}:`, error);
  }
}

/**
 * Agrega observador de intersección para animaciones suaves al hacer scroll
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('main > div > section');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    sec.classList.add('fade-in-section');
    observer.observe(sec);
  });
}
