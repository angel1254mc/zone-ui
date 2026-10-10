import { Accordion, AccordionItem } from '@angel1254mc/zone-ui';

const sections = [
  {
    value: 'agents',
    title: 'New Agents',
    changes: ['Yidhari joins the Exclusive Channel.', 'Ben gets a new outfit in the Agent store.'],
  },
  {
    value: 'balance',
    title: 'Balance changes',
    changes: ['Assist windows are 0.1 s longer.', 'Shiyu Defense floor 7 enemies have less HP.'],
  },
  {
    value: 'fixes',
    title: 'Bug fixes',
    changes: ['The map no longer resets its zoom.', 'Fixed a typo in the Hollow Zero log.'],
  },
];

export default function PatchNotes() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Accordion type="multiple" defaultValue={['agents', 'balance']}>
        {sections.map((section) => (
          <AccordionItem key={section.value} value={section.value} title={section.title} meta={section.changes.length}>
            <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
              {section.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
