import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { PropsTable } from '../../../ui/PropsTable';

function Theming() {
  return (
    <>
      <section className="d-section d-prose" id="theme-root">
        <h2 className="d-h2">The theme root</h2>
        <p>
          <code>ZzzTheme</code> renders a <code>&lt;div class="zzz-theme"&gt;</code> that scopes the design tokens, the
          type baseline and the accent clock. Wrap your app in one. Nest another to change the density or pin the accent
          for one part of the page.
        </p>
      </section>

      <section className="d-section d-prose" id="density">
        <h2 className="d-h2">Density</h2>
        <p>
          Every length in the kit is a design unit multiplied by <code>--zzz-px</code>, which is{' '}
          <code>1rem / 16 × --zzz-scale</code>. The web default scale is <code>0.7</code>: a medium control is about 40
          px tall and body text about 14 px. Sizes follow the browser's font size and zoom.
        </p>
        <CodeBlock
          title="Scale"
          code={`<ZzzTheme scale={0.5}>{/* compact */}</ZzzTheme>
<ZzzTheme scale={1}>{/* game density: 57 px pills, 20 px body text */}</ZzzTheme>
<ZzzTheme scale="viewport">{/* scales with the window height, for full-screen scenes */}</ZzzTheme>`}
        />
        <p>
          Use <code>"viewport"</code> only for full-screen, game-style scenes such as a title screen. Ordinary pages
          should not size text by the window.
        </p>
      </section>

      <section className="d-section d-prose" id="accent">
        <h2 className="d-h2">The accent</h2>
        <p>
          Selected, active and pressed elements share one accent, <code>--zzz-accent</code>, that pulses from lime to
          yellow. Every component reads the same variable, so everything on screen pulses in step.
        </p>
        <CodeBlock
          title="Accent phase"
          code={`<ZzzTheme accentPhase="lime">{/* pinned: lime, mid or yellow */}</ZzzTheme>
<ZzzTheme reducedMotion>{/* frozen at lime */}</ZzzTheme>`}
        />
        <p>
          Pin the phase with <code>accentPhase</code> for static mock-ups and visual tests. When the operating system
          asks for reduced motion the accent stops at lime on its own; <code>reducedMotion</code> forces that anywhere.
        </p>
      </section>

      <section className="d-section d-prose" id="tokens">
        <h2 className="d-h2">Design tokens</h2>
        <p>
          The tokens are CSS custom properties named <code>--zzz-&lt;path&gt;</code>, for example{' '}
          <code>--zzz-color-text-muted</code> or <code>--zzz-space-dialog-button-gap</code>. Read them in your own CSS
          so custom parts match the kit. The same values are exported as a typed object for JavaScript.
        </p>
        <CodeBlock
          title="tokens.ts"
          code={`import { tokens } from '@angel1254mc/zone-ui';

tokens.color.accent.lime; // '#93BA00'`}
        />
      </section>

      <PropsTable component="ZzzTheme" />
    </>
  );
}

const page: PageDoc = {
  Body: Theming,
  toc: [
    { id: 'theme-root', label: 'The theme root' },
    { id: 'density', label: 'Density' },
    { id: 'accent', label: 'The accent' },
    { id: 'tokens', label: 'Design tokens' },
    { id: 'api-ZzzTheme', label: 'ZzzTheme' },
  ],
};

export default page;
