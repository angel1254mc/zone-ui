import { Accordion, AccordionItem } from '@angel1254mc/zone-ui';

export default function PlainVariant() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Accordion variant="plain" defaultValue={['graphics']}>
        <AccordionItem value="graphics" title="Graphics">
          Frame rate, resolution and the quality preset.
        </AccordionItem>
        <AccordionItem value="audio" title="Audio">
          Music, voice and effects volume.
        </AccordionItem>
        <AccordionItem value="beta" title="Locked until Inter-Knot Lv. 20" disabled>
          Experimental options.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
