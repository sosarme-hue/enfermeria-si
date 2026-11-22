<?php
// Enlaza la web española de Ludicopedia con la inglesa (/en/). Solo por línea de comandos (tarea programada diaria).
// Idempotente: en cada página española con equivalente inglés (mapa.json) añade hreflang es/en/x-default si faltan;
// añade «🌐 English» al menú al final de js/comun.js si falta; y la línea Sitemap de /en/ en robots.txt si falta.
// Así, si otra herramienta vuelve a generar alguna página o comun.js, al día siguiente se repara sola.
// Copia de cada archivo antes de tocarlo por primera vez en _en/copias/.
if (php_sapi_name() !== 'cli') { http_response_code(403); exit('No autorizado'); }
date_default_timezone_set('Europe/Madrid');
$aqui = __DIR__; $pub = dirname($aqui); $web = 'https://ludicopedia.com/';
if (!is_dir("$pub/enciclopedia") || !is_dir("$pub/en")) exit("No parece la raíz de Ludicopedia con /en/: $pub\n");
$mapa = json_decode(file_get_contents("$aqui/mapa.json"), true);
function copia($pub, $aqui, $rel) { $d = "$aqui/copias/$rel"; if (!file_exists($d)) { @mkdir(dirname($d), 0755, true); copy("$pub/$rel", $d); } }
$hechas = 0; $ver = 0; $faltan = 0; $sinCanon = [];
foreach ($mapa as $es => $en) {
  $f = "$pub/$es";
  if (!is_file($f) || !is_file("$pub/en/" . ($en === '' ? 'index.html' : $en))) { $faltan++; continue; }
  $c = file_get_contents($f);
  // versión nueva de comun.js en la URL para que los navegadores no usen la copia guardada sin el botón
  $cv = preg_replace('~(js/comun\.js)(\?v=[^"]*)?"~', '$1?v=en20261122"', $c);
  if ($cv !== $c) { copia($pub, $aqui, $es); file_put_contents($f, $cv, LOCK_EX); $c = $cv; $ver++; }
  if (strpos($c, 'hreflang="en"') !== false) continue;
  $uEs = $web . ($es === 'index.html' ? '' : $es); $uEn = $web . 'en/' . $en;
  $alt = "\n<link rel=\"alternate\" hreflang=\"es\" href=\"$uEs\"><link rel=\"alternate\" hreflang=\"en\" href=\"$uEn\"><link rel=\"alternate\" hreflang=\"x-default\" href=\"$uEs\">";
  $n = 0; $c2 = preg_replace('~(<link rel="canonical"[^>]*>)~', '$1' . $alt, $c, 1, $n);
  if (!$n) { $sinCanon[] = $es; continue; }
  copia($pub, $aqui, $es);
  if (file_put_contents($f, $c2, LOCK_EX) !== false) $hechas++;
}
$r = "hreflang añadido a $hechas páginas, versión de comun.js cambiada en $ver";
if ($faltan) $r .= ", $faltan sin archivo";
if ($sinCanon) $r .= ", sin canonical: " . implode(' ', $sinCanon);
$js = "$pub/js/comun.js"; $marca = '/* enlace a la versión inglesa (2026-11-22) */';
$trozo = "\n$marca\n(function(){function p(){try{var n=document.querySelector('header nav.nav')||document.querySelector('nav.nav');var l=document.querySelector('link[rel=alternate][hreflang=en]');if(!n||!l||n.querySelector('.nav-idioma'))return;var a=document.createElement('a');a.href=l.getAttribute('href');a.hreflang='en';a.lang='en';a.className='nav-idioma';a.title='Read this page in English';a.textContent='🌐 English';n.appendChild(a);}catch(e){}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',p);else p();})();\n";
$c = file_get_contents($js);
if (strpos($c, $marca) === false) { copia($pub, $aqui, 'js/comun.js'); $r .= file_put_contents($js, $c . $trozo, LOCK_EX) !== false ? "; comun.js: botón English añadido" : "; ERROR escribiendo comun.js"; }
$rb = "$pub/robots.txt"; $lin = "Sitemap: {$web}en/sitemap.xml";
if (is_file($rb) && strpos(file_get_contents($rb), $lin) === false) { copia($pub, $aqui, 'robots.txt'); file_put_contents($rb, rtrim(file_get_contents($rb)) . "\n$lin\n", LOCK_EX); $r .= "; robots.txt: sitemap inglés añadido"; }
$r = date('c') . " $r\n"; file_put_contents("$aqui/aplicar.log", $r, FILE_APPEND); echo $r;
