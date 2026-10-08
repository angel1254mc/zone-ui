import { NewsCard } from '@angel1254mc/zone-ui';

export default function LongText() {
  return (
    <NewsCard
      href="#notice"
      date="2024/06/02"
      category="Notices"
      title="A very long headline that keeps going well past the width of the card"
      description="A long summary that runs past two lines is cut with an ellipsis at the end of the second line, so every card in a grid keeps the same height no matter how much the editors wrote."
    />
  );
}
