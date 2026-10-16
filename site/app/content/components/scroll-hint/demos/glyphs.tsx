import type { ReactNode } from 'react';
import { ScrollHint } from '@angel1254mc/zone-ui';

function Box({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 'calc(160 * var(--zzz-px))',
        height: 'calc(100 * var(--zzz-px))',
        borderRadius: 'calc(12 * var(--zzz-px))',
        background: '#1a1a1a',
      }}
    >
      {children}
    </div>
  );
}

export default function Glyphs() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <Box>
        <ScrollHint />
      </Box>
      <Box>
        <ScrollHint size="list" />
      </Box>
      <Box>
        <ScrollHint direction="right" />
      </Box>
      <Box>
        <ScrollHint direction="up" />
      </Box>
    </div>
  );
}
