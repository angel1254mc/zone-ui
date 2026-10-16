import { Button, Capsule, ContentCard } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

export default function SideMedia() {
  return (
    <div style={{ width: '100%', maxWidth: 860 }}>
      <ContentCard
        mediaPosition="side"
        eyebrow="W-Engine"
        trailing={<Capsule>Base ATK 684</Capsule>}
        title="Steel Cushion"
        media={<WEngineImage id="14102" fit="contain" layout="ratio" alt="" />}
        footer={<Button width="compact">Equip</Button>}
      >
        <p>
          A supercomputing W-Engine with a motion monitoring feature. It matches the fast reflexes and combat maneuvers
          of feline Thirens.
        </p>
      </ContentCard>
    </div>
  );
}
