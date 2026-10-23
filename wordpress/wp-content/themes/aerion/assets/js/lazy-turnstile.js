/**
 * Carrega o Turnstile do Cloudflare so quando o visitante vai usar um formulario.
 *
 * O Fluent Forms enfileira o api.js em toda pagina que tem formulario, o que na
 * home custava ~700 KB e bloqueava a renderizacao. Aqui o script e removido do
 * HTML (filtro em functions.php) e carregado na primeira interacao com o
 * formulario ou quando ele chega perto da tela. O token leva 1 a 2 s para
 * ficar pronto, por isso nao esperamos o preenchimento terminar.
 */
(function () {
  'use strict';

  var widgets = Array.prototype.slice.call(document.querySelectorAll('.ff-el-turnstile.cf-turnstile'));
  if (!widgets.length) return;

  var started = false;

  function renderAll() {
    if (!window.turnstile || typeof window.turnstile.render !== 'function') return;
    widgets.forEach(function (el) {
      // O Fluent Forms guarda o id do widget neste atributo e o usa para
      // reiniciar o desafio depois de um envio com erro.
      if (!el.id || el.getAttribute('data-cf-turnstile_widget_id')) return;
      var id = window.turnstile.render('#' + el.id, { sitekey: el.getAttribute('data-sitekey') });
      el.setAttribute('data-cf-turnstile_widget_id', id);
    });
  }

  function load() {
    if (started) return;
    started = true;
    var script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    // Sem async/defer: o Turnstile recusa o desafio quando o script e marcado
    // assim e a pagina chama turnstile.ready(). Aqui chamamos render() no onload.
    script.async = false;
    script.defer = false;
    script.onload = renderAll;
    document.head.appendChild(script);
  }

  var forms = widgets.map(function (el) { return el.closest('form'); }).filter(Boolean);
  forms.forEach(function (form) {
    ['focusin', 'pointerdown', 'keydown', 'touchstart'].forEach(function (name) {
      form.addEventListener(name, load, { once: true, passive: true });
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: '400px 0px' });
    forms.forEach(function (form) { observer.observe(form); });
  } else {
    load();
  }
})();
