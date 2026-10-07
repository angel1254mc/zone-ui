import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts, then the foundations, then the barrel (every component's CSS). tokens.css and base.css are imported
// explicitly: the production build drops the barrel's own `import './styles/tokens.css'` / `base.css`
// side-effect imports (no :root tokens, no accent clock, no materials in demo-dist), while the component CSS
// imported from each component module survives.
import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/base.css';
import '@angel1254mc/zone-ui';
import './demo.css';
import { configureArt } from '../examples/art';
import { App } from './App';

// Game art is loaded BY URL at runtime from the committed manifest (static.nanoka.cc / Enka.Network); the
// demo ships no image file. Test hook: `?artBase=<url>` points both sources at another host (a self-hosted
// mirror, or an unreachable one to see the empty frames).
const artBase = new URLSearchParams(window.location.search).get('artBase');
if (artBase) configureArt({ nanokaBase: artBase, enkaBase: artBase });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
