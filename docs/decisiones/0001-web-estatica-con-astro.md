# 0001 · Web estática con Astro

- **Estado:** Aceptada
- **Fecha:** 2026-09-28

## Contexto

La web actual es un WordPress con WPML (2021). Hay que rehacerla de cero, moderna y rápida, en tres idiomas,
y mantenerla un equipo pequeño. El contenido cambia poco: catálogo anual, alguna noticia al mes.

## Decisión

Web estática generada con **Astro**: todas las páginas se construyen en HTML al publicar y se sirven desde un CDN.
Sin servidor ni base de datos propios.

## Alternativas descartadas

- **Seguir con WordPress:** más lento, necesita actualizaciones de seguridad constantes y plugins, y el
  aspecto tiende a plantilla.
- **Next.js:** muy bueno si hubiera área privada desde el primer día; para una web pública añade servidor
  y complejidad que no necesitamos. El área de distribuidores (fase 6) se puede añadir en Astro.

## Consecuencias

- Carga casi instantánea, sin nada que atacar en el servidor y alojamiento gratuito o casi gratuito.
- Los formularios necesitan un servicio externo (Formspree o una función del alojamiento).
- Las noticias, si las edita alguien sin tocar código, necesitarán un gestor de contenidos externo.
