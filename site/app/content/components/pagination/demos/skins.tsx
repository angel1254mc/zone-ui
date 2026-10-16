import { Pagination } from '@angel1254mc/zone-ui';

export default function Skins() {
  return (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'center' }}>
      <div style={{ background: '#EFEFEF', padding: 16, borderRadius: 12 }}>
        <Pagination aria-label="Web skin" count={12} defaultPage={3} />
      </div>
      <Pagination aria-label="Game skin" skin="game" count={12} defaultPage={3} />
    </div>
  );
}
