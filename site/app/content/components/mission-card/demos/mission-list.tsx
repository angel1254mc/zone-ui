import { useState } from 'react';
import { MissionCard } from '@angel1254mc/zone-ui';
import type { MissionStatus } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

interface Mission {
  id: string;
  title: string;
  rewardId: string;
  rewardLabel: string;
  status: MissionStatus;
  isNew?: boolean;
}

const initial: Mission[] = [
  {
    id: 'pinball',
    title: 'Complete all stages in "Clink, Clank, Pinball Knight!"',
    rewardId: '100',
    rewardLabel: '60 Polychrome',
    status: 'claimed',
  },
  {
    id: 'shiyu',
    title: 'Clear "Shiyu Defense" Critical Node 3 times',
    rewardId: '112',
    rewardLabel: '3 Boopons',
    status: 'go',
    isNew: true,
  },
  {
    id: 'hollow',
    title: 'Defeat 30 Ethereals in "Hollow Zero"',
    rewardId: '501',
    rewardLabel: '60 Battery Charge',
    status: 'go',
  },
  {
    id: 'next',
    title: 'This mission unlocks in the next update',
    rewardId: '404',
    rewardLabel: 'Lost Supply Box',
    status: 'locked',
  },
];

export default function MissionList() {
  const [missions, setMissions] = useState(initial);
  const claim = (id: string) =>
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, status: 'claimed', isNew: false } : m)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {missions.map((m) => (
        <MissionCard
          key={m.id}
          title={m.title}
          status={m.status}
          isNew={m.isNew}
          reward={<ItemImage id={m.rewardId} alt="" />}
          rewardLabel={m.rewardLabel}
          onGo={() => claim(m.id)}
        />
      ))}
    </div>
  );
}
