<?php
// Publicador semanal del blog. Solo desde la línea de comandos (tarea programada diaria de Hostinger).
// Lee manifiesto.json y publica los artículos cuya fecha ya ha llegado: los copia desde payload/ a su sitio
// si todavía no existen (nunca sobrescribe un artículo ya publicado), pone la portada del blog que toca
// y añade las URL nuevas al mapa del sitio. Copia de lo que cambia en copias/AAAA-MM-DD/ y registro en publicaciones.log.
// No borra nada. Para probar con otra fecha: BLOG_HOY=2026-12-01 php publicar.php
if (php_sapi_name() !== 'cli') { http_response_code(403); exit('No autorizado'); }
date_default_timezone_set('Europe/Madrid');
$aqui = __DIR__; $raiz = getenv('BLOG_RAIZ') ?: dirname($aqui); $hoy = getenv('BLOG_HOY') ?: date('Y-m-d');
$m = json_decode(file_get_contents("$aqui/manifiesto.json"), true);
if (!$m) exit("manifiesto.json ilegible\n");
$log = []; $err = [];
$copia = function ($rel) use ($aqui, $raiz, $hoy) {
  $c = "$aqui/copias/$hoy/$rel"; @mkdir(dirname($c), 0755, true);
  if (!file_exists($c) && file_exists("$raiz/$rel")) copy("$raiz/$rel", $c);
};
// 1) artículos
$publicadas = [];
foreach ($m['articulos'] as $a) {
  if ($a['fecha'] > $hoy) continue;
  foreach ($a['archivos'] as $i => $rel) {
    $t = "$raiz/$rel";
    $publicadas[] = [$a['urls'][$i], $a['fecha']];
    if (file_exists($t)) continue;
    @mkdir(dirname($t), 0755, true);
    if (@copy("$aqui/payload/$rel", $t)) $log[] = "publicado $rel"; else $err[] = "no se pudo copiar $rel";
  }
}
// 2) portadas y páginas que cambian con cada artículo (la última versión cuya fecha ya ha llegado).
// Cada versión se aplica una sola vez (estado.json): si después alguien regenera la web, no se le pisa.
$f = null; foreach ($m['indices'] as $x) if ($x['fecha'] <= $hoy) $f = $x;
$est = "$aqui/estado.json"; $E = file_exists($est) ? (json_decode(file_get_contents($est), true) ?: []) : [];
if ($f) {
  $firma = $f['fecha'];
  foreach ($f['archivos'] as $rel) { $src = "$aqui/payload/indices/{$f['fecha']}/$rel"; $firma .= '|' . (file_exists($src) ? md5_file($src) : '-'); }
  $firma = md5($firma);
  if (($E['indices'] ?? '') !== $firma) {
    $ok = true;
    foreach ($f['archivos'] as $rel) {
      $src = "$aqui/payload/indices/{$f['fecha']}/$rel"; $t = "$raiz/$rel";
      if (!file_exists($src)) { $err[] = "falta portada $rel ({$f['fecha']})"; $ok = false; continue; }
      if (file_exists($t) && md5_file($t) === md5_file($src)) continue;
      if (file_exists($t)) $copia($rel);
      @mkdir(dirname($t), 0755, true);
      if (@copy($src, $t)) $log[] = "portada $rel ({$f['fecha']})"; else { $err[] = "no se pudo escribir $rel"; $ok = false; }
    }
    if ($ok) { $E['indices'] = $firma; $E['indices_fecha'] = $f['fecha']; file_put_contents($est, json_encode($E)); }
  }
}
// 3) mapa del sitio
if ($f) { foreach ($m['urls_portadas'] as $u) $publicadas[] = [$u, $f['fecha']]; }
$sm = $m['sitemap']; $t = "$raiz/{$sm['archivo']}";
if ($sm['modo'] === 'propio') {
  // archivo solo del blog: se rehace entero
  $x = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
  foreach ($publicadas as [$u, $d]) $x .= "<url><loc>$u</loc><lastmod>$d</lastmod></url>\n";
  $x .= "</urlset>\n";
  if ($publicadas && (!file_exists($t) || file_get_contents($t) !== $x)) {
    if (file_put_contents($t, $x) !== false) $log[] = "{$sm['archivo']} rehecho (" . count($publicadas) . " URL)"; else $err[] = "no se pudo escribir {$sm['archivo']}";
  }
} elseif (file_exists($t)) {
  // se añaden las URL que falten al mapa del sitio de la web
  $c = file_get_contents($t); $add = '';
  foreach ($publicadas as [$u, $d]) if (strpos($c, "<loc>$u</loc>") === false && strpos($add, "<loc>$u</loc>") === false) $add .= "<url><loc>$u</loc><lastmod>$d</lastmod></url>";
  if ($add !== '') {
    $p = strrpos($c, '</urlset>');
    if ($p === false) $err[] = "{$sm['archivo']} sin </urlset>";
    else { $copia($sm['archivo']); if (file_put_contents($t, substr($c, 0, $p) . $add . substr($c, $p)) !== false) $log[] = "{$sm['archivo']} actualizado"; else $err[] = "no se pudo escribir {$sm['archivo']}"; }
  }
} else $err[] = "falta {$sm['archivo']}";
$r = date('c') . " [hoy=$hoy] · " . ($log ? implode('; ', $log) : 'nada nuevo') . ($err ? ' · ERRORES: ' . implode('; ', $err) : '') . "\n";
file_put_contents("$aqui/publicaciones.log", $r, FILE_APPEND);
echo $r;
