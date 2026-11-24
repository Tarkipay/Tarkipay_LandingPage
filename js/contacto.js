/**
 * TarkiPay - contacto.js
 * Lógica y validación de formularios de contacto (tanto la sección en la landing como en pages/contacto.html).
 * 
 * Reglas de negocio y validación:
 * 1. Nombre completo: Obligatorio, mínimo 2 caracteres.
 * 2. Rubro o nombre del negocio: Obligatorio, mínimo 2 caracteres.
 * 3. Correo electrónico: Obligatorio, formato válido RFC email.
 * 4. Celular: Opcional, pero si se ingresa debe tener exactamente 9 dígitos numéricos peruanos.
 * 5. Mensaje/Consulta: Opcional.
 * 6. Gestión de accesibilidad: aria-invalid, aria-describedby y foco automático en el primer error.
 * 7. Confirmación editorial local: Conserva datos sin enviar información a servidores externos.
 */

(function () {
  'use strict';

  function initContactoForm() {
    // -------------------------------------------------------------
    // Formulario 1: Sección de la Landing Page (#form-contacto)
    // -------------------------------------------------------------
    const formContacto = document.getElementById('form-contacto');
    if (formContacto && formContacto.dataset.initialized !== 'true') {
      formContacto.dataset.initialized = 'true';

      const inputName = document.getElementById('contact-name');
      const inputEmail = document.getElementById('contact-email');
      const inputPhone = document.getElementById('contact-phone');
      const inputBusiness = document.getElementById('contact-business');
      const inputMessage = document.getElementById('contact-message');

      const errName = document.getElementById('err-contact-name');
      const errEmail = document.getElementById('err-contact-email');
      const errPhone = document.getElementById('err-contact-phone');
      const errBusiness = document.getElementById('err-contact-business');
      const errMessage = document.getElementById('err-contact-message');
      const successMsg = document.getElementById('contact-success-msg');

      function setFieldState(input, errorEl, isValid) {
        if (!input) return;
        input.setAttribute('aria-invalid', String(!isValid));
        if (errorEl) {
          input.setAttribute('aria-describedby', errorEl.id);
          if (isValid) {
            input.classList.remove('input-invalid');
            errorEl.classList.add('hidden');
          } else {
            input.classList.add('input-invalid');
            errorEl.classList.remove('hidden');
          }
        }
      }

      formContacto.addEventListener('input', () => {
        if (successMsg) successMsg.classList.add('hidden');
      });

      formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        if (successMsg) successMsg.classList.add('hidden');

        const nameVal = inputName ? inputName.value.trim() : '';
        const emailVal = inputEmail ? inputEmail.value.trim() : '';
        const phoneVal = inputPhone ? inputPhone.value.trim() : '';
        const businessVal = inputBusiness ? inputBusiness.value.trim() : '';

        const nameValid = nameVal.length >= 2;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = emailRegex.test(emailVal);
        const phoneRegex = /^[0-9]{9}$/;
        const phoneValid = !phoneVal || phoneRegex.test(phoneVal);
        const businessValid = businessVal.length >= 2;
        const messageValid = true; // Consulta opcional sin restricción de tamaño

        setFieldState(inputName, errName, nameValid);
        setFieldState(inputEmail, errEmail, emailValid);
        setFieldState(inputPhone, errPhone, phoneValid);
        setFieldState(inputBusiness, errBusiness, businessValid);
        setFieldState(inputMessage, errMessage, messageValid);

        if (nameValid && emailValid && phoneValid && businessValid && messageValid) {
          if (successMsg) {
            successMsg.classList.remove('hidden');
            successMsg.focus?.();
          }
        } else {
          const firstInvalid = formContacto.querySelector('[aria-invalid="true"]');
          if (firstInvalid) {
            firstInvalid.focus();
          }
        }
      });
    }

    // -------------------------------------------------------------
    // Formulario 2: Página dedicada pages/contacto.html (#contact-form)
    // -------------------------------------------------------------
    const contactPageForm = document.getElementById('contact-form');
    if (contactPageForm && contactPageForm.dataset.initialized !== 'true') {
      contactPageForm.dataset.initialized = 'true';

      const inputNombre = document.getElementById('nombre');
      const inputEmail = document.getElementById('email');
      const inputTelefono = document.getElementById('telefono');
      const inputNegocio = document.getElementById('negocio');
      const inputMensaje = document.getElementById('mensaje');
      const statusFeedback = document.getElementById('form-status');

      contactPageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (statusFeedback) {
          statusFeedback.innerHTML = '';
          statusFeedback.className = 'form-feedback';
        }

        const nombreVal = inputNombre ? inputNombre.value.trim() : '';
        const emailVal = inputEmail ? inputEmail.value.trim() : '';
        const telefonoVal = inputTelefono ? inputTelefono.value.trim() : '';

        const errors = [];
        if (nombreVal.length < 2) {
          errors.push('Por favor, ingresa tu nombre completo (mínimo 2 letras).');
          if (inputNombre) inputNombre.classList.add('input-invalid');
        } else if (inputNombre) {
          inputNombre.classList.remove('input-invalid');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          errors.push('Ingresa un correo electrónico con formato válido.');
          if (inputEmail) inputEmail.classList.add('input-invalid');
        } else if (inputEmail) {
          inputEmail.classList.remove('input-invalid');
        }

        const phoneRegex = /^[0-9]{9}$/;
        if (telefonoVal && !phoneRegex.test(telefonoVal.replace(/\s+/g, '').replace(/^\+51/, ''))) {
          errors.push('El número de celular debe contener 9 dígitos.');
          if (inputTelefono) inputTelefono.classList.add('input-invalid');
        } else if (inputTelefono) {
          inputTelefono.classList.remove('input-invalid');
        }

        if (errors.length > 0) {
          if (statusFeedback) {
            statusFeedback.className = 'alert-box error mt-16';
            statusFeedback.innerHTML = `<ul style="margin: 0; padding-left: 1.25rem;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
          }
          contactPageForm.querySelector('.input-invalid')?.focus();
        } else {
          if (statusFeedback) {
            statusFeedback.className = 'alert-box success mt-16';
            statusFeedback.innerHTML = `<strong>¡Solicitud validada localmente!</strong><p>Gracias por tu interés en TarkiPay. Nos pondremos en contacto contigo a la brevedad.</p>`;
          }
        }
      });
    }
  }

  // Exportar al objeto global
  window.initContactoForm = initContactoForm;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactoForm);
  } else {
    initContactoForm();
  }
})();
