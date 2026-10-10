import { Button, ToastProvider, useToast } from '@angel1254mc/zone-ui';

function Triggers() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button width="compact" onClick={() => toast({ message: 'New event: Their Secret Histories' })}>
        Info
      </Button>
      <Button width="compact" iconTone="confirm" onClick={() => toast({ message: 'Build saved', variant: 'success' })}>
        Success
      </Button>
      <Button
        width="compact"
        iconTone="cancel"
        onClick={() => toast({ message: 'Insufficient Dennies', variant: 'error' })}
      >
        Error
      </Button>
    </div>
  );
}

export default function Variants() {
  return (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  );
}
