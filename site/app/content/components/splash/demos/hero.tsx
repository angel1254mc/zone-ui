import { useState } from 'react';
import { Button, Splash } from '@angel1254mc/zone-ui';

export default function SplashHero() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', height: 420, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <Button onClick={() => setOpen(true)}>Show splash</Button>
      <Splash
        contained
        open={open}
        onOpenChange={setOpen}
        title="Proxy Trivia"
        subtitle="A daily quiz from New Eridu"
        footer="v1.0"
      />
    </div>
  );
}
