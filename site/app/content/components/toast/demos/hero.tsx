import { Button, ToastProvider, useToast } from '@angel1254mc/zone-ui';

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button width="compact" onClick={() => toast({ message: 'Settings saved', variant: 'success' })}>
      Save
    </Button>
  );
}

export default function ToastHero() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
