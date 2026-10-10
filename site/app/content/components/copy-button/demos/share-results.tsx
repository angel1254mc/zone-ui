import { CopyButton } from '@angel1254mc/zone-ui';

const answers = [true, true, false, true, true];

function shareText() {
  const score = answers.filter(Boolean).length;
  const grid = answers.map((right) => (right ? '🟩' : '🟥')).join('');
  return `Daily Trivia #214  ${score}/${answers.length}\n${grid}\nStreak 12`;
}

export default function ShareResults() {
  return (
    <div style={{ width: '100%', maxWidth: 360, display: 'grid', gap: 16 }}>
      <pre
        style={{
          margin: 0,
          padding: 16,
          borderRadius: 12,
          background: 'var(--zzz-color-surface-stat-row)',
          font: 'inherit',
          whiteSpace: 'pre-wrap',
        }}
      >
        {shareText()}
      </pre>
      <CopyButton size="lg" getText={shareText} copiedLabel="Results copied" style={{ width: '100%' }}>
        Share results
      </CopyButton>
    </div>
  );
}
