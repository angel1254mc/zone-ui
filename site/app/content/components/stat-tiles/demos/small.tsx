import { StatTile, StatTiles } from '@angel1254mc/zone-ui';

export default function Small() {
  return (
    <StatTiles aria-label="Requests" size="sm" columns={3}>
      <StatTile label="Requests" value="1.2 M" delta="+6%" deltaTone="positive" />
      <StatTile label="Errors" value={14} delta={9} deltaTone="negative" />
      <StatTile label="Latency" value="120 ms" delta={0} />
    </StatTiles>
  );
}
