import { QuantityBar } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the crafting readout, and the label-and-count line from a dismantle screen. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))' }}>
      <QuantityBar size="lg" label="Craft Quantity" value={12} style={{ width: 'calc(480 * var(--zzz-px))' }} />
      <QuantityBar
        size="lg"
        label="Selected"
        value="3 / 60"
        separator=":"
        style={{ width: 'calc(480 * var(--zzz-px))' }}
      />
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
        A quantity bar reads out the amount someone has chosen, like "Craft Quantity × 12". It sits under a Slider in a
        crafting or dismantle panel and takes no input itself. Changes are announced to screen readers.
      </p>
      <p>For progress towards a goal, use Progress. For a label and value in a list of stats, use Stat row.</p>
    </>
  ),
  usageCode: `import { QuantityBar } from '@angel1254mc/zone-ui';

<QuantityBar label="Craft Quantity" value={quantity} />`,
  examples: [
    {
      demo: 'with-slider',
      title: 'With a slider',
      description: 'The slider sets the amount and the bar under it reads it back.',
    },
    {
      demo: 'label-and-separator',
      title: 'Label only and custom separator',
      description: 'Leave out value for an instruction, or swap the × sign for your own separator.',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Small, medium and large match the Slider sizes, so pair them.',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          The bar is a polite live region that reads the whole line when the value changes. Pass{' '}
          <code>live={'{false}'}</code> if something else already announces it.
        </>,
      ],
    },
    {
      title: 'Layout',
      items: [
        <>
          The bar has the same default width as Slider. Set another with <code>style</code> or <code>className</code>;
          the examples use{' '}
          <code>
            style={'{{'} width: '100%' {'}}'}
          </code>{' '}
          on both so they follow their column.
        </>,
      ],
    },
  ],
  related: ['slider', 'progress', 'stat-row'],
};

export default doc;
