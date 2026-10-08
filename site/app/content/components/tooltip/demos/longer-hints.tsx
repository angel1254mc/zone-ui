import { Button, Tooltip } from '@angel1254mc/zone-ui';

export default function LongerHints() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 520,
        padding: '28px 24px 132px',
        borderRadius: 12,
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      <Tooltip
        placement="bottom"
        content="Anomaly Proficiency increases the Anomaly Buildup rate of the Agent's Attribute attacks."
      >
        <Button>Anomaly Proficiency</Button>
      </Tooltip>
    </div>
  );
}
