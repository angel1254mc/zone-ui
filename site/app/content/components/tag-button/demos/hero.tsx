import { Button, HomeIcon, TagButton } from '@angel1254mc/zone-ui';

export default function TagButtonHero() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <TagButton kind="back" />
      <Button width="compact" icon={<HomeIcon />}>
        City
      </Button>
    </div>
  );
}
