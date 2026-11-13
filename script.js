(() => {
  'use strict';
  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = (returnFocus = false) => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    const desktop = window.matchMedia('(min-width: 761px)');
    desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
  }

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('botcheck')) return;
    const accessKey = String(data.get('access_key') || '').trim();
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      status.textContent = 'The form is temporarily unavailable. Please email me at samardevraj2002@gmail.com.';
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Submission failed');
      status.textContent = 'Thanks for your message. I’ll be in touch soon.';
      form.reset();
    } catch {
      status.textContent = 'Your message couldn’t be sent. Please try again or email samardevraj2002@gmail.com.';
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
