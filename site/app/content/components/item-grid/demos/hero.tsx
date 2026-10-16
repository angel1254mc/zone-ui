import { AnomalyIcon, AttackIcon, ItemCard, ItemGrid, StunIcon, SupportIcon } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const SPECIALTY = { attack: <AttackIcon />, stun: <StunIcon />, anomaly: <AnomalyIcon />, support: <SupportIcon /> };
const ENGINES = [
  { id: '14102', rarity: 's', specialty: 'attack' },
  { id: '14104', rarity: 's', specialty: 'attack' },
  { id: '14105', rarity: 's', specialty: 'stun' },
  { id: '14107', rarity: 's', specialty: 'anomaly' },
  { id: '13001', rarity: 'a', specialty: 'attack' },
  { id: '13002', rarity: 'a', specialty: 'anomaly' },
  { id: '13003', rarity: 'a', specialty: 'support' },
  { id: '13004', rarity: 'a', specialty: 'stun' },
  { id: '13005', rarity: 'a', specialty: 'support' },
  { id: '13006', rarity: 'a', specialty: 'attack' },
  { id: '12001', rarity: 'b', specialty: 'attack' },
  { id: '12002', rarity: 'b', specialty: 'anomaly' },
  { id: '12003', rarity: 'b', specialty: 'stun' },
  { id: '12004', rarity: 'b', specialty: 'support' },
  { id: '12005', rarity: 'b', specialty: 'attack' },
  { id: '12006', rarity: 'b', specialty: 'stun' },
] as const;

export default function ItemGridHero() {
  return (
    <ItemGrid
      aria-label="W-Engines"
      items={ENGINES}
      getId={(e) => e.id}
      columns={8}
      defaultValue="14102"
      renderItem={(e, { index }) => (
        <ItemCard
          rarity={e.rarity}
          level={60}
          stars={1 + (index % 5)}
          specialty={SPECIALTY[e.specialty]}
          art={<WEngineImage id={e.id} alt="" />}
        />
      )}
    />
  );
}
