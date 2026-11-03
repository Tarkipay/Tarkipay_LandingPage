/**
 * TarkiPay - contacto.js
 * Maneja las validaciones en tiempo real y el envío del formulario de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('telefono');
  const businessInput = document.getElementById('negocio');
  const messageInput = document.getElementById('mensaje');
  const statusMessage = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Resetear mensajes
    statusMessage.textContent = '';
    statusMessage.className = 'form-feedback';

    // Validación básica
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Por favor, ingresa tu nombre completo.');
      return;
    }

    if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Por favor, ingresa un número de teléfono / WhatsApp.');
      return;
    }

    // Datos del formulario
    const formData = {
      nombre: nameInput.value.trim(),
      email: emailInput.value.trim(),
      telefono: phoneInput.value.trim(),
      negocio: businessInput ? businessInput.value.trim() : '',
      mensaje: messageInput ? messageInput.value.trim() : '',
      fecha: new Date().toISOString()
    };

    console.log('[TarkiPay Contacto] Formulario enviado:', formData);

    // Simulación de envío exitoso
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      form.reset();
      
      statusMessage.textContent = '¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo a la brevedad.';
      statusMessage.classList.add('success');
    }, 1000);
  });

  function showError(inputElement, message) {
    statusMessage.textContent = message;
    statusMessage.classList.add('error');
    inputElement.focus();
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
