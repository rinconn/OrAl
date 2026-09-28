# 0005 · Ramas, PRs y comprobación automática

- **Estado:** Aceptada
- **Fecha:** 2026-09-28

## Contexto

Queremos trabajar como si la web ya fuera la definitiva desde el primer día: nada provisional y nada que se rompa sin avisar.

## Decisión

- `main` siempre funciona. Cada cambio va en una rama y entra por **PR**.
- En cada PR, GitHub Actions ejecuta formato (Prettier), lint (ESLint con reglas de accesibilidad),
  tipos (`astro check`) y build. Si algo falla, no se acepta.
- La PR explica en pocas líneas qué cambia y cómo se ha probado.

## Alternativas descartadas

- **Trabajar directo en `main`:** más rápido al principio, pero sin historia clara ni red de seguridad.

## Consecuencias

- Cada cambio tiene su explicación y se puede deshacer por separado.
- La historia de PRs es la memoria del proyecto, junto con el [CHANGELOG](../../CHANGELOG.md).
