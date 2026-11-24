/**
 * TarkiPay - app.js
 * Controlador central de la aplicación y componentes globales.
 * 
 * Responsabilidades:
 * 1. Carga e inyección asíncrona de componentes reutilizables (Navbar y Footer).
 * 2. Normalización de rutas relativas (enlaces e imágenes) al navegar desde /pages/ o raíz.
 * 3. Menú móvil accesible según especificaciones WAI-ARIA (aria-expanded, trampa Escape, cierre por click exterior).
 * 4. Despacho de eventos de ciclo de vida ('tarkipay:navbar-loaded', 'tarkipay:footer-loaded') para coordinar subcomponentes.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-container', 'components/reusable/navbar.html', (container, isInPagesDir) => {
      adjustNavPaths(container, isInPagesDir);
      initAccessibleMobileMenu(container);
      document.dispatchEvent(new CustomEvent('tarkipay:navbar-loaded', { detail: { container, isInPagesDir } }));
    });

    loadComponent('footer-container', 'components/reusable/footer.html', (container, isInPagesDir) => {
      adjustNavPaths(container, isInPagesDir);
      document.dispatchEvent(new CustomEvent('tarkipay:footer-loaded', { detail: { container, isInPagesDir } }));
    });
  });

  /**
   * Carga un fragmento HTML vía fetch e inyecta el contenido en el contenedor especificado.
   * @param {string} containerId - ID del contenedor destino en el DOM.
   * @param {string} url - Ruta relativa base del archivo HTML.
   * @param {Function} [callback] - Callback opcional ejecutado tras la inyección exitosa.
   */
  async function loadComponent(containerId, url, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Detectar si la página actual reside en el subdirectorio /pages/
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const resolvedUrl = isInPagesDir ? `../${url}` : url;

    try {
      const response = await fetch(resolvedUrl);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar ${resolvedUrl}`);
      }
      const html = await response.text();
      container.innerHTML = html;

      if (typeof callback === 'function') {
        callback(container, isInPagesDir);
      }
    } catch (error) {
      console.error(`[TarkiPay App] Error cargando componente (${url}):`, error);
    }
  }

  /**
   * Ajusta rutas relativas de enlaces e imágenes si el componente se renderiza desde /pages/
   * @param {HTMLElement} container 
   * @param {boolean} isInPagesDir 
   */
  function adjustNavPaths(container, isInPagesDir) {
    if (!isInPagesDir || !container) return;

    // Ajustar enlaces de navegación (a[href])
    container.querySelectorAll('a').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        if (href.startsWith('#')) {
          anchor.setAttribute('href', `../index.html${href}`);
        } else if (href.startsWith('pages/')) {
          anchor.setAttribute('href', href.replace('pages/', ''));
        } else if (href === '/' || href === 'index.html') {
          anchor.setAttribute('href', '../index.html');
        } else if (!href.startsWith('../')) {
          anchor.setAttribute('href', `../${href}`);
        }
      }
    });

    // Ajustar imágenes (img[src])
    container.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('../')) {
        img.setAttribute('src', `../${src}`);
      }
    });
  }

  /**
   * Configura la accesibilidad y control del menú de navegación móvil.
   * @param {HTMLElement} context 
   */
  function initAccessibleMobileMenu(context) {
    const root = context || document;
    const mobileMenuBtn = root.getElementById?.('mobile-menu-btn') || document.getElementById('mobile-menu-btn') || root.querySelector?.('.mobile-menu-btn');
    const mainNav = root.getElementById?.('main-nav') || document.getElementById('main-nav') || root.querySelector?.('.main-nav');

    if (!mobileMenuBtn || !mainNav) return;

    function openMenu() {
      mainNav.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    }

    function closeMenu() {
      mainNav.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    function toggleMenu() {
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar al pulsar sobre cualquier enlace interno del menú
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Cerrar con la tecla Escape y devolver el foco al botón de apertura
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
        mobileMenuBtn.focus();
      }
    });

    // Cerrar si se hace clic fuera del menú o del botón
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open')) {
        if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }

  // Exponer métodos globalmente
  window.TarkiPayApp = {
    loadComponent,
    adjustNavPaths,
    initAccessibleMobileMenu
  };
})();
