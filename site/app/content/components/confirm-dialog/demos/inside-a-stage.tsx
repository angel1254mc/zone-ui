import { useState } from 'react';
import { Button, ConfirmDialog, HatchBackground, RecycleIcon, Stage, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function InsideAStage() {
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Stage>
      <div ref={setCanvas} style={{ position: 'absolute', inset: 0 }}>
        <HatchBackground />
        <Text as="h2" role="title" style={{ position: 'absolute', left: u(80), top: u(70), margin: 0 }}>
          W-Engine Storage
        </Text>
        <div style={{ position: 'absolute', left: u(80), bottom: u(70) }}>
          <Button icon={<RecycleIcon />} iconTone="recycle" onClick={() => setOpen(true)}>
            Recycle
          </Button>
        </div>
        <ConfirmDialog
          container={canvas}
          title="Recycle 3 W-Engines?"
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => {}}
        />
      </div>
    </Stage>
  );
}
