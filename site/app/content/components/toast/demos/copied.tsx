import { Button, ToastProvider, useToast } from '@angel1254mc/zone-ui';

const inviteLink = 'https://example.com/invite/zone';

function CopyInvite() {
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard?.writeText(inviteLink).catch(() => {});
    toast({ message: 'Copied!', variant: 'success' });
  };
  return (
    <Button width="compact" onClick={copy}>
      Copy invite link
    </Button>
  );
}

export default function Copied() {
  return (
    <ToastProvider>
      <CopyInvite />
    </ToastProvider>
  );
}
