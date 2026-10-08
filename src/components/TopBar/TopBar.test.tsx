import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { TopBar } from '.';

describe('TopBar', () => {
  it('renders the Back tag button when onBack is given', async () => {
    const onBack = vi.fn();
    render(<TopBar onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('has no back button without onBack', () => {
    render(<TopBar left={<span>x</span>} />);
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('renders a title as a PageTitle heading, and left / right slots', () => {
    const { container } = render(
      <TopBar onBack={() => {}} title="Manage Item" right={<button>Recycle</button>} left={<span>extra</span>} />
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Manage Item' })).toHaveClass('zzz-page-title');
    expect(container.querySelector('.zzz-top-bar__right')).toContainElement(
      screen.getByRole('button', { name: 'Recycle' })
    );
    expect(container.querySelector('.zzz-top-bar__left')).toHaveTextContent('extra');
  });

  it('exposes the background variant and renders the mural layer', () => {
    const { container, rerender } = render(<TopBar />);
    expect(container.firstElementChild).toHaveAttribute('data-background', 'solid');
    rerender(<TopBar background="translucent" />);
    expect(container.firstElementChild).toHaveAttribute('data-background', 'translucent');
    rerender(<TopBar background="mural" />);
    expect(container.querySelector('.zzz-mural')).not.toBeNull();
  });

  it('passes backLabel, ref, className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TopBar ref={ref} className="c" onBack={() => {}} backLabel="Back to City" />);
    expect(screen.getByRole('button', { name: 'Back to City' })).toBeInTheDocument();
    expect(ref.current).toHaveClass('zzz-top-bar', 'c');
  });
});
