import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  color: 'var(--zzz-color-text-muted)',
  fontSize: gpx(14),
  lineHeight: 1.2,
};

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(10),
        alignItems: 'flex-start',
      }}
    >
      {children}
      <span style={caption}>{label}</span>
    </div>
  );
}

const meta = {
  title: 'Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Transient message pills (`ToastProvider` + `useToast`).',
      },
    },
  },
  args: { children: 'Settings saved', variant: 'info' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: gpx(24) }}>
      <Cell label="info">
        <Toast variant="info" animate={false}>
          New event: Their Secret Histories
        </Toast>
      </Cell>
      <Cell label="success">
        <Toast variant="success" animate={false}>
          Redemption code accepted
        </Toast>
      </Cell>
      <Cell label="error">
        <Toast variant="error" animate={false}>
          Insufficient Dennies
        </Toast>
      </Cell>
      <Cell label="dismissible">
        <Toast variant="info" animate={false} onDismiss={() => {}}>
          Newsletter subscription confirmed
        </Toast>
      </Cell>
      <Cell label="no disc (icon=null)">
        <Toast icon={null} animate={false}>
          Plain hint pill
        </Toast>
      </Cell>
    </div>
  ),
};

function Demo() {
  const { toast, dismiss } = useToast();
  const n = useRef(0);
  return (
    <div
      style={{
        display: 'flex',
        gap: gpx(20),
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <Button width="compact" onClick={() => toast(`Hint #${++n.current}: tap an Agent to view details`)}>
        Info
      </Button>
      <Button width="compact" iconTone="confirm" onClick={() => toast({ message: 'Build saved', variant: 'success' })}>
        Success
      </Button>
      <Button
        width="compact"
        iconTone="cancel"
        onClick={() => toast({ message: 'Insufficient Dennies', variant: 'error' })}
      >
        Error
      </Button>
      <Button width="compact" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

/** Click the buttons: toasts queue at the top centre (max 3) and auto-dismiss after 4 s. */
export const WithProvider: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  render: () => (
    <ToastProvider>
      <div
        style={{
          minHeight: gpx(600),
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Demo />
      </div>
    </ToastProvider>
  ),
};

function Fire({ items }: { items: Parameters<ReturnType<typeof useToast>['toast']>[0][] }) {
  const { toast } = useToast();
  useEffect(() => {
    items.forEach((i) => toast(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Four toasts fired on mount, `max` 3: the fourth waits in the queue. Sticky (duration 0) for inspection. */
export const Queue: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 260 } },
  },
  render: () => (
    <ToastProvider duration={0}>
      <Fire
        items={[
          { message: 'New event: Their Secret Histories', id: 'q1' },
          { message: 'Build saved', variant: 'success', id: 'q2' },
          {
            message: 'Insufficient Dennies',
            variant: 'error',
            id: 'q3',
          },
          { message: 'Queued (4th)', id: 'q4' },
        ]}
      />
      <div style={{ minHeight: gpx(400) }} />
    </ToastProvider>
  ),
};
