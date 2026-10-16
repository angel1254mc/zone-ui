import { Hero } from '@angel1254mc/zone-ui';

export default function Centred() {
  return (
    <Hero
      background="plain"
      align="center"
      eyebrow="Beta"
      title="Build your squad"
      bullets={['Pick three agents from your roster', 'Compare stats side by side', 'Share the squad with a link']}
      primaryAction={{ label: 'Start building', href: '#start' }}
    />
  );
}
