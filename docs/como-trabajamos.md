# Cómo trabajamos

## Entorno

Se trabaja en **GitHub Codespaces** desde VS Code ([0003](decisiones/0003-codespaces-como-entorno.md)).
Al abrirlo instala todo y arranca la web sola; la vista previa está en la pestaña **Puertos** (puerto 4321).
Si se para, en la terminal del Codespace: `npm run dev`.

## Flujo de un cambio

1. Cada cambio va en su **rama**, nunca directo a `main` ([0005](decisiones/0005-ramas-pr-y-ci.md)).
2. Se abre una **PR** contando en pocas líneas qué cambia y cómo se ha probado.
3. GitHub ejecuta la **comprobación automática** (formato, lint, tipos y build). Tiene que salir en verde.
4. Se revisa y se **acepta** la PR. En el Codespace: `git checkout main` y `git pull`.

Nombres de rama cortos y en español, que digan qué es: `cabecera`, `catalogo`, `documentacion`.
Los mensajes de commit también en español, en imperativo o describiendo el resultado.

## Antes de subir un cambio

- [ ] `npm run verify` pasa (formato, lint, tipos y build).
- [ ] Revisado en escritorio (1440 px) y móvil (390 px): sin scroll horizontal ni textos cortados.
- [ ] Sin errores en la consola del navegador.
- [ ] Se puede usar con teclado (Tab, Enter, Esc) y todo lo interactivo tiene foco visible.
- [ ] Ningún dato inventado: todo sale del catálogo o de la web actual ([Contenido](contenido.md)).
- [ ] Si mejora algo frente a la web actual: nota `.why` en la sección y fila en [Antes y después](antes-y-despues.md).
- [ ] [CHANGELOG](../CHANGELOG.md) actualizado; decisión nueva en [`decisiones/`](decisiones/) si cuesta deshacerla.

## Versiones

El registro de cambios sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Mientras la web no
esté publicada, todo se acumula en "Sin publicar" con el número de su PR. Al publicar se cierra la versión 1.0.0.
