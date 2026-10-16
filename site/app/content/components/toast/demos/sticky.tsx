import { Button, ToastProvider, useToast } from '@angel1254mc/zone-ui';

function Trigger() {
  const { toast, dismiss } = useToast();
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button
        width="compact"
        iconTone="cancel"
        onClick={() => toast({ message: 'Connection lost. Retrying', variant: 'error', duration: 0 })}
      >
        Stay open
      </Button>
      <Button width="compact" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export default function Sticky() {
  return (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  );
}
