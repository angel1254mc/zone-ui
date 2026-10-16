import { Button, Tooltip } from '@angel1254mc/zone-ui';

// Top first and Bottom last, so each bubble opens into empty space on the backdrop.
const sides = ['top', 'left', 'right', 'bottom'] as const;

export default function Placement() {
  return (
    <div
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 12,
        width: '100%',
        maxWidth: 640,
        padding: '64px 24px',
        borderRadius: 12,
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      {sides.map((side) => (
        <Tooltip key={side} content={`Shown on the ${side}`} placement={side}>
          <Button width="compact">{side[0].toUpperCase() + side.slice(1)}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
