/**
 * TarkiPay - product-showcase.js
 * Controlador del Showcase Interactivo en la sección Solución.
 * 
 * Funcionalidades:
 * - Navegación accesible por pestañas (WAI-ARIA: Avisos / Ventas / Equipo)
 * - Roving tabindex y atajos de teclado (flechas, Inicio, Fin)
 * - Orientación responsiva (horizontal en móviles, vertical en escritorio)
 * - Búsqueda rápida de emisores con normalización tolerante a tildes
 * - Enlaces directos a la demo interactiva (data-demo-target) con cambio automático a rol Admin si es requerido
 */

(function () {
  'use strict';

  function initProductShowcase() {
    const showcase = document.getElementById('product-showcase');
    if (!showcase || showcase.dataset.initialized === 'true') return;
    showcase.dataset.initialized = 'true';

    const tablist = showcase.querySelector('[role="tablist"]');
    const tabs = [...showcase.querySelectorAll('.tp-product-tab')];
    const panels = [...showcase.querySelectorAll('.tp-product-panel')];
    const search = document.getElementById('product-preview-search');
    const rows = [...showcase.querySelectorAll('[data-preview-sender]')];
    const empty = document.getElementById('product-preview-empty');

    // 1. Orientación accesible responsiva
    const compactMedia = window.matchMedia('(max-width: 800px)');
    const updateOrientation = () => {
      if (tablist) {
        tablist.setAttribute('aria-orientation', compactMedia.matches ? 'horizontal' : 'vertical');
      }
    };
    updateOrientation();
    compactMedia.addEventListener('change', updateOrientation);

    // 2. Selección de pestaña y panel asociado
    function selectProductView(tab) {
      if (!tab) return;
      tabs.forEach(item => {
        const isSelected = item === tab;
        item.classList.toggle('active', isSelected);
        item.setAttribute('aria-selected', String(isSelected));
        item.tabIndex = isSelected ? 0 : -1;
      });

      const targetPanelId = tab.getAttribute('aria-controls');
      panels.forEach(panel => {
        panel.hidden = panel.id !== targetPanelId;
      });
    }

    // 3. Manejo de eventos de clic y teclado en pestañas
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectProductView(tab));

      tab.addEventListener('keydown', event => {
        const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!allowedKeys.includes(event.key)) return;

        event.preventDefault();
        let nextIndex;

        if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        }

        if (nextIndex !== undefined && tabs[nextIndex]) {
          selectProductView(tabs[nextIndex]);
          tabs[nextIndex].focus();
        }
      });
    });

    // 4. Búsqueda y filtrado de emisores de ejemplo (tolerante a mayúsculas y tildes)
    const normalize = text =>
      String(text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
        .trim();

    if (search) {
      search.addEventListener('input', () => {
        const query = normalize(search.value);
        let visibleCount = 0;

        rows.forEach(row => {
          const sender = normalize(row.dataset.previewSender);
          const isMatch = sender.includes(query);
          row.hidden = !isMatch;
          if (isMatch) visibleCount++;
        });

        if (empty) {
          empty.hidden = visibleCount > 0;
        }
      });
    }

    // 5. Enlaces que redirigen a pestañas específicas del simulador de la demo
    document.querySelectorAll('[data-demo-target]').forEach(link => {
      if (link.dataset.targetBound === 'true') return;
      link.dataset.targetBound = 'true';

      link.addEventListener('click', () => {
        const targetTabName = link.dataset.demoTarget;
        const targetTab = [...document.querySelectorAll('.sim-tab')].find(
          t => t.dataset.tab === targetTabName
        );
        if (!targetTab) return;

        // Si la pestaña requiere privilegios de administración, cambiamos automáticamente el rol
        if (targetTab.classList.contains('admin-only-tab')) {
          const btnAdmin = document.getElementById('btn-role-admin');
          if (btnAdmin) btnAdmin.click();
        }

        targetTab.click();
        targetTab.focus({ preventScroll: true });
      });
    });
  }

  // Exportar al objeto global para inicialización modular y directa
  window.initProductShowcase = initProductShowcase;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductShowcase);
  } else {
    initProductShowcase();
  }
})();
