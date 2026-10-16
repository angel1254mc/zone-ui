import { NewsCard } from '@angel1254mc/zone-ui';
import { NamecardImage } from 'examples/art';

const posts = [
  {
    id: 'check-in',
    banner: { id: 'ImgCardEvent03' },
    date: '2024/07/03',
    category: 'Events',
    title: 'Surprise Screening Plan: Daily Check-In',
    description: 'Check in every day during the event to claim Polychromes, Denny and Master Tapes.',
  },
  {
    id: 'preview',
    banner: { id: 'ImgCardEvent02' },
    date: '2024/06/28',
    category: 'News',
    title: 'Version 1.0 Update Preview Special Program Recap',
    description: 'New Agents, new W-Engines, the Hollow Zero rework and more from the livestream.',
  },
  {
    id: 'compensation',
    banner: { id: 'ImgCardEvent04' },
    date: '2024/06/21',
    category: 'Notices',
    title: 'Server Maintenance Compensation Details',
    description: 'Proxies who reached Inter-Knot Level 4 before the maintenance will receive 300 Polychromes.',
  },
  {
    id: 'angels',
    banner: { agentId: '1311' },
    date: '2024/06/19',
    category: 'Events',
    title: 'Angels Support Operation',
    description: 'Complete support missions with the new Agents to earn event rewards.',
  },
];

export default function NewsGrid() {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, calc(396 * var(--zzz-px)))',
        justifyContent: 'center',
        columnGap: 'calc(46 * var(--zzz-px))',
        rowGap: 'calc(64 * var(--zzz-px))',
        width: '100%',
      }}
    >
      {posts.map(({ id, banner, ...post }) => (
        <li key={id}>
          <NewsCard href={`#${id}`} art={<NamecardImage {...banner} alt="" />} {...post} />
        </li>
      ))}
    </ul>
  );
}
