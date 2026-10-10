import { Hero, InfoAlertIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a text-only hero with an explicit width in design units (no art, so nothing loads). */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(820 * var(--zzz-px))', borderRadius: 12, overflow: 'hidden' }}>
      <Hero
        eyebrow="Daily"
        title="Proxy Trivia"
        meta={['Puzzle #42', 'Oct 1']}
        description="Five questions about New Eridu, thirty seconds each."
        primaryAction={{ label: 'Play' }}
        secondaryAction={{ label: 'How to play', icon: <InfoAlertIcon />, iconTone: 'plain' }}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  wide: true,
  hero: { demo: 'hero', frame: 'bleed' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.32,
  usage: (
    <>
      <p>
        The hero opens a landing page or an app: a small accent tag, a large outlined headline, a meta line, a short
        description and up to two actions, with art beside or behind the text. Use the summary slot for a status such as
        &quot;Already played today&quot;.
      </p>
      <p>
        It measures its own width: on narrow containers the art moves above the text. For a full-screen gate that waits
        for a tap before the app starts, use Splash.
      </p>
    </>
  ),
  usageCode: `import { Hero } from '@angel1254mc/zone-ui';

<Hero
  eyebrow="Daily"
  title="Proxy Trivia"
  description="Five questions, thirty seconds each."
  primaryAction={{ label: 'Play', onClick: start }}
  art={<img src="/agent.png" alt="" />}
/>`,
  examples: [
    {
      demo: 'background-art',
      title: 'Art behind the text',
      description: 'With artPosition="background" the art fills the section and a scrim keeps the text readable.',
      frame: 'bleed',
    },
    {
      demo: 'played-today',
      title: 'Status in the summary slot',
      description: 'A daily game that was already played: a short status and a live countdown under the actions.',
      frame: 'bleed',
    },
    {
      demo: 'centred',
      title: 'Centred, without art',
      description: 'A plain background, centred text and a bullet list for a simple feature page.',
      frame: 'bleed',
    },
  ],
  types: [
    {
      name: 'HeroAction',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Button text.' },
        { name: 'href', type: 'string', description: 'Renders the action as a link.' },
        { name: 'onClick', type: 'MouseEventHandler', description: 'Click handler.' },
        { name: 'icon', type: 'ReactNode', description: 'Glyph in the button cap.' },
        { name: 'iconTone', type: 'ButtonIconTone', description: 'Coloured disc behind the glyph, as on Button.' },
        { name: 'disabled', type: 'boolean', description: 'Greys the label.' },
        { name: 'aria-label', type: 'string', description: 'Accessible name when the label is not plain text.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Responsive behaviour',
      items: [
        <>Below 720 px of section width the art stacks above the text and the type steps down.</>,
        <>
          With background art, the text gets a thin outline for contrast. Force it with{' '}
          <code className="d-inline-code">textOutline</code>.
        </>,
      ],
    },
    {
      title: 'Headings',
      items: [
        <>
          The title is an <code className="d-inline-code">h1</code> and names the section. Change the level with{' '}
          <code className="d-inline-code">headingLevel</code> when the page already has one.
        </>,
      ],
    },
  ],
  related: ['navbar', 'splash', 'event-title'],
};

export default doc;
