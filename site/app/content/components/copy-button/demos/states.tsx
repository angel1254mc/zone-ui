import { CopyButton } from '@angel1254mc/zone-ui';

const blocked = () => Promise.reject(new Error('Clipboard blocked'));

export default function States() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
      <CopyButton text="ZZZ-SIXTH-STREET" />
      <CopyButton text="ZZZ-SIXTH-STREET" status="copied" />
      <CopyButton text="ZZZ-SIXTH-STREET" status="failed" />
      <CopyButton getText={blocked}>Try a blocked copy</CopyButton>
    </div>
  );
}
