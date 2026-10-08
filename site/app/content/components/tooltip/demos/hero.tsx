import { Button, IconButton, InfoAlertIcon, Tooltip } from '@angel1254mc/zone-ui';

export default function TooltipHero() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 520,
        padding: '56px 24px',
        borderRadius: 12,
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      <Tooltip content="Base ATK of the equipped W-Engine">
        <Button>ATK</Button>
      </Tooltip>
      <Tooltip content="Stat bonuses">
        <IconButton icon={<InfoAlertIcon />} label="Stat bonuses" />
      </Tooltip>
    </div>
  );
}
