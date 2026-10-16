import { Accordion, AccordionItem } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a three-question FAQ with the first answer open. */
function Thumbnail() {
  return (
    <div style={{ width: 'calc(480 * var(--zzz-px))' }}>
      <Accordion defaultValue={['wengine']}>
        <AccordionItem value="wengine" title="What is a W-Engine?">
          A weapon that Agents equip, with a passive effect.
        </AccordionItem>
        <AccordionItem value="polychrome" title="How do I earn Polychrome?">
          Events and Commissions.
        </AccordionItem>
        <AccordionItem value="drive" title="How do Drive Discs work?">
          Set bonuses at two and four discs.
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  usage: (
    <>
      <p>
        Use an accordion when people scan a list of headings and open only the ones they need: an FAQ, patch notes, a
        long settings page. By default one item is open at a time. Set <code>type="multiple"</code> to let several stay
        open.
      </p>
      <p>
        When the sections are views people switch between, use Segmented tabs or Web tabs instead. For a framed block
        that is always visible, use Panel.
      </p>
    </>
  ),
  usageCode: `import { Accordion, AccordionItem } from '@angel1254mc/zone-ui';

<Accordion defaultValue={['wengine']}>
  <AccordionItem value="wengine" title="What is a W-Engine?">
    A weapon that Agents equip.
  </AccordionItem>
  <AccordionItem value="polychrome" title="How do I earn Polychrome?">
    Complete events and Commissions.
  </AccordionItem>
</Accordion>`,
  examples: [
    {
      demo: 'patch-notes',
      title: 'Several open at once',
      description: 'With type="multiple" each section opens on its own, and meta shows a count before the caret.',
    },
    {
      demo: 'expand-all',
      title: 'Expand and collapse all',
      description: 'Control the open items with value and onValueChange to drive them from your own buttons.',
    },
    {
      demo: 'plain-variant',
      title: 'Plain variant',
      description: 'A lighter header and muted text for settings pages, with a locked item that cannot open.',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          Each header is a button in the tab order. <kbd>Enter</kbd> or <kbd>Space</kbd> opens and closes it.
        </>,
        <>Disabled items are skipped.</>,
      ],
    },
    {
      title: 'Open items',
      items: [
        <>
          <code>value</code> and <code>defaultValue</code> are arrays of item values, in both single and multiple mode.
        </>,
        <>
          In single mode the open item can be closed again. Set <code>collapsible={'{false}'}</code> to keep one item
          open at all times.
        </>,
        <>
          Headers sit inside an <code>h3</code>. Change it with <code>headingLevel</code> to fit your page outline.
        </>,
      ],
    },
  ],
  related: ['segmented-tabs', 'panel', 'web-tabs'],
};

export default doc;
