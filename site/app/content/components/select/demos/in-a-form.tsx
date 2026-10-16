import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Select, Text } from '@angel1254mc/zone-ui';

export default function InAForm() {
  const [saved, setSaved] = useState('Nothing saved yet');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const server = new FormData(event.currentTarget).get('server');
    setSaved(server ? `Saved: ${server}` : 'Choose a server first');
  };

  return (
    <form onSubmit={save} style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <Text as="span" id="server-label" role="body" tone="muted">
        Server
      </Text>
      <Select
        aria-labelledby="server-label"
        name="server"
        width="fill"
        placeholder="Choose a server"
        options={[
          { value: 'america', label: 'America' },
          { value: 'europe', label: 'Europe' },
          { value: 'asia', label: 'Asia' },
          { value: 'tw-hk-mo', label: 'TW, HK, MO' },
        ]}
      />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 8 }}>
        <Button type="submit">Save</Button>
        <output style={{ color: 'var(--zzz-color-text-muted)' }}>{saved}</output>
      </div>
    </form>
  );
}
