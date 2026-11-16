

/* Google Analytics G-96PPMQZFX2: solo se carga si se aceptan las estadísticas en el aviso de cookies (modo de consentimiento v2, todo denegado por defecto) · 2026-11-16 */
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
(function(){
  var ID='G-96PPMQZFX2';
  function cargar(){if(window.gaCargado)return;window.gaCargado=true;gtag('consent','update',{analytics_storage:'granted'});
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(s);gtag('js',new Date());gtag('config',ID);}
  function borrar(){document.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(/^_ga/.test(n))['','.medicapedia.org','medicapedia.org'].forEach(function(d){document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'+(d?';domain='+d:'');});});}
  try{var v=JSON.parse(localStorage.getItem('aviso-cookies'));if(v&&v.v===2&&v.estadisticas&&Date.now()-v.d<365*864e5)cargar();}catch(e){}
  document.addEventListener('avisocookies',function(e){if(e.detail&&e.detail.estadisticas)cargar();else{if(window.gaCargado)gtag('consent','update',{analytics_storage:'denied'});borrar();}});
})();
/* Aviso de cookies: configuración (versión 2, la misma que las otras webs con Google Analytics) */
window.AVISO_COOKIES={politica:{es:"/cookies.html",en:"/en/cookies.html",ca:"/ca/cookies.html"},color:"#134b52",texto:"#ffffff",version:2,textos:{
  es:{p:'Usamos lo necesario para que la web funcione y, si lo aceptas, Google Analytics para saber qué páginas se visitan y mejorar la web. No usamos cookies de publicidad. Puedes cambiar de opinión cuando quieras en «Configurar cookies», al pie de la página.',estD:'Google Analytics: qué páginas se visitan y desde dónde llegan las visitas, de forma agregada. Solo si lo aceptas.'},
  en:{p:'We use what is needed for the site to work and, if you accept, Google Analytics to see which pages are visited and improve the site. We do not use advertising cookies. You can change your mind at any time in “Cookie settings” at the bottom of the page.',estD:'Google Analytics: which pages are visited and where visits come from, in aggregate. Only if you accept.'},
  ca:{p:'Fem servir el necessari perquè el web funcioni i, si ho acceptes, Google Analytics per saber quines pàgines es visiten i millorar el web. No fem servir galetes de publicitat. Pots canviar d\'opinió quan vulguis a «Configurar galetes», al peu de la pàgina.',estD:'Google Analytics: quines pàgines es visiten i d\'on arriben les visites, de manera agregada. Només si ho acceptes.'}}};
/* el aviso sin la raya decorativa que el diseño Laboratorio pone en botones y títulos */
(function(){var s=document.createElement('style');s.textContent='#avc button::before,#avc button::after,#avc h2::before,#avc h2::after{content:none!important;display:none!important}';document.head.appendChild(s);})();
/* Aviso de cookies (RGPD / LSSI) · común a celebraciones.org, catdogpedia.com y worldwinepedia.com · 2026-11-08
   Configuración: window.AVISO_COOKIES = {politica: {es: '/cookies.html', en: ...}, color: '#123', texto: '#fff'} antes de este bloque.
   Categorías: necesarias (siempre), estadisticas, publicidad. Se guarda en localStorage 'aviso-cookies' 12 meses.
   Para activar un script solo con permiso: <script type="text/plain" data-cookies="estadisticas" src="..."></script>
   API: window.avisoCookies.abrir(), .permiso('estadisticas'), evento 'avisocookies' en document. */
(function () {
  var C = window.AVISO_COOKIES || {}, d = document, CLAVE = 'aviso-cookies', VERSION = C.version || 1, DOCE_MESES = 365 * 864e5;
  var L = (d.documentElement.lang || 'es').slice(0, 2);
  var TX = {
    es: { t: 'Cookies', p: 'Usamos solo lo necesario para que la web funcione. Con tu permiso podríamos usar también cookies de estadísticas y de publicidad. Puedes cambiar de opinión cuando quieras en «Configurar cookies», al pie de la página.', mas: 'Política de cookies', ok: 'Aceptar', no: 'Rechazar', conf: 'Configurar', guardar: 'Guardar mi elección', todo: 'Aceptar todas', nec: 'Necesarias', necD: 'Hacen que la web funcione y recuerdan tus preferencias (idioma, esta elección). Siempre activas.', est: 'Estadísticas', estD: 'Nos dirían qué páginas se visitan, de forma agregada. Ahora no se usan.', pub: 'Publicidad', pubD: 'Anuncios y medición de anuncios. Ahora no se usan.', siempre: 'Siempre activas', pie: 'Configurar cookies', cerrar: 'Cerrar' },
    ca: { t: 'Galetes', p: 'Fem servir només el necessari perquè el web funcioni. Amb el teu permís també podríem fer servir galetes d\'estadístiques i de publicitat. Pots canviar d\'opinió quan vulguis a «Configurar galetes», al peu de la pàgina.', mas: 'Política de galetes', ok: 'Acceptar', no: 'Rebutjar', conf: 'Configurar', guardar: 'Desar la meva elecció', todo: 'Acceptar-les totes', nec: 'Necessàries', necD: 'Fan que el web funcioni i recorden les teves preferències (idioma, aquesta elecció). Sempre actives.', est: 'Estadístiques', estD: 'Ens dirien quines pàgines es visiten, de manera agregada. Ara no es fan servir.', pub: 'Publicitat', pubD: 'Anuncis i mesura d\'anuncis. Ara no es fan servir.', siempre: 'Sempre actives', pie: 'Configurar galetes', cerrar: 'Tancar' },
    en: { t: 'Cookies', p: 'We only use what is needed for the site to work. With your permission we could also use statistics and advertising cookies. You can change your mind at any time in “Cookie settings” at the bottom of the page.', mas: 'Cookie policy', ok: 'Accept', no: 'Reject', conf: 'Settings', guardar: 'Save my choice', todo: 'Accept all', nec: 'Necessary', necD: 'They make the site work and remember your preferences (language, this choice). Always on.', est: 'Statistics', estD: 'They would tell us which pages are visited, in aggregate. Not used at the moment.', pub: 'Advertising', pubD: 'Ads and ad measurement. Not used at the moment.', siempre: 'Always on', pie: 'Cookie settings', cerrar: 'Close' },
    fr: { t: 'Cookies', p: 'Nous n\'utilisons que le nécessaire au fonctionnement du site. Avec votre accord, nous pourrions aussi utiliser des cookies de statistiques et de publicité. Vous pouvez changer d\'avis à tout moment via « Paramètres des cookies », en bas de page.', mas: 'Politique de cookies', ok: 'Accepter', no: 'Refuser', conf: 'Paramétrer', guardar: 'Enregistrer mon choix', todo: 'Tout accepter', nec: 'Nécessaires', necD: 'Elles font fonctionner le site et retiennent vos préférences (langue, ce choix). Toujours actives.', est: 'Statistiques', estD: 'Elles nous indiqueraient les pages visitées, de façon agrégée. Non utilisées actuellement.', pub: 'Publicité', pubD: 'Annonces et mesure des annonces. Non utilisées actuellement.', siempre: 'Toujours actives', pie: 'Paramètres des cookies', cerrar: 'Fermer' },
    it: { t: 'Cookie', p: 'Usiamo solo il necessario per far funzionare il sito. Con il tuo consenso potremmo usare anche cookie statistici e pubblicitari. Puoi cambiare idea quando vuoi da «Impostazioni cookie», in fondo alla pagina.', mas: 'Cookie policy', ok: 'Accetta', no: 'Rifiuta', conf: 'Personalizza', guardar: 'Salva la mia scelta', todo: 'Accetta tutti', nec: 'Necessari', necD: 'Fanno funzionare il sito e ricordano le tue preferenze (lingua, questa scelta). Sempre attivi.', est: 'Statistiche', estD: 'Ci direbbero quali pagine vengono visitate, in forma aggregata. Al momento non usati.', pub: 'Pubblicità', pubD: 'Annunci e misurazione degli annunci. Al momento non usati.', siempre: 'Sempre attivi', pie: 'Impostazioni cookie', cerrar: 'Chiudi' }
  };
  var t = TX[L] || TX.en; if (C.textos && C.textos[L]) for (var k in C.textos[L]) t[k] = C.textos[L][k];
  var POL = (C.politica || {})[L] || (C.politica || {}).en || '#';

  function leer() { try { var v = JSON.parse(localStorage.getItem(CLAVE)); if (v && v.v === VERSION && Date.now() - v.d < DOCE_MESES) return v; } catch (e) {} return null; }
  function guardar(est, pub) {
    var v = { v: VERSION, d: Date.now(), estadisticas: !!est, publicidad: !!pub };
    try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch (e) {}
    activar(v); cerrar();
    try { d.dispatchEvent(new CustomEvent('avisocookies', { detail: v })); } catch (e) {}
  }
  function activar(v) {
    d.querySelectorAll('script[type="text/plain"][data-cookies]').forEach(function (s) {
      if (!v[s.dataset.cookies] || s.dataset.hecho) return; s.dataset.hecho = 1;
      var n = d.createElement('script'); if (s.src) n.src = s.src; else n.text = s.text; d.head.appendChild(n);
    });
  }

  var css = '#avc{position:fixed;left:16px;right:16px;bottom:16px;z-index:900;max-width:560px;margin:0 auto 0 0;background:#fff;color:#1d2327;border:1px solid rgba(0,0,0,.12);border-radius:14px;box-shadow:0 10px 36px rgba(0,0,0,.18);padding:18px 18px 16px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '#avc[hidden]{display:none}#avc h2{font-size:16px;margin:0 0 6px;font-weight:700;color:inherit;font-family:inherit}#avc p{margin:0 0 12px}#avc a{color:' + (C.color || '#155e63') + ';text-decoration:underline}' +
    '#avc .avb{display:flex;flex-wrap:wrap;gap:8px}#avc button{flex:1 1 auto;min-width:110px;font-family:inherit;font-weight:600;font-size:14px;line-height:1.15;padding:11px 14px;border-radius:9px;cursor:pointer;border:1.5px solid ' + (C.color || '#155e63') + ';background:' + (C.color || '#155e63') + ';color:' + (C.texto || '#fff') + '}' +
    '#avc button.sec{background:transparent;color:' + (C.color || '#155e63') + '}#avc button:focus-visible{outline:3px solid #f0b400;outline-offset:2px}' +
    '#avc .avcat{border-top:1px solid #e6e8ea;padding:10px 0;display:flex;gap:12px;align-items:flex-start;justify-content:space-between}#avc .avcat b{display:block}#avc .avcat small{color:#5b6670;display:block;font-size:12.5px}' +
    '#avc input{width:20px;height:20px;margin-top:2px;accent-color:' + (C.color || '#155e63') + ';flex:none}#avc .fijo{font-size:12px;color:#5b6670;white-space:nowrap}' +
    '@media(max-width:600px){#avc{left:8px;right:8px;bottom:8px;padding:14px;font-size:13.5px}#avc button{min-width:0;padding:11px 10px}}' +
    '.avc-pie{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;opacity:.9}';
  var caja;
  function montar() {
    if (caja) return caja;
    var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);
    caja = d.createElement('div'); caja.id = 'avc'; caja.setAttribute('role', 'dialog'); caja.setAttribute('aria-labelledby', 'avc-t'); caja.hidden = true;
    d.body.appendChild(caja); return caja;
  }
  function vistaInicial() {
    montar().innerHTML = '<h2 id="avc-t">🍪 ' + t.t + '</h2><p>' + t.p + ' <a href="' + POL + '">' + t.mas + '</a></p>' +
      '<div class="avb"><button type="button" data-a="no">' + t.no + '</button><button type="button" class="sec" data-a="conf">' + t.conf + '</button><button type="button" data-a="ok">' + t.ok + '</button></div>';
    eventos();
  }
  function vistaConfig() {
    var v = leer() || {};
    var fila = function (k, nom, des) { return '<label class="avcat"><span><b>' + nom + '</b><small>' + des + '</small></span><input type="checkbox" data-k="' + k + '"' + (v[k] ? ' checked' : '') + '></label>'; };
    montar().innerHTML = '<h2 id="avc-t">🍪 ' + t.t + '</h2><p><a href="' + POL + '">' + t.mas + '</a></p>' +
      '<div class="avcat"><span><b>' + t.nec + '</b><small>' + t.necD + '</small></span><span class="fijo">' + t.siempre + '</span></div>' +
      fila('estadisticas', t.est, t.estD) + fila('publicidad', t.pub, t.pubD) +
      '<div class="avb" style="margin-top:6px"><button type="button" data-a="no">' + t.no + '</button><button type="button" class="sec" data-a="guardar">' + t.guardar + '</button><button type="button" data-a="ok">' + t.todo + '</button></div>';
    eventos();
  }
  function eventos() {
    caja.querySelectorAll('button[data-a]').forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.a;
        if (a === 'ok') guardar(1, 1);
        else if (a === 'no') guardar(0, 0);
        else if (a === 'conf') { vistaConfig(); var i = caja.querySelector('input'); if (i) i.focus(); }
        else if (a === 'guardar') guardar(caja.querySelector('[data-k=estadisticas]').checked, caja.querySelector('[data-k=publicidad]').checked);
      };
    });
  }
  function abrir(config) { if (config) vistaConfig(); else vistaInicial(); caja.hidden = false; }
  function cerrar() { if (caja) caja.hidden = true; }
  function enlacePie() {
    var f = d.querySelector('footer'); if (!f || f.querySelector('.avc-pie')) return;
    var b = d.createElement('button'); b.type = 'button'; b.className = 'avc-pie'; b.textContent = t.pie; b.onclick = function () { abrir(true); var i = caja.querySelector('input'); if (i) i.focus(); };
    var ref = null; f.querySelectorAll('a').forEach(function (a) { if (!ref && POL !== '#' && (a.getAttribute('href') === POL || a.pathname === POL)) ref = a; });
    if (ref) {
      var li = ref.closest('li');
      if (li) { var nli = d.createElement('li'); nli.appendChild(b); li.parentNode.insertBefore(nli, li.nextSibling); }
      else { var cs = getComputedStyle(ref); b.style.fontSize = cs.fontSize; b.style.color = cs.color; ref.parentNode.insertBefore(b, ref.nextSibling); if (cs.display === 'block') { b.style.display = 'block'; b.style.margin = cs.marginTop + ' 0 ' + cs.marginBottom; b.style.textAlign = 'left'; } else ref.parentNode.insertBefore(d.createTextNode(' · '), b); }
    } else {
      var p = d.createElement('p'); p.style.cssText = 'text-align:center;font-size:13px;margin:10px 0 0'; p.appendChild(b); f.appendChild(p);
    }
  }
  function inicio() {
    var v = leer();
    enlacePie();
    if (v) activar(v); else abrir(false);
  }
  window.avisoCookies = { abrir: function () { abrir(true); }, permiso: function (k) { var v = leer(); return !!(v && v[k]); } };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', inicio); else inicio();
})();
