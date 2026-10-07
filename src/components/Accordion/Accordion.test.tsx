import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Accordion, AccordionItem } from './Accordion';
import type { AccordionProps } from './Accordion';

function Faq(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="a" title="What is a W-Engine?">
        Equipment for Agents.
      </AccordionItem>
      <AccordionItem value="b" title="How do I get Polychrome?">
        From events.
      </AccordionItem>
      <AccordionItem value="c" title="Locked" disabled>
        Hidden.
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders heading buttons with aria-expanded / aria-controls and hidden regions', () => {
    render(<Faq />);
    const btn = screen.getByRole('button', { name: 'What is a W-Engine?' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn.closest('h3')).not.toBeNull();
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!;
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('hidden');
    expect(panel).toHaveAttribute('aria-labelledby', btn.id);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('single: opening one closes the other; collapsible by default', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const a = screen.getByRole('button', { name: 'What is a W-Engine?' });
    const b = screen.getByRole('button', {
      name: 'How do I get Polychrome?',
    });
    await user.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'What is a W-Engine?' })).toHaveTextContent('Equipment for Agents.');
    await user.click(b);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(b).toHaveAttribute('aria-expanded', 'true');
    await user.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });

  it('single + collapsible=false keeps the open item open', async () => {
    const user = userEvent.setup();
    render(<Faq defaultValue={['a']} collapsible={false} />);
    const a = screen.getByRole('button', { name: 'What is a W-Engine?' });
    expect(a).toHaveAttribute('aria-expanded', 'true');
    await user.click(a);
    expect(a).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple: items open independently', async () => {
    const user = userEvent.setup();
    render(<Faq type="multiple" />);
    await user.click(screen.getByRole('button', { name: 'What is a W-Engine?' }));
    await user.click(screen.getByRole('button', { name: 'How do I get Polychrome?' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('works with the keyboard (Tab + Enter / Space)', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'What is a W-Engine?' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'What is a W-Engine?' })).toHaveAttribute('aria-expanded', 'true');
    await user.tab();
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'How do I get Polychrome?' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('controlled value + onValueChange', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    function C() {
      const [v, setV] = useState<string[]>(['b']);
      return (
        <Faq
          value={v}
          onValueChange={(n) => {
            spy(n);
            setV(n);
          }}
        />
      );
    }
    render(<C />);
    expect(screen.getByRole('button', { name: 'How do I get Polychrome?' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'What is a W-Engine?' }));
    expect(spy).toHaveBeenCalledWith(['a']);
    expect(screen.getByRole('button', { name: 'What is a W-Engine?' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('disabled items do not toggle and headingLevel is configurable', async () => {
    const user = userEvent.setup();
    render(<Faq headingLevel={2} />);
    const c = screen.getByRole('button', { name: 'Locked' });
    expect(c).toBeDisabled();
    await user.click(c);
    expect(c).toHaveAttribute('aria-expanded', 'false');
    expect(c.closest('h2')).not.toBeNull();
  });

  it('passes className / ref and marks forced pressed', () => {
    let node: HTMLDivElement | null = null;
    render(
      <Accordion
        className="x"
        ref={(n) => {
          node = n;
        }}
      >
        <AccordionItem value="a" title="A" pressed>
          a
        </AccordionItem>
      </Accordion>
    );
    expect(node).toHaveClass('zzz-accordion', 'x');
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('data-pressed');
  });
});
