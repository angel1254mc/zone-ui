import { Button, InlineError, Notice } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/**
 * Gallery preview: a notice pill on a light backdrop (its fill is translucent black, so it needs one),
 * above a greyed Craft button with the red reason under it.
 */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(28 * var(--zzz-px))', justifyItems: 'center' }}>
      <div
        style={{
          padding: 'calc(18 * var(--zzz-px)) calc(28 * var(--zzz-px))',
          borderRadius: 'calc(16 * var(--zzz-px))',
          background: 'linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)',
        }}
      >
        <Notice>'Unlock Early' has been unlocked</Notice>
      </div>
      <div style={{ display: 'grid', gap: 'calc(12 * var(--zzz-px))', justifyItems: 'center' }}>
        <Button width="wide" aria-disabled>
          Craft
        </Button>
        <InlineError>Insufficient crafting materials</InlineError>
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.5,
  usage: (
    <>
      <p>
        <code>InlineError</code> is a short red line that says why an action is unavailable or why it failed. Place it
        under the control it explains. For a message about one form field, use the <code>error</code> prop of Text field
        instead.
      </p>
      <p>
        <code>Notice</code> is a translucent pill for a short status over art, such as "Unlock Early has been unlocked".
        For a message that pops up and disappears on its own, use Toast.
      </p>
    </>
  ),
  usageCode: `import { Button, InlineError } from '@angel1254mc/zone-ui';

<Button aria-disabled aria-describedby="craft-error">Craft</Button>
<InlineError id="craft-error">Insufficient crafting materials</InlineError>`,
  examples: [
    {
      demo: 'after-an-action',
      title: 'After an action',
      description: 'When the error follows something the user did, pass alert so screen readers announce it.',
    },
    {
      demo: 'notice',
      title: 'Notice',
      description: 'A status pill with the default info glyph, a custom glyph, and none.',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          Without <code>alert</code>, the message is plain text. Point the disabled control at it with{' '}
          <code>aria-describedby</code> so it is read with the control.
        </>,
        <>
          <code>alert</code> adds <code>role="alert"</code> and the message is announced at once. Use it only for
          messages that appear because of a user action.
        </>,
        <>
          <code>Notice</code> has <code>role="status"</code>, so changes are announced politely. Its glyph is
          decorative.
        </>,
      ],
    },
    {
      title: 'Notice glyph',
      items: [
        <>
          The default glyph is <code>InfoAlertIcon</code>. Pass any icon to <code>icon</code>, or{' '}
          <code>icon={'{null}'}</code> for text only.
        </>,
        <>The fill is half-transparent black, so place the notice over art or a light surface.</>,
      ],
    },
  ],
  related: ['text-field', 'toast', 'button'],
};

export default doc;
