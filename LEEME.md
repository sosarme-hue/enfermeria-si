# Blog de Ludicopedia (rama de despliegue)

Esta rama solo contiene la carpeta `_blog` de ludicopedia.com. Hostinger la despliega por Git en `public_html/_blog` y nada más.
La carpeta está protegida con `.htaccess` (Require all denied).

- `aplicar.php` (una sola vez, tarea programada): añade «📝 Blog» al menú pegando un trozo al final de `js/comun.js` y ejecuta `publicar.php`.
  Si se vuelve a subir un comun.js sin ese trozo, se borra `hecho.txt` y se ejecuta otra vez.
- `publicar.php` (cada día, tarea programada): publica en `/blog/` los artículos cuya fecha ha llegado (nunca sobrescribe uno ya publicado),
  pone la portada del blog de esa fecha y añade las URL a `sitemap.xml`.
- Generado con `gen_blog.py` (en project-files, carpeta blogs-2026-11-10/ludicopedia).
