# 0003 · GitHub Codespaces como entorno

- **Estado:** Aceptada
- **Fecha:** 2026-09-28

## Contexto

El portátil de trabajo es de empresa y el Control de aplicaciones de Windows bloquea el binario nativo que usa
Astro (`astro.win32-x64-msvc.node`). `npm run dev` no arranca en local.

## Decisión

Desarrollar en **GitHub Codespaces** desde VS Code de escritorio. El `.devcontainer` instala las dependencias
y arranca la web al abrirlo; `astro.config.mjs` permite la vista previa desde `*.app.github.dev`.

## Alternativas descartadas

- **Pedir una excepción a IT:** posible, pero lenta y fuera de nuestro control.
- **WSL o Docker en local:** también dependen de permisos del equipo.

## Consecuencias

- Mismo entorno para cualquiera que se sume, en cualquier ordenador.
- Codespaces tiene horas gratuitas limitadas al mes; conviene pararlo al terminar (se para solo tras un rato sin uso).
- La terminal buena es la del Codespace, no PowerShell.
