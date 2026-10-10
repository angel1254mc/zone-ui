import { useState } from 'react';
import { Button, CheckIcon, DialogBand, Text } from '@angel1254mc/zone-ui';

export default function NoticeBand() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Show notice</Button>
      <DialogBand
        title="Server maintenance"
        open={open}
        onOpenChange={setOpen}
        actions={
          <Button width="dialog" icon={<CheckIcon />} iconTone="confirm" onClick={() => setOpen(false)}>
            Got it
          </Button>
        }
      >
        <Text as="p" role="bodyLg" tone="secondary" style={{ margin: 0 }}>
          Servers go offline at 04:00 for about two hours. Rewards for the downtime arrive by mail.
        </Text>
      </DialogBand>
    </>
  );
}
