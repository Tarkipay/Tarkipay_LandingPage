/** TarkiPay landing loader and existing marketing interactions.
 * Functional demo: demo-core.js (model and authorization), demo-ui.js (views).
 * External Android, broker and Box integrations are simulated locally.
 */

(function () {
  'use strict';

  // Evitar ejecuciones duplicadas en entornos modulares
  if (window.__tarkipayLandingLoaded) return;
  window.__tarkipayLandingLoaded = true;

  // =========================================================================
  // 1. UTILIDADES Y FORMATEADORES DE DATOS
  // =========================================================================

  /**
   * Genera una cadena de fecha local en formato ISO (YYYY-MM-DD) con desplazamiento en días.
   * @param {number} offset - Días de diferencia (+1, 0, -1, etc.)
   * @returns {string} Fecha ISO
   */
  const localDate = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const today = localDate(0);
  const yesterday = localDate(-1);

  /**
   * Da formato legible a una fecha ISO para Perú ('es-PE').
   * @param {string} iso - Cadena ISO YYYY-MM-DD
   * @returns {string}
   */
  const displayDate = (iso) => {
    try {
      return new Date(`${iso}T12:00:00`).toLocaleDateString('es-PE');
    } catch (_) {
      return iso;
    }
  };

  /**
   * Sanitiza cadenas de texto para inserción segura en el DOM.
   * @param {*} value 
   * @returns {string}
   */
  const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  /**
   * Normaliza texto para comparaciones tolerantes a mayúsculas, minúsculas y tildes.
   * @param {string} text 
   * @returns {string}
   */
  const normalizeText = (text) =>
    String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();

  // =========================================================================
  // 2. MODELO DE DATOS Y ESTADO CENTRAL DE LA DEMOSTRACIÓN
  // =========================================================================

  const demoSeed = {
    businessName: 'Bodega La Esquina',
    ownerName: 'Elena Vargas',
    role: 'admin', // 'admin' | 'collab'
    soundEnabled: true,
    isOffline: false,
    lastSync: '14:33',
    sources: {
      Yape: { active: true, lastEvent: 'Hoy, 14:32' },
      Plin: { active: true, lastEvent: 'Hoy, 14:31' }
    },
    avisos: [
      {
        id: 'TP-1042',
        amount: 20.00,
        sender: 'María López',
        payTime: '14:32',
        receiveTime: '14:32',
        delayed: false,
        channel: 'Yape',
        status: 'Aviso detectado',
        verifiedInWallet: true,
        verifiedBy: 'Elena Vargas (14:32)',
        read: false,
        date: today,
        linkedSaleId: null,
        note: 'Verificado al entregar pedido'
      },
      {
        id: 'TP-1041',
        amount: 20.00,
        sender: 'Carlos Ruiz',
        payTime: '14:29',
        receiveTime: '14:31',
        delayed: true,
        channel: 'Plin',
        status: 'Aviso detectado',
        verifiedInWallet: false,
        verifiedBy: null,
        read: true,
        date: today,
        linkedSaleId: null,
        note: 'Notificación recibida con 2 min de demora'
      },
      {
        id: 'TP-1040',
        amount: 15.00,
        sender: 'Ana Torres',
        payTime: '14:29',
        receiveTime: '14:29',
        delayed: false,
        channel: 'Yape',
        status: 'Aviso detectado',
        verifiedInWallet: true,
        verifiedBy: 'Elena Vargas (14:30)',
        read: true,
        date: today,
        linkedSaleId: null,
        note: ''
      },
      {
        id: 'TP-1039',
        amount: null,
        sender: 'No disponible',
        payTime: null,
        receiveTime: '14:27',
        delayed: false,
        channel: 'No disponible',
        status: 'Datos por revisar',
        verifiedInWallet: false,
        verifiedBy: null,
        read: true,
        date: today,
        linkedSaleId: null,
        note: 'Notificación incompleta sin monto legible'
      },
      {
        id: 'TP-1020',
        amount: 35.00,
        sender: 'Jorge Mendoza',
        payTime: '17:15',
        receiveTime: '17:15',
        delayed: false,
        channel: 'Yape',
        status: 'Aviso detectado',
        verifiedInWallet: true,
        verifiedBy: 'Elena Vargas (17:16)',
        read: true,
        date: yesterday,
        linkedSaleId: null,
        note: 'Jornada anterior cerrada'
      }
    ],
    ventas: [
      {
        id: 'V-01',
        expectedAmount: 25.00,
        receivedAmount: 20.00,
        linkedAvisoId: null,
        status: 'Pendiente (Faltan S/ 5.00)',
        time: '14:31',
        note: 'Cliente indicó que completará la diferencia'
      }
    ],
    requests: [
      {
        id: 'REQ-01',
        amount: 45.00,
        saleRef: 'Mostrador #05 (Transferencia interbancaria)',
        sender: 'Lucía Pérez',
        time: '14:25',
        status: 'pending',
        responseBy: null,
        responseTime: null
      },
      {
        id: 'REQ-02',
        amount: 15.00,
        saleRef: 'Mostrador #03 (Ana Torres)',
        sender: 'Lucía Pérez',
        time: '14:29',
        status: 'resolved',
        resolutionText: 'Revisado en billetera Yape',
        responseBy: 'Elena Vargas',
        responseTime: '14:30'
      }
    ],
    team: [
      { id: 'M-1', name: 'Elena Vargas', role: 'Administradora', scope: 'Todos los periodos', schedule: 'Acceso permanente', active: true },
      { id: 'M-2', name: 'Lucía Pérez', role: 'Colaboradora', scope: 'Solo avisos de hoy', schedule: 'Lunes a sábado · 09:00 a 18:00', active: true },
      { id: 'M-3', name: 'Diego Ramos', role: 'Colaborador', scope: 'Acceso revocado', schedule: 'Sin turno vigente', active: false }
    ],
    auditLog: [
      { action: 'Actualización de horario a Lucía Pérez (09:00 a 18:00)', author: 'Elena Vargas', date: `${displayDate(today)} 08:50` },
      { action: 'Retiro de acceso a Diego Ramos', author: 'Elena Vargas', date: `${displayDate(localDate(-2))} 19:10` }
    ],
    devices: [
      { id: 'DEV-1', name: 'Samsung Galaxy A54 (Teléfono receptor principal)', lastActive: 'Sincronizó a las 14:33', closed: false },
      { id: 'DEV-2', name: 'Motorola G22 (Equipo secundario de almacén)', lastActive: '2 de octubre', closed: false }
    ],
    filters: {
      amount: null,
      sender: '',
      channel: 'all'
    },
    reqFilter: 'pending'
  };

  // Exponer estado con propósitos de auditoría o pruebas


  // =========================================================================
  // 3. SÍNTESIS DE ALERTA AUDITIVA (WEB AUDIO API)
  // =========================================================================

  const SECTIONS_CONFIG = [
    { containerId: 'hero-container', path: 'components/landing_sections/01_hero.html' },
    { containerId: 'problema-container', path: 'components/landing_sections/02_problema.html' },
    { containerId: 'solucion-container', path: 'components/landing_sections/03_solucion.html' },
    { containerId: 'beneficios-container', path: 'components/landing_sections/04_beneficios.html' },
    { containerId: 'onboarding-container', path: 'components/landing_sections/04b_onboarding.html' },
    { containerId: 'como-funciona-container', path: 'components/landing_sections/05_como_funciona.html' },
    { containerId: 'demo-container', path: 'components/landing_sections/06_demo.html' },
    { containerId: 'nosotros-container', altId: 'equipo-container', path: 'components/landing_sections/07_nosotros.html' },
    { containerId: 'contacto-container', altId: 'cta-final-container', path: 'components/landing_sections/08_contacto.html' }
  ];

  const MODAL_CANDIDATE_PATHS = [
    'components/landing_sections/modals.html',
    'components/modals.html',
    'components/reusable/modals.html'
  ];

  /**
   * Resuelve o crea un contenedor en el DOM para la inyección de una sección.
   */
  function ensureContainer(containerId, altId) {
    let el = document.getElementById(containerId);
    if (el) return el;
    if (altId) {
      el = document.getElementById(altId);
      if (el) return el;
    }
    const parent = document.getElementById('landing-content') || document.querySelector('main') || document.body;
    el = document.createElement('div');
    el.id = containerId;
    parent.appendChild(el);
    return el;
  }

  /**
   * Carga una sección HTML por fetch de manera segura.
   */
  async function fetchAndInject(container, path) {
    try {
      const res = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return false;
      let html = await res.text();
      html = html.replace(/<!-- Code injected by live-server -->[\s\S]*?<\/script>/gi, '');
      container.innerHTML = html;
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Carga los modales de la aplicación en el DOM si aún no están presentes.
   */
  async function loadModals() {
    if (document.getElementById('modal-permisos') && document.getElementById('modal-legal')) {
      return true;
    }
    let modalsHost = document.getElementById('modals-container');
    if (!modalsHost) {
      modalsHost = document.createElement('div');
      modalsHost.id = 'modals-container';
      document.body.appendChild(modalsHost);
    }
    for (const path of MODAL_CANDIDATE_PATHS) {
      const ok = await fetchAndInject(modalsHost, path);
      if (ok) return true;
    }
    return false;
  }

  /**
   * Carga secuencialmente las 8 secciones y los modales.
   */
  async function loadAllSections() {
    for (const sec of SECTIONS_CONFIG) {
      const container = ensureContainer(sec.containerId, sec.altId);
      // Solo inyectar si el contenedor está vacío
      if (!container.firstElementChild) {
        await fetchAndInject(container, sec.path);
      }
    }
    await loadModals();

    // Asegurar la carga de los scripts auxiliares si no fueron incluidos en el HTML
    await Promise.all([
      ensureScriptLoaded('js/product-showcase.js'),
      ensureScriptLoaded('js/contacto.js')
    ]);
  }

  function ensureScriptLoaded(src) {
    if (document.querySelector(`script[src="${src}"], script[src*="${src}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  }

  // =========================================================================
  // 5. INICIALIZACIÓN DE LA LÓGICA DE NEGOCIO Y EVENT LISTENERS
  // =========================================================================

  function initializeTarkiPayLogic() {
    window.initTarkiPayDemo(demoSeed);

    // -----------------------------------------------------------------------
    // H. Modales: Privacidad/Permisos y Legal con Trampa de Foco WAI-ARIA
    // -----------------------------------------------------------------------
    const modalPermisos = document.getElementById('modal-permisos');
    const openPermisosModal = () => {
      if (modalPermisos) modalPermisos.classList.remove('hidden');
    };

    const btnOpenPermisosInfo = document.getElementById('btn-open-permisos-info');
    if (btnOpenPermisosInfo && btnOpenPermisosInfo.dataset.bound !== 'true') {
      btnOpenPermisosInfo.dataset.bound = 'true';
      btnOpenPermisosInfo.addEventListener('click', openPermisosModal);
    }

    const bindFooterPermisos = () => {
      const btnFooterPermisos = document.getElementById('btn-footer-permisos');
      if (btnFooterPermisos && btnFooterPermisos.dataset.bound !== 'true') {
        btnFooterPermisos.dataset.bound = 'true';
        btnFooterPermisos.addEventListener('click', openPermisosModal);
      }
    };
    bindFooterPermisos();

    const btnCloseModalPermisos = document.getElementById('btn-close-modal-permisos');
    if (btnCloseModalPermisos && btnCloseModalPermisos.dataset.bound !== 'true') {
      btnCloseModalPermisos.dataset.bound = 'true';
      btnCloseModalPermisos.addEventListener('click', () => {
        if (modalPermisos) modalPermisos.classList.add('hidden');
      });
    }

    const btnAcceptPermisos = document.getElementById('btn-accept-permisos');
    if (btnAcceptPermisos && btnAcceptPermisos.dataset.bound !== 'true') {
      btnAcceptPermisos.dataset.bound = 'true';
      btnAcceptPermisos.addEventListener('click', () => {
        if (modalPermisos) modalPermisos.classList.add('hidden');

      });
    }

    const btnRejectPermisos = document.getElementById('btn-reject-permisos');
    if (btnRejectPermisos && btnRejectPermisos.dataset.bound !== 'true') {
      btnRejectPermisos.dataset.bound = 'true';
      btnRejectPermisos.addEventListener('click', () => {
        if (modalPermisos) modalPermisos.classList.add('hidden');

      });
    }

    // Modal Legal (Política de Privacidad y Términos)
    const modalLegal = document.getElementById('modal-legal');
    const modalLegalTitle = document.getElementById('modal-legal-title');
    const modalLegalBody = document.getElementById('modal-legal-body');

    const bindLegalButtons = () => {
      document.querySelectorAll('.footer-link-btn[data-legal]').forEach(btn => {
        if (btn.dataset.bound !== 'true') {
          btn.dataset.bound = 'true';
          btn.addEventListener('click', () => {
            const type = btn.dataset.legal;
            if (modalLegalTitle && modalLegalBody) {
              if (type === 'privacidad') {
                modalLegalTitle.textContent = 'Política de Privacidad de TarkiPay';
                modalLegalBody.innerHTML = `
                  <p class="mb-12"><strong>1. Alcance de los datos:</strong> TarkiPay procesa únicamente los campos visibles en notificaciones compatibles de pago (monto, hora, nombre del emisor y billetera de origen) con el fin de mostrárselos al equipo autorizado del comercio.</p>
                  <p class="mb-12"><strong>2. Exclusión de datos bancarios sensibles:</strong> KAYRAQ nunca solicita ni almacena contraseñas bancarias, claves de billeteras digitales ni saldos totales de cuenta.</p>
                  <p><strong>3. Control del titular:</strong> El propietario del negocio puede revocar el acceso de cualquier colaborador o desconectar una fuente de notificaciones en cualquier momento.</p>
                `;
              } else {
                modalLegalTitle.textContent = 'Términos y Condiciones de Uso';
                modalLegalBody.innerHTML = `
                  <p class="mb-12"><strong>1. Naturaleza informativa del servicio:</strong> TarkiPay es una herramienta de apoyo operativo que replica avisos de notificaciones. Un aviso detectado no constituye un estado de cuenta ni reemplaza la comprobación en la billetera receptora.</p>
                  <p><strong>2. Uso en el comercio:</strong> El administrador del negocio es responsable de definir los permisos y horarios de los colaboradores invitados mediante códigos de acceso.</p>
                `;
              }
            }
            if (modalLegal) modalLegal.classList.remove('hidden');
          });
        }
      });
    };
    bindLegalButtons();

    const btnCloseModalLegal = document.getElementById('btn-close-modal-legal');
    if (btnCloseModalLegal && btnCloseModalLegal.dataset.bound !== 'true') {
      btnCloseModalLegal.dataset.bound = 'true';
      btnCloseModalLegal.addEventListener('click', () => {
        if (modalLegal) modalLegal.classList.add('hidden');
      });
    }

    const btnOkModalLegal = document.getElementById('btn-ok-modal-legal');
    if (btnOkModalLegal && btnOkModalLegal.dataset.bound !== 'true') {
      btnOkModalLegal.dataset.bound = 'true';
      btnOkModalLegal.addEventListener('click', () => {
        if (modalLegal) modalLegal.classList.add('hidden');
      });
    }

    // Escuchar el evento de carga del footer para volver a atar botones legales
    document.addEventListener('tarkipay:footer-loaded', () => {
      bindFooterPermisos();
      bindLegalButtons();
    });

    // Accesibilidad integral en modales: trampa de foco y Escape
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      if (modal.dataset.accessibleBound === 'true') return;
      modal.dataset.accessibleBound = 'true';

      let triggerElement;
      const getFocusable = () =>
        [...modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
          .filter(el => !el.disabled && el.getClientRects().length);

      new MutationObserver(() => {
        if (!modal.classList.contains('hidden')) {
          triggerElement = document.activeElement;
          const focusables = getFocusable();
          if (focusables.length) focusables[0].focus();
        } else if (triggerElement && typeof triggerElement.focus === 'function') {
          triggerElement.focus();
        }
        document.body.style.overflow = document.querySelector('.modal-backdrop:not(.hidden)') ? 'hidden' : '';
      }).observe(modal, { attributes: true, attributeFilter: ['class'] });

      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.add('hidden');
      });

      modal.addEventListener('keydown', e => {
        if (e.key === 'Escape') modal.classList.add('hidden');
        if (e.key !== 'Tab') return;

        const items = getFocusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    });

    const btnOnbPermisos = document.getElementById('btn-trigger-permisos-from-onb');
    if (btnOnbPermisos && btnOnbPermisos.dataset.bound !== 'true') {
      btnOnbPermisos.dataset.bound = 'true';
      btnOnbPermisos.addEventListener('click', openPermisosModal);
    }

    const problemCarousel = document.querySelector('[data-problem-carousel]');
    if (problemCarousel && problemCarousel.dataset.bound !== 'true') {
      problemCarousel.dataset.bound = 'true';
      const track = problemCarousel.querySelector('[data-track]');
      const slides = Array.from(problemCarousel.querySelectorAll('.tp-problem-slide'));
      const tabs = Array.from(problemCarousel.querySelectorAll('.tp-carousel-tab'));
      const dots = Array.from(problemCarousel.querySelectorAll('.tp-dot'));
      const prevBtn = problemCarousel.querySelector('[data-prev]');
      const nextBtn = problemCarousel.querySelector('[data-next]');
      let currentIndex = 0;
      let autoPlayTimer = null;

      const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
        tabs.forEach((tab, i) => {
          const isActive = i === currentIndex;
          tab.classList.toggle('active', isActive);
          tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), 5500);
      };

      const stopAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      };

      tabs.forEach((tab, i) => tab.addEventListener('click', () => { goToSlide(i); startAutoPlay(); }));
      dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); }));
      prevBtn?.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoPlay(); });
      nextBtn?.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoPlay(); });

      // Soporte táctil (swipe en móvil)
      let touchStartX = 0;
      track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) {
          goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
          startAutoPlay();
        }
      });

      problemCarousel.addEventListener('mouseenter', stopAutoPlay);
      problemCarousel.addEventListener('mouseleave', startAutoPlay);
      startAutoPlay();
    }

    if (document.body.dataset.mobileNavBound !== 'true') {
      document.body.dataset.mobileNavBound = 'true';

      const closeMobileMenu = () => {
        const btn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('main-nav');
        if (!btn || !nav) return;
        nav.classList.remove('is-open', 'active');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú de navegación');
      };

      document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('#mobile-menu-btn');
        const nav = document.getElementById('main-nav');

        // Clic en el botón hamburguesa: frenar propagación para evitar doble toggle con app.js
        if (menuBtn && nav) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const isOpen = !(nav.classList.contains('is-open') || nav.classList.contains('active'));
          nav.classList.toggle('is-open', isOpen);
          nav.classList.toggle('active', isOpen);
          menuBtn.setAttribute('aria-expanded', String(isOpen));
          menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
          return;
        }

        // Cerrar al hacer clic en cualquier enlace del menú o fuera del header
        if (nav && (nav.classList.contains('is-open') || nav.classList.contains('active'))) {
          if (e.target.closest('#main-nav a') || !e.target.closest('.site-header')) {
            closeMobileMenu();
          }
        }
      }, true); // <-- Fase de captura: se ejecuta primero y bloquea listeners duplicados

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 1080) closeMobileMenu();
      });
    }

    // -----------------------------------------------------------------------
    // I. Disparar Inicialización de Vistas
    // -----------------------------------------------------------------------
    // Inicializar sub-controladores si existen
    if (typeof window.initProductShowcase === 'function') {
      window.initProductShowcase();
    }
    if (typeof window.initContactoForm === 'function') {
      window.initContactoForm();
    }
  }

  // =========================================================================
  // 6. ANIMACIONES DE SCROLL (INTERSECTION OBSERVER)
  // =========================================================================

  function initScrollAnimations() {
    const sections = document.querySelectorAll('main > div > section, main > section');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    sections.forEach(sec => {
      if (sec.id === 'inicio') return; // El Hero usa su propia animación repetible
      sec.classList.add('fade-in-section');
      observer.observe(sec);
    });

    // Animación repetible del Hero cada vez que vuelve al viewport
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroSection.classList.add('hero-animate');
          } else {
            heroSection.classList.remove('hero-animate');
          }
        });
      }, {
        threshold: 0.2
      });
      heroObserver.observe(heroSection);
    }
  }

  // =========================================================================
  // 7. ARRANQUE DEL ORQUESTADOR
  // =========================================================================

  async function bootstrap() {
    await loadAllSections();
    initializeTarkiPayLogic();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
