# Dragon Ball Explorer — HTML, CSS y JavaScript puro

## Descripción

Aplicación web para consultar y visualizar personajes de Dragon Ball mediante la API pública https://dragonball-api.com/api-docs.

**Esta versión no utiliza Node.js, Express, Python ni un backend propio.** El navegador consume la API directamente mediante `fetch()`.

## Tecnologías

- HTML: estructura de la página.
- CSS: diseño adaptable a móvil y computador.
- JavaScript: eventos, solicitudes HTTP, lectura de JSON y manipulación del DOM.
- Dragon Ball API: fuente externa de información.

## Cómo ejecutar

1. Descomprime el ZIP.
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` en el navegador. Recomendado: utiliza la extensión Live Server para servir los archivos localmente.
4. Busca personajes y abre el botón “Ver detalles”.

No se necesita ejecutar `npm install`, crear un entorno virtual ni instalar un servidor backend.

## Estructura

```text
dragon-ball-explorer-no-node/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

## Cómo funciona

1. El usuario abre la página.
2. `app.js` realiza una solicitud `fetch()` a la API pública.
3. La API responde con datos JSON.
4. JavaScript lee la respuesta y crea tarjetas con el nombre, imagen, raza y afiliación.
5. El usuario puede buscar y consultar los detalles de un personaje.

## Rutas consultadas

- `https://dragonball-api.com/api/characters?page=1&limit=12`
- `https://dragonball-api.com/api/characters/{id}`

Revisa la documentación oficial si cambia el formato de respuesta o los parámetros: https://dragonball-api.com/api-docs

## Nota importante sobre la actividad SENA

Esta versión se enfoca en la evidencia **GA2-220501096-AA2-EV03 – Consumo de APIs de terceros**, con frontend en HTML, CSS y JavaScript. La guía pide publicar la aplicación y entregar un PDF con portada, enlace al repositorio y enlace de despliegue.

Como el navegador consulta directamente una API de otro dominio, el funcionamiento depende de que la API permita solicitudes CORS desde el navegador. Si el servicio bloquea CORS, se necesitará un proxy/backend; esta versión no lo incluye porque se solicitó evitar Node.js.

GitHub Pages puede alojar estos archivos estáticos directamente. Antes de entregar, publica el repositorio, prueba la web publicada y agrega los enlaces reales a tu documento de evidencia.
