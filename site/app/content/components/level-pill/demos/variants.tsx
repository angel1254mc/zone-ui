import { LevelPill } from '@angel1254mc/zone-ui';

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <LevelPill level={60} max={60} rank="S" />
        <LevelPill level={45} max={50} rank="A" />
        <LevelPill level={9} max={10} rank="B" />
      </div>
      <LevelPill variant="equip" level={60} max={60} rank="A" />
      <LevelPill variant="large" level={12} max={20} rank="A" />
      <LevelPill variant="agent" level={60} max={60} />
    </div>
  );
}
