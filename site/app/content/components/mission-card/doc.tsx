import { GiftIcon, MissionCard, PolychromeIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: an open mission over a claimed one, with drawn glyphs as rewards. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(12 * var(--zzz-px))' }}>
      <MissionCard title="Clear Critical Node 3 times" reward={<GiftIcon />} isNew />
      <MissionCard title="Check in for 7 days" reward={<PolychromeIcon />} status="claimed" />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.4,
  usage: (
    <>
      <p>
        A mission card is one task on an event page: what to do, the reward in a ringed circle, and a button that reads
        Go, Claimed or Stay Tuned. Stack several in a column for the event&apos;s task list. The magnifier next to the
        button opens details about the mission or its reward.
      </p>
      <p>
        For rewards earned by logging in each day, use Check-in Calendar. For the full list of an event&apos;s rewards,
        use Reward Preview. To show what was just received, use Reward Tile.
      </p>
    </>
  ),
  usageCode: `import { MissionCard } from '@angel1254mc/zone-ui';

<MissionCard
  title="Clear Shiyu Defense Critical Node 3 times"
  reward={<img src={boopon} alt="" />}
  rewardLabel="3 Boopons"
  onGo={startMission}
/>`,
  examples: [
    {
      demo: 'mission-list',
      title: 'Mission list',
      description: 'Keep each status in state. Press Go to claim a mission and watch its card change.',
    },
    {
      demo: 'event-colours',
      title: 'Event colours',
      description: 'theme recolours the ring and body for each event, and can add a sticker on the corner.',
    },
  ],
  types: [
    {
      name: 'MissionCardTheme',
      rows: [
        {
          name: 'ring',
          type: 'string',
          description: 'CSS colour of the frame, the left strip and the reward ring. Default teal.',
        },
        {
          name: 'body',
          type: 'string',
          description: 'CSS colour of the body band, drawn lighter toward the top. Default pink.',
        },
        {
          name: 'ornament',
          type: 'string',
          description: 'CSS colour of a sticker on the bottom-left corner. No sticker when omitted.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'Status',
      items: [
        <>
          <b>go</b> (the default): the black Go button, the only state where <code>onGo</code> fires.
        </>,
        <>
          <b>claimed</b>: a tick over the reward and a greyed Claimed button.
        </>,
        <>
          <b>locked</b>: Stay Tuned, for missions that open later. Change any label with <code>actionLabel</code>.
        </>,
      ],
    },
    {
      title: 'Title',
      items: [
        <>
          One-line titles use the larger text size. When the title wraps to two lines, the card switches to the smaller
          size on its own.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The card is an <code>article</code> named by its title. Pass <code>rewardLabel</code> so the reward circle is
          named too, with &ldquo;claimed&rdquo; added once it is.
        </>,
        <>
          The magnifier is named &ldquo;Details&rdquo;. Rename it with <code>inspectLabel</code>.
        </>,
      ],
    },
  ],
  related: ['check-in-calendar', 'reward-preview', 'reward-tile'],
};

export default doc;
