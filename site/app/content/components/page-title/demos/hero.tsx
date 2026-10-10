import { PageTitle, TagButton } from '@angel1254mc/zone-ui';

export default function PageTitleHero() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(28 * var(--zzz-px))' }}>
      <TagButton kind="back" />
      <PageTitle>Manage Item</PageTitle>
    </div>
  );
}
