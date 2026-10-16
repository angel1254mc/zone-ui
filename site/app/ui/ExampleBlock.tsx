import { useState } from 'react';
import { SegmentedTabs } from '@angel1254mc/zone-ui';
import type { ResolvedDemo, ResolvedExample } from '../types';
import { CodeBlock } from './CodeBlock';

const VIEWS = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
];

/** A live demo with a Preview / Code switch. Pass `title` to render the example heading and description. */
export function ExampleBlock({ example, label }: { example: ResolvedDemo | ResolvedExample; label?: string }) {
  const [view, setView] = useState('preview');
  const { Demo } = example;
  const titled = 'title' in example ? example : null;
  const name = titled?.title ?? label ?? example.id;
  return (
    <section className="d-example" id={example.id} aria-labelledby={titled ? `${example.id}-h` : undefined}>
      {titled && (
        <header className="d-example__head">
          <h3 id={`${example.id}-h`} className="d-h3">
            {titled.title}
          </h3>
          {titled.description && <p className="d-example__desc">{titled.description}</p>}
        </header>
      )}
      <div className="d-example__frame">
        <div className="d-example__bar">
          <SegmentedTabs size="sm" items={VIEWS} value={view} onValueChange={setView} aria-label={`${name}: view`} />
        </div>
        {view === 'preview' ? (
          <div className={`d-stage d-stage--${example.frame}`}>
            <Demo />
          </div>
        ) : (
          <CodeBlock code={example.code} title={`${example.id}.tsx`} />
        )}
      </div>
    </section>
  );
}
