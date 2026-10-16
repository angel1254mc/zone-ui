# Writing Zone docs content

The docs site lives in `site/` (Vite + React Router, SPA). Every page in `site/app/catalog.ts` already exists;
writing content means adding a module in that page's own folder. The registry finds modules with
`import.meta.glob`, so **you never edit a shared file**.

```sh
npm run site:dev       # http://localhost:5180
npm run site:docgen    # regenerate site/app/generated/props.json after a component's props change
npm run site:build     # static build in site/build/client
npm run site:preview   # serve that build on http://localhost:5181
```

## Rules

- `site/app/catalog.ts` is the single source of names, tiers, blurbs and docgen components. Read it, never edit it.
- Your folder name is the catalog slug: `content/components/<slug>/`, `content/docs/<slug>/`,
  `content/examples/<slug>/`.
- Touch only your own folders. Everything else (`ui/`, `lib/`, `pages/`, `routes/`, `styles/`, `routes.ts`) is
  shared: if it blocks you, report it instead of changing it.
- Write about the components only: what they do and how to use them. Never mention other UI libraries, how the
  kit or these docs were made, or plans and status.

## Component pages

```
content/components/<slug>/
  doc.tsx           default export: ComponentDoc
  demos/hero.tsx    the large preview at the top of Overview
  demos/<name>.tsx  one file per example
```

`doc.tsx` (see `content/components/button`, `segmented-tabs` and `navbar`):

| Field            | Required | What it is                                                                                        |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `hero`           | yes      | `{ demo: 'hero' }`, optionally `frame`.                                                           |
| `usage`          | yes      | One or two short paragraphs (JSX): when to use it, and what to use instead.                       |
| `usageCode`      | yes      | Import line plus the smallest useful snippet.                                                     |
| `examples`       | yes      | `{ demo, title, description, frame? }[]` in page order. `description` is one sentence.            |
| `thumbnail`      | yes      | Component for the gallery card. See the rules below.                                              |
| `thumbnailScale` | no       | `--zzz-scale` of the card preview. Default `0.5`.                                                 |
| `types`          | no       | Extra tables on Properties: `{ name, rows: { name, type, required?, description }[] }[]`.         |
| `notes`          | no       | Lists on Properties: `{ title, items: ReactNode[] }[]`, e.g. States, Keyboard, Native attributes. |
| `related`        | no       | Catalog slugs of related components.                                                              |
| `wide`           | no       | Full-width page without the on-this-page rail (organisms that need the room).                     |
| `playground`     | no       | Live prop controls. Only Button has one; add others only when asked.                              |

The page header, the import fallback and the props tables come from the catalog and `props.json`; you don't
write them. Use plain `<code>` in `usage` and `notes`; it is styled for you. Type descriptions are plain text
where `backticks` become code.

### Demos

- One example per file, default-exported component. The file name (without `.tsx`) is the `demo` value and the
  anchor id (`/components/button#icon-tones`). Don't use `hero`, `usage`, `examples`, `related` or
  `playground` as example names.
- The Code view shows the file exactly as written, so it must be copy-pasteable: import only from
  `@angel1254mc/zone-ui` and `react` (and `examples/art` for game art). No `react-router`, no site files.
- Links inside demos point at hash targets (`href="#news"`), never at real site paths.
- Every file in `demos/` must be used by `hero` or `examples`.
- `frame`: `center` (default), `start` (left-aligned) or `bleed` (no padding, for full-width parts).

### Thumbnail rules

The gallery (`/components`) shows each thumbnail live in a card:

- The card preview is 200 px tall and at least 260 px wide (up to ~380 px). The thumbnail renders centred inside
  a nested `ZzzTheme` at `thumbnailScale` (default 0.5) and anything outside the preview is clipped
  (`overflow: hidden`). At 0.5, one design unit is half a pixel: keep the thumbnail within about 250 × 190 CSS px.
- The preview container is `inert`: nothing inside can be focused or clicked, and the card link is the only tab
  stop. Don't rely on interaction; show the state you want through props (`defaultValue`, `defaultChecked`…).
- Static and inline: no portals, no fixed-position overlays, no timers, autoplay or network requests. For
  overlays (Modal, Drawer, Toast, Tooltip, Dropdown Menu, Confirm Dialog) show the trigger or a representative
  inline panel, not the real overlay.
- Size things in design units, not pixels, so they follow the scale: `width: 'calc(820 * var(--zzz-px))'`, or
  the component's own numeric `width` prop. Full-width parts get an explicit width, a lower `thumbnailScale` and
  no self-measuring layout (the Nav Bar thumbnail: 820 units wide, `collapse="never"`, scale 0.36, ≈ 295 px).
- Don't wrap it in your own `ZzzTheme`. Define it in `doc.tsx`; it is not shown as code.
- A broken thumbnail falls back to the placeholder and logs an error, so check the gallery after adding one.

## Docs and Examples pages

```
content/docs/<slug>/page.tsx        Getting started and Foundations pages
content/examples/<slug>/page.tsx    example apps
```

Default export: `PageDoc` — `{ Body, toc?, wide?, ownHeader?, thumbnail?, thumbnailScale? }`. `Body` renders
under the standard header (catalog name and blurb). Each `toc` id must exist inside `Body`. `thumbnail` is used
by the Examples overview card (same rules as above). Pages may use the site's building blocks: `ui/CodeBlock`,
`ui/PropsTable`, and `ui/ExampleBlock` with `resolveDemo('docs/<slug>', { demo })` from `lib/demos` for files in
the page's own `demos/` folder. See `content/docs/installation` and `theming`.

## Pending pages

Without a module, a page still works: component pages show the generated Properties tab, and the Overview,
gallery card and docs pages show a neutral fallback marked `data-pending`. The fallback disappears as soon as
your module exists. `document.querySelectorAll('[data-pending]')` lists what is left.

## Checks before you hand over

```sh
npx prettier@3.7.4 --write <your files>
npm run typecheck
npx vitest run site        # catalog routes, contract checks, every demo and thumbnail renders
npm run site:build
npm test                   # the full suite and the repository hygiene check
```

`site/scripts/contrast.mjs` measures text contrast in the chrome against a running server (see its header).
