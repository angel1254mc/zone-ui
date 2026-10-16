import { useState } from 'react';
import { BackIcon, Button, ConfirmDialog } from '@angel1254mc/zone-ui';

export default function LeaveRun() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('Run in progress');
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <Button icon={<BackIcon />} onClick={() => setOpen(true)}>
        Leave run
      </Button>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{status}</output>
      <ConfirmDialog
        title="Leave this run?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        initialFocus="cancel"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setStatus('You left the run')}
        onCancel={() => setStatus('Run in progress')}
      />
    </div>
  );
}
