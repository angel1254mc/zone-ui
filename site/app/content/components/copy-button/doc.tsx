import { CopyButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the idle button above its copied state. */
function Thumbnail() {
  return (
    <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))', justifyItems: 'center' }}>
      <CopyButton text="">Copy link</CopyButton>
      <CopyButton text="" status="copied" copiedLabel="Link copied">
        Copy link
      </CopyButton>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.6,
  usage: (
    <>
      <p>
        Use a copy button next to anything people will paste somewhere else: an invite link, a redemption code, a share
        message. After a click it says Copied with a green check, or Copy failed with a red cross, then goes back to its
        label after two seconds. The pill keeps the width of its longest label, so nothing around it moves.
      </p>
      <p>
        Pass <code>getText</code> when the text depends on the current state: it is read at click time and may be async.
        For any other action, use Button.
      </p>
    </>
  ),
  usageCode: `import { CopyButton } from '@angel1254mc/zone-ui';

<CopyButton text="https://example.com/invite/7HQ2" />`,
  examples: [
    {
      demo: 'share-results',
      title: 'Share results',
      description: 'getText builds the share message when the button is clicked, so it always matches the result.',
    },
    {
      demo: 'invite-field',
      title: 'Next to a field',
      description: 'A read-only field shows the link, and onCopy runs after each successful copy.',
    },
    {
      demo: 'states',
      title: 'States',
      description:
        'Idle, copied and failed, forced with status, and a button whose copy always fails so you can try it.',
    },
  ],
  notes: [
    {
      title: 'Clipboard',
      items: [
        <>
          It tries the Clipboard API first and falls back to a hidden text area for older browsers and insecure pages.
        </>,
        <>
          When both fail it shows the failed state and calls <code>onError</code>. A <code>getText</code> that throws or
          rejects counts as a failure too.
        </>,
        <>The result is announced to screen readers through a polite status region next to the button.</>,
      ],
    },
    {
      title: 'Status',
      items: [
        <>
          <code>status</code> controls the look from outside, and <code>onStatusChange</code> reports every change,
          including the return to idle.
        </>,
        <>
          <code>resetAfter</code> sets how long Copied or Copy failed stays, in milliseconds.
        </>,
      ],
    },
  ],
  related: ['button', 'text-field', 'toast'],
};

export default doc;
