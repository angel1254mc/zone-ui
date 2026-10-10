import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Radio, RadioGroup } from '@angel1254mc/zone-ui';

export default function InAForm() {
  const [saved, setSaved] = useState('Nothing saved yet');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const server = new FormData(event.currentTarget).get('server');
    setSaved(`Saved: ${server}`);
  };

  return (
    <form onSubmit={save} style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <RadioGroup label="Server" name="server" defaultValue="europe">
        <Radio value="america">America</Radio>
        <Radio value="europe">Europe</Radio>
        <Radio value="asia">Asia</Radio>
      </RadioGroup>
      <Button type="submit">Save</Button>
      <output style={{ color: 'var(--zzz-color-text-muted)' }}>{saved}</output>
    </form>
  );
}
