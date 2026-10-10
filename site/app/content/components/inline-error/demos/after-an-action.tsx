import { useState } from 'react';
import { Button, GiftIcon, InlineError } from '@angel1254mc/zone-ui';

export default function AfterAnAction() {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Button icon={<GiftIcon />} width="wide" onClick={() => setFailed(true)}>
        Claim all
      </Button>
      {failed && <InlineError alert>Storage is full. Free up space and try again.</InlineError>}
    </div>
  );
}
