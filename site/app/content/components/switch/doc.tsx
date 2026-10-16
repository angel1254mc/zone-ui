import { Switch, Text } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: two settings rows, one on and one off. */
function Thumbnail() {
  const row = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'calc(40 * var(--zzz-px))',
  };
  return (
    <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))', width: 'calc(400 * var(--zzz-px))' }}>
      <div style={row}>
        <Text role="bodyLg">Vibration</Text>
        <Switch size="lg" aria-label="Vibration" defaultChecked />
      </div>
      <div style={row}>
        <Text role="bodyLg">Auto-battle</Text>
        <Switch size="lg" aria-label="Auto-battle" />
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        A switch turns a setting on or off, and the change applies straight away. On, the knob slides right and its
        light takes the live accent. The switch has no text of its own, so name it with a <code>&lt;label&gt;</code>,{' '}
        <code>aria-labelledby</code> or <code>aria-label</code>.
      </p>
      <p>
        For a choice that is saved later with a form, use Checkbox. For filters in a drawer, use Chip. For game sound,
        use Sound toggle.
      </p>
    </>
  ),
  usageCode: `import { Switch } from '@angel1254mc/zone-ui';

<Switch id="locked" checked={on} onCheckedChange={setOn} />
<label htmlFor="locked">Show locked items</label>`,
  examples: [
    {
      demo: 'settings-list',
      title: 'Settings list',
      description: 'A label on the left and the switch on the right, one row per setting.',
    },
    {
      demo: 'filter-a-list',
      title: 'Changing what is shown',
      description: 'The switch applies at once, so the list updates as soon as it flips.',
      frame: 'start',
    },
    {
      demo: 'sizes-and-states',
      title: 'Sizes and states',
      description: 'Small, medium and large, each off, on, and disabled in both positions.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          <kbd>Space</kbd> or <kbd>Enter</kbd> toggles the focused switch.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          It renders a <code>&lt;button role="switch"&gt;</code> with <code>aria-checked</code>.
        </>,
        <>
          A <code>&lt;label htmlFor&gt;</code> pointing at its <code>id</code> names it, and clicking the label toggles
          it.
        </>,
      ],
    },
  ],
  related: ['checkbox', 'sound-toggle', 'chip'],
};

export default doc;
