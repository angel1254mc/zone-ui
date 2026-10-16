import { CategoryTag } from '@angel1254mc/zone-ui';

export default function Skins() {
  return (
    <div style={{ display: 'grid', gap: 16, padding: 24, borderRadius: 16, background: '#efefef' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <CategoryTag skin="web">News</CategoryTag>
        <CategoryTag skin="web">Events</CategoryTag>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <CategoryTag skin="game">News</CategoryTag>
        <CategoryTag skin="game">Events</CategoryTag>
      </div>
    </div>
  );
}
