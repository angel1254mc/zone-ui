import { Slider } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the crafting slider with the thumb part way along. */
function Thumbnail() {
  return <Slider min={1} max={10} defaultValue={4} width={480} aria-label="Craft quantity" />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.5,
  usage: (
    <>
      <p>
        Use a slider to choose an amount within a range, like how many items to craft. Drag the thumb, use the arrow
        keys, or press the minus and plus steppers to move one step at a time. Show the result with a Quantity bar
        underneath.
      </p>
      <p>
        For a number people already know and want to type, use a Text field with <code>type="number"</code>. For game
        audio, use Sound toggle, which has its own volume slider.
      </p>
    </>
  ),
  usageCode: `import { Slider } from '@angel1254mc/zone-ui';

<Slider min={1} max={10} value={quantity} onValueChange={setQuantity} aria-label="Craft quantity" />`,
  examples: [
    {
      demo: 'with-quantity-bar',
      title: 'With a quantity bar',
      description: 'The crafting panel pairing: the slider sets the amount and the bar reads it back.',
    },
    {
      demo: 'percent',
      title: 'Steps and labels',
      description: 'A step of 5, bounds shown as percentages, and value text for screen readers.',
    },
    {
      demo: 'sizes',
      title: 'Sizes',
      description: 'Small, medium and large scale the steppers, thumb and numbers. The last one is disabled.',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          On the thumb, <kbd>←</kbd> <kbd>↓</kbd> step down and <kbd>→</kbd> <kbd>↑</kbd> step up.
        </>,
        <>
          <kbd>Page Up</kbd> and <kbd>Page Down</kbd> take bigger steps (<code>pageStep</code>, a tenth of the range by
          default). <kbd>Home</kbd> and <kbd>End</kbd> jump to the ends.
        </>,
        <>
          The steppers are buttons named "Decrease" and "Increase". Rename them with <code>decrementLabel</code> and{' '}
          <code>incrementLabel</code>.
        </>,
      ],
    },
    {
      title: 'Bounds and states',
      items: [
        <>At the minimum or maximum, that stepper turns inactive but stays focusable, so keyboard focus is not lost.</>,
        <>
          When <code>min</code> equals <code>max</code>, both steppers are inactive and the thumb sits at the right end.
        </>,
        <>
          <code>disabled</code> disables the thumb and both steppers.
        </>,
      ],
    },
    {
      title: 'Layout',
      items: [
        <>
          <code>width</code> sets a fixed width that stays the same at every size. To follow the container instead, pass{' '}
          <code>
            style={'{{'} width: '100%' {'}}'}
          </code>
          , as the examples do with a Quantity bar under it.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The thumb has <code>role="slider"</code>. <code>aria-label</code>, <code>aria-labelledby</code> and{' '}
          <code>aria-describedby</code> go to it; other attributes go to the wrapper.
        </>,
        <>
          <code>getValueText</code> sets what screen readers announce for the value.
        </>,
      ],
    },
  ],
  related: ['quantity-bar', 'sound-toggle', 'text-field'],
};

export default doc;
