import { ItemCard, ItemGrid } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

const IDS = {
  s: ['14102', '14104', '14105', '14107', '14109', '14110', '14114', '14116'],
  a: ['13001', '13002', '13003', '13004', '13005', '13006', '13007', '13008'],
  b: ['12001', '12002', '12003', '12004', '12005', '12006', '12007', '12008'],
};
const ENGINES = (['s', 'a', 'b'] as const).flatMap((rarity) => IDS[rarity].map((id) => ({ id, rarity })));

export default function Scrolling() {
  return (
    <ItemGrid
      aria-label="W-Engine Storage"
      items={ENGINES}
      getId={(e) => e.id}
      columns={6}
      scrollbar="right"
      defaultValue="14102"
      style={{ height: 'calc(500 * var(--zzz-px))' }}
      renderItem={(e) => <ItemCard rarity={e.rarity} level={60} stars={1} art={<WEngineImage id={e.id} alt="" />} />}
    />
  );
}
