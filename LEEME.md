# Ludicopedia: enlace de la web española con la inglesa (rama de despliegue)

Esta rama solo contiene la carpeta `_en` de ludicopedia.com (protegida con `.htaccess`). Hostinger la despliega por Git en `public_html/_en`.

- `aplicar.php` (tarea programada diaria, idempotente): añade hreflang es/en/x-default a las páginas españolas que tienen versión inglesa
  (lista en `mapa.json`), el botón «🌐 English» al final de `js/comun.js` y la línea Sitemap de `/en/sitemap.xml` en `robots.txt`.
  Si otra herramienta regenera páginas o comun.js, al día siguiente se vuelve a aplicar. Copias originales en `_en/copias/`.
- La web inglesa está en `/en/` (rama claude/project-thread-9bbbgx de tenispedia-en-juego).
