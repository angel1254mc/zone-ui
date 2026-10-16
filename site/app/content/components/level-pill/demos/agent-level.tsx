import { useState } from 'react';
import { Button, LevelPill, XpBar } from '@angel1254mc/zone-ui';

const MAX_LEVEL = 60;
const XP_PER_LEVEL = 6000;

export default function AgentLevel() {
  const [level, setLevel] = useState(57);
  const [xp, setXp] = useState(2400);
  const maxed = level >= MAX_LEVEL;

  const train = () => {
    const total = xp + 2500;
    const gained = Math.floor(total / XP_PER_LEVEL);
    const next = Math.min(MAX_LEVEL, level + gained);
    setLevel(next);
    setXp(next >= MAX_LEVEL ? XP_PER_LEVEL : total % XP_PER_LEVEL);
  };

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
      <LevelPill variant="agent" level={level} max={MAX_LEVEL} />
      <XpBar value={xp} max={XP_PER_LEVEL} />
      <Button disabled={maxed} onClick={train}>
        {maxed ? 'Max level' : 'Train'}
      </Button>
    </div>
  );
}
