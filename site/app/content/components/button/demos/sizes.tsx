import { Button, HomeIcon } from '@angel1254mc/zone-ui';

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <Button size="sm" icon={<HomeIcon />}>
        Small
      </Button>
      <Button size="md" icon={<HomeIcon />}>
        Medium
      </Button>
      <Button size="lg" icon={<HomeIcon />}>
        Large
      </Button>
    </div>
  );
}
