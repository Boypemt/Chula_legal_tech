# Chula Legal Tech — web starter

A minimal static web starter: semantic HTML, a small CSS token layer with
light/dark themes, and vanilla ES modules. No build step, no dependencies.

## Project layout

```
.
├── index.html        # Page shell: header, hero, sections, footer
├── css/
│   └── styles.css    # Design tokens, base styles, components
├── js/
│   ├── main.js       # Entry point — wires up the page
│   └── theme.js      # Light/dark theme toggle with localStorage
├── package.json      # Dev-server scripts only (no dependencies)
├── .editorconfig
└── .gitignore
```

## Running it locally

The page uses ES modules, so open it over HTTP rather than double-clicking the
file (`file://` blocks module imports).

```bash
npm start              # npx serve . — needs network on first run
# or
python -m http.server 3000
```

Then visit <http://localhost:3000>.

## Where to make changes

- **Colours, spacing, fonts** — the `:root` token blocks at the top of
  [css/styles.css](css/styles.css). Dark mode overrides sit right below them, in
  both a `prefers-color-scheme` block and a `[data-theme="dark"]` block.
- **Page content** — [index.html](index.html). Each `<section>` has an `id` that
  the nav links to.
- **Behaviour** — [js/main.js](js/main.js). The counter and contact-form
  handlers are demos; delete them once you have real features.

## Next steps

Pick these up as the project needs them, not upfront:

- Add more pages as sibling HTML files, sharing `css/` and `js/`.
- Point the contact form at a real endpoint in `initForm()`.
- Add a bundler or a framework later — nothing here has to be undone first.
- Deploy by uploading the folder to any static host (GitHub Pages, Netlify,
  Cloudflare Pages).
