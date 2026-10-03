import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { DialogBand } from './DialogBand'
import { ConfirmDialog } from './ConfirmDialog'
import { RewardDialog } from './RewardDialog'
import { DialogBackdrop } from './DialogBackdrop'
import { ToastProvider, useToast } from '../Toast'

function Harness({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Craft</button>
      <DialogBand
        open={open}
        onOpenChange={(o) => {
          onOpenChange?.(o)
          setOpen(o)
        }}
        title="Use these materials?"
        actions={
          <>
            <button>Cancel</button>
            <button>Confirm</button>
          </>
        }
      >
        <p>Body</p>
      </DialogBand>
    </>
  )
}

afterEach(() => {
  document.documentElement.style.overflow = ''
})

describe('DialogBand', () => {
  it('renders nothing while closed', () => {
    render(<DialogBand open={false} onOpenChange={() => {}} title="Hidden" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('portals a labelled modal dialog to <body> with the band anatomy', () => {
    const { container } = render(<DialogBand open onOpenChange={() => {}} title="Obtained" actions={<button>OK</button>} />)
    const dialog = screen.getByRole('dialog', { name: 'Obtained' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(container.contains(dialog)).toBe(false)
    expect(dialog.closest('.zzz-overlay')?.parentElement).toBe(document.body)
    expect(dialog.closest('.zzz-overlay')).toHaveClass('zzz-theme')
    expect(dialog).toHaveClass('zzz-dialog-band')
    expect(dialog.querySelector('.zzz-graffiti')).not.toBeNull()
    expect(document.querySelector('.zzz-dialog-backdrop')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('heading', { name: 'Obtained' }).tagName).toBe('H2')
  })

  it('omits watermark and backdrop on request', () => {
    render(<DialogBand open onOpenChange={() => {}} title="T" watermark={false} backdrop={false} />)
    expect(document.querySelector('.zzz-graffiti')).toBeNull()
    expect(document.querySelector('.zzz-dialog-backdrop')).toBeNull()
  })

  it('moves focus to the last action (Confirm), traps Tab, and restores focus on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Harness onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole('button', { name: 'Craft' })
    await user.click(trigger)
    const confirm = screen.getByRole('button', { name: 'Confirm' })
    expect(confirm).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(confirm).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(trigger).toHaveFocus()
  })

  it('locks page scroll and makes the page inert while open', async () => {
    const user = userEvent.setup()
    const { container } = render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Craft' }))
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(container).toHaveAttribute('inert')
    await user.keyboard('{Escape}')
    expect(container).not.toHaveAttribute('inert')
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('leaves the always-mounted toast live region reachable while open', async () => {
    const user = userEvent.setup()
    function Inner() {
      const { toast } = useToast()
      return (
        <DialogBand defaultOpen title="Edit" actions={<button onClick={() => toast({ message: 'Saved' })}>Save</button>} />
      )
    }
    const { container } = render(
      <ToastProvider>
        <Inner />
      </ToastProvider>,
    )
    expect(container).toHaveAttribute('inert')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    const msg = await screen.findByText('Saved')
    expect(msg.closest('[inert]')).toBeNull()
    expect(msg.closest('[aria-live]')).not.toBeNull()
  })

  it('exempts [data-zzz-live-layer] and portal-hosted live regions from inert, but not other portals', async () => {
    const marked = document.body.appendChild(document.createElement('div'))
    marked.setAttribute('data-zzz-live-layer', '')
    const livePortal = document.body.appendChild(document.createElement('div'))
    livePortal.className = 'zzz-theme zzz-portal'
    livePortal.innerHTML = '<div role="status"></div>'
    const plainPortal = document.body.appendChild(document.createElement('div'))
    plainPortal.className = 'zzz-theme zzz-portal'
    plainPortal.innerHTML = '<div role="tooltip">tip</div>'
    try {
      const { unmount } = render(<DialogBand open onOpenChange={() => {}} title="T" />)
      expect(marked).not.toHaveAttribute('inert')
      expect(livePortal).not.toHaveAttribute('inert')
      expect(plainPortal).toHaveAttribute('inert')
      unmount()
      expect(plainPortal).not.toHaveAttribute('inert')
    } finally {
      marked.remove()
      livePortal.remove()
      plainPortal.remove()
    }
  })

  it('keeps the closing band mounted for its exit animation', async () => {
    const { rerender } = render(<DialogBand open onOpenChange={() => {}} title="T" />)
    rerender(<DialogBand open={false} onOpenChange={() => {}} title="T" />)
    const band = document.querySelector('.zzz-dialog-band')
    expect(band).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(document.querySelector('.zzz-dialog-band')).toBeNull())
  })

  it('works uncontrolled (defaultOpen) and ignores Escape when closeOnEscape is false', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<DialogBand defaultOpen title="Stay" closeOnEscape={false} actions={<button>OK</button>} />)
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog', { name: 'Stay' })).toHaveAttribute('data-state', 'open')
    unmount()
    render(<DialogBand defaultOpen title="Go" actions={<button>OK</button>} />)
    await user.keyboard('{Escape}')
    expect(document.querySelector('.zzz-dialog-band')).toHaveAttribute('data-state', 'closed')
  })

  it('renders into a container (position absolute) without locking page scroll', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    render(<DialogBand open onOpenChange={() => {}} title="Inside" container={host} />)
    const layer = host.querySelector('.zzz-overlay')
    expect(layer).toHaveClass('zzz-overlay--contained')
    expect(layer).not.toHaveClass('zzz-theme')
    expect(document.documentElement.style.overflow).toBe('')
    host.remove()
  })
})

describe('ConfirmDialog', () => {
  it('is an alertdialog with Cancel / Confirm; Confirm fires onConfirm and closes', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    render(<ConfirmDialog open onOpenChange={onOpenChange} title="Craft 5 Ether Battery?" onConfirm={onConfirm} />)
    const dialog = screen.getByRole('alertdialog', { name: 'Craft 5 Ether Battery?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const confirm = screen.getByRole('button', { name: 'Confirm' })
    expect(confirm).toHaveFocus()
    expect(confirm).toHaveAttribute('data-icon-tone', 'confirm')
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('data-icon-tone', 'cancel')
    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('Escape and Cancel call onCancel; initialFocus="cancel" focuses Cancel', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ConfirmDialog defaultOpen title="Q" onConfirm={() => {}} onCancel={onCancel} initialFocus="cancel" cancelLabel="No" />)
    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('confirmDisabled disables Confirm and focuses Cancel', () => {
    render(<ConfirmDialog open onOpenChange={() => {}} title="Q" onConfirm={() => {}} confirmDisabled />)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })
})

describe('RewardDialog', () => {
  it('shows "Obtained", the reward tiles and one Confirm that closes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <RewardDialog
        defaultOpen
        onClose={onClose}
        items={[
          { name: 'Ether Battery', count: 5, rarity: 'a' },
          { name: 'Denny', count: 500 },
        ]}
      />,
    )
    expect(screen.getByRole('dialog', { name: 'Obtained' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Ether Battery')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.zzz-dialog-band')).toHaveAttribute('data-state', 'closed')
  })
})

describe('DialogBackdrop', () => {
  it('is decorative and exposes state / pixelate', () => {
    const { container } = render(<DialogBackdrop state="closed" pixelate />)
    const el = container.firstElementChild!
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveAttribute('data-state', 'closed')
    expect(el.querySelector('.zzz-dialog-backdrop__mosaic')).not.toBeNull()
  })
})

describe('scroll lock', () => {
  const root = document.documentElement
  let restoreWidth: () => void
  beforeEach(() => {
    // Simulate a 15 px classic scrollbar: viewport 1024, document 1009.
    const innerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 1009 })
    restoreWidth = () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: innerWidth })
      delete (root as unknown as { clientWidth?: number }).clientWidth
    }
  })
  afterEach(() => restoreWidth())

  it('locks page scrolling while open and reserves the scrollbar width so the page does not shift', () => {
    const { rerender } = render(<DialogBand open title="Title" />)
    expect(root.style.overflow).toBe('hidden')
    const reserved = root.style.scrollbarGutter === 'stable' || document.body.style.paddingRight === '15px'
    expect(reserved).toBe(true)

    rerender(<DialogBand open={false} title="Title" />)
    expect(root.style.overflow).toBe('')
    expect(root.style.scrollbarGutter).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('does not reserve space when the page has no scrollbar', () => {
    Object.defineProperty(root, 'clientWidth', { configurable: true, value: 1024 })
    render(<DialogBand open title="Title" />)
    expect(root.style.overflow).toBe('hidden')
    expect(root.style.scrollbarGutter).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })
})
