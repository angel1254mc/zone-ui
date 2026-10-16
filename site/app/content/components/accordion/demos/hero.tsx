import { Accordion, AccordionItem } from '@angel1254mc/zone-ui';

const faq = [
  {
    value: 'wengine',
    title: 'What is a W-Engine?',
    body: 'W-Engines are weapons that Agents equip. Each one has a Base ATK, an Advanced Stat and a passive effect that grows with Overclock.',
  },
  {
    value: 'polychrome',
    title: 'How do I earn Polychrome?',
    body: 'Complete events, Commissions and Inter-Knot achievements. Some check-in plans also reward it.',
  },
  {
    value: 'drive',
    title: 'How do Drive Disc set bonuses work?',
    body: 'Equipping two discs of a set grants its 2-piece bonus. Four discs add the 4-piece effect.',
  },
];

export default function AccordionHero() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Accordion defaultValue={['wengine']}>
        {faq.map((item) => (
          <AccordionItem key={item.value} value={item.value} title={item.title}>
            {item.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
