import { ClockIcon, StarIcon, StatTile, StatTiles, TargetLoopIcon } from '@angel1254mc/zone-ui';

export default function Dashboard() {
  return (
    <StatTiles aria-label="Account" columns={3}>
      <StatTile icon={<StarIcon />} label="Achievements" value="87/120" delta={4} sub="this week" />
      <StatTile icon={<ClockIcon />} label="Play time" value="36 h" delta={-2} sub="vs last week" />
      <StatTile icon={<TargetLoopIcon />} label="Accuracy" value="91%" delta={0} />
      <StatTile label="Wins" value={642} delta={12} />
      <StatTile label="Win rate" value="58%" delta={-1} />
      <StatTile label="Rank" value="S" sub="top 12% today" highlight />
    </StatTiles>
  );
}
