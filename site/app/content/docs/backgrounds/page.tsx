import { Link } from 'react-router';
import { resolveDemo } from '../../../lib/demos';
import type { Frame, PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { ExampleBlock } from '../../../ui/ExampleBlock';
import { PropsTable } from '../../../ui/PropsTable';
import './backgrounds.css';

const demo = (name: string, frame?: Frame) => resolveDemo('docs/backgrounds', { demo: name, frame });

function Backgrounds() {
  return (
    <div className="bg-page">
      <section className="d-section d-prose bg-prose" id="usage">
        <h2 className="d-h2">Usage</h2>
        <p>
          Background layers are decorative. Each one fills its nearest positioned ancestor, sits behind the content, is
          hidden from assistive technology and ignores the pointer. Put the layer first inside a container with{' '}
          <code>position: relative</code> and <code>overflow: hidden</code>, and give the content{' '}
          <code>position: relative</code> so it paints on top.
        </p>
        <CodeBlock
          code={`import { HatchBackground } from '@angel1254mc/zone-ui';

<section style={{ position: 'relative', overflow: 'hidden' }}>
  <HatchBackground />
  <div style={{ position: 'relative' }}>Content</div>
</section>`}
        />
        <p>
          Layers stack in source order, so a graffiti layer followed by film strips draws the strips on top. For the
          same looks as CSS classes on your own elements, see <Link to="/docs/materials">Materials</Link>.
        </p>
      </section>

      <section className="d-section d-prose bg-prose" id="hatch">
        <h2 className="d-h2">Hatch</h2>
        <p>
          <code>HatchBackground</code> fills its box with 39.8° stripes. The default <code>black</code> tone is the
          faint white hatch behind most screens. <code>sage</code>, <code>teal</code> and <code>deep</code> are the
          coloured panels of the sweep transition, and an object sets your own light and dark stripes.
        </p>
        <ExampleBlock example={demo('hatch-tones')} label="Hatch tones" />
      </section>

      <PropsTable component="HatchBackground" />

      <section className="d-section d-prose bg-prose" id="dots">
        <h2 className="d-h2">Dot texture</h2>
        <p>
          <code>DotTexture</code> lays the diamond dot mesh over whatever is behind it, transparent between the dots.
          Pick a pitch with <code>size</code>, and set the strength of the light and dark dots with <code>alpha</code>{' '}
          and <code>shade</code>.
        </p>
        <ExampleBlock example={demo('dot-texture-sizes')} label="Dot texture sizes" />
      </section>

      <PropsTable component="DotTexture" />

      <section className="d-section d-prose bg-prose" id="graffiti">
        <h2 className="d-h2">Graffiti</h2>
        <p>
          <code>GraffitiLayer</code> draws large tilted lettering, a monogram and fine print as a dark watermark. The
          lettering keeps its size in any container; a smaller box just shows less of it.
        </p>
        <ul className="d-note__list">
          <li>
            <code>variant="agent"</code> (the default) fades toward the lower left and expects pure black behind it. Do
            not put it over the hatch.
          </li>
          <li>
            <code>variant="dialog"</code> is dimmer, for the band of a dialog.
          </li>
          <li>
            <code>drift</code> slides the lettering slowly along its baseline. It stops when the system asks for reduced
            motion or an ancestor has <code>data-reduced-motion</code>. <code>GRAFFITI_LOOP_SECONDS</code> is the length
            of one loop.
          </li>
        </ul>
        <ExampleBlock example={demo('graffiti-variants', 'bleed')} label="Graffiti variants" />
      </section>

      <PropsTable component="GraffitiLayer" />

      <section className="d-section d-prose bg-prose" id="film-strips">
        <h2 className="d-h2">Film strips</h2>
        <p>
          <code>FilmStripBackground</code> draws film strips leaning 16° along the left side of its box. Each strip
          alternates dark windows and orange posters with black stencils. Pass <code>frames</code> to put your own
          content on the posters, cycled in order, and <code>strips</code> to show two strips instead of three.
        </p>
        <ExampleBlock example={demo('film-strip-layers', 'bleed')} label="Film strips" />
      </section>

      <PropsTable component="FilmStripBackground" />

      <section className="d-section d-prose bg-prose" id="mural">
        <h2 className="d-h2">Mural band</h2>
        <p>
          <code>StorageMuralBackground</code> is a dimmed image band, for example behind a top bar. Pass any image URL
          as <code>src</code>: it covers the band under a black veil, so nothing gets brighter than <code>#2E2E2E</code>{' '}
          and text stays readable. The image fades in once it has fully loaded. While it loads, if it fails, or without{' '}
          <code>src</code>, a flat dark band shows instead.
        </p>
        <ExampleBlock example={demo('mural-band', 'bleed')} label="Mural band" />
        <p>The package ships no images. The art in this example loads by URL.</p>
      </section>

      <PropsTable component="StorageMuralBackground" />
    </div>
  );
}

const page: PageDoc = {
  Body: Backgrounds,
  toc: [
    { id: 'usage', label: 'Usage' },
    { id: 'hatch', label: 'Hatch' },
    { id: 'api-HatchBackground', label: 'HatchBackground props', sub: true },
    { id: 'dots', label: 'Dot texture' },
    { id: 'api-DotTexture', label: 'DotTexture props', sub: true },
    { id: 'graffiti', label: 'Graffiti' },
    { id: 'api-GraffitiLayer', label: 'GraffitiLayer props', sub: true },
    { id: 'film-strips', label: 'Film strips' },
    { id: 'api-FilmStripBackground', label: 'FilmStripBackground props', sub: true },
    { id: 'mural', label: 'Mural band' },
    { id: 'api-StorageMuralBackground', label: 'StorageMuralBackground props', sub: true },
  ],
};

export default page;
