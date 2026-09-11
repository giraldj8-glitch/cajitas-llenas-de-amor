# Cajitas llenas de amor 💌

Una colección de cajas 3D con mensajes de reconocimiento para cada persona del equipo. Toca una caja y aparecen las serpentinas y los cariños que te han dedicado.

## Ver en vivo

👉 **[cajitas-llenas-de-amor](https://giraldj8-glitch.github.io/cajitas-llenas-de-amor/)** (GitHub Pages)

## Cómo funciona

- `index.html` — landing con la rejilla de las 8 personas
- `<slug>.html` — una página por persona con su caja 3D
- `assets/` — CSS, JS, datos y confeti compartidos

## Agregar o editar mensajes

Todos los mensajes viven en **`assets/data.js`**. Cada persona tiene un array `mensajes`. Para añadir uno:

```js
'andres-felipe': {
  // ...
  mensajes: [
    {
      de: 'Nombre de quien lo dedica',
      alias: 'Alias corto',        // opcional
      texto: 'El mensaje...'
    }
  ]
}
```

Después haz commit y push — GitHub Pages se actualiza solo.

## Stack

- HTML + CSS + JS puro, sin frameworks ni build step
- Caja 3D con CSS `transform-style: preserve-3d` (sin Three.js)
- Confeti en canvas sin dependencias
- Custom easings (`cubic-bezier(0.23, 1, 0.32, 1)` y spring)
- `prefers-reduced-motion` respetado

## Desplegar

El sitio se publica automáticamente con **GitHub Pages** desde la rama `main`. Para activarlo en otro repo: Settings → Pages → Source: `main` / root.
