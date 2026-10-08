import { Button, CheckIcon, CloseIcon, IconButton } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: the panel laid out inline on the striped backdrop, built from the modal's own classes.
 * The real modal portals to <body> and traps focus, so it never renders in a card.
 */
function Thumbnail() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        width: u(560),
        height: u(400),
        borderRadius: 12,
        background:
          'repeating-linear-gradient(var(--zzz-skew-hatch), transparent 0 calc(5 * var(--zzz-px)), rgb(255 255 255 / 0.07) calc(5 * var(--zzz-px)) calc(10 * var(--zzz-px))), #111',
      }}
    >
      <div className="zzz-modal" style={{ animation: 'none' }}>
        <div className="zzz-modal__header">
          <div className="zzz-modal__title">Reset build?</div>
          <p className="zzz-modal__description">Levels and skills return to their defaults.</p>
        </div>
        <div className="zzz-modal__body">
          <p style={{ margin: 0 }}>This can&apos;t be undone.</p>
          <div className="zzz-modal__footer">
            <Button icon={<CloseIcon />} iconTone="cancel">
              Cancel
            </Button>
            <Button icon={<CheckIcon />} iconTone="confirm">
              Reset
            </Button>
          </div>
        </div>
        <IconButton className="zzz-modal__close" size="stepper" icon={<CloseIcon />} label="Close" />
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.42,
  usage: (
    <>
      <p>
        Use a modal on websites for a short question or a small form that needs an answer before people go on: confirm a
        reset, sign up for a newsletter, sign in again. It is a centred panel with a title, an optional description,
        your content and actions in the footer.
      </p>
      <p>
        On game-style screens, ask with a Confirm Dialog instead. For longer content that people adjust while they look
        at the page, such as filters, use a Drawer.
      </p>
    </>
  ),
  usageCode: `import { Button, Modal } from '@angel1254mc/zone-ui';

<Modal title="Patch notes" trigger={<Button>What's new</Button>}>
  New stages and a fresh leaderboard every week.
</Modal>`,
  examples: [
    {
      demo: 'newsletter-form',
      title: 'A form in a modal',
      description: 'Control open yourself and close the modal when the form submits.',
    },
    {
      demo: 'session-alert',
      title: 'An alert that needs an answer',
      description: 'With alert, hideClose and closeOnBackdrop={false} the only way out is the action.',
    },
  ],
  notes: [
    {
      title: 'Focus and keyboard',
      items: [
        <>
          Focus moves to the first field or button in the body, or to{' '}
          <code className="d-inline-code">initialFocus</code>. Tab stays inside the panel.
        </>,
        <>
          <kbd>Esc</kbd> and a click on the backdrop close it, unless{' '}
          <code className="d-inline-code">closeOnEscape</code> or <code className="d-inline-code">closeOnBackdrop</code>{' '}
          is false.
        </>,
        <>Focus returns to the trigger, or to whatever opened it.</>,
      ],
    },
    {
      title: 'Opening it',
      items: [
        <>
          Pass one button as <code className="d-inline-code">trigger</code> and the modal opens itself. Add{' '}
          <code className="d-inline-code">open</code> and <code className="d-inline-code">onOpenChange</code> when your
          own buttons need to close it.
        </>,
      ],
    },
    {
      title: 'Portals and stacking',
      items: [
        <>
          The modal renders in a fixed layer on <code className="d-inline-code">&lt;body&gt;</code>. The rest of the
          page becomes inert and stops scrolling while it is open.
        </>,
      ],
    },
  ],
  related: ['confirm-dialog', 'drawer', 'button'],
};

export default doc;
