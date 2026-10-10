import { Button, PolychromeIcon, SignalSearchIcon } from '@angel1254mc/zone-ui';

export default function Marquee() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
      <Button variant="marquee" marqueeText="Good luck" cost={{ icon: <PolychromeIcon />, amount: '× 1' }}>
        Single Search
      </Button>
      <Button variant="marquee" marqueeText="Good luck" cost={{ icon: <PolychromeIcon />, amount: '× 10' }}>
        Ten Searches
      </Button>
      <Button variant="marquee" icon={<SignalSearchIcon />}>
        Search
      </Button>
    </div>
  );
}
