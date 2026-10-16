import { Button, Capsule, ClockIcon, ContentCard } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

export default function DashboardGrid() {
  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      <ContentCard
        variant="accent"
        eyebrow="Today"
        trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ClockIcon size={22} /> 14h left
          </span>
        }
        title="Daily puzzle #212"
        media={<AgentImage id="1191" crop="crop" fit="cover" position="50% 28%" alt="" />}
      >
        <p>Five questions, thirty seconds each.</p>
      </ContentCard>
      <ContentCard
        eyebrow="Your stats"
        trailing={<Capsule>Streak 6</Capsule>}
        title="83% correct"
        footer={<Button width="compact">Share</Button>}
      >
        <p>Best streak: 14 days. Played 212 times.</p>
      </ContentCard>
      <ContentCard variant="compact" eyebrow="Notice" title="Maintenance tonight">
        <p>Servers go down at 02:00 for about an hour.</p>
      </ContentCard>
    </div>
  );
}
