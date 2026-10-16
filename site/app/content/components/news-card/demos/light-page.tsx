import { NewsCard } from '@angel1254mc/zone-ui';
import { NamecardImage } from 'examples/art';

export default function LightPage() {
  return (
    <div style={{ background: '#EFEFEF', padding: 24, borderRadius: 12 }}>
      <NewsCard
        tone="light"
        href="#sound-of-new-eridu"
        art={<NamecardImage agentId="1031" alt="" />}
        date="2024/06/12"
        category="News"
        title="Developer Diary: The Sound of New Eridu"
        description="The audio team talks about the city soundscape, the soundtrack and the vinyl store."
      />
    </div>
  );
}
