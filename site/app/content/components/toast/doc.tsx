import { Toast } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: two toasts, one for information and one for success. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(12 * var(--zzz-px))', justifyItems: 'start' }}>
      <Toast variant="info" animate={false}>
        New event: Their Secret Histories
      </Toast>
      <Toast variant="success" animate={false}>
        Build saved
      </Toast>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.8,
  usage: (
    <>
      <p>
        Toasts show a short message that confirms an action or reports a problem, then go away on their own. Use them
        for results that do not need a decision, such as a saved setting or a copied link.
      </p>
      <p>
        When the reader must answer before going on, use Confirm dialog. For a message next to a field, use Inline
        error.
      </p>
    </>
  ),
  usageCode: `import { ToastProvider, useToast } from '@angel1254mc/zone-ui';

// Wrap the app once, then call the hook in any child.
<ToastProvider>
  <App />
</ToastProvider>

const { toast } = useToast();
toast({ message: 'Settings saved', variant: 'success' });`,
  examples: [
    {
      demo: 'variants',
      title: 'Variants',
      description: 'Pass a variant to show information, success or an error. Each toast leaves after a few seconds.',
    },
    {
      demo: 'copied',
      title: 'After an action',
      description: 'Fire a success toast once the copy finishes so the reader knows it worked.',
    },
    {
      demo: 'sticky',
      title: 'Stays until dismissed',
      description: 'A duration of 0 keeps the toast on screen until the reader closes it or it is cleared.',
    },
  ],
  types: [
    {
      name: 'ToastOptions',
      rows: [
        { name: 'message', type: 'ReactNode', required: true, description: 'The text or node shown in the toast.' },
        { name: 'variant', type: 'info | success | error', description: 'Picks the icon and colour. Default `info`.' },
        {
          name: 'duration',
          type: 'number',
          description: 'Time in milliseconds before it leaves. `0` keeps it until dismissed. Defaults to the provider.',
        },
        { name: 'dismissible', type: 'boolean', description: 'Shows a close button. Default true.' },
        { name: 'icon', type: 'ReactNode', description: 'A custom glyph. `null` hides the icon.' },
        { name: 'id', type: 'string', description: 'Reuse an id to replace a toast instead of adding a new one.' },
      ],
    },
  ],
  notes: [
    {
      title: 'Behaviour',
      items: [
        <>
          <code>ToastProvider</code> holds the queue and shows up to three toasts at once. Put it high in the tree, so
          every screen can call <code>useToast</code>.
        </>,
        <>
          <code>dismiss()</code> clears all toasts, and <code>dismiss(id)</code> clears one.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>Information and success toasts are announced politely. Error toasts are announced as alerts.</>,
        <>Each toast with a close button has a Dismiss button. Keep the message short enough to read in one pass.</>,
      ],
    },
  ],
  related: ['button', 'confirm-dialog', 'inline-error'],
};

export default doc;
