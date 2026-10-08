import { useState } from 'react';
import { Accordion, AccordionItem, Button } from '@angel1254mc/zone-ui';

const faq = [
  { value: 'battery', title: 'How fast does Battery Charge refill?', body: 'One point every six minutes, up to 240.' },
  { value: 'pity', title: 'When is an S-Rank guaranteed?', body: 'Within 90 pulls on the Exclusive Channel.' },
  { value: 'reset', title: 'When do daily tasks reset?', body: 'Every day at 04:00 server time.' },
];

export default function ExpandAll() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <div style={{ width: '100%', maxWidth: 560, display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button size="sm" width="auto" onClick={() => setOpen(faq.map((item) => item.value))}>
          Expand all
        </Button>
        <Button size="sm" width="auto" onClick={() => setOpen([])}>
          Collapse all
        </Button>
      </div>
      <Accordion type="multiple" value={open} onValueChange={setOpen}>
        {faq.map((item) => (
          <AccordionItem key={item.value} value={item.value} title={item.title}>
            {item.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
