# Cajitas llenas de amor 🎁

Una caja de regalo 3D para cada persona del equipo. Se abre, salta la tapa,
vuelan las cartitas y aparecen los mensajes que le dedicaron sus compañeros.

## Ver en vivo

👉 **[cajitas-llenas-de-amor](https://giraldj8-glitch.github.io/cajitas-llenas-de-amor/)** (GitHub Pages)

## Cómo funciona

- `index.html` — landing con la rejilla de las 8 personas, cada una con su cajita 3D
- `<slug>.html` — la página de cada persona con su regalo a tamaño completo
- `assets/` — estilos, datos, la caja y el confeti

Todas las páginas de persona son idénticas salvo el `data-persona`. Si cambias
`_template.html`, regenéralas con:

```bash
for f in andres-felipe andres-gamba carlos-corredor daniela-vivas luisa-pulido nelson-rodriguez paula-vivas santiago-daza; do sed "s/__SLUG__/$f/" _template.html > "$f.html"; done
```

## La caja 3D

No hay Three.js ni WebGL: la caja son planos CSS en un contexto
`transform-style: preserve-3d`.

Cada cubo (el cuerpo y la tapa) es un **cubo biselado**: 6 caras planas más
12 biseles a 45° que redondean las aristas. Cada bisel lleva un degradado de
la cara A a la cara B, y eso es lo que hace que la arista se lea *redonda* en
vez de como un chaflán plano — el look de render "clay".

Geometría, para un cubo de ancho `W`, alto `H` y bisel `C`:

| Pieza | Tamaño | Posición |
|---|---|---|
| Cara | `(W-2C) × (H-2C)` | `W/2` ó `H/2` sobre su normal |
| Bisel horizontal | `(W-1.45C) × C√2` | `(H+W-2C)/(2√2)` sobre su normal, corrido `(W-H)/(2√2)` en el plano |
| Bisel vertical | `C√2 × (H-1.45C)` | `(W-C)/√2` sobre su normal |

Los biseles van un poco más largos de la cuenta a propósito: sus puntas
redondeadas se solapan y tapan las esquinas del cubo.

El markup de la caja lo genera `assets/gift.js` — son ~50 elementos por caja,
así que no tiene sentido repetirlos en los 9 HTML.

## Agregar o editar mensajes

Todos los mensajes viven en **`assets/data.js`**. Cada persona tiene un array
`mensajes`:

```js
'andres-felipe': {
  // ...
  mensajes: [
    {
      de: 'Nombre de quien lo dedica',   // opcional
      alias: 'Alias corto',              // opcional
      texto: 'El mensaje...'
    }
  ]
}
```

Si una persona tiene `mensajes: []`, su caja se abre vacía y muestra el
mensaje de "tu caja se está llenando de cariño".

Después haz commit y push — GitHub Pages se actualiza solo.

## Ver el sitio en local

Necesita un servidor: abrir los `.html` con `file://` rompe la carga de los
scripts en algunos navegadores.

```bash
python3 -m http.server 4321
```

Y entra a <http://localhost:4321>.

## Stack

- HTML + CSS + JS puro, sin frameworks ni build step
- Caja 3D en CSS (`preserve-3d`), sin Three.js
- Confeti en canvas sin dependencias, con un solo pozo de partículas
- Curvas propias (`cubic-bezier(0.23, 1, 0.32, 1)` y un spring)
- Parallax con el puntero, que se duerme solo cuando no hay movimiento
- `prefers-reduced-motion` respetado

## Desplegar

El sitio se publica con **GitHub Pages** desde la rama `main`.
Para activarlo en otro repo: Settings → Pages → Source: `main` / root.
