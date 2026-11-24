/**
 * TarkiPay - landing.js
 * Orquestador principal de la Landing Page interactiva de TarkiPay.
 * 
 * Funcionalidades y módulos:
 * 1. Carga e inyección modular de las 8 secciones ('01_hero.html' a '08_contacto.html') y modales ('modals.html').
 * 2. Estado central reactivo de la demostración (avisos, ventas, solicitudes, equipo, dispositivos).
 * 3. Switch de roles (Administradora / Colaboradora) y control de permisos de interfaz.
 * 4. Síntesis de alerta sonora (Web Audio API) y simulación de conectividad offline/online.
 * 5. Generador y simulador de avisos entrantes de pago en tiempo real.
 * 6. Búsqueda y filtrado avanzado de avisos (monto numérico, nombres tolerantes a tildes, billeteras).
 * 7. Cajón de detalle del aviso con registro de constancia "Revisado en billetera" y cierre accesible.
 * 8. Personalización en vivo del nombre de negocio y persona responsable.
 * 9. Módulo de ventas: comparación automática de montos esperados vs recibidos y cálculo de diferencias.
 * 10. Módulo de solicitudes de revisión entre colaboradores y la administración.
 * 11. Módulo de equipo: generación de códigos de un solo uso, revocación de accesos y log de auditoría.
 * 12. Módulo de fuentes de notificación y configuración/prueba de sonido de TarkiPay Box.
 * 13. Resumen diario, cálculo dinámico de estadísticas y exportación de reportes CSV RFC-4180 con protección anti-fórmulas.
 * 14. Modales de privacidad y legal con trampa de foco y navegación por teclado WAI-ARIA.
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

  const state = {
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
  window.TarkiPayState = state;

  // =========================================================================
  // 3. SÍNTESIS DE ALERTA AUDITIVA (WEB AUDIO API)
  // =========================================================================

  function playAlertSound() {
    if (!state.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Tono de campana 880Hz (A5)
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
      osc.onended = () => {
        try { ctx.close(); } catch (_) { }
      };
    } catch (_) {
      // Ignorar restricciones de autoplay si aún no hubo interacción previa
    }
  }

  // =========================================================================
  // 4. COORDINACIÓN Y CARGA MODULAR DE SECCIONES HTML
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
    // -----------------------------------------------------------------------
    // A. Personalización del Comercio y Titular
    // -----------------------------------------------------------------------
    const formConfigNegocio = document.getElementById('form-config-negocio');
    const inputBusinessName = document.getElementById('input-business-name');
    const errorBusinessName = document.getElementById('error-business-name');
    const feedbackConfigNegocio = document.getElementById('feedback-config-negocio');

    function updateBusinessNameInUI() {
      const activeBizEl = document.getElementById('sim-active-business-name');
      if (activeBizEl) activeBizEl.textContent = state.businessName;
      document.querySelectorAll('.dynamic-biz-name').forEach(el => {
        el.textContent = state.businessName;
      });
    }

    if (formConfigNegocio && formConfigNegocio.dataset.bound !== 'true') {
      formConfigNegocio.dataset.bound = 'true';

      formConfigNegocio.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = inputBusinessName ? inputBusinessName.value.trim() : '';

        if (!val) {
          if (inputBusinessName) {
            inputBusinessName.classList.add('input-invalid');
            inputBusinessName.setAttribute('aria-invalid', 'true');
            inputBusinessName.focus();
          }
          if (errorBusinessName) errorBusinessName.classList.remove('hidden');
          if (feedbackConfigNegocio) feedbackConfigNegocio.classList.add('hidden');
          return;
        }

        if (inputBusinessName) {
          inputBusinessName.classList.remove('input-invalid');
          inputBusinessName.setAttribute('aria-invalid', 'false');
        }
        if (errorBusinessName) errorBusinessName.classList.add('hidden');
        state.businessName = val;

        const ownerInput = document.getElementById('input-owner-name');
        const ownerVal = ownerInput ? ownerInput.value.trim() : '';
        const ownerMissing = !ownerVal;

        if (ownerInput) ownerInput.setAttribute('aria-invalid', String(ownerMissing));
        const errOwnerEl = document.getElementById('error-owner-name');
        if (errOwnerEl) errOwnerEl.classList.toggle('hidden', !ownerMissing);

        if (ownerMissing) {
          if (ownerInput) ownerInput.focus();
          return;
        }

        state.ownerName = ownerVal;

        // Sincronizar fuentes desde los checkboxes
        ['Yape', 'Plin'].forEach(source => {
          const chk = document.getElementById(`chk-init-${source.toLowerCase()}`);
          if (chk) {
            const desired = chk.checked;
            if (state.sources[source] && state.sources[source].active !== desired) {
              const toggleBtn = document.querySelector(`.source-toggle-btn[data-source="${source}"]`);
              if (toggleBtn) toggleBtn.click();
            }
          }
        });

        if (state.team[0]) {
          state.team[0].name = state.ownerName;
        }

        renderTeamList();
        updateBusinessNameInUI();
        renderAvisosList();
        if (feedbackConfigNegocio) feedbackConfigNegocio.classList.remove('hidden');
      });
    }

    // Botón para desplegar la personalización rápida
    const btnTogglePersonalization = document.getElementById('btn-toggle-personalization');
    const panelPersonalization = document.getElementById('demo-personalization');
    if (btnTogglePersonalization && panelPersonalization && btnTogglePersonalization.dataset.bound !== 'true') {
      btnTogglePersonalization.dataset.bound = 'true';
      btnTogglePersonalization.addEventListener('click', () => {
        const isOpen = panelPersonalization.classList.toggle('hidden') === false;
        btnTogglePersonalization.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && inputBusinessName) inputBusinessName.focus();
      });
    }

    // -----------------------------------------------------------------------
    // B. Conectividad y Switch de Roles (Administradora / Colaboradora)
    // -----------------------------------------------------------------------
    const btnRoleAdmin = document.getElementById('btn-role-admin');
    const btnRoleCollab = document.getElementById('btn-role-collab');

    function setRole(newRole) {
      state.role = newRole;
      if (btnRoleAdmin) btnRoleAdmin.classList.toggle('active', newRole === 'admin');
      if (btnRoleCollab) btnRoleCollab.classList.toggle('active', newRole === 'collab');

      document.querySelectorAll('.admin-only-tab').forEach(tab => {
        tab.classList.toggle('hidden', newRole === 'collab');
      });

      if (newRole === 'collab') {
        const avisosTab = document.querySelector('.sim-tab[data-tab="tab-avisos"]');
        if (avisosTab) avisosTab.click();
      }

      renderAvisosList();
      renderRequestsList();
    }

    if (btnRoleAdmin && btnRoleAdmin.dataset.bound !== 'true') {
      btnRoleAdmin.dataset.bound = 'true';
      btnRoleAdmin.addEventListener('click', () => setRole('admin'));
    }
    if (btnRoleCollab && btnRoleCollab.dataset.bound !== 'true') {
      btnRoleCollab.dataset.bound = 'true';
      btnRoleCollab.addEventListener('click', () => setRole('collab'));
    }

    // Control de alerta sonora
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    if (btnToggleSound && btnToggleSound.dataset.bound !== 'true') {
      btnToggleSound.dataset.bound = 'true';
      btnToggleSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        btnToggleSound.setAttribute('aria-pressed', String(state.soundEnabled));
        const soundText = document.getElementById('sound-status-text');
        if (soundText) {
          soundText.textContent = state.soundEnabled
            ? 'Alerta sonora: Activa'
            : 'Alerta sonora: Silenciada';
        }
      });
    }

    // Control de caída de red (Offline simulator)
    const btnToggleConnection = document.getElementById('btn-toggle-connection');
    function renderConnectionState() {
      const pill = document.getElementById('sim-connection-pill');
      const banner = document.getElementById('banner-offline-alert');
      const connText = document.getElementById('conn-status-text');

      if (btnToggleConnection) {
        btnToggleConnection.setAttribute('aria-pressed', String(state.isOffline));
      }

      if (state.isOffline) {
        if (pill) {
          pill.textContent = `Sin conexión · Últ. dato ${state.lastSync}`;
          pill.className = 'connection-pill offline';
        }
        if (banner) banner.classList.remove('hidden');
        const offTimeEl = document.getElementById('offline-last-time');
        if (offTimeEl) offTimeEl.textContent = state.lastSync;
        if (connText) connText.textContent = 'Restaurar conexión';
      } else {
        if (pill) {
          pill.textContent = `Teléfono receptor conectado · Últ. sinc. ${state.lastSync}`;
          pill.className = 'connection-pill online';
        }
        if (banner) banner.classList.add('hidden');
        if (connText) connText.textContent = 'Simular caída de internet';
      }
    }

    if (btnToggleConnection && btnToggleConnection.dataset.bound !== 'true') {
      btnToggleConnection.dataset.bound = 'true';
      btnToggleConnection.addEventListener('click', () => {
        state.isOffline = !state.isOffline;
        renderConnectionState();
      });
    }

    // Simular llegada de nuevo aviso entrante (+S/ 18.00 o similar)
    const btnSimulateIncoming = document.getElementById('btn-simulate-incoming');
    if (btnSimulateIncoming && btnSimulateIncoming.dataset.bound !== 'true') {
      btnSimulateIncoming.dataset.bound = 'true';
      btnSimulateIncoming.addEventListener('click', () => {
        const hasActiveSource = Object.values(state.sources).some(s => s.active);
        if (state.isOffline || !hasActiveSource) {
          alert('La simulación necesita conexión y al menos una fuente activa. Actívalas para generar un aviso.');
          return;
        }

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const currentIds = state.avisos.map(a => Number(a.id.replace('TP-', '')) || 1000);
        const newNumericId = Math.max(...currentIds, 1000) + 1;
        const newId = `TP-${newNumericId}`;

        const sampleAmounts = [18.00, 18.50, 25.00, 32.00];
        const sampleNames = ['Rosa Medina', 'Luis Paredes', 'Camila Soto', 'Manuel Flores'];
        const pick = Math.floor(Math.random() * sampleAmounts.length);

        const activeChannels = Object.keys(state.sources).filter(k => state.sources[k].active);
        const chosenChannel = activeChannels[pick % activeChannels.length] || 'Yape';

        state.avisos.unshift({
          id: newId,
          amount: sampleAmounts[pick],
          sender: sampleNames[pick],
          payTime: `${hh}:${mm}`,
          receiveTime: `${hh}:${mm}`,
          delayed: false,
          channel: chosenChannel,
          status: 'Aviso detectado',
          verifiedInWallet: false,
          verifiedBy: null,
          read: false,
          date: today,
          linkedSaleId: null,
          note: 'Recibido en tiempo real'
        });

        state.lastSync = `${hh}:${mm}`;
        if (state.sources[chosenChannel]) {
          state.sources[chosenChannel].lastEvent = `Hoy, ${hh}:${mm}`;
        }

        playAlertSound();
        renderConnectionState();
        renderAvisosList();
        populateAvisoSelect();
        renderCierreTable();
      });
    }

    // Navegación entre pestañas del simulador
    const simTabs = [...document.querySelectorAll('.sim-tab')];
    const simPanels = [...document.querySelectorAll('.sim-panel')];

    simTabs.forEach((tab, index) => {
      tab.id = `sim-tab-${index}`;
      tab.setAttribute('aria-controls', tab.dataset.tab);
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) {
        targetPanel.setAttribute('role', 'tabpanel');
        targetPanel.setAttribute('aria-labelledby', tab.id);
      }

      if (tab.dataset.bound !== 'true') {
        tab.dataset.bound = 'true';

        tab.addEventListener('click', () => {
          simTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.tabIndex = -1;
          });
          simPanels.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          tab.tabIndex = 0;

          if (targetPanel) targetPanel.classList.add('active');
        });

        tab.addEventListener('keydown', e => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
          e.preventDefault();
          const visibleTabs = simTabs.filter(t => !t.classList.contains('hidden'));
          const currentIdx = visibleTabs.indexOf(tab);
          let targetIdx = 0;

          if (e.key === 'Home') targetIdx = 0;
          else if (e.key === 'End') targetIdx = visibleTabs.length - 1;
          else if (e.key === 'ArrowRight') targetIdx = (currentIdx + 1) % visibleTabs.length;
          else if (e.key === 'ArrowLeft') targetIdx = (currentIdx - 1 + visibleTabs.length) % visibleTabs.length;

          if (visibleTabs[targetIdx]) {
            visibleTabs[targetIdx].click();
            visibleTabs[targetIdx].focus();
          }
        });
      }
    });

    // -----------------------------------------------------------------------
    // C. Módulo 1: Renderizado de Avisos, Filtros y Detalle
    // -----------------------------------------------------------------------
    const avisosListContainer = document.getElementById('avisos-list-container');
    const avisoDetailDrawer = document.getElementById('aviso-detail-drawer');
    const avisoDetailContent = document.getElementById('aviso-detail-content');
    const filterAmountInput = document.getElementById('filter-amount');
    const errorFilterAmount = document.getElementById('error-filter-amount');
    const filterSenderInput = document.getElementById('filter-sender');

    function renderAvisosList() {
      if (!avisosListContainer) return;

      const todayAvisos = state.avisos.filter(a => a.date === today);
      const querySender = normalizeText(state.filters.sender);

      const filtered = todayAvisos.filter(item => {
        // Filtro por monto
        if (state.filters.amount !== null && item.amount !== state.filters.amount) return false;
        // Filtro por nombre tolerante a tildes y mayúsculas
        if (querySender && !normalizeText(item.sender).includes(querySender)) return false;
        // Filtro por billetera
        if (state.filters.channel !== 'all' && item.channel !== state.filters.channel) return false;
        return true;
      });

      const countLabel = document.getElementById('avisos-count-label');
      if (countLabel) {
        countLabel.textContent = `Mostrando ${filtered.length} de ${todayAvisos.length} avisos de hoy · Última consulta: ${state.lastSync}`;
      }

      if (filtered.length === 0) {
        avisosListContainer.innerHTML = `
          <div class="alert-banner warning">
            <div>
              <strong>Sin coincidencias: 0 avisos encontrados</strong>
              <p>No encontramos un aviso con ese criterio. Recuerda que esto no significa que el cliente no haya pagado; revisa directamente la billetera receptora o limpia el filtro.</p>
            </div>
          </div>
        `;
        return;
      }

      avisosListContainer.innerHTML = filtered.map(aviso => {
        const amountText = aviso.amount !== null ? `S/ ${aviso.amount.toFixed(2)}` : 'Monto no disponible';
        const timeText = aviso.payTime
          ? `${aviso.payTime}${aviso.delayed ? ` (Llegó ${aviso.receiveTime} con demora)` : ''}`
          : `Recepción: ${aviso.receiveTime}`;

        const badgeClass = aviso.verifiedInWallet
          ? 'verified'
          : (aviso.amount !== null ? 'positive' : 'warning');

        const badgeLabel = aviso.verifiedInWallet
          ? 'Revisado en billetera'
          : aviso.status;

        return `
          <article tabindex="0" role="button" aria-label="Ver detalle de ${aviso.id}" class="aviso-item ${aviso.read ? '' : 'unread'}" data-aviso-id="${aviso.id}">
            <div>
              <div class="aviso-amount">${amountText}</div>
              <div class="aviso-meta">${escapeHTML(aviso.sender)} · ${timeText} · ${escapeHTML(state.businessName)}</div>
              <span class="status-badge ${badgeClass}">${badgeLabel}</span>
            </div>
            <div class="aviso-right">
              <span class="channel-pill">${escapeHTML(aviso.channel)}</span>
              <span class="read-indicator">${aviso.read ? 'Visto' : 'Nuevo aviso'}</span>
            </div>
          </article>
        `;
      }).join('');

      avisosListContainer.querySelectorAll('.aviso-item').forEach(card => {
        card.addEventListener('click', () => openAvisoDetail(card.dataset.avisoId));
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openAvisoDetail(card.dataset.avisoId);
          }
        });
      });
    }

    function openAvisoDetail(avisoId) {
      const aviso = state.avisos.find(a => a.id === avisoId);
      if (!aviso || !avisoDetailDrawer || !avisoDetailContent) return;

      aviso.read = true;
      renderAvisosList();

      const amountDisplay = aviso.amount !== null ? `S/ ${aviso.amount.toFixed(2)}` : 'No disponible en la notificación';
      avisoDetailDrawer.classList.remove('hidden');

      const btnCloseDetail = document.getElementById('btn-close-detail');
      if (btnCloseDetail) btnCloseDetail.focus();

      avisoDetailContent.innerHTML = `
        <div class="detail-grid">
          <div><strong>Código del aviso:</strong> <span>${escapeHTML(aviso.id)} (Mismo en App y Box)</span></div>
          <div><strong>Comercio:</strong> <span>${escapeHTML(state.businessName)}</span></div>
          <div><strong>Importe:</strong> <span>${amountDisplay}</span></div>
          <div><strong>Emisor:</strong> <span>${escapeHTML(aviso.sender)}</span></div>
          <div><strong>Hora registrada:</strong> <span>${aviso.payTime ? `Pago ${aviso.payTime} / Recepción ${aviso.receiveTime}` : `Recepción ${aviso.receiveTime}`}</span></div>
          <div><strong>Billetera:</strong> <span>${escapeHTML(aviso.channel)}</span></div>
          <div><strong>Estado:</strong> <span>${aviso.verifiedInWallet ? `Verificado en billetera por ${escapeHTML(aviso.verifiedBy)}` : escapeHTML(aviso.status)}</span></div>
        </div>
        <div class="guideline-note mb-12">
          <strong>¿Tienes dudas sobre este cobro?</strong>
          <p>Contrasta estos datos abriendo la aplicación de tu billetera receptora antes de cerrar la venta.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="btn-mark-wallet-verified">
          Dejar constancia: "Verifiqué este abono en la billetera"
        </button>
      `;

      const btnMark = document.getElementById('btn-mark-wallet-verified');
      if (btnMark) {
        btnMark.addEventListener('click', () => {
          const actor = state.role === 'admin' ? state.ownerName : 'Lucía Pérez';
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          aviso.verifiedInWallet = true;
          aviso.verifiedBy = `${actor} (${timeStr})`;
          openAvisoDetail(aviso.id);
          renderAvisosList();
          renderCierreTable();
        });
      }
    }

    const btnCloseDetail = document.getElementById('btn-close-detail');
    if (btnCloseDetail && btnCloseDetail.dataset.bound !== 'true') {
      btnCloseDetail.dataset.bound = 'true';
      btnCloseDetail.addEventListener('click', () => {
        if (avisoDetailDrawer) avisoDetailDrawer.classList.add('hidden');
      });
    }

    // Cerrar cajón de detalle con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && avisoDetailDrawer && !avisoDetailDrawer.classList.contains('hidden')) {
        avisoDetailDrawer.classList.add('hidden');
      }
    });

    // Formulario de filtrado por monto
    const formFilterAvisos = document.getElementById('form-filter-avisos');
    if (formFilterAvisos && formFilterAvisos.dataset.bound !== 'true') {
      formFilterAvisos.dataset.bound = 'true';

      formFilterAvisos.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = filterAmountInput ? filterAmountInput.value.trim() : '';

        if (raw === '') {
          state.filters.amount = null;
          if (filterAmountInput) filterAmountInput.classList.remove('input-invalid');
          if (errorFilterAmount) errorFilterAmount.classList.add('hidden');
          renderAvisosList();
          return;
        }

        const num = parseFloat(raw);
        if (isNaN(num) || num <= 0) {
          if (filterAmountInput) filterAmountInput.classList.add('input-invalid');
          if (errorFilterAmount) errorFilterAmount.classList.remove('hidden');
          return;
        }

        if (filterAmountInput) filterAmountInput.classList.remove('input-invalid');
        if (errorFilterAmount) errorFilterAmount.classList.add('hidden');
        state.filters.amount = num;
        renderAvisosList();
      });
    }

    // Chips de prueba rápida
    document.querySelectorAll('.chip-btn').forEach(chip => {
      if (chip.dataset.bound !== 'true') {
        chip.dataset.bound = 'true';
        chip.addEventListener('click', () => {
          if (filterAmountInput) filterAmountInput.value = chip.dataset.quickAmount;
          if (formFilterAvisos) formFilterAvisos.dispatchEvent(new Event('submit'));
        });
      }
    });

    // Filtro por emisor
    if (filterSenderInput && filterSenderInput.dataset.bound !== 'true') {
      filterSenderInput.dataset.bound = 'true';
      filterSenderInput.addEventListener('input', () => {
        state.filters.sender = filterSenderInput.value.trim();
        renderAvisosList();
      });
    }

    // Segmented buttons para filtrar por billetera
    document.querySelectorAll('#wallet-channel-filter .seg-btn').forEach(btn => {
      if (btn.dataset.bound !== 'true') {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          document.querySelectorAll('#wallet-channel-filter .seg-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.filters.channel = btn.dataset.channel || 'all';
          renderAvisosList();
        });
      }
    });

    // Limpiar todos los filtros
    const btnClearAllFilters = document.getElementById('btn-clear-all-filters');
    if (btnClearAllFilters && btnClearAllFilters.dataset.bound !== 'true') {
      btnClearAllFilters.dataset.bound = 'true';
      btnClearAllFilters.addEventListener('click', () => {
        if (filterAmountInput) {
          filterAmountInput.value = '';
          filterAmountInput.classList.remove('input-invalid');
        }
        if (filterSenderInput) filterSenderInput.value = '';
        if (errorFilterAmount) errorFilterAmount.classList.add('hidden');
        state.filters = { amount: null, sender: '', channel: 'all' };

        document.querySelectorAll('#wallet-channel-filter .seg-btn').forEach((b, i) => {
          b.classList.toggle('active', i === 0);
        });
        renderAvisosList();
      });
    }

    // Botón refrescar avisos
    const btnRefreshAvisos = document.getElementById('btn-refresh-avisos');
    if (btnRefreshAvisos && btnRefreshAvisos.dataset.bound !== 'true') {
      btnRefreshAvisos.dataset.bound = 'true';
      btnRefreshAvisos.addEventListener('click', () => {
        if (!state.isOffline) {
          const now = new Date();
          state.lastSync = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
        renderConnectionState();
        renderAvisosList();
      });
    }

    // -----------------------------------------------------------------------
    // D. Módulo 2: Vinculación de Ventas y Solicitudes de Revisión
    // -----------------------------------------------------------------------
    const saleSelectAviso = document.getElementById('sale-select-aviso');
    const ventaComparisonResult = document.getElementById('venta-comparison-result');
    const ventasRegisteredList = document.getElementById('ventas-registered-list');

    function populateAvisoSelect() {
      if (!saleSelectAviso) return;
      const todayAvisos = state.avisos.filter(a => a.date === today);
      saleSelectAviso.innerHTML = todayAvisos.map(a => {
        const amt = a.amount !== null ? `S/ ${a.amount.toFixed(2)}` : 'Sin monto legible';
        const linkedTag = a.linkedSaleId ? ` [Asociado a ${a.linkedSaleId}]` : '';
        return `<option value="${a.id}">${escapeHTML(a.id)} · ${amt} · ${escapeHTML(a.sender)} (${a.receiveTime})${linkedTag}</option>`;
      }).join('');
    }

    function renderVentasList() {
      if (!ventasRegisteredList) return;
      ventasRegisteredList.innerHTML = state.ventas.map(v => `
        <div class="compact-item">
          <div>
            <strong>${escapeHTML(v.id)} · Esperado: S/ ${v.expectedAmount.toFixed(2)}</strong>
            <span class="text-small text-muted block">Recibido: ${v.receivedAmount !== null ? `S/ ${v.receivedAmount.toFixed(2)}` : 'Pendiente'} · ${v.time} ${v.note ? `· Nota: ${escapeHTML(v.note)}` : ''}</span>
          </div>
          <div>
            <span class="status-badge ${v.status.includes('Asociada') ? 'positive' : 'warning'}">${escapeHTML(v.status)}</span>
            ${v.linkedAvisoId ? `<button type="button" class="btn-text btn-unlink-sale" data-sale-id="${v.id}">Corregir vínculo</button>` : ''}
          </div>
        </div>
      `).join('');

      ventasRegisteredList.querySelectorAll('.btn-unlink-sale').forEach(btn => {
        btn.addEventListener('click', () => {
          const sale = state.ventas.find(s => s.id === btn.dataset.saleId);
          if (sale && sale.linkedAvisoId) {
            const av = state.avisos.find(a => a.id === sale.linkedAvisoId);
            if (av) av.linkedSaleId = null;
            sale.linkedAvisoId = null;
            sale.status = 'Vínculo retirado por corrección';
            populateAvisoSelect();
            renderVentasList();
            renderCierreTable();
          }
        });
      });
    }

    const formVincularVenta = document.getElementById('form-vincular-venta');
    if (formVincularVenta && formVincularVenta.dataset.bound !== 'true') {
      formVincularVenta.dataset.bound = 'true';

      formVincularVenta.addEventListener('submit', (e) => {
        e.preventDefault();
        const expectedInput = document.getElementById('sale-expected-amount');
        const errorSale = document.getElementById('error-sale-amount');
        const expected = parseFloat(expectedInput ? expectedInput.value : '');

        if (isNaN(expected) || expected <= 0) {
          if (expectedInput) expectedInput.classList.add('input-invalid');
          if (errorSale) errorSale.classList.remove('hidden');
          return;
        }

        if (expectedInput) expectedInput.classList.remove('input-invalid');
        if (errorSale) errorSale.classList.add('hidden');

        const selectedAviso = state.avisos.find(a => a.id === (saleSelectAviso ? saleSelectAviso.value : ''));
        if (!selectedAviso || !ventaComparisonResult) return;

        ventaComparisonResult.classList.remove('hidden');

        if (selectedAviso.linkedSaleId) {
          ventaComparisonResult.className = 'comparison-result-box mismatch';
          ventaComparisonResult.textContent = `Atención: El aviso ${selectedAviso.id} ya fue asociado a la venta ${selectedAviso.linkedSaleId}. Evita duplicar la entrega.`;
          return;
        }

        if (selectedAviso.amount === null) {
          ventaComparisonResult.className = 'comparison-result-box mismatch';
          ventaComparisonResult.textContent = `El aviso ${selectedAviso.id} no incluye un monto legible. Revisa la billetera receptora antes de entregar.`;
          return;
        }

        const diff = expected - selectedAviso.amount;
        const newSaleId = `V-0${state.ventas.length + 1}`;
        const incidentNote = document.getElementById('sale-incident-note');
        const noteVal = incidentNote ? incidentNote.value.trim() : '';

        if (Math.abs(diff) < 0.001) {
          selectedAviso.linkedSaleId = newSaleId;
          state.ventas.unshift({
            id: newSaleId,
            expectedAmount: expected,
            receivedAmount: selectedAviso.amount,
            linkedAvisoId: selectedAviso.id,
            status: `Asociada con ${selectedAviso.id}`,
            time: selectedAviso.receiveTime,
            note: noteVal
          });
          ventaComparisonResult.className = 'comparison-result-box match';
          ventaComparisonResult.textContent = `Monto exacto comprobado (S/ ${expected.toFixed(2)}). El aviso ${selectedAviso.id} quedó asociado a la venta ${newSaleId}.`;
        } else if (diff > 0) {
          state.ventas.unshift({
            id: newSaleId,
            expectedAmount: expected,
            receivedAmount: selectedAviso.amount,
            linkedAvisoId: null,
            status: `Pendiente (Faltan S/ ${diff.toFixed(2)})`,
            time: selectedAviso.receiveTime,
            note: noteVal || 'Pago incompleto detectado'
          });
          ventaComparisonResult.className = 'comparison-result-box mismatch';
          ventaComparisonResult.textContent = `Diferencia detectada: Esperabas S/ ${expected.toFixed(2)} y el aviso es por S/ ${selectedAviso.amount.toFixed(2)}. Faltan S/ ${diff.toFixed(2)}.`;
        } else {
          selectedAviso.linkedSaleId = newSaleId;
          state.ventas.unshift({
            id: newSaleId,
            expectedAmount: expected,
            receivedAmount: selectedAviso.amount,
            linkedAvisoId: selectedAviso.id,
            status: `Asociada (+S/ ${Math.abs(diff).toFixed(2)})`,
            time: selectedAviso.receiveTime,
            note: noteVal
          });
          ventaComparisonResult.className = 'comparison-result-box match';
          ventaComparisonResult.textContent = `Aviso asociado a ${newSaleId}. El importe recibido supera en S/ ${Math.abs(diff).toFixed(2)} al esperado.`;
        }

        populateAvisoSelect();
        renderVentasList();
        renderCierreTable();
      });
    }

    const btnMarkSalePending = document.getElementById('btn-mark-sale-pending');
    if (btnMarkSalePending && btnMarkSalePending.dataset.bound !== 'true') {
      btnMarkSalePending.dataset.bound = 'true';
      btnMarkSalePending.addEventListener('click', () => {
        const expectedInput = document.getElementById('sale-expected-amount');
        const expected = parseFloat(expectedInput ? expectedInput.value : 0) || 0;
        if (expected <= 0) return;

        const newSaleId = `V-0${state.ventas.length + 1}`;
        const incidentNote = document.getElementById('sale-incident-note');
        const noteVal = incidentNote ? incidentNote.value.trim() : '';

        state.ventas.unshift({
          id: newSaleId,
          expectedAmount: expected,
          receivedAmount: null,
          linkedAvisoId: null,
          status: 'Pendiente de revisión',
          time: state.lastSync,
          note: noteVal || 'A la espera de verificación en billetera'
        });

        renderVentasList();
        renderCierreTable();
      });
    }

    // Pedidos de revisión al administrador
    const requestsListContainer = document.getElementById('requests-list-container');
    function renderRequestsList() {
      if (!requestsListContainer) return;

      const list = state.requests.filter(r => r.status === state.reqFilter);
      if (list.length === 0) {
        requestsListContainer.innerHTML = `<p class="text-small text-muted">No hay consultas en esta sección.</p>`;
        return;
      }

      requestsListContainer.innerHTML = list.map(req => {
        if (req.status === 'pending') {
          return `
            <div class="compact-item">
              <div>
                <strong>S/ ${req.amount.toFixed(2)} · ${escapeHTML(req.saleRef)}</strong>
                <span class="text-small text-muted block">Enviado por ${escapeHTML(req.sender)} a las ${req.time}</span>
              </div>
              ${state.role === 'admin' ? `
                <button type="button" class="btn btn-primary btn-sm btn-resolve-req" data-req-id="${req.id}">
                  Confirmar abono revisado
                </button>
              ` : `<span class="status-badge warning">Pendiente de respuesta</span>`}
            </div>
          `;
        }
        return `
          <div class="compact-item">
            <div>
              <strong>S/ ${req.amount.toFixed(2)} · ${escapeHTML(req.saleRef)}</strong>
              <span class="text-small text-muted block">${escapeHTML(req.resolutionText)} por ${escapeHTML(req.responseBy)} a las ${req.responseTime}</span>
            </div>
            <span class="status-badge positive">Confirmado</span>
          </div>
        `;
      }).join('');

      requestsListContainer.querySelectorAll('.btn-resolve-req').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = state.requests.find(r => r.id === btn.dataset.reqId);
          if (target) {
            target.status = 'resolved';
            target.resolutionText = 'Comprobado en billetera receptora';
            target.responseBy = state.ownerName;
            target.responseTime = state.lastSync;
            renderRequestsList();
          }
        });
      });
    }

    const formRequestReview = document.getElementById('form-request-review');
    if (formRequestReview && formRequestReview.dataset.bound !== 'true') {
      formRequestReview.dataset.bound = 'true';

      formRequestReview.addEventListener('submit', (e) => {
        e.preventDefault();
        const amtInput = document.getElementById('req-amount');
        const refInput = document.getElementById('req-sale-ref');
        const amt = parseFloat(amtInput ? amtInput.value : '');
        const ref = refInput ? refInput.value.trim() : '';

        if (isNaN(amt) || amt <= 0 || !ref) return;

        state.requests.unshift({
          id: `REQ-0${state.requests.length + 1}`,
          amount: amt,
          saleRef: ref,
          sender: state.role === 'admin' ? state.ownerName : 'Lucía Pérez',
          time: state.lastSync,
          status: 'pending',
          responseBy: null,
          responseTime: null
        });

        renderRequestsList();
      });
    }

    document.querySelectorAll('#requests-filter-tabs .seg-btn').forEach(btn => {
      if (btn.dataset.bound !== 'true') {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          document.querySelectorAll('#requests-filter-tabs .seg-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.reqFilter = btn.dataset.reqFilter || 'pending';
          renderRequestsList();
        });
      }
    });

    // -----------------------------------------------------------------------
    // E. Módulo 3: Equipo, Horarios y Auditoría
    // -----------------------------------------------------------------------
    const teamMembersList = document.getElementById('team-members-list');
    const permissionsAuditLog = document.getElementById('permissions-audit-log');

    function renderTeamList() {
      if (!teamMembersList) return;
      teamMembersList.innerHTML = state.team.map(member => `
        <div class="compact-item">
          <div>
            <strong>${escapeHTML(member.name)} · ${escapeHTML(member.role)}</strong>
            <span class="text-small text-muted block">${escapeHTML(member.scope)} · ${escapeHTML(member.schedule)}</span>
          </div>
          ${member.active && member.role !== 'Administradora' ? `
            <button type="button" class="btn btn-danger btn-sm btn-revoke-member" data-member-id="${member.id}">
              Retirar acceso
            </button>
          ` : `<span class="status-badge ${member.active ? 'positive' : 'warning'}">${member.active ? 'Acceso vigente' : 'Acceso revocado'}</span>`}
        </div>
      `).join('');

      teamMembersList.querySelectorAll('.btn-revoke-member').forEach(btn => {
        btn.addEventListener('click', () => {
          const m = state.team.find(item => item.id === btn.dataset.memberId);
          if (m) {
            m.active = false;
            m.scope = 'Acceso retirado';
            state.auditLog.unshift({
              action: `Retiro de acceso a ${m.name}`,
              author: state.ownerName,
              date: `${displayDate(today)} ${state.lastSync}`
            });
            renderTeamList();
            renderAuditLog();
          }
        });
      });
    }

    function renderAuditLog() {
      if (!permissionsAuditLog) return;
      permissionsAuditLog.innerHTML = state.auditLog.map(entry => `
        <div class="compact-item">
          <div>
            <strong>${escapeHTML(entry.action)}</strong>
            <span class="text-small text-muted block">Por ${escapeHTML(entry.author)} · ${escapeHTML(entry.date)}</span>
          </div>
        </div>
      `).join('');
    }

    const formInviteMember = document.getElementById('form-invite-member');
    if (formInviteMember && formInviteMember.dataset.bound !== 'true') {
      formInviteMember.dataset.bound = 'true';

      formInviteMember.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('invite-name');
        const errorInvite = document.getElementById('error-invite-name');
        const nameVal = nameInput ? nameInput.value.trim() : '';

        if (!nameVal) {
          if (nameInput) nameInput.classList.add('input-invalid');
          if (errorInvite) errorInvite.classList.remove('hidden');
          return;
        }

        if (nameInput) nameInput.classList.remove('input-invalid');
        if (errorInvite) errorInvite.classList.add('hidden');

        const scopeInput = document.getElementById('invite-history-scope');
        const scheduleInput = document.getElementById('invite-schedule');
        const scopeVal = scopeInput ? scopeInput.value : 'Solo avisos de hoy';
        const scheduleVal = scheduleInput ? scheduleInput.value : 'Lunes a sábado · 09:00 a 18:00';
        const code = `${Math.floor(100 + Math.random() * 899)} ${Math.floor(100 + Math.random() * 899)}`;

        state.team.push({
          id: `M-${state.team.length + 1}`,
          name: nameVal,
          role: 'Colaborador',
          scope: scopeVal,
          schedule: scheduleVal,
          active: true
        });

        state.auditLog.unshift({
          action: `Invitación creada para ${nameVal} (${scopeVal})`,
          author: state.ownerName,
          date: `${displayDate(today)} ${state.lastSync}`
        });

        const codeValEl = document.getElementById('generated-code-value');
        const codeDetEl = document.getElementById('generated-code-details');
        const codeBanner = document.getElementById('generated-code-banner');

        if (codeValEl) codeValEl.textContent = code;
        if (codeDetEl) codeDetEl.textContent = `Asignado a ${nameVal} · ${scopeVal} · ${scheduleVal}`;
        if (codeBanner) codeBanner.classList.remove('hidden');

        if (nameInput) nameInput.value = '';
        renderTeamList();
        renderAuditLog();
      });
    }

    // -----------------------------------------------------------------------
    // F. Módulo 4: Fuentes de Notificación y TarkiPay Box
    // -----------------------------------------------------------------------
    document.querySelectorAll('.source-toggle-btn').forEach(btn => {
      if (btn.dataset.bound !== 'true') {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const src = btn.dataset.source;
          if (!state.sources[src]) return;

          state.sources[src].active = !state.sources[src].active;
          const isAct = state.sources[src].active;
          btn.textContent = isAct ? 'Desactivar fuente' : 'Activar fuente';
          const metaEl = document.getElementById(`source-${src.toLowerCase()}-meta`);
          if (metaEl) {
            metaEl.textContent = isAct
              ? `Estado: Activa · Último aviso recibido: ${state.sources[src].lastEvent}`
              : `Estado: Desactivada · El historial previo de ${src} se conserva`;
          }
        });
      }
    });

    const btnTestSourceConfig = document.getElementById('btn-test-source-config');
    if (btnTestSourceConfig && btnTestSourceConfig.dataset.bound !== 'true') {
      btnTestSourceConfig.dataset.bound = 'true';
      btnTestSourceConfig.addEventListener('click', () => {
        const feedbackEl = document.getElementById('source-test-feedback');
        if (feedbackEl) feedbackEl.classList.remove('hidden');
      });
    }

    const activeDevicesList = document.getElementById('active-devices-list');
    function renderDevicesList() {
      if (!activeDevicesList) return;
      activeDevicesList.innerHTML = state.devices.map(d => `
        <div class="compact-item">
          <div>
            <strong>${escapeHTML(d.name)}</strong>
            <span class="text-small text-muted block">${escapeHTML(d.lastActive)}</span>
          </div>
          ${!d.closed ? `
            <button type="button" class="btn btn-secondary btn-sm btn-close-device" data-dev-id="${d.id}">
              Cerrar sesión
            </button>
          ` : `<span class="status-badge warning">Sesión finalizada</span>`}
        </div>
      `).join('');

      activeDevicesList.querySelectorAll('.btn-close-device').forEach(btn => {
        btn.addEventListener('click', () => {
          const dev = state.devices.find(item => item.id === btn.dataset.devId);
          if (dev) {
            dev.closed = true;
            renderDevicesList();
          }
        });
      });
    }

    const boxActionFeedback = document.getElementById('box-action-feedback');
    const formPairBox = document.getElementById('form-pair-box');
    if (formPairBox && formPairBox.dataset.bound !== 'true') {
      formPairBox.dataset.bound = 'true';

      formPairBox.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('box-pair-code');
        const soundInput = document.getElementById('box-sound-level');
        const code = codeInput ? codeInput.value.trim() : '731 204';
        const sound = soundInput ? soundInput.value : 'Tono Campana · Volumen 60%';

        const titleEl = document.getElementById('box-connection-title');
        const subEl = document.getElementById('box-connection-sub');
        if (titleEl) titleEl.textContent = `Conectado · ${escapeHTML(state.businessName)}`;
        if (subEl) subEl.textContent = `Código ${code} vinculado · ${sound}`;

        if (boxActionFeedback) {
          boxActionFeedback.className = 'alert-box success mt-12';
          boxActionFeedback.textContent = `Vinculación simulada de TarkiPay Box para ${escapeHTML(state.businessName)} (${sound}).`;
          boxActionFeedback.classList.remove('hidden');
        }
      });
    }

    const btnTestBoxSound = document.getElementById('btn-test-box-sound');
    if (btnTestBoxSound && btnTestBoxSound.dataset.bound !== 'true') {
      btnTestBoxSound.dataset.bound = 'true';
      btnTestBoxSound.addEventListener('click', () => {
        playAlertSound();
        if (boxActionFeedback) {
          boxActionFeedback.className = 'alert-box success mt-12';
          boxActionFeedback.textContent = 'Sonido de prueba reproducido en este navegador (simulación de TarkiPay Box). No representa un cobro y no suma al total del día.';
          boxActionFeedback.classList.remove('hidden');
        }
      });
    }

    const btnTestExpiredBoxCode = document.getElementById('btn-test-expired-box-code');
    if (btnTestExpiredBoxCode && btnTestExpiredBoxCode.dataset.bound !== 'true') {
      btnTestExpiredBoxCode.dataset.bound = 'true';
      btnTestExpiredBoxCode.addEventListener('click', () => {
        if (boxActionFeedback) {
          boxActionFeedback.className = 'alert-box error mt-12';
          boxActionFeedback.textContent = 'No se pudo vincular: El código temporal ya venció o fue utilizado. Solicita un código nuevo en el Box.';
          boxActionFeedback.classList.remove('hidden');
        }
      });
    }

    // -----------------------------------------------------------------------
    // G. Módulo 5: Resumen Diario y Generación de Reportes CSV
    // -----------------------------------------------------------------------
    const cierreDateSelect = document.getElementById('cierre-date-select');
    const cierreTableBody = document.getElementById('cierre-table-body');

    function renderCierreTable() {
      if (!cierreDateSelect || !cierreTableBody) return;
      const selectedDate = cierreDateSelect.value;
      const dayAvisos = selectedDate === 'ALL'
        ? state.avisos
        : state.avisos.filter(a => a.date === selectedDate);

      const totalAvisos = dayAvisos.reduce((acc, a) => acc + (a.amount !== null ? a.amount : 0), 0);
      const totalRevisados = dayAvisos.reduce((acc, a) => acc + (a.verifiedInWallet && a.amount !== null ? a.amount : 0), 0);
      const legiblesCount = dayAvisos.filter(a => a.amount !== null).length;

      const statTotalAvisos = document.getElementById('stat-total-avisos');
      const statCountAvisos = document.getElementById('stat-count-avisos');
      const statTotalRevisados = document.getElementById('stat-total-revisados');
      const statTotalPendientes = document.getElementById('stat-total-pendientes');

      if (statTotalAvisos) statTotalAvisos.textContent = `S/ ${totalAvisos.toFixed(2)}`;
      if (statCountAvisos) statCountAvisos.textContent = `${dayAvisos.length} avisos en el periodo · ${legiblesCount} con importe legible.`;
      if (statTotalRevisados) statTotalRevisados.textContent = `S/ ${totalRevisados.toFixed(2)}`;
      if (statTotalPendientes) {
        statTotalPendientes.textContent = `${state.ventas.filter(v => v.status.includes('Pendiente')).length} pendiente(s)`;
      }

      if (dayAvisos.length === 0) {
        cierreTableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-muted">No se registraron movimientos en la fecha seleccionada.</td>
          </tr>
        `;
        return;
      }

      cierreTableBody.innerHTML = dayAvisos.map(a => `
        <tr>
          <td>${a.date} · ${a.receiveTime}</td>
          <td><code>${escapeHTML(a.id)}</code></td>
          <td><strong>${a.amount !== null ? `S/ ${a.amount.toFixed(2)}` : 'No disponible'}</strong></td>
          <td>${escapeHTML(a.sender)}</td>
          <td>${escapeHTML(a.channel)}</td>
          <td>
            <span class="status-badge ${a.verifiedInWallet ? 'verified' : (a.amount !== null ? 'positive' : 'warning')}">
              ${a.verifiedInWallet ? 'Revisado en billetera' : escapeHTML(a.status)}
            </span>
          </td>
          <td>${escapeHTML(a.verifiedBy || a.note || '—')}</td>
        </tr>
      `).join('');
    }

    if (cierreDateSelect) {
      Array.from(cierreDateSelect.options).forEach((option, index) => {
        if (option.value === 'ALL') {
          option.textContent = 'Todas las jornadas de ejemplo';
          return;
        }
        option.value = localDate(-index);
        option.textContent = `${['Hoy', 'Ayer', 'Hace dos días'][index]} · ${displayDate(option.value)}${index === 2 ? ' (Sin movimientos)' : ''}`;
      });

      if (cierreDateSelect.dataset.bound !== 'true') {
        cierreDateSelect.dataset.bound = 'true';
        cierreDateSelect.addEventListener('change', renderCierreTable);
      }
    }

    // Exportador de Reportes CSV (Cumple RFC-4180 con protección anti-inyección de fórmulas)
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv && btnExportCsv.dataset.bound !== 'true') {
      btnExportCsv.dataset.bound = 'true';

      btnExportCsv.addEventListener('click', () => {
        if (state.role !== 'admin') {
          alert('Solo la cuenta Administradora del negocio está autorizada para exportar el reporte en CSV.');
          return;
        }

        const selectedDate = cierreDateSelect ? cierreDateSelect.value : 'ALL';
        const rows = [
          ['Negocio', 'Fecha', 'Codigo', 'Hora', 'Importe (S/)', 'Emisor', 'Billetera', 'Estado', 'Observacion']
        ];

        const listToExport = selectedDate === 'ALL'
          ? state.avisos
          : state.avisos.filter(a => a.date === selectedDate);

        listToExport.forEach(a => {
          rows.push([
            state.businessName,
            a.date,
            a.id,
            a.receiveTime,
            a.amount !== null ? a.amount.toFixed(2) : 'No disponible',
            a.sender,
            a.channel,
            a.verifiedInWallet ? 'Revisado en billetera' : a.status,
            a.verifiedBy || a.note || ''
          ]);
        });

        const csvCell = value => {
          let text = String(value ?? '');
          // Mitigación de inyección de fórmulas en hojas de cálculo
          if (/^[=+@-]/.test(text)) text = `'${text}`;
          return `"${text.replace(/"/g, '""')}"`;
        };

        const csvContent = '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const encodedUri = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Reporte_TarkiPay_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(encodedUri), 1000);
      });
    }

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
        state.isOffline = false;
        renderConnectionState();
      });
    }

    const btnRejectPermisos = document.getElementById('btn-reject-permisos');
    if (btnRejectPermisos && btnRejectPermisos.dataset.bound !== 'true') {
      btnRejectPermisos.dataset.bound = 'true';
      btnRejectPermisos.addEventListener('click', () => {
        if (modalPermisos) modalPermisos.classList.add('hidden');
        state.isOffline = true;
        renderConnectionState();
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
    renderConnectionState();
    renderAvisosList();
    populateAvisoSelect();
    renderVentasList();
    renderRequestsList();
    renderTeamList();
    renderAuditLog();
    renderDevicesList();
    renderCierreTable();

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
