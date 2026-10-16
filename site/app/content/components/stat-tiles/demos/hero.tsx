import { StatTile, StatTiles } from '@angel1254mc/zone-ui';

export default function StatTilesHero() {
  return (
    <StatTiles aria-label="Results" columns={3}>
      <StatTile label="Played" value={42} delta={3} sub="this week" />
      <StatTile label="Streak" value={12} delta={1} sub="best 21" highlight />
      <StatTile label="Best" value="1:42" delta="−8 s" deltaTone="positive" sub="per run" />
    </StatTiles>
  );
}
