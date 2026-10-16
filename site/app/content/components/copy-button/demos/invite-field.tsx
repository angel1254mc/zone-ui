import { useState } from 'react';
import { CopyButton, TextField } from '@angel1254mc/zone-ui';

const invite = 'https://example.com/invite/7HQ2-PROXY';

export default function InviteField() {
  const [copies, setCopies] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <TextField label="Invite link" value={invite} readOnly width={420} />
        <CopyButton text={invite} copiedLabel="Link copied" onCopy={() => setCopies((n) => n + 1)}>
          Copy link
        </CopyButton>
      </div>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>Copied {copies} times</output>
    </div>
  );
}
