import { useState } from 'react';
import { Button, CheckIcon, CheckInCalendar } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

const rewards = [
  { count: 20, itemName: 'Polychrome', id: '100' },
  { count: 3, itemName: 'Boopon', id: '112' },
  { count: 5, itemName: 'Ether Battery', id: '502' },
  { count: 1, itemName: 'Prepaid Power Card', id: '511' },
  { count: 50, itemName: 'Polychrome', id: '100' },
];

export default function DailyCheckIn() {
  const [claimed, setClaimed] = useState(1);
  const done = claimed === rewards.length;

  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'center' }}>
      <CheckInCalendar
        aria-label="Five-day login bonus"
        columns={5}
        days={rewards.map((r, i) => ({
          day: i + 1,
          count: r.count,
          itemName: r.itemName,
          item: <ItemImage id={r.id} alt="" />,
          claimed: i < claimed,
          special: i === rewards.length - 1,
        }))}
      />
      <Button
        width="dialog"
        icon={<CheckIcon />}
        iconTone="confirm"
        disabled={done}
        onClick={() => setClaimed((n) => n + 1)}
      >
        {done ? 'All claimed' : `Claim day ${claimed + 1}`}
      </Button>
    </div>
  );
}
