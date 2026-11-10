<?php
// Instalación de un solo uso del blog de Ludicopedia. Solo desde la línea de comandos (tarea programada de Hostinger).
// 1) añade «📝 Blog» al menú: pega un trozo al final de js/comun.js (copia del original en copias/comun.js.antes);
// 2) ejecuta publicar.php, que pone los artículos ya fechados, la portada del blog y las URL en sitemap.xml.
// Deja hecho.txt y no se repite. Si alguien vuelve a subir comun.js sin el trozo, basta con borrar hecho.txt y volver a ejecutarlo.
if (php_sapi_name() !== 'cli') { http_response_code(403); exit('No autorizado'); }
date_default_timezone_set('Europe/Madrid');
$aqui = __DIR__; $pub = getenv('BLOG_RAIZ') ?: dirname($aqui);
if (file_exists("$aqui/hecho.txt")) exit("Ya aplicado: " . file_get_contents("$aqui/hecho.txt"));
$js = "$pub/js/comun.js";
if (!is_file($js) || !is_dir("$pub/enciclopedia")) exit("No parece la raíz de Ludicopedia: $pub\n");
$marca = '/* blog en el menú (2026-11-10) */';
$trozo = "\n$marca\n(function(){try{var n=document.querySelector('header.cab nav.nav');if(!n||n.querySelector('.nav-blog'))return;var a=document.createElement('a');a.href=(document.body.dataset.raiz||'')+'blog/index.html';a.className='nav-blog'+(document.body.dataset.seccion==='blog'?' activo':'');a.textContent='📝 Blog';n.appendChild(a);}catch(e){}})();\n";
$c = file_get_contents($js);
if (strpos($c, $marca) !== false) $r = "comun.js ya tenía el enlace al blog";
else {
  @mkdir("$aqui/copias", 0755, true); copy($js, "$aqui/copias/comun.js.antes");
  $r = file_put_contents($js, $c . $trozo, LOCK_EX) !== false ? "comun.js: enlace al blog añadido" : "ERROR escribiendo comun.js";
}
$r = date('c') . " $r\n"; file_put_contents("$aqui/publicaciones.log", $r, FILE_APPEND); echo $r;
if (strpos($r, 'ERROR') !== false) exit;
file_put_contents("$aqui/hecho.txt", $r);
require "$aqui/publicar.php";
