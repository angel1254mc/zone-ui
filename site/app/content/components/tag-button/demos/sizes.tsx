import { Button, HomeIcon, TagButton } from '@angel1254mc/zone-ui';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
          <TagButton kind="back" size={size} />
          <TagButton kind="back" size={size} pressed />
          <TagButton kind="close" size={size} />
          <Button size={size} width="compact" icon={<HomeIcon />}>
            City
          </Button>
        </div>
      ))}
    </div>
  );
}
