import { CheckInCalendar } from '@angel1254mc/zone-ui';
import { ItemImage, WEngineImage } from 'examples/art';

export default function CheckInCalendarHero() {
  return (
    <CheckInCalendar
      aria-label="Login rewards"
      days={[
        { day: 1, count: 30, itemName: 'Polychrome', item: <ItemImage id="100" alt="" />, claimed: true },
        { day: 2, count: 6, itemName: 'Boopon', item: <ItemImage id="112" alt="" />, claimed: true },
        { day: 3, count: 30, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
        { day: 4, count: 1, itemName: 'W-Engine', item: <WEngineImage id="14102" alt="" />, special: true },
        { day: 5, count: 40, itemName: 'Polychrome', item: <ItemImage id="100" alt="" /> },
        { day: 6, count: 6, itemName: 'Battery Charge', item: <ItemImage id="501" alt="" /> },
        { day: 7, count: 2, itemName: 'Lost Supply Box', item: <ItemImage id="404" alt="" /> },
      ]}
    />
  );
}
