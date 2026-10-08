import { useState } from 'react';
import { Button, Splash } from '@angel1254mc/zone-ui';

export default function FullScreen() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open full screen</Button>
      <Splash
        open={open}
        onOpenChange={setOpen}
        title="Proxy Trivia"
        subtitle="A daily quiz from New Eridu"
        hint="Press to enter"
        footer="v1.0"
      />
    </>
  );
}
