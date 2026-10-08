import { Button, InlineError } from '@angel1254mc/zone-ui';

export default function InlineErrorHero() {
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Button width="wide" aria-disabled aria-describedby="craft-error">
        Craft
      </Button>
      <InlineError id="craft-error">Insufficient crafting materials</InlineError>
    </div>
  );
}
