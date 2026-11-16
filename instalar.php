<?php
// Google Analytics G-96PPMQZFX2 con aviso de cookies en medicapedia.org (16-11-2026).
// ?clave=...             -> solo mira (no cambia nada)
// ?clave=...&hacer=1     -> copia de seguridad y cambia assets/busca.js, cookies.html y privacidad.html (es, en, ca)
// ?clave=...&deshacer=1  -> vuelve a poner las copias
header('Content-Type: text/plain; charset=utf-8');
if (hash('sha256', (string)($_GET['clave'] ?? '')) !== '7a9d2e98594624ec484773d82cacf567bfc5a017f2a4b5d00e4101c145f7dab3') { http_response_code(404); exit; }
require __DIR__ . '/textos.php';
$raiz = realpath(__DIR__ . '/..');
$copia = dirname($raiz) . '/copias-ga-2026-11-16';
$ID = 'G-96PPMQZFX2';
$archivos = ['assets/busca.js', 'cookies.html', 'en/cookies.html', 'ca/cookies.html', 'privacidad.html', 'en/privacidad.html', 'ca/privacidad.html'];
$escribir = isset($_GET['hacer']);

echo "Raíz: $raiz\nCopias en: $copia\n\n";
// 1. Revisión: etiquetas de Google ya puestas en páginas sueltas (portadas y legales) y en busca.js
foreach (array_merge(['index.html', 'en/index.html', 'ca/index.html'], $archivos) as $a) {
    $h = @file_get_contents("$raiz/$a");
    if ($h === false) { echo "$a: NO EXISTE\n"; continue; }
    echo "$a: " . strlen($h) . " B" . (preg_match('/googletagmanager|gtag\(|G-[A-Z0-9]{8,}/', $h) ? "  ** ya tiene etiqueta de Google **" : "") . "\n";
}
echo "\n";

if (isset($_GET['deshacer'])) {
    foreach ($archivos as $a) {
        if (is_file("$copia/$a")) { copy("$copia/$a", "$raiz/$a"); echo "$a: devuelto a la copia (" . filesize("$raiz/$a") . " B)\n"; }
        else echo "$a: no hay copia\n";
    }
    exit;
}
if (!$escribir) echo "Solo revisión (nada se cambia):\n";

// 2. Copias de seguridad (solo la primera vez), fuera de public_html
if ($escribir) foreach ($archivos as $a) {
    if (!is_file("$copia/$a")) { @mkdir(dirname("$copia/$a"), 0755, true); copy("$raiz/$a", "$copia/$a"); }
    echo "copia $a: " . (is_file("$copia/$a") ? filesize("$copia/$a") . " B" : "ERROR") . "\n";
}
if ($escribir) foreach ($archivos as $a) if (!is_file("$copia/$a")) { echo "\nFalta alguna copia: no se cambia nada.\n"; exit; }

function poner($a, $nuevo, $viejo) {
    global $raiz, $escribir;
    if ($nuevo === $viejo) { echo "$a: sin cambios\n"; return; }
    if (!$escribir) { echo "$a: se cambiaría (" . strlen($viejo) . " -> " . strlen($nuevo) . " B)\n"; return; }
    $ok = file_put_contents("$raiz/$a", $nuevo, LOCK_EX);
    echo "$a: " . ($ok === strlen($nuevo) ? "cambiado (" . strlen($viejo) . " -> $ok B)" : "ERROR al escribir") . "\n";
}

// 3. busca.js: añadir Analytics + aviso al final
$m = file_get_contents("$raiz/assets/busca.js");
poner('assets/busca.js', strpos($m, $ID) !== false ? $m : rtrim($m) . "\n" . file_get_contents(__DIR__ . '/bloque.js'), $m);

// 4. Páginas legales: cambios exactos; si algo no coincide, ese archivo no se toca
foreach (['es' => '', 'en' => 'en/', 'ca' => 'ca/'] as $l => $p) {
    $h = file_get_contents("$raiz/{$p}cookies.html");
    if (strpos($h, $ID) !== false || strpos($h, '96PPMQZFX2') !== false) { echo "{$p}cookies.html: ya estaba\n"; }
    elseif (preg_match('#(<section class="hero texto">)(.*?)(</section>)#s', $h, $mm) !== 1 || substr_count($h, '<section class="hero texto">') !== 1) echo "{$p}cookies.html: no encuentro la sección, no se toca\n";
    else poner("{$p}cookies.html", str_replace($mm[0], $mm[1] . $COOKIES[$l] . $mm[3], $h), $h);

    $h = file_get_contents("$raiz/{$p}privacidad.html");
    [$viejo, $nuevo, $li] = $PRIV[$l];
    if (strpos($h, 'Google Analytics') !== false) echo "{$p}privacidad.html: ya estaba\n";
    elseif (substr_count($h, $viejo) !== 1) echo "{$p}privacidad.html: no encuentro la frase, no se toca\n";
    else { $n = str_replace($viejo, $nuevo, $h); $i = strpos($n, '</ul>', strpos($n, $nuevo)); poner("{$p}privacidad.html", substr($n, 0, $i) . $li . substr($n, $i), $h); }
}
echo "\nHecho.\n";
