# Project Guidelines

## Architecture

- Keep Bucks2Bar a static, browser-only application. Do not add a backend or send user-entered financial data to a server.
- Keep markup in `index.html`, styling in `styles.css`, and application behavior in `script.js` unless a change clearly requires a different structure.
- Preserve the existing local-storage behavior and the pinned Bootstrap and Chart.js CDN dependencies.

## UI and Accessibility

- Every button must have a pink background, including view tabs and interactive states. Keep text readable against the pink background and preserve visible keyboard focus.
- Use semantic HTML, accessible names, and responsive layouts consistent with the existing interface.

## Changes and Validation

- Keep changes focused and follow the existing code style.
- For local manual checks, follow the instructions in [README.md](../README.md). There is no automated test setup currently documented.
