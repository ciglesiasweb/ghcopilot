# Guía de arquitectura

Bucks2Bar es una aplicación web estática. La interfaz y todo el procesamiento de los importes se ejecutan en el navegador; no se debe introducir un servicio backend ni transmitir datos financieros.

## Estructura HTML: `index.html`

- Define el contenido y la estructura accesible de las pestañas Data y Chart.
- Usa elementos semánticos, relaciones ARIA coherentes y controles con nombres accesibles.
- Mantén aquí la carga de `styles.css`, `script.js` y las dependencias CDN fijadas de Bootstrap y Chart.js.
- No incorpores lógica de aplicación ni estilos en línea salvo que un requisito lo justifique.

## Presentación: `styles.css`

- Centraliza aquí los estilos, los estados de interacción y los ajustes responsive.
- Conserva el foco de teclado visible y el contraste de texto.
- Todos los botones, incluidas las pestañas y sus estados, deben tener fondo rosa según las instrucciones del proyecto.
- No traslades la lógica de datos o de navegación desde `script.js` a CSS.

## Comportamiento: `script.js`

- Controla la entrada y validación de importes, el estado de las pestañas, el gráfico y la persistencia en `localStorage`.
- Los importes válidos son no negativos, admiten hasta dos decimales y se guardan automáticamente. Los valores inválidos no deben guardarse ni reflejarse en el gráfico.
- Trata los fallos de lectura o escritura del almacenamiento sin sobrescribir datos ilegibles; la entrada debe seguir disponible en memoria.
- Mantén los datos en el navegador. Si Chart.js no está disponible, la captura de datos debe seguir funcionando.

## Pruebas: `tests/app.test.js`

- Añade o actualiza pruebas Vitest/jsdom para los cambios de comportamiento, accesibilidad y persistencia.
- Ejecuta la suite con `npm test`.
- Para iniciar la aplicación manualmente y revisar el flujo completo, sigue las instrucciones de [`README.md`](../README.md).
