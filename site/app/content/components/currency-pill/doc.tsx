import { BatteryIcon, CurrencyPill, DennyIcon, PolychromeIcon } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the three resources of a top bar, stacked so they read at card size. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(18 * var(--zzz-px))', justifyItems: 'end' }}>
      <CurrencyPill label="Battery Charge" value={20} max={240} icon={<BatteryIcon />} onAdd={() => {}} />
      <CurrencyPill label="Dennies" value={76418} icon={<DennyIcon />} onAdd={() => {}} />
      <CurrencyPill label="Polychrome" value={193} icon={<PolychromeIcon />} onAdd={() => {}} />
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.75,
  usage: (
    <>
      <p>
        A currency pill shows how much of one currency the player holds, with its icon on the slanted tail. Pass{' '}
        <code>onAdd</code> to show a &ldquo;+&rdquo; button that leads to a store or a refill. Give it a{' '}
        <code>max</code> for stamina, the energy that runs down as you play: the pill then reads <code>20/240</code>.
      </p>
      <p>
        Line several up with <code>ResourceBar</code>, usually on the right of a Top Bar. For the quantity of one item
        in an inventory, use the count on Item Card. To pick an amount to spend, use Quantity Bar.
      </p>
    </>
  ),
  usageCode: `import { CurrencyPill, DennyIcon } from '@angel1254mc/zone-ui';

<CurrencyPill label="Dennies" value={76418} icon={<DennyIcon />} onAdd={openStore} />`,
  examples: [
    {
      demo: 'top-bar',
      title: 'In the top bar',
      description: 'A ResourceBar in the right slot of a Top Bar, the usual home for currencies.',
      frame: 'bleed',
    },
    {
      demo: 'refill-stamina',
      title: 'Refill stamina',
      description: 'The + button adds charge, which may go past the cap, and turns off at a limit you choose.',
    },
    {
      demo: 'number-formats',
      title: 'Number formats',
      description: 'Zero padding by default, no padding with digits={0}, white zeros, and a string as given.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Numbers',
      items: [
        <>
          Numbers are zero-padded to 8 digits, or 3 when <code>max</code> is set. <code>digits</code> changes the count
          and <code>0</code> turns padding off. The max is never padded.
        </>,
        <>
          The padding zeros are grey, or white with <code>max</code>. Override with <code>padTone</code>.
        </>,
        <>A string value renders as given, for amounts like &ldquo;99K+&rdquo;.</>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The pill is a group named by <code>label</code>, and screen readers hear the full amount, for example
          &ldquo;Dennies 76,418&rdquo;. The icon is decorative.
        </>,
        <>
          The &ldquo;+&rdquo; is its own button named &ldquo;Get more Dennies&rdquo;. Rename it with{' '}
          <code>addLabel</code>, and disable it with <code>addProps</code>.
        </>,
      ],
    },
  ],
  related: ['top-bar', 'quantity-bar', 'badges'],
};

export default doc;
