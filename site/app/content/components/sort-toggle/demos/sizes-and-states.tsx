import { SortToggle } from '@angel1254mc/zone-ui';

export default function SizesAndStates() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <SortToggle size={size} defaultDirection="desc" />
          <SortToggle size={size} defaultDirection="asc" />
          <SortToggle size={size} pressed />
          <SortToggle size={size} disabled />
        </div>
      ))}
    </div>
  );
}
