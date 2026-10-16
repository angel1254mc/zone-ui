import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, CheckIcon, MailIcon, Modal, TextField } from '@angel1254mc/zone-ui';

export default function NewsletterForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubscribed(email);
    setOpen(false);
  };

  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
      <Button icon={<MailIcon />} onClick={() => setOpen(true)}>
        Newsletter
      </Button>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>
        {subscribed ? `Subscribed as ${subscribed}` : 'Not subscribed'}
      </output>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Newsletter"
        description="Patch notes and event dates, every Thursday."
      >
        <form onSubmit={submit} style={{ display: 'grid', gap: 20 }}>
          <TextField label="Email" type="email" required value={email} onValueChange={setEmail} />
          <Button type="submit" icon={<CheckIcon />} iconTone="confirm">
            Subscribe
          </Button>
        </form>
      </Modal>
    </div>
  );
}
