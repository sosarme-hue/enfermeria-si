/* enfermeria.si · herramientas de la página */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var fmt = function(n,d){ return Number(n).toLocaleString('es-ES',{maximumFractionDigits:d||0}); };

  // Ritmo de goteo
  if ($('vol')) {
    var drip = function(){
      var v=parseFloat($('vol').value), h=parseFloat($('hrs').value), f=parseFloat($('fac').value);
      if(!(v>0&&h>0)){ $('gpm').textContent='—'; $('mlh').textContent='—'; return; }
      $('gpm').textContent=fmt(Math.round(v*f/(h*60)));
      $('mlh').textContent=fmt(v/h,1);
    };
    ['vol','hrs','fac'].forEach(function(id){ $(id).addEventListener('input',drip); });
    drip();
  }

  // Escalas que suman puntos: <form class="scale" data-bands='[[hasta,"texto","color"],...]' data-out="id">
  document.querySelectorAll('form.scale').forEach(function(f){
    var bands = JSON.parse(f.dataset.bands||'[]');
    var out = $(f.dataset.out), sev = $(f.dataset.out+'-sev');
    var calc = function(){
      var t=0; f.querySelectorAll('select').forEach(function(s){ t+=Number(s.value); });
      out.textContent=t;
      if(sev){ for(var i=0;i<bands.length;i++){ if(t<=bands[i][0]){ sev.textContent=bands[i][1]; sev.style.color='var(--'+bands[i][2]+')'; break; } } }
      if(sev && f.dataset.red3 && t<5){ var r=false; f.querySelectorAll('select').forEach(function(s){ if(Number(s.value)===3) r=true; }); if(r){ sev.textContent='Un parámetro puntúa 3: valoración urgente'; sev.style.color='var(--warn)'; } }
    };
    f.addEventListener('change',calc); f.addEventListener('submit',function(e){e.preventDefault();}); calc();
  });


  // Calculadoras genéricas: <div class="calc"> con inputs [data-v] y salidas [data-f="expresión"]
  document.querySelectorAll('.calc').forEach(function(c){
    var ins=c.querySelectorAll('[data-v]'), outs=c.querySelectorAll('[data-f]');
    var run=function(){
      var names=[], vals=[], ok=true;
      ins.forEach(function(i){ var v=parseFloat(String(i.value).replace(',','.')); names.push(i.dataset.v); vals.push(v); if(i.tagName==='INPUT' && !(v>=0)) ok=false; });
      outs.forEach(function(o){
        var r=NaN; try{ r=Function.apply(null,names.concat('return ('+o.dataset.f+');')).apply(null,vals); }catch(e){}
        o.textContent=(ok&&isFinite(r))?fmt(r,parseInt(o.dataset.d||'1',10)):'—';
      });
    };
    ins.forEach(function(i){ i.addEventListener('input',run); i.addEventListener('change',run); });
    run();
  });
  // Preguntas tipo test
  document.querySelectorAll('.q').forEach(function(q){
    q.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        q.querySelectorAll('button').forEach(function(x){ x.classList.remove('ok','ko'); if(x.dataset.ok==='1') x.classList.add('ok'); });
        if(b.dataset.ok!=='1') b.classList.add('ko');
        var w=q.querySelector('.why'); if(w) w.hidden=false;
      });
    });
  });

  // Pestañas de épocas y países (datos en JSON dentro de la página)
  var eras = $('eras-data');
  if (eras) {
    var E = JSON.parse(eras.textContent);
    document.querySelectorAll('.eras button').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.eras button').forEach(function(x){ x.setAttribute('aria-selected', x===b?'true':'false'); });
        var e=E[b.dataset.era];
        $('era-when').textContent=e[0]; $('era-title').textContent=e[1]; $('era-text').textContent=e[2];
        var ul=$('era-list'); ul.innerHTML='';
        e[3].forEach(function(r){ var li=document.createElement('li'), sp=document.createElement('span'); sp.textContent=r[0]; li.appendChild(sp); li.appendChild(document.createTextNode(r[1])); ul.appendChild(li); });
      });
    });
  }
  var cdat = $('countries-data');
  if (cdat) {
    var C = JSON.parse(cdat.textContent);
    document.querySelectorAll('.countries button').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.countries button').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
        var c=C[b.dataset.c];
        ['name','edu','reg','spec','org'].forEach(function(k,i){ var el=$('c-'+k); if(!el) return;
          if(k==='org'){ el.innerHTML=''; var a=document.createElement('a'); a.href=c[4][1]; a.textContent=c[4][0]; a.rel='noopener'; el.appendChild(a); }
          else el.textContent=c[i]; });
      });
    });
  }

  // Buscador: índice en assets/buscar.json [título, ruta, resumen, públicos, texto]
  var form = document.querySelector('form.search');
  if (form && form.dataset.src) {
    var box = $('resultados'), inp = form.querySelector('input[type=search]'), I = null, full = form.classList.contains('page');
    var norm = function(s){ return s.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g,''); };
    var href = function(p){ var h = form.dataset.root + p; if (form.dataset.ix && (h==='' || h.slice(-1)==='/')) h += 'index.html'; return h; };
    var snip = function(t, terms){
      var n = norm(t), k = n.indexOf(terms[0]); if (k < 0) return null;
      var a = Math.max(0, k-70), b = Math.min(t.length, k+150), s = (a?'… ':'') + t.slice(a,b) + (b<t.length?' …':'');
      return s;
    };
    var mark = function(el, text, terms){
      var n = norm(text), pos = 0, re = [];
      terms.forEach(function(q){ var k = n.indexOf(q); while(k>=0){ re.push([k,k+q.length]); k = n.indexOf(q,k+q.length); } });
      re.sort(function(x,y){return x[0]-y[0];});
      re.forEach(function(r){ if(r[0]<pos) return; el.appendChild(document.createTextNode(text.slice(pos,r[0]))); var m=document.createElement('mark'); m.textContent=text.slice(r[0],r[1]); el.appendChild(m); pos=r[1]; });
      el.appendChild(document.createTextNode(text.slice(pos)));
    };
    // Sinónimos, siglas y nombres comerciales habituales
    var SYN = {
      'sintrom':['acenocumarol','anticoagul'], 'acenocumarol':['sintrom'], 'nolotil':['metamizol'], 'ventolin':['salbutamol'],
      'clexane':['enoxaparina','heparina'], 'enoxaparina':['heparina'], 'epinefrina':['adrenalina'], 'adrenalina':['epinefrina'],
      'alzheimer':['demencia'], 'atdom':['domiciliaria'], 'domicilio':['domiciliaria'], 'pcc':['cronico complejo'], 'maca':['cronica avanzada'], 'efyc':['familiar y comunitaria'], 'gestora':['gestion de casos'], 'itu':['infeccion urinaria','urinari'], 'iam':['infarto'], 'acv':['ictus'], 'avc':['ictus'],
      'hta':['hipertension'], 'tension':['hipertension','tension arterial'], 'dm':['diabetes'], 'dm2':['diabetes'], 'azucar':['glucemia','diabetes'],
      'ic':['insuficiencia cardiaca'], 'fa':['fibrilacion auricular'], 'erc':['enfermedad renal'], 'lpp':['lesiones por presion'],
      'escaras':['lesiones por presion','ulcera'], 'escara':['lesiones por presion'], 'rcp':['soporte vital','reanimacion'], 'pcr':['parada','soporte vital'],
      'sng':['sondaje nasogastrico'], 'peg':['gastrostomia'], 'picc':['cateter'], 'via':['venosa','cateter'], 'vvp':['via venosa periferica'],
      'ecg':['electrocardiograma'], 'ta':['tension arterial'], 'sat':['saturacion','oxigeno'], 'o2':['oxigeno'], 'epi':['equipos de proteccion'],
      'aine':['antiinflamatorio','ibuprofeno'], 'antiinflamatorios':['aine'], 'calmantes':['analgesic'], 'analgesicos':['analgesic'],
      'antibiotico':['antibiotic'], 'antibioticos':['antibiotic'], 'corticoide':['corticoid'], 'cortisona':['corticoid'], 'inhalador':['inhalador'],
      'sueros':['fluidoterapia','suero'], 'gota a gota':['goteo'], 'caidas':['caida'], 'presion':['tension','lesiones por presion'],
      'ahogo':['disnea'], 'falta de aire':['disnea'], 'confusion':['delirium'], 'azucar alta':['hiperglucemia'], 'azucar baja':['hipoglucemia'],
      'alergia':['anafilaxia','alergi'], 'eir':['eir'], 'embarazada':['embarazo'], 'bebe':['lactante','recien nacido'], 'nino':['infantil','pediatric'], 'ninos':['infantil','pediatric'], 'cancer':['oncolog','paliativ'], 'tumor':['oncolog','paliativ'], 'tiroides':['hipotiroidismo','tiroid'], 'eutirox':['levotiroxina'], 'colesterol':['colesterol','dislipemia'], 'adiro':['acido acetilsalicilico','antiagreg'], 'aspirina':['acido acetilsalicilico'], 'seguril':['furosemida'], 'protector':['protectores gastricos','omeprazol'], 'huesos':['osteoporosis'], 'orina':['urinari','orina'], 'pulmonia':['neumonia'], 'cistitis':['cistitis','infeccion urinaria']
    };
    var clean = function(s){ return ' ' + norm(s||'').replace(/[^a-z0-9ñ]+/g,' ') + ' '; };
    var prep = function(){ I.forEach(function(p){ p.T = clean(p[0]); p.S = clean(p[2]); p.X = clean(p[4]); p.sec = (p[1].split('/').filter(Boolean).length <= 1); }); };
    var count = function(h, q, cap){ var n=0, k=h.indexOf(q); while(k>=0 && n<cap){ n++; k=h.indexOf(q,k+q.length); } return n; };
    // Puntúa un término (o sus alternativas) en una página. Coincidencia a principio de palabra; subcadena solo si el término es largo.
    var score1 = function(p, alts){
      var best = 0;
      alts.forEach(function(q){
        var w = ' ' + q, s = 0;
        if (p.T.indexOf(w)>=0) s = 12; else if (p.S.indexOf(w)>=0) s = 5;
        var c = count(p.X, w, 6); if (c) s += Math.max(1, c);
        if (!s && q.length >= 5 && (p.T+p.S+p.X).indexOf(q)>=0) s = 1;
        if (s > best) best = s;
      });
      return best;
    };
    var run = function(){
      if (!I) return;
      var raw = inp.value.trim(), all = norm(raw).replace(/[^a-z0-9ñ ]+/g,' ').trim();
      var terms = all.split(/\s+/).filter(function(w){return w.length>1;});
      var aud = (form.querySelector('input[name=a]:checked')||{}).value||'';
      box.innerHTML='';
      if (!terms.length) return;
      var groups = SYN[all] ? [[all].concat(SYN[all])] : terms.map(function(q){ return [q].concat(SYN[q]||[]); });
      var hits = [];
      I.forEach(function(p){
        if (aud && p[3].indexOf(aud)<0) return;
        var score = 0;
        for (var i=0;i<groups.length;i++){ var s = score1(p, groups[i]); if (!s) return; score += s; }
        if (p.T.indexOf(' ' + all)===0) score += 6;
        if (p.sec) score -= 4;
        hits.push([score,p]);
      });
      hits.sort(function(a,b){ return b[0]-a[0]; });
      var mterms = []; groups.forEach(function(g){ g.forEach(function(q){ mterms.push(q); }); });
      var max = full ? 50 : 8;
      var n = document.createElement('p'); n.className='n';
      n.textContent = hits.length ? (hits.length===1 ? '1 página encontrada' : hits.length+' páginas encontradas') : 'No hay resultados. Prueba con otra palabra, por ejemplo «heparina», «Glasgow» o «fiebre».';
      box.appendChild(n);
      hits.slice(0,max).forEach(function(h){ var p=h[1], a=document.createElement('a'); a.href=href(p[1]);
        var b=document.createElement('b'); mark(b,p[0],mterms); a.appendChild(b);
        var s=document.createElement('span'), sn=null;
        if (norm(p[0]+' '+p[2]).indexOf(mterms[0])<0 && p[4]) { for (var j=0;j<mterms.length && !sn;j++) sn = snip(p[4],[mterms[j]]); }
        mark(s, sn||p[2], mterms); a.appendChild(s); box.appendChild(a); });
      if (!full && hits.length>max){ var m=document.createElement('a'); m.className='more'; m.href=href('buscar/')+'?q='+encodeURIComponent(raw); m.textContent='Ver los '+hits.length+' resultados'; box.appendChild(m); }
    };
    var load = function(){ if (I) return run(); fetch(form.dataset.src).then(function(r){return r.json();}).then(function(d){ I=d; prep(); run(); }).catch(function(){ box.textContent='No se ha podido cargar el buscador.'; }); };
    form.addEventListener('submit',function(e){ e.preventDefault(); load(); });
    inp.addEventListener('input',load); inp.addEventListener('focus',load,{once:true});
    form.querySelectorAll('input[name=a]').forEach(function(r){ r.addEventListener('change',load); });
    var qs = (location.search.match(/[?&]q=([^&]*)/)||[])[1];
    if (qs) { inp.value = decodeURIComponent(qs.replace(/\+/g,' ')); load(); }
  }
})();
