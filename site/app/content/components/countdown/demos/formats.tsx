import { useState } from 'react';
import { Countdown, HourglassIcon } from '@angel1254mc/zone-ui';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export default function Formats() {
  const [now] = useState(() => Date.now());
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Countdown target={now + 2 * DAY + 7 * HOUR} format="labels" suffix="left" />
      <Countdown target={now + 66 * DAY + 5 * HOUR} format="compact" />
      <Countdown target={now + 4 * 60_000 + 9_000} format="ms" icon={<HourglassIcon />} prefix="Auction closes in" />
      <Countdown
        target={now + 7 * HOUR + 42 * 60_000}
        icon={null}
        format={({ hours, minutes }) => `${hours} h ${minutes} min`}
      />
    </div>
  );
}
