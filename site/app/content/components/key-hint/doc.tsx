import { KeyHints } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the Discard / Lock pair from the foot of an item screen. */
function Thumbnail() {
  return (
    <KeyHints
      size="lg"
      hints={[
        { keyCap: 'R', label: 'Discard' },
        { keyCap: 'T', label: 'Lock' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        A key hint names the keyboard shortcut for an action on screen: a key cap, then what it does. Line several up
        with <code>KeyHints</code>, usually at the right end of a Bottom bar.
      </p>
      <p>
        The hint is a label, not a control. Pass <code>onActivate</code> to listen for the key, and wire it to the same
        handler as the real button, so the action also works by mouse, touch and Tab. For keys inside running text, use
        a plain <code>&lt;kbd&gt;</code>.
      </p>
    </>
  ),
  usageCode: `import { KeyHints } from '@angel1254mc/zone-ui';

<KeyHints
  hints={[
    { keyCap: 'R', label: 'Discard' },
    { keyCap: 'T', label: 'Lock' },
  ]}
/>`,
  examples: [
    {
      demo: 'with-shortcut',
      title: 'With a shortcut',
      description: 'Press T, or click the padlock. Both run the same toggle.',
    },
    {
      demo: 'bottom-bar',
      title: 'In a bottom bar',
      description: 'Bottom bar takes the same hint objects and right-aligns them inside the band.',
      frame: 'bleed',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'The size on KeyHints sets every hint in the row and the gap between them.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <code>onActivate</code> listens on the whole window. It skips held-down repeats, presses with <kbd>Ctrl</kbd>,{' '}
          <kbd>Alt</kbd> or <kbd>Meta</kbd>, and typing in text fields.
        </>,
        <>
          The cap fits one character. When it shows a symbol instead of the key name, pass <code>hotkey</code>:{' '}
          <code>keyCap="↵"</code> with <code>hotkey="Enter"</code>.
        </>,
        <>
          <code>disabled</code> pauses the shortcut while the hint stays on screen.
        </>,
      ],
    },
    {
      title: 'Markup',
      items: [
        <>
          The cap renders as <code>&lt;kbd&gt;</code>. Leave out <code>label</code> for a bare key circle.
        </>,
        <>
          <code>KeyHints</code> is right-aligned by default. Pass <code>align="start"</code> to line it up on the left.
        </>,
      ],
    },
  ],
  related: ['bottom-bar', 'icon-button', 'top-bar'],
};

export default doc;
