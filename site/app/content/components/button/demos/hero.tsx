import { Button, CheckIcon, FilterIcon } from '@angel1254mc/zone-ui';

export default function ButtonHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <Button>View</Button>
      <Button icon={<FilterIcon />} width="compact">
        Filter
      </Button>
      <Button icon={<CheckIcon />} iconTone="confirm" width="dialog">
        Confirm
      </Button>
    </div>
  );
}
