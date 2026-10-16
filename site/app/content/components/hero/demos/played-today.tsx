import { Countdown, Hero, Text } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

const tomorrow = new Date();
tomorrow.setHours(24, 0, 0, 0);

export default function PlayedToday() {
  return (
    <Hero
      eyebrow="Daily"
      title="Proxy Trivia"
      meta={['Puzzle #42', 'Oct 1']}
      primaryAction={{ label: 'See results', href: '#results' }}
      secondaryAction={{ label: 'Archive', href: '#archive' }}
      summary={
        <>
          <Text role="bodyXl" tone="primary">
            Already played today
          </Text>
          <Countdown target={tomorrow} prefix="Next puzzle in" />
        </>
      }
      art={<AgentImage id="1041" crop="full" alt="" />}
    />
  );
}
