/**
 * TarkiPay - app.js
 * Controlador central: Carga e inyecta componentes globales (navbar, footer).
 */

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('navbar-container', 'components/reusable/navbar.html', adjustNavPaths);
  loadComponent('footer-container', 'components/reusable/footer.html', adjustNavPaths);
});

/**
 * Carga un fragmento HTML vía fetch e inyecta el contenido en el contenedor especificado.
 * @param {string} containerId - ID del contenedor destino
 * @param {string} url - Ruta del archivo HTML a cargar
 * @param {Function} [callback] - Callback opcional ejecutado tras la inyección
 */
async function loadComponent(containerId, url, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Ajustar la ruta si estamos dentro de la carpeta /pages
  const isInPagesDir = window.location.pathname.includes('/pages/');
  const resolvedUrl = isInPagesDir ? `../${url}` : url;

  try {
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    container.innerHTML = html;

    if (typeof callback === 'function') {
      callback(container, isInPagesDir);
    }
  } catch (error) {
    console.error(`[TarkiPay App] Error cargando componente:`, error);
  }
}

/**
 * Ajusta rutas relativas de enlaces e imágenes si el componente se carga desde /pages/
 * @param {HTMLElement} container 
 * @param {boolean} isInPagesDir 
 */
function adjustNavPaths(container, isInPagesDir) {
  if (!isInPagesDir) return;

  // Ajustar links
  container.querySelectorAll('a').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      if (href.startsWith('pages/')) {
        anchor.setAttribute('href', href.replace('pages/', ''));
      } else if (href === '/') {
        anchor.setAttribute('href', '../index.html');
      } else if (!href.startsWith('../')) {
        anchor.setAttribute('href', `../${href}`);
      }
    }
  });

  // Ajustar imágenes
  container.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('../')) {
      img.setAttribute('src', `../${src}`);
    }
  });
}
