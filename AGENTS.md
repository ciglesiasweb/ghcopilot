# Bucks2Bar

Bucks2Bar es una aplicación estática y browser-only para registrar ingresos y gastos mensuales en dólares estadounidenses y compararlos en un gráfico anual. No tiene backend: los datos financieros se guardan en el almacenamiento local del navegador y no deben enviarse a ningún servidor.

## Arquitectura

- `index.html`: estructura semántica, vistas de datos y gráfico, y carga de dependencias.
- `styles.css`: presentación responsive, estados visuales y foco accesible.
- `script.js`: interacción, validación de importes, persistencia local y visualización con Chart.js.
- `tests/app.test.js`: pruebas de comportamiento con Vitest y jsdom.
- `README.md`: ejecución local, pruebas y comportamiento de datos y privacidad.

Antes de modificar una capa, consulta la guía correspondiente en /docs con las instrucciones específicas de esa capa. Mantén las responsabilidades separadas y sigue también las instrucciones generales del proyecto.

## Invariantes del proyecto

- Mantén la aplicación estática y local; no añadas backend ni transmitas datos financieros.
- Conserva la persistencia existente en `localStorage` y las dependencias CDN fijadas de Bootstrap y Chart.js.
- Mantén HTML semántico, nombres accesibles, navegación por teclado y diseño responsive.
- Todos los botones deben tener fondo rosa, incluidos los tabs y sus estados interactivos; conserva contraste legible y foco visible.
- Limita los cambios al alcance solicitado y respeta el estilo existente.

## Validación

Ejecuta `npm test` para la suite automatizada. Para probar la aplicación manualmente, sigue [`README.md`](README.md); por ejemplo, sírvela localmente con `python -m http.server 8000`.
