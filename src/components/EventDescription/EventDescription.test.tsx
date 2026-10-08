import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { EventDescription } from './EventDescription';

describe('EventDescription', () => {
  it('renders a paragraph with bodyXl + small outline, right-aligned', () => {
    render(<EventDescription>Next stop: the live venue</EventDescription>);
    const p = screen.getByText('Next stop: the live venue');
    expect(p.tagName).toBe('P');
    expect(p).toHaveClass(
      'zzz-event-description',
      'zzz-event-description--end',
      'zzz-text-bodyXl',
      'zzz-text--outline-md'
    );
    expect(p.style.maxWidth).toBe('calc(620 * var(--zzz-px))');
  });
  it('accepts align, maxWidth none, className and ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <EventDescription ref={ref} align="start" maxWidth="none" className="x">
        Text
      </EventDescription>
    );
    expect(ref.current).toHaveClass('zzz-event-description--start', 'x');
    expect(ref.current?.style.maxWidth).toBe('none');
  });
});
