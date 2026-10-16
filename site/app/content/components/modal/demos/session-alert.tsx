import { useState } from 'react';
import { Button, CheckIcon, Modal } from '@angel1254mc/zone-ui';

export default function SessionAlert() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Simulate expiry</Button>
      <Modal
        alert
        hideClose
        closeOnBackdrop={false}
        open={open}
        onOpenChange={setOpen}
        title="Session expired"
        footer={
          <Button icon={<CheckIcon />} iconTone="confirm" onClick={() => setOpen(false)}>
            Sign in again
          </Button>
        }
      >
        <p style={{ margin: 0 }}>Sign in to keep planning your builds.</p>
      </Modal>
    </>
  );
}
