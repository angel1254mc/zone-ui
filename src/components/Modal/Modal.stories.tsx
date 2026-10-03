import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'
import { CheckIcon, CloseIcon } from '../../icons'

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 640 },
      description: {
        component: [
          'A centred modal panel for web pages. In full-screen game-style layouts use `DialogBand` (the Confirm / Obtained band).',
          '',
          '- 450 wide, asymmetric radius `20 0 20 20` (top-right square), 3 px black border + 3 px `rgba(66,66,66,.66)` outline, `linear-gradient(170deg, #222, #000 80%)` under a rhombus grid.',
          '- Header min 60 on `linear-gradient(#1C1C1C, #080808)`, title `color.text.title`; optional description (the dialog\'s description). Footer actions right-aligned; close button (`IconButton` stepper) in the square corner.',
          '- Backdrop: light scrim + 39.8° stripes + 4 px blur. `role="dialog"` (or `alertdialog`) + `aria-modal`; focus moves in, Tab is trapped, Escape / backdrop / close button close, focus returns to the opener; page scroll is locked.',
        ].join('\n'),
      },
    },
  },
  args: { title: 'Reset build?' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const page: CSSProperties = { minHeight: gpx(640), display: 'grid', placeItems: 'center' }

/** Uncontrolled: the trigger opens it. */
export const Default: Story = {
  render: (args) => (
    <div style={page}>
      <Modal
        {...args}
        trigger={<Button width="compact">Open modal</Button>}
        description="Levels, skills and equipment of this plan return to their defaults."
        footer={
          <>
            <Button icon={<CloseIcon />} iconTone="cancel">
              Cancel
            </Button>
            <Button icon={<CheckIcon />} iconTone="confirm">
              Confirm
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>This cannot be undone.</p>
      </Modal>
    </div>
  ),
}

/** Forced open for inspection. */
export const Open: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true)
    return (
      <div style={page}>
        <Button width="compact" onClick={() => setOpen(true)}>
          Reopen
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Newsletter"
          description="Inter-Knot Dispatch, every Thursday."
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Later</Button>
              <Button icon={<CheckIcon />} iconTone="confirm" onClick={() => setOpen(false)}>
                Subscribe
              </Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            Get patch notes, event schedules and Signal Search banners from New Eridu straight to your inbox.
          </p>
        </Modal>
      </div>
    )
  },
}

export const AlertDialog: Story = {
  render: () => (
    <div style={page}>
      <Modal
        alert
        defaultOpen
        hideClose
        closeOnBackdrop={false}
        title="Session expired"
        footer={
          <Button icon={<CheckIcon />} iconTone="confirm">
            Sign in again
          </Button>
        }
      >
        <p style={{ margin: 0 }}>Please sign in to keep planning your builds.</p>
      </Modal>
    </div>
  ),
}
