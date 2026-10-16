import { useEffect, useState } from 'react';
import { Button, ResetIcon, Spinner, Text } from '@angel1254mc/zone-ui';

const roster = ['Anby', 'Billy', 'Nicole', 'Nekomata'];

export default function WhileLoading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'center', minHeight: 160, alignContent: 'start' }}>
      <Button icon={<ResetIcon />} disabled={loading} onClick={() => setLoading(true)}>
        Refresh
      </Button>
      {loading ? <Spinner label="Loading roster" /> : <Text role="body">{roster.join(' · ')}</Text>}
    </div>
  );
}
