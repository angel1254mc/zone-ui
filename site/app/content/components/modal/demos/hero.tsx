import { useState } from 'react';
import { Button, CheckIcon, CloseIcon, Modal } from '@angel1254mc/zone-ui';

export default function ModalHero() {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Reset build?"
      description="Levels, skills and equipment of this plan return to their defaults."
      trigger={<Button width="compact">Reset build</Button>}
      footer={
        <>
          <Button icon={<CloseIcon />} iconTone="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button icon={<CheckIcon />} iconTone="confirm" onClick={() => setOpen(false)}>
            Reset
          </Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>This can't be undone.</p>
    </Modal>
  );
}
