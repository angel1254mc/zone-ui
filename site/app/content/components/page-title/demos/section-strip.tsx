import { SectionTitleStrip } from '@angel1254mc/zone-ui';

export default function SectionStrip() {
  return (
    <div style={{ display: 'grid', gap: 24, minWidth: 'calc(760 * var(--zzz-px))', paddingBottom: 24 }}>
      <SectionTitleStrip title="W-Engine Storage" count={[113, 2000]} />
      <SectionTitleStrip title="Materials" rule={false} />
    </div>
  );
}
