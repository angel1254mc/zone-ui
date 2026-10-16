import { StatusGrid } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a small grid of mixed statuses, with no captions or tooltips. */
function Thumbnail() {
  return (
    <StatusGrid
      aria-label="Recent results"
      columns={5}
      hideLabels
      items={[
        { status: 'success' },
        { status: 'success' },
        { status: 'error' },
        { status: 'success' },
        { status: 'warning' },
        { status: 'success' },
        { status: 'neutral' },
        { status: 'empty' },
        { status: 'success' },
        { status: 'success' },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Use a status grid to show a row of small outcomes at once: the answers to a quiz, a streak of days played, or
        the uptime of a service over time. Each cell is one status, and the colour comes with a glyph, so the grid still
        reads without colour.
      </p>
      <p>
        For one or two big numbers, use Stat Tiles. For a count that changes over time, use Bar Chart. For progress
        toward one goal, use Progress.
      </p>
    </>
  ),
  usageCode: `import { StatusGrid } from '@angel1254mc/zone-ui';

<StatusGrid
  aria-label="Quiz results"
  items={[
    { status: 'success', label: 'Q1' },
    { status: 'error', label: 'Q2' },
    { status: 'empty', label: 'Q3' },
  ]}
/>`,
  examples: [
    {
      demo: 'streak-calendar',
      title: 'Streak calendar',
      description: 'Thirty days in seven columns, with the current day ringed and a tooltip on each day.',
    },
    {
      demo: 'uptime',
      title: 'Uptime strip',
      description: 'Ninety small cells with no glyphs and no captions. Each cell names its day and shows its uptime.',
    },
  ],
  types: [
    {
      name: 'StatusGridItem',
      rows: [
        {
          name: 'status',
          type: "'success' | 'error' | 'warning' | 'neutral' | 'empty'",
          required: true,
          description:
            'Green check for success, red cross for error, orange for warning, grey for neutral, dark for empty.',
        },
        { name: 'label', type: 'ReactNode', description: 'Short caption under the cell, such as "Q1".' },
        {
          name: 'labelText',
          type: 'string',
          description: 'Plain-text name for screen readers when `label` is not text.',
        },
        {
          name: 'tooltip',
          type: 'ReactNode',
          description: 'Text shown on hover or focus. The cell becomes focusable.',
        },
        {
          name: 'content',
          type: 'ReactNode',
          description: 'Custom content inside the cell, such as a day number. Replaces the glyph.',
        },
        { name: 'current', type: 'boolean', description: 'Marks the current cell, such as today, with a ring.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Statuses',
      items: [
        <>
          <code>statusLabels</code> sets the words read for each status. For a quiz, use Correct, Incorrect and Pending
          for <code>success</code>, <code>error</code> and <code>empty</code>.
        </>,
        <>
          <code>glyphs={'{false}'}</code> removes the glyph inside each cell, for dense strips.
        </>,
      ],
    },
    {
      title: 'Layout',
      items: [
        <>
          <code>size</code> is <code>sm</code>, <code>md</code> (the default) or <code>lg</code>. <code>columns</code>{' '}
          sets a fixed column count, and without it the cells wrap in a row.
        </>,
        <>
          <code>hideLabels</code> keeps the labels for screen readers only.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The grid is a list. Each cell is an image named by its label and status, such as &ldquo;Q1: Correct&rdquo;.
          Give the grid an <code>aria-label</code>.
        </>,
      ],
    },
  ],
  related: ['bar-chart', 'stat-tiles', 'step-progress'],
};

export default doc;
