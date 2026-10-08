import { EventCtaButton } from '@angel1254mc/zone-ui';

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <EventCtaButton still>Enter</EventCtaButton>
      <EventCtaButton pressed>Go</EventCtaButton>
      <EventCtaButton disabled>Go</EventCtaButton>
    </div>
  );
}
