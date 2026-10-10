import { Button, StarsPill } from '@angel1254mc/zone-ui';

export default function CustomAction() {
  return <StarsPill size="large" value={3} action={<Button>Refine</Button>} />;
}
