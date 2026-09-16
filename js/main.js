/* =====================================================================
   Formato Esquadrias — comportamentos da página
   ===================================================================== */
(function () {
  'use strict';

  var ZAP = '5515996070870'; // WhatsApp da empresa, formato internacional

  /* ---------- 1. Menu mobile ---------- */
  var hamburguer = document.getElementById('hamburguer');
  var nav = document.getElementById('nav');

  if (hamburguer && nav) {
    hamburguer.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      hamburguer.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    // fecha ao clicar em qualquer link do menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('aberto');
        hamburguer.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. Sombra no cabeçalho ao rolar ---------- */
  var cabecalho = document.getElementById('cabecalho');
  function aoRolar() {
    if (cabecalho) cabecalho.classList.toggle('rolou', window.scrollY > 8);
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* ---------- 3. Animação de entrada das seções ---------- */
  var alvos = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('visivel'); }, i * 70);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
    // Rede de segurança: o que já está na tela ao abrir não pode ficar
    // invisível esperando o observador (thumbnail, print, conexão lenta).
    // Só vale para o topo da página — o resto continua animando na rolagem.
    setTimeout(function () {
      alvos.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('visivel');
        }
      });
    }, 900);
  } else {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  }

  /* ---------- 4. Link do menu destacado conforme a seção visível ---------- */
  var links = Array.prototype.slice.call(nav ? nav.querySelectorAll('a[href^="#"]') : []);
  var secoes = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (secoes.length && 'IntersectionObserver' in window) {
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('ativo', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { obsNav.observe(s); });
  }

  /* ---------- 5. Formulário → WhatsApp ----------
     Hospedagem estática não envia e-mail. Em vez de um formulário que
     não funciona, montamos a mensagem e abrimos o WhatsApp da empresa.  */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome    = (form.nome.value || '').trim();
      var cidade  = (form.cidade.value || '').trim();
      var assunto = form.assunto.value;
      var msg     = (form.msg.value || '').trim();

      var linhas = ['Olá! Vim pelo site da Formato Esquadrias.'];
      if (nome)   linhas.push('Meu nome é ' + nome + '.');
      linhas.push('Assunto: ' + assunto + '.');
      if (cidade) linhas.push('Cidade da obra: ' + cidade + '.');
      if (msg)    linhas.push('Detalhes: ' + msg);

      var texto = encodeURIComponent(linhas.join('\n'));
      window.open('https://wa.me/' + ZAP + '?text=' + texto, '_blank', 'noopener');
    });
  }

  /* ---------- 6. Ano do rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
