import { Hero, InfoAlertIcon } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

export default function HeroHero() {
  return (
    <Hero
      eyebrow="Daily"
      title="Proxy Trivia"
      meta={['Puzzle #42', 'Oct 1']}
      description="Five questions about New Eridu, thirty seconds each. One try per day, then share your run with friends."
      primaryAction={{ label: 'Play', href: '#play' }}
      secondaryAction={{ label: 'How to play', icon: <InfoAlertIcon />, iconTone: 'plain', href: '#rules' }}
      art={<AgentImage id="1041" crop="full" alt="" />}
    />
  );
}
