<?php
// Enlaces de Medicapedia hacia Pulmonopedia (28-11-2026).
// ?clave=...             -> solo mira (no cambia nada)
// ?clave=...&hacer=1     -> copia de seguridad y añade el recuadro «Hoy · Pulmonopedia» en las fichas enf/ y f/ (es, en, ca)
// ?clave=...&deshacer=1  -> vuelve a poner las copias
header('Content-Type: text/plain; charset=utf-8');
if (hash('sha256', (string)($_GET['clave'] ?? '')) !== '70a9e79903b03b5aecd07fbac1361875db7950de55542d2673c95c401365521b') { http_response_code(404); exit; }
@set_time_limit(300);
$raiz = realpath(__DIR__ . '/..');
$copia = dirname($raiz) . '/copias-enlaces-pulmonopedia-2026-11-28';
$B = json_decode(file_get_contents(__DIR__ . '/bloques.json'), true);
$INI = '<!--pulmonopedia-->'; $FIN = '<!--/pulmonopedia-->';
$escribir = isset($_GET['hacer']);
$todos = array_keys($B['paginas']);
echo "Raíz: $raiz\nCopias en: $copia\nArchivos previstos: " . count($todos) . "\n\n";
if (isset($_GET['deshacer'])) {
    $n = 0;
    foreach ($todos as $a) if (is_file("$copia/$a")) { copy("$copia/$a", "$raiz/$a"); $n++; }
    echo "Devueltos a la copia: $n\n"; exit;
}
$cuenta = ['cambia' => 0, 'igual' => 0, 'no_existe' => 0, 'sin_ancla' => 0, 'error' => 0];
foreach ($B['paginas'] as $a => $bloque) {
    $h = @file_get_contents("$raiz/$a");
    if ($h === false) { $cuenta['no_existe']++; echo "$a: no existe\n"; continue; }
    $limpio = preg_replace('#' . preg_quote($INI, '#') . '.*?' . preg_quote($FIN, '#') . '#s', '', $h);
    $ancla = '<section class="fuentes">';
    if (substr_count($limpio, $ancla) !== 1) { $cuenta['sin_ancla']++; echo "$a: sin ancla, no se toca\n"; continue; }
    $nuevo = str_replace($ancla, $INI . $bloque . $FIN . $ancla, $limpio);
    if ($nuevo === $h) { $cuenta['igual']++; continue; }
    if (!$escribir) { $cuenta['cambia']++; continue; }
    if (!is_file("$copia/$a")) { @mkdir(dirname("$copia/$a"), 0755, true); if (!copy("$raiz/$a", "$copia/$a")) { echo "$a: sin copia, no se toca\n"; $cuenta['error']++; continue; } }
    $ok = file_put_contents("$raiz/$a", $nuevo, LOCK_EX);
    if ($ok === strlen($nuevo)) $cuenta['cambia']++; else { $cuenta['error']++; echo "$a: ERROR al escribir\n"; }
}
echo "\n" . ($escribir ? "Hecho" : "Solo revisión (nada se cambia)") . ": " . json_encode($cuenta) . "\n";
