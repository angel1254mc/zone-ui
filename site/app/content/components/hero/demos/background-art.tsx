import { ClockIcon, Hero } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

export default function BackgroundArt() {
  return (
    <Hero
      artPosition="background"
      background="graffiti"
      eyebrow="New season"
      title="Hollow Zero Nights"
      meta={['Season 3', 'From Oct 15']}
      description="Ranked runs, new stages and a fresh leaderboard every week."
      primaryAction={{ label: 'Join', icon: <ClockIcon />, href: '#join' }}
      secondaryAction={{ label: 'Details', href: '#details' }}
      art={<AgentImage id="1191" crop="full" alt="" />}
    />
  );
}
