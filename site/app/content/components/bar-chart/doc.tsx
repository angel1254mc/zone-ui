import { BarChart } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a score distribution with the reader's bar highlighted, drawn without the grow-in. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(480 * var(--zzz-px))' }}>
      <BarChart
        label="Scores"
        animate={false}
        height={200}
        highlight={4}
        markerLabel="You"
        data={[
          { label: '0', value: 112 },
          { label: '1', value: 486 },
          { label: '2', value: 1204 },
          { label: '3', value: 2371 },
          { label: '4', value: 2950 },
          { label: '5', value: 1289 },
        ]}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Use a bar chart to compare a handful of categories side by side: how players scored today, how a poll went, how
        many runs you cleared each day. Highlight the bar that belongs to the reader and give it a marker such as
        &ldquo;You&rdquo;, so they find themselves first.
      </p>
      <p>
        For one or two big numbers, use Stat Tiles. For a pass or fail per day or per question, use Status Grid. For
        progress toward a single goal, use the bars in Progress.
      </p>
    </>
  ),
  usageCode: `import { BarChart } from '@angel1254mc/zone-ui';

<BarChart
  label="Today's scores"
  data={[
    { label: '3', value: 2371 },
    { label: '4', value: 2950 },
    { label: '5', value: 1289 },
  ]}
  highlight={1}
  markerLabel="You"
/>`,
  examples: [
    {
      demo: 'poll-results',
      title: 'Poll results',
      description: 'Each bar takes its own rarity colour, and every bar shows its vote count and share.',
    },
    {
      demo: 'week-in-review',
      title: 'Several highlights',
      description: 'Mark more than one bar with highlight on the datum, each with its own marker text.',
    },
    {
      demo: 'run-times',
      title: 'Custom value text',
      description: 'formatValue turns raw seconds into clock times, on lighter bars and a shorter plot.',
    },
  ],
  types: [
    {
      name: 'BarChartDatum',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Category label under the bar.' },
        { name: 'value', type: 'number', required: true, description: 'Bar height, measured against `max`.' },
        {
          name: 'labelText',
          type: 'string',
          description: 'Plain-text label for the summary and the hidden table when `label` is not a string.',
        },
        {
          name: 'highlight',
          type: 'boolean',
          description: 'Highlights this bar, like listing its index in `highlight`.',
        },
        {
          name: 'marker',
          type: 'ReactNode',
          description: "Tag above this highlighted bar. Defaults to the chart's `markerLabel`.",
        },
        {
          name: 'color',
          type: 'BarChartFill',
          description: 'Fill for this bar only. Wins over `fill` and `highlightFill`.',
        },
        { name: 'id', type: 'string | number', description: 'React key. Defaults to the index.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Fills',
      items: [
        <>
          Named fills: <code>muted</code> (the default), <code>light</code>, <code>accent</code> and{' '}
          <code>rarity-s</code> to <code>rarity-c</code>. Any other string is used as a CSS colour.
        </>,
        <>
          <code>fill</code> sets every bar, <code>highlightFill</code> the highlighted ones, and a datum&apos;s{' '}
          <code>color</code> one bar.
        </>,
      ],
    },
    {
      title: 'Values',
      items: [
        <>
          <code>valueDisplay</code> prints the value, the percentage, both, or nothing. Percentages are shares of the
          sum of all values.
        </>,
        <>
          The tallest bar fills the plot unless you set <code>max</code>, for example the number of questions in a quiz.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The drawing is one image named by a generated summary: how many bars, the highest one, and the highlighted
          ones. Name the chart with <code>label</code>, or replace the sentence with <code>summary</code>.
        </>,
        <>A visually hidden table next to it lists every value and share.</>,
        <>
          Bars grow in on mount. <code>animate={'{false}'}</code> turns it off, and it is always off when the system
          asks for reduced motion.
        </>,
      ],
    },
  ],
  related: ['stat-tiles', 'status-grid', 'progress'],
};

export default doc;
