import { ItemCard } from '@angel1254mc/zone-ui';
import { DriveDiscImage } from 'examples/art';

const equipped = [
  { slot: 1, level: 15 },
  { slot: 2, level: 15 },
  { slot: 3, level: 12 },
  { slot: 4, level: 9 },
] as const;

export default function DriveDiscSlots() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {equipped.map((d) => (
        <ItemCard
          key={d.slot}
          size="list"
          name={`Woodpecker Electro, slot ${d.slot}`}
          rarity="s"
          slot={d.slot}
          level={d.level}
          art={<DriveDiscImage id="31000" alt="" />}
        />
      ))}
      <ItemCard size="list" name="Slot 5" empty />
      <ItemCard size="list" name="Slot 6" empty />
    </div>
  );
}
