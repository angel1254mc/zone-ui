import { ClockIcon, Notice } from '@angel1254mc/zone-ui';

export default function NoticeDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        justifyItems: 'center',
        width: '100%',
        maxWidth: 520,
        padding: '28px 0',
        borderRadius: 12,
        background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
      }}
    >
      <Notice>'Unlock Early' has been unlocked</Notice>
      <Notice icon={<ClockIcon />}>Event ends in 6d</Notice>
      <Notice icon={null}>Saved</Notice>
    </div>
  );
}
