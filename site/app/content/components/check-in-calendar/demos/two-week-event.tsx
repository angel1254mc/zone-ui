import { CheckInCalendar } from '@angel1254mc/zone-ui';
import type { CheckInTileProps } from '@angel1254mc/zone-ui';
import { AgentImage, DriveDiscImage, ItemImage, WEngineImage } from 'examples/art';

const days: CheckInTileProps[] = [
  { day: 1, count: 30, itemName: 'Polychrome', item: <ItemImage id="100" alt="" />, claimed: true },
  { day: 2, count: 6, itemName: 'Boopon', item: <ItemImage id="112" alt="" />, claimed: true },
  { day: 3, count: 30, itemName: 'Polychrome', item: <ItemImage id="100" alt="" />, claimed: true },
  { day: 4, count: 1, itemName: 'W-Engine', item: <WEngineImage id="14102" alt="" />, special: true },
  { day: 5, count: 40, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
  { day: 6, count: 6, itemName: 'Battery Charge', item: <ItemImage id="501" alt="" /> },
  { day: 7, count: 40, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
  { day: 8, count: 20, itemName: 'Drive Disc', item: <DriveDiscImage id="31000" alt="" /> },
  { day: 9, count: 40, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
  { day: 10, count: 1, itemName: 'W-Engine Energy Module', item: <ItemImage id="301003" alt="" /> },
  { day: 11, count: 60, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
  { day: 12, count: 6, itemName: 'Lost Supply Box', item: <ItemImage id="404" alt="" /> },
  { day: 13, count: 60, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
  {
    day: 14,
    count: 1,
    itemName: 'Outfit',
    item: <AgentImage crop="circle" id="1011" alt="" />,
    special: true,
    tag: 'Outfit\nSelect',
  },
];

export default function TwoWeekEvent() {
  return <CheckInCalendar aria-label="Event check-in" days={days} columns={7} />;
}
