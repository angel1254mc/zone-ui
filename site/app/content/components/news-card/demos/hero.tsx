import { NewsCard } from '@angel1254mc/zone-ui';
import { NamecardImage } from 'examples/art';

export default function NewsCardHero() {
  return (
    <NewsCard
      href="#signal-search"
      art={<NamecardImage agentId="1191" alt="" />}
      date="2024/07/04"
      category="Notices"
      title="Signal Search Probability Details"
      description="Exclusive Channel, W-Engine Channel and Bangboo Channel rates, pity rules and guarantees for the current version."
    />
  );
}
