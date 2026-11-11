#!/bin/bash
# Medicapedia: activa el diseno C "Laboratorio" (ES, EN y CA). Uso unico, 11-11-2026.
R=/home/u235595016/domains/medicapedia.org/public_html
C=/home/u235595016/domains/medicapedia.org/copias-diseno/2026-11-11
cd "$R" || exit 1
if [ ! -f "$C/assets/estilo.css" ]; then
  mkdir -p "$C/en" "$C/ca" "$C/assets"
  cp -p index.html "$C/index.html"; cp -p en/index.html "$C/en/index.html"; cp -p ca/index.html "$C/ca/index.html"
  cp -p assets/estilo.css "$C/assets/estilo.css"
fi
mkdir -p img/diseno
cp _diseno/img/pasteur.jpg _diseno/img/nightingale.jpg img/diseno/
cp _diseno/medi-portada.css assets/medi-portada.css
# bloque al final de estilo.css (se parte siempre de la copia, sin duplicar)
cat "$C/assets/estilo.css" _diseno/bloque-laboratorio.css > assets/estilo.css
grep -q 'medi-portada.css' index.html || sed -i 's#<link rel="stylesheet" href="assets/estilo.css?v=20261105">#&\n<link rel="stylesheet" href="assets/medi-portada.css?v=1">#' index.html
for L in en ca; do grep -q 'medi-portada.css' $L/index.html || sed -i 's#<link rel="stylesheet" href="../assets/estilo.css?v=20261105">#&\n<link rel="stylesheet" href="../assets/medi-portada.css?v=1">#' $L/index.html; done
{ date; wc -c assets/estilo.css assets/medi-portada.css index.html en/index.html ca/index.html img/diseno/*.jpg; grep -c 'medi-portada.css' index.html en/index.html ca/index.html; } > _diseno/hecho.txt 2>&1
