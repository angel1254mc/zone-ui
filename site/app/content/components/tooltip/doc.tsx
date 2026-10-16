import { Button } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/**
 * Gallery preview. The real bubble is portalled and fixed, so this draws it inline with the kit's
 * own bubble class, over a light backdrop because the bubble is translucent black.
 */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 'calc(16 * var(--zzz-px))',
        padding: 'calc(36 * var(--zzz-px)) calc(32 * var(--zzz-px))',
        borderRadius: 'calc(20 * var(--zzz-px))',
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      <div className="zzz-tooltip" data-side="top" style={{ position: 'relative', animation: 'none' }}>
        Base ATK of the equipped W-Engine
      </div>
      <Button>ATK</Button>
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
        A tooltip shows a short hint when someone hovers over or focuses a control: the name of an icon button, or what
        a stat means. Wrap exactly one focusable element, such as a button or a link. The bubble is translucent black,
        so it reads best over art and light surfaces.
      </p>
      <p>
        Keep anything people must read out of tooltips, since touch screens never show them. For a status message use
        Toast, and for a menu of actions use Dropdown menu.
      </p>
    </>
  ),
  usageCode: `import { Tooltip } from '@angel1254mc/zone-ui';

<Tooltip content="Base ATK of the equipped W-Engine">
  <Button>ATK</Button>
</Tooltip>`,
  examples: [
    {
      demo: 'icon-buttons',
      title: 'Naming icon buttons',
      description: 'Hover over or tab to each button to see its name.',
    },
    {
      demo: 'placement',
      title: 'Placement',
      description: 'Choose a side. A tooltip without room on that side flips to the opposite one.',
    },
    {
      demo: 'longer-hints',
      title: 'Longer hints',
      description: 'Longer content wraps onto several lines.',
    },
  ],
  notes: [
    {
      title: 'Keyboard and pointer',
      items: [
        <>
          Hover shows the tooltip after a short delay, set with <code>delay</code>. Focus shows it at once.
        </>,
        <>
          <kbd>Esc</kbd> hides it without closing a dialog around it.
        </>,
        <>Touch does not open tooltips.</>,
      ],
    },
    {
      title: 'Markup',
      items: [
        <>
          The child gets <code>aria-describedby</code> pointing at the bubble while it is open, so it must accept a{' '}
          <code>ref</code> and the pointer and focus handlers.
        </>,
        <>
          The bubble is rendered at the end of <code>&lt;body&gt;</code>, so containers with hidden overflow never clip
          it. <code>className</code>, <code>style</code> and other attributes go to the bubble.
        </>,
      ],
    },
  ],
  related: ['icon-button', 'dropdown-menu', 'toast'],
};

export default doc;
