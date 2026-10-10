import { CategoryTag } from '@angel1254mc/zone-ui';

export default function CategoryTagHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 24, borderRadius: 16, background: '#efefef' }}>
      <CategoryTag>News</CategoryTag>
      <CategoryTag>Notices</CategoryTag>
      <CategoryTag>Events</CategoryTag>
      <CategoryTag>Patch Notes</CategoryTag>
    </div>
  );
}
