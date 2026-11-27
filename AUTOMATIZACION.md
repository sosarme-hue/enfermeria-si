# Quiz de enfermeria.si: preguntas nuevas cada dos días

Esta rama (`quiz-web`) se despliega en la carpeta `/quiz/` de enfermeria.si
(Hostinger, `hosting_git_deploy-website-repository`, usuario u235595016,
rama `quiz-web`, directorio `quiz`). Solo toca esa carpeta.

## Cómo funciona el quiz
- `preguntas.json` es el banco. El orden importa: el quiz n.º R (cada dos días
  desde el 27-11-2026) usa las preguntas de las posiciones 10·R a 10·R+9.
- **Nunca reordenes ni borres preguntas**: solo se añaden al final.
  Una pregunta con un error se corrige en su sitio.
- Cada pregunta: `id` (siguiente número), `q` (pregunta), `o` (2–4 opciones),
  `a` (índice de la correcta, 0 = primera), `x` (explicación de 1–2 frases),
  `tema` y `l` (ficha de enfermeria.si para repasar, p. ej. `tecnicas/sepsis/`).
- Temas: tecnicas, farmacos, escalas, urgencias, cronicos, seguridad, vacunas,
  etapas, proceso, historia, mitos (en mitos, opciones `["Realidad","Mito"]`).

## Tanda de cada dos días (10 preguntas)
1. Lee `preguntas.json` para no repetir preguntas ni datos ya preguntados.
2. Escribe 10 preguntas nuevas, en español, variando temas. Cada dato debe salir
   de la ficha enlazada en `l` (léela en https://enfermeria.si/<l> o en
   `assets/buscar.json` de la rama `main`), que ya cita guías vigentes.
   Nada que la ficha no diga. Varía la posición de la respuesta correcta.
3. Comprueba que el JSON es válido, que `a` está en rango y que cada `l` existe.
4. Commit y push a `quiz-web`, despliega en `/quiz/` y comprueba que
   https://enfermeria.si/quiz/preguntas.json tiene el nuevo total.
