import { ModifierRow } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a row with its action, and a row without one. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(12 * var(--zzz-px))',
        width: 'calc(800 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        background: 'var(--zzz-color-surface-agent-info)',
      }}
    >
      <ModifierRow count={8} action={{ onClick: () => {} }} />
      <ModifierRow label="Debuffs" count={2} />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.3,
  usage: (
    <>
      <p>
        Modifier row shows how many buffs or debuffs are active on a character, with an optional button for the action
        that goes with them. Stack rows to show several groups, such as buffs and debuffs, on the same screen.
      </p>
      <p>For a plain number with a label, use Stat row. For a set of options someone picks from, use Choice group.</p>
    </>
  ),
  usageCode: `import { ModifierRow } from '@angel1254mc/zone-ui';

<ModifierRow label="Buffs" count={4} />
<ModifierRow count={8} action={{ onClick: openReadiness }} />`,
  examples: [
    {
      demo: 'modifier-list',
      title: 'Buffs and debuffs',
      description: 'Rows without an action work as a summary, with a label and a count on each.',
    },
    {
      demo: 'custom-action',
      title: 'Custom action',
      description: 'Pass a Button element as the action to replace the default button with your own.',
    },
  ],
  notes: [
    {
      title: 'Action',
      items: [
        <>
          Leave <code>action</code> out for a row with no button. Pass button props to use the default look, or a React
          element to use your own button.
        </>,
        <>
          <code>pressed</code> on the button shows a toggle that is on, such as a mode that is active.
        </>,
      ],
    },
  ],
  related: ['button', 'stat-row', 'chip'],
};

export default doc;
