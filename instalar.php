<?php
// Enlaces de Medicapedia hacia farmacos.ai (24-11-2026).
// ?clave=...             -> solo mira (no cambia nada)
// ?clave=...&hacer=1     -> copia de seguridad y añade el recuadro «Hoy · farmacos.ai» en las fichas f/ y enf/ (es, en, ca)
//                           y un aviso en farmacos.html y enfermedades.html
// ?clave=...&deshacer=1  -> vuelve a poner las copias
header('Content-Type: text/plain; charset=utf-8');
if (hash('sha256', (string)($_GET['clave'] ?? '')) !== 'db9ca0331203e7a7562b107a73583df9346a090de278410e3d29234ff690fe8e') { http_response_code(404); exit; }
@set_time_limit(300);
$raiz = realpath(__DIR__ . '/..');
$copia = dirname($raiz) . '/copias-enlaces-farmacos-2026-11-24';
$B = json_decode(file_get_contents(__DIR__ . '/bloques.json'), true);
$INI = '<!--farmacos.ai-->'; $FIN = '<!--/farmacos.ai-->';
$escribir = isset($_GET['hacer']);
$todos = array_merge(array_keys($B['paginas']), array_keys($B['listados']));
echo "Raíz: $raiz\nCopias en: $copia\nArchivos previstos: " . count($todos) . "\n\n";

if (isset($_GET['deshacer'])) {
    $n = 0;
    foreach ($todos as $a) if (is_file("$copia/$a")) { copy("$copia/$a", "$raiz/$a"); $n++; }
    echo "Devueltos a la copia: $n\n"; exit;
}
function quitar($h) { global $INI, $FIN; return preg_replace('#' . preg_quote($INI, '#') . '.*?' . preg_quote($FIN, '#') . '#s', '', $h); }
$cuenta = ['cambia' => 0, 'igual' => 0, 'no_existe' => 0, 'sin_ancla' => 0, 'error' => 0];
function poner($a, $nuevo, $viejo) {
    global $raiz, $copia, $escribir, $cuenta;
    if ($nuevo === $viejo) { $cuenta['igual']++; return; }
    if (!$escribir) { $cuenta['cambia']++; return; }
    if (!is_file("$copia/$a")) { @mkdir(dirname("$copia/$a"), 0755, true); if (!copy("$raiz/$a", "$copia/$a")) { echo "$a: sin copia, no se toca\n"; $cuenta['error']++; return; } }
    $ok = file_put_contents("$raiz/$a", $nuevo, LOCK_EX);
    if ($ok === strlen($nuevo)) $cuenta['cambia']++; else { $cuenta['error']++; echo "$a: ERROR al escribir\n"; }
}
// Fichas: recuadro justo antes de las fuentes; {N} = título de la página
foreach ($B['paginas'] as $a => $bloque) {
    $h = @file_get_contents("$raiz/$a");
    if ($h === false) { $cuenta['no_existe']++; echo "$a: no existe\n"; continue; }
    $limpio = quitar($h);
    $ancla = '<section class="fuentes">';
    if (substr_count($limpio, $ancla) !== 1 || !preg_match('#<h1[^>]*>(.*?)</h1>#s', $limpio, $t)) { $cuenta['sin_ancla']++; echo "$a: sin ancla, no se toca\n"; continue; }
    $nombre = htmlspecialchars(html_entity_decode(trim(strip_tags($t[1])), ENT_QUOTES, 'UTF-8'), ENT_QUOTES, 'UTF-8');
    $b = $INI . str_replace('{N}', $nombre, $bloque) . $FIN;
    poner($a, str_replace($ancla, $b . $ancla, $limpio), $h);
}
// Listados: aviso tras el primer <p class="aviso"> de <main>
foreach ($B['listados'] as $a => $bloque) {
    $h = @file_get_contents("$raiz/$a");
    if ($h === false) { $cuenta['no_existe']++; echo "$a: no existe\n"; continue; }
    $limpio = quitar($h);
    $m = strpos($limpio, '<main>'); $i = $m === false ? false : strpos($limpio, '<p class="aviso">', $m); $k = $i === false ? false : strpos($limpio, '</p>', $i);
    if ($k === false) { $cuenta['sin_ancla']++; echo "$a: sin ancla, no se toca\n"; continue; }
    $k += 4;
    poner($a, substr($limpio, 0, $k) . $INI . $bloque . $FIN . substr($limpio, $k), $h);
}
echo "\n" . ($escribir ? "Hecho" : "Solo revisión (nada se cambia)") . ": " . json_encode($cuenta) . "\n";
