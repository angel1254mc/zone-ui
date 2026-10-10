import { Spinner } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: both variants, frozen with data-reduced-motion so the card stays static. */
function Thumbnail() {
  return (
    <div data-reduced-motion="" style={{ display: 'flex', gap: 'calc(80 * var(--zzz-px))', alignItems: 'center' }}>
      <Spinner size={120} />
      <Spinner variant="chevrons" size={110} />
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
        Show a spinner while something loads and you cannot say how long it will take. The ring follows the live accent;
        use <code>tone="white"</code> inside a button. The chevrons suit a whole panel or a loading screen.
      </p>
      <p>When you know how far along the work is, use Progress. For a time limit, use Countdown bar.</p>
    </>
  ),
  usageCode: `import { Spinner } from '@angel1254mc/zone-ui';

<Spinner label="Loading roster" />`,
  examples: [
    {
      demo: 'in-context',
      title: 'In a button and a panel',
      description: 'A white ring in the icon cap of a busy button, and chevrons holding the place of a panel.',
    },
    {
      demo: 'while-loading',
      title: 'While data loads',
      description: 'Swap the spinner in while the request runs and the content back when it is done.',
    },
    {
      demo: 'tones-and-sizes',
      title: 'Tones and sizes',
      description: 'Accent, white and the inherited text colour, then small to large rings and chevrons.',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          The spinner has <code>role="status"</code> and a hidden label, "Loading" by default. Say what is loading with{' '}
          <code>label</code>.
        </>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [
        <>
          Both variants stop moving when the system asks for reduced motion, or inside an element with{' '}
          <code>data-reduced-motion</code>.
        </>,
      ],
    },
  ],
  related: ['progress', 'countdown-bar', 'button'],
};

export default doc;
