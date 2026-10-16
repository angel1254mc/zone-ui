import { Link } from 'react-router';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';

function Installation() {
  return (
    <>
      <section className="d-section d-prose" id="install">
        <h2 className="d-h2">Install</h2>
        <p>
          Zone needs React 19 or later: its components take <code>ref</code> as a regular prop. It has no other runtime
          dependencies.
        </p>
        <CodeBlock lang="bash" code="npm install @angel1254mc/zone-ui" />
      </section>

      <section className="d-section d-prose" id="styles">
        <h2 className="d-h2">Load the styles</h2>
        <p>
          Import the stylesheet once, at the entry of your app. It holds the design tokens, the base styles (the accent
          clock, materials and text roles) and every component's CSS.
        </p>
        <CodeBlock
          title="main.tsx"
          code={`import '@angel1254mc/zone-ui/fonts.css'; // optional: Mona Sans from Google Fonts
import '@angel1254mc/zone-ui/styles.css';`}
        />
        <p>
          <code>fonts.css</code> is optional. Leave it out if you already load Mona Sans, or if you self-host the
          display face.
        </p>
      </section>

      <section className="d-section d-prose" id="theme-root">
        <h2 className="d-h2">Wrap the app</h2>
        <p>
          Render your app inside <code>ZzzTheme</code>. It scopes the tokens and type baseline, and can change the
          density of everything inside it.
        </p>
        <CodeBlock
          title="App.tsx"
          code={`import { Button, SegmentedTabs, ZzzTheme } from '@angel1254mc/zone-ui';

export function App() {
  return (
    <ZzzTheme>
      <SegmentedTabs
        aria-label="Mode"
        defaultValue="daily"
        items={[
          { value: 'daily', label: 'Daily' },
          { value: 'archive', label: 'Archive' },
        ]}
      />
      <Button>Start</Button>
    </ZzzTheme>
  );
}`}
        />
      </section>

      <section className="d-section d-prose" id="next">
        <h2 className="d-h2">Next steps</h2>
        <ul className="d-note__list">
          <li>
            <Link to="/docs/theming">Theming</Link>: density, the accent clock and design tokens.
          </li>
          <li>
            <Link to="/components">Components</Link>: every component with live examples and its props.
          </li>
          <li>
            <Link to="/examples">Examples</Link>: complete apps built only from the kit.
          </li>
        </ul>
      </section>
    </>
  );
}

const page: PageDoc = {
  Body: Installation,
  toc: [
    { id: 'install', label: 'Install' },
    { id: 'styles', label: 'Load the styles' },
    { id: 'theme-root', label: 'Wrap the app' },
    { id: 'next', label: 'Next steps' },
  ],
};

export default page;
