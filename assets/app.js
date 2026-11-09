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
    var run = function(){
      if (!I) return;
      var raw = inp.value.trim(), terms = norm(raw).split(/\s+/).filter(function(w){return w.length>1;});
      var aud = (form.querySelector('input[name=a]:checked')||{}).value||'';
      box.innerHTML='';
      if (!terms.length) return;
      var hits = [];
      I.forEach(function(p){
        if (aud && p[3].indexOf(aud)<0) return;
        var T = norm(p[0]), S = norm(p[2]), X = norm(p[4]||''), score = 0;
        for (var i=0;i<terms.length;i++){ var q=terms[i];
          if (T.indexOf(q)>=0) score += 10; else if (S.indexOf(q)>=0) score += 4; else if (X.indexOf(q)>=0) score += 1; else return; }
        if (T.indexOf(terms.join(' '))===0) score += 5;
        hits.push([score,p]);
      });
      hits.sort(function(a,b){ return b[0]-a[0]; });
      var max = full ? 40 : 8;
      var n = document.createElement('p'); n.className='n';
      n.textContent = hits.length ? (hits.length===1 ? '1 página encontrada' : hits.length+' páginas encontradas') : 'No hay resultados. Prueba con otra palabra, por ejemplo «heparina», «Glasgow» o «fiebre».';
      box.appendChild(n);
      hits.slice(0,max).forEach(function(h){ var p=h[1], a=document.createElement('a'); a.href=href(p[1]);
        var b=document.createElement('b'); mark(b,p[0],terms); a.appendChild(b);
        var s=document.createElement('span'); var sn = (norm(p[0]+' '+p[2]).indexOf(terms[0])<0 && p[4]) ? snip(p[4],terms) : null; mark(s, sn||p[2], terms); a.appendChild(s); box.appendChild(a); });
      if (!full && hits.length>max){ var m=document.createElement('a'); m.href=href('buscar/')+'?q='+encodeURIComponent(raw); m.textContent='Ver los '+hits.length+' resultados'; box.appendChild(m); }
    };
    var load = function(){ if (I) return run(); fetch(form.dataset.src).then(function(r){return r.json();}).then(function(d){ I=d; run(); }).catch(function(){ box.textContent='No se ha podido cargar el buscador.'; }); };
    form.addEventListener('submit',function(e){ e.preventDefault(); load(); });
    inp.addEventListener('input',load); inp.addEventListener('focus',load,{once:true});
    form.querySelectorAll('input[name=a]').forEach(function(r){ r.addEventListener('change',load); });
    var qs = (location.search.match(/[?&]q=([^&]*)/)||[])[1];
    if (qs) { inp.value = decodeURIComponent(qs.replace(/\+/g,' ')); load(); }
  }
})();
