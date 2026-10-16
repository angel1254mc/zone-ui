import { CurrencyPill, DennyIcon, PolychromeIcon } from '@angel1254mc/zone-ui';

export default function NumberFormats() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <CurrencyPill label="Dennies" value={76418} icon={<DennyIcon />} />
      <CurrencyPill label="Dennies" value={76418} digits={0} icon={<DennyIcon />} />
      <CurrencyPill label="Polychrome" value={193} digits={5} padTone="white" icon={<PolychromeIcon />} />
      <CurrencyPill label="Polychrome" value="99K+" icon={<PolychromeIcon />} />
    </div>
  );
}
