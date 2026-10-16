import { ProgressPill } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function ProgressPillDemo() {
  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'start', paddingTop: 12 }}>
      <ProgressPill icon={<ItemImage id="100" alt="" />} label={'Polychrome\nProgress:'} value="19%" isNew />
      <ProgressPill icon={<ItemImage id="110" alt="" />} label={'Master Tape\nProgress:'} value="64%" />
    </div>
  );
}
