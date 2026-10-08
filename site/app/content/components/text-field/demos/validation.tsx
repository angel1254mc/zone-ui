import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, TextField } from '@angel1254mc/zone-ui';

export default function Validation() {
  const [code, setCode] = useState('ZZZ-123');
  const [error, setError] = useState<string | null>('Codes have 12 letters and numbers');
  const [redeemed, setRedeemed] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[A-Z0-9]{12}$/.test(code)) {
      setError('Codes have 12 letters and numbers');
      return;
    }
    setError(null);
    setRedeemed(`Redeemed ${code}`);
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 400 }}>
      <TextField
        label="Redeem code"
        description="Letters and numbers only"
        placeholder="Enter redemption code"
        value={code}
        onValueChange={(value) => {
          setCode(value.toUpperCase());
          setError(null);
        }}
        error={error}
      />
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <Button type="submit">Redeem</Button>
        <output style={{ color: 'var(--zzz-color-text-muted)' }}>{redeemed}</output>
      </div>
    </form>
  );
}
