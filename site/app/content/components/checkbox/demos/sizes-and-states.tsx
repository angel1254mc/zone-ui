import { Checkbox } from '@angel1254mc/zone-ui';

export default function SizesAndStates() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 28, alignItems: 'center' }}>
          <Checkbox size={size} defaultChecked>
            Checked
          </Checkbox>
          <Checkbox size={size} indeterminate>
            Mixed
          </Checkbox>
          <Checkbox size={size}>Unchecked</Checkbox>
          <Checkbox size={size} disabled>
            Disabled
          </Checkbox>
        </div>
      ))}
    </div>
  );
}
