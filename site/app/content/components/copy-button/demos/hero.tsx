import { CopyButton } from '@angel1254mc/zone-ui';

export default function CopyButtonHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
      <CopyButton text="https://example.com/invite/7HQ2-PROXY">Copy link</CopyButton>
      <CopyButton text="ZZZ-SIXTH-STREET" copiedLabel="Code copied">
        Copy code
      </CopyButton>
    </div>
  );
}
