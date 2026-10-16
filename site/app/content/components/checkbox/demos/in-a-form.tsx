import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Checkbox } from '@angel1254mc/zone-ui';

export default function InAForm() {
  const [saved, setSaved] = useState('Nothing saved yet');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const topics = new FormData(event.currentTarget).getAll('notify');
    setSaved(topics.length ? `Saved: ${topics.join(', ')}` : 'Saved: no notifications');
  };

  return (
    <form onSubmit={save} style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Checkbox name="notify" value="events" defaultChecked>
          Event announcements
        </Checkbox>
        <Checkbox name="notify" value="maintenance">
          Maintenance notices
        </Checkbox>
        <Checkbox name="notify" value="rewards" defaultChecked>
          Login rewards
        </Checkbox>
      </div>
      <Button type="submit">Save</Button>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{saved}</output>
    </form>
  );
}
