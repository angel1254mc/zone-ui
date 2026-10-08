import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { Modal } from './Modal';

function Uncontrolled(props: Partial<Parameters<typeof Modal>[0]>) {
  return (
    <Modal
      title="Reset build?"
      description="Levels and equipment return to default."
      trigger={<button>Open</button>}
      footer={
        <>
          <button>Cancel</button>
          <button>Confirm</button>
        </>
      }
      {...props}
    >
      <p>
        Body with a <a href="#x">link</a>.
      </p>
    </Modal>
  );
}

describe('Modal', () => {
  afterEach(() => {
    document.documentElement.style.overflow = '';
  });

  it('is closed by default; the trigger opens a labelled, described modal dialog', async () => {
    const user = userEvent.setup();
    render(<Uncontrolled />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog', { name: 'Reset build?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Levels and equipment return to default.');
    expect(screen.getByRole('heading', { name: 'Reset build?' })).toBeInTheDocument();
    // focus moves to the first focusable element of the body
    expect(screen.getByRole('link', { name: 'link' })).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('traps Tab / Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Uncontrolled defaultOpen />);
    const link = screen.getByRole('link');
    link.focus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(link).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('makes the page behind inert while open and un-inerts it before focus returns', async () => {
    const user = userEvent.setup();
    const outside = document.createElement('div');
    outside.id = 'outside';
    document.body.appendChild(outside);
    const { container } = render(<Uncontrolled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const layer = screen.getByRole('dialog').closest('.zzz-modal-layer')!;
    expect(layer.parentElement).toBe(document.body);
    expect(layer).not.toHaveAttribute('inert');
    expect(container).toHaveAttribute('inert');
    expect(outside).toHaveAttribute('inert');
    await user.keyboard('{Escape}');
    expect(container).not.toHaveAttribute('inert');
    expect(outside).not.toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
    outside.remove();
  });

  it('Escape closes and focus returns to the trigger', async () => {
    const user = userEvent.setup();
    render(<Uncontrolled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('close button and backdrop close; closeOnBackdrop / closeOnEscape can be turned off', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Uncontrolled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.pointerDown(document.querySelector('.zzz-modal-overlay')!);
    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(<Uncontrolled closeOnBackdrop={false} closeOnEscape={false} hideClose />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.pointerDown(document.querySelector('.zzz-modal-overlay')!);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    // clicks inside the panel never close it
    fireEvent.pointerDown(screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('controlled open + onOpenChange; initialFocus; alertdialog', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    function C() {
      const [open, setOpen] = useState(false);
      const confirmRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button onClick={() => setOpen(true)}>Reset</button>
          <Modal
            alert
            title="Reset build?"
            open={open}
            onOpenChange={(o) => {
              spy(o);
              setOpen(o);
            }}
            initialFocus={confirmRef}
            footer={<button ref={confirmRef}>Confirm</button>}
          >
            <button>Other</button>
          </Modal>
        </>
      );
    }
    render(<C />);
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('alertdialog', { name: 'Reset build?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(spy).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveFocus();
  });

  it('passes className / style / ref to the panel; width in design units', () => {
    let node: HTMLDivElement | null = null;
    render(
      <Modal
        title="T"
        defaultOpen
        width={520}
        className="x"
        ref={(n) => {
          node = n;
        }}
      >
        body
      </Modal>
    );
    const d = screen.getByRole('dialog');
    expect(d).toHaveClass('zzz-modal', 'x');
    expect(node).toBe(d);
    expect(d.style.getPropertyValue('--zzz-modal-width')).toBe('calc(520 * var(--zzz-px))');
    // no focusable content except the close button
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });
});
