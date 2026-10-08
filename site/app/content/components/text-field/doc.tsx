import { SearchIcon, TextField } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a labelled field with a placeholder, and a search field with its icon cap. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(24 * var(--zzz-px))' }}>
      <TextField label="Redeem code" placeholder="Enter redemption code" width={460} />
      <TextField aria-label="Search agents" icon={<SearchIcon />} placeholder="Search agents" width={460} />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.5,
  usage: (
    <>
      <p>
        Use a text field for short typed input in a web form: a code, a nickname, a search. Give it a <code>label</code>
        , or an <code>aria-label</code> when the context already names it. Add a <code>description</code> for hints and
        an <code>error</code> when the value is wrong.
      </p>
      <p>To pick from a fixed set of values, use Select. For a number within a range, use Slider.</p>
    </>
  ),
  usageCode: `import { TextField } from '@angel1254mc/zone-ui';

<TextField label="Redeem code" placeholder="Enter redemption code" onValueChange={setCode} />`,
  examples: [
    {
      demo: 'validation',
      title: 'Validation',
      description: 'Check the value on submit and pass a message to error. Typing clears it.',
      frame: 'start',
    },
    {
      demo: 'search',
      title: 'Search with an icon',
      description: 'The icon cap marks a search field. The list below filters as you type.',
      frame: 'start',
    },
    {
      demo: 'with-select',
      title: 'Next to a select',
      description: 'Text field and Select share the same heights, so they line up in one row.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'States',
      items: [
        <>
          <b>Focus.</b> The ring turns the live accent.
        </>,
        <>
          <b>Error.</b> <code>error={'{true}'}</code> turns the ring red. Pass a message instead and it also shows under
          the field, linked with <code>aria-describedby</code>.
        </>,
        <>
          <b>Disabled.</b> The fill and text grey out.
        </>,
      ],
    },
    {
      title: 'Native attributes',
      items: [
        <>
          <code>className</code>, <code>style</code> and <code>width</code> style the outer wrapper. <code>ref</code>{' '}
          and every other attribute go to the <code>&lt;input&gt;</code>, so <code>value</code>,{' '}
          <code>defaultValue</code>, <code>onChange</code>, <code>name</code> and <code>type</code> work as usual.
        </>,
        <>
          <code>size</code> sets the height (<code>sm</code>, <code>md</code>, <code>lg</code>), not the native
          character count. Without <code>width</code> the field fills its container.
        </>,
      ],
    },
  ],
  related: ['select', 'inline-error', 'button'],
};

export default doc;
