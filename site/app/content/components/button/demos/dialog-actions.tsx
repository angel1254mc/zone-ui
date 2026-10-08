import { useState } from 'react';
import { Button, CheckIcon, CloseIcon } from '@angel1254mc/zone-ui';

export default function DialogActions() {
  const [answer, setAnswer] = useState('Nothing chosen yet');
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <div style={{ display: 'flex', gap: 'var(--zzz-space-dialog-button-gap)' }}>
        <Button width="dialog" icon={<CloseIcon />} iconTone="cancel" onClick={() => setAnswer('Cancelled')}>
          Cancel
        </Button>
        <Button width="dialog" icon={<CheckIcon />} iconTone="confirm" onClick={() => setAnswer('Confirmed')}>
          Confirm
        </Button>
      </div>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{answer}</output>
    </div>
  );
}
