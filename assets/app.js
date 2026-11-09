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

  // Buscador sencillo sobre el índice de la web
  var idx = $('search-index');
  var form = document.querySelector('form.search');
  if (idx && form) {
    var I = JSON.parse(idx.textContent), box = $('resultados');
    var norm = function(s){ return s.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g,''); };
    var run = function(){
      var q = norm(form.querySelector('input[type=search]').value.trim());
      var aud = (form.querySelector('input[name=a]:checked')||{}).value||'';
      box.innerHTML='';
      if(q.length<2) return;
      var hits = I.filter(function(p){ return (!aud || p[3].indexOf(aud)>=0) && norm(p[0]+' '+p[2]).indexOf(q)>=0; }).slice(0,8);
      if(!hits.length){ box.textContent='No hay resultados. Prueba con «sonda», «Glasgow», «EIR» o «Nightingale».'; return; }
      hits.forEach(function(p){ var a=document.createElement('a'); a.href=p[1]; a.textContent=p[0]; var s=document.createElement('span'); s.textContent=p[2]; a.appendChild(s); box.appendChild(a); });
    };
    form.addEventListener('submit',function(e){ e.preventDefault(); run(); });
    form.querySelector('input[type=search]').addEventListener('input',run);
    form.querySelectorAll('input[name=a]').forEach(function(r){ r.addEventListener('change',run); });
  }
})();
