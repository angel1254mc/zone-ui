import { Button, Capsule, ContentCard } from '@angel1254mc/zone-ui';

export default function ContentCardHero() {
  return (
    <div style={{ width: '100%', maxWidth: 620 }}>
      <ContentCard
        eyebrow="Daily briefing"
        trailing={<Capsule>Day 12</Capsule>}
        title="Hollow activity is up in Sixth Street"
        footer={
          <>
            <Button>Dismiss</Button>
            <Button width="compact">Details</Button>
          </>
        }
      >
        <p>
          Patrols report three new rifts since midnight. Proxies on duty should check in before 18:00 and avoid the old
          subway entrance.
        </p>
      </ContentCard>
    </div>
  );
}
