import { EffectNameBar, EffectText } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: an effect name bar over a short effect paragraph with a keyword and values. */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'calc(14 * var(--zzz-px))',
        width: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: '#000',
        borderRadius: 'calc(16 * var(--zzz-px))',
      }}
    >
      <EffectNameBar>Scorching Breath</EffectNameBar>
      <EffectText markup="Upon hitting an enemy with a {kw}Basic Attack{/kw}, ATK increases by {val}3.5%{/val} for {val}8s{/val}." />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Effect text is the paragraph that explains what an item or skill does. Key terms are orange and numbers are
        green, so people can scan for what matters. Write it with <code>Keyword</code> and <code>Value</code> inside, or
        pass a plain string with a small markup through <code>markup</code>.
      </p>
      <p>
        <code>EffectNameBar</code> is the capsule that names the effect above the paragraph, with an optional chevron
        that expands more detail. For ordinary body copy, use Text. For a stat name and its number, use Stat Row.
      </p>
    </>
  ),
  usageCode: `import { EffectText } from '@angel1254mc/zone-ui';

<EffectText markup="Basic Attacks increase ATK by {val}3.5%{/val} for 8s." />`,
  examples: [
    {
      demo: 'keywords-as-children',
      title: 'Keywords as children',
      description: 'Use Keyword and Value directly when a term needs an icon or the text is built in code.',
    },
    {
      demo: 'expandable',
      title: 'Expandable details',
      description: 'The name bar chevron is a toggle button. Point controls at the region it shows and hides.',
    },
    {
      demo: 'next-phase',
      title: 'Current and next phase',
      description:
        'An upgrade preview: the muted tone greys the next level, and bold words stay white to show what changes.',
    },
  ],
  notes: [
    {
      title: 'Markup',
      items: [
        <>
          <code>&#123;kw&#125;Attack&#123;/kw&#125;</code> renders a <code>Keyword</code> in orange.
        </>,
        <>
          <code>&#123;val&#125;3.5%&#123;/val&#125;</code> renders a <code>Value</code> in green.
        </>,
        <>
          <code>&#123;b&#125;Basic Attack&#123;/b&#125;</code> renders <code>&lt;strong&gt;</code>, which stays white in
          the muted tone.
        </>,
        <>
          Tags don't nest. When <code>children</code> are given, <code>markup</code> is ignored.
        </>,
      ],
    },
    {
      title: 'Density',
      items: [
        <>
          <code>compact</code> for side panels, <code>paragraph</code> for large panels and <code>loose</code> for
          equipment screens. Only the line spacing changes.
        </>,
      ],
    },
    {
      title: 'Name bar',
      items: [
        <>
          The bar fills its container. <code>surface</code> matches the panel behind it: <code>panel</code>,{' '}
          <code>sunken</code> or <code>black</code>.
        </>,
        <>
          With <code>expandable</code>, the chevron hangs below the bar and takes no space, so leave a gap before the
          next element.
        </>,
      ],
    },
  ],
  related: ['stat-row', 'section-label', 'panel'],
};

export default doc;
