import { BatteryIcon, CheckInCalendar, DennyIcon, GiftIcon, PolychromeIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: four days with drawn glyphs as reward art, the first one claimed. */
function Thumbnail() {
  return (
    <CheckInCalendar
      aria-label="Login rewards"
      columns={4}
      days={[
        { day: 1, count: 30, itemName: 'Polychrome', item: <PolychromeIcon />, claimed: true },
        { day: 2, count: 60, itemName: 'Battery Charge', item: <BatteryIcon /> },
        { day: 3, count: 8, itemName: 'Dennies', item: <DennyIcon /> },
        { day: 4, count: 1, itemName: 'Gift', item: <GiftIcon />, special: true },
      ]}
    />
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.42,
  usage: (
    <>
      <p>
        A check-in calendar shows a login reward schedule: one ticket per day, with the reward, its quantity and a tick
        once it is claimed. Use it for daily login bonuses and event check-ins, where coming back each day unlocks the
        next ticket. Special days get a pink window and an optional red tag.
      </p>
      <p>
        The calendar only displays the schedule. Your page decides which days are claimed. To list rewards without days,
        use Reward Tile. To show a history of played and missed days, use Status Grid.
      </p>
    </>
  ),
  usageCode: `import { CheckInCalendar } from '@angel1254mc/zone-ui';

<CheckInCalendar
  aria-label="Login rewards"
  days={[
    { day: 1, count: 30, itemName: 'Polychrome', item: <img src={polychrome} alt="" />, claimed: true },
    { day: 2, count: 6, itemName: 'Boopon', item: <img src={boopon} alt="" /> },
  ]}
/>`,
  examples: [
    {
      demo: 'daily-check-in',
      title: 'Daily check-in',
      description: 'Keep the claimed days in state and mark each ticket as the player claims it.',
    },
    {
      demo: 'two-week-event',
      title: 'Two-week event',
      description: 'Fourteen days in two rows, with special days and a tag on the final reward.',
    },
  ],
  notes: [
    {
      title: 'Days',
      items: [
        <>
          Each entry of <code>days</code> takes the props of <code>CheckInTile</code>, listed below. You can also render
          a <code>CheckInTile</code> on its own.
        </>,
        <>
          <code>columns</code> sets tiles per row (7 by default). The grid keeps the tile size, so pick a column count
          that fits your layout.
        </>,
        <>
          The day number and the count are zero-padded to two digits. A <code>\n</code> in <code>tag</code> breaks the
          line.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The calendar is an ordered list. Each tile is named from its props, for example &ldquo;Day 1, 30 × Polychrome,
          claimed&rdquo;, so pass <code>itemName</code> and keep the art decorative with <code>alt=&quot;&quot;</code>.
        </>,
      ],
    },
  ],
  related: ['reward-tile', 'mission-card', 'status-grid'],
};

export default doc;
