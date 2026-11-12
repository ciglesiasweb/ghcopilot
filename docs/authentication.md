# Guía de autenticación

Bucks2Bar no implementa autenticación actualmente. Si se incorpora, toda la autenticación de usuario debe gestionarse exclusivamente mediante cookies.

- No uses tokens, `localStorage`, `sessionStorage` ni ningún otro mecanismo para autenticar usuarios o conservar credenciales.
- No cambies esta regla sin actualizar primero los requisitos del proyecto.
- Mantén la aplicación browser-only y sus restricciones de privacidad; cualquier propuesta que requiera cambiar esa arquitectura debe tratarse como un cambio de arquitectura explícito.
