import {
  Button,
  CheckIcon,
  CloseIcon,
  DialogBackdrop,
  GraffitiLayer,
  HatchBackground,
  RewardTile,
  RewardTileGroup,
  Text,
} from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: the band laid out inline over a striped page, built from the band's own classes and
 * the public DialogBackdrop. The real dialog portals and traps focus, so it never renders in a card.
 */
function Thumbnail() {
  return (
    <div style={{ position: 'relative', width: u(660), height: u(480), overflow: 'hidden', borderRadius: 12 }}>
      <HatchBackground />
      <DialogBackdrop />
      <div className="zzz-dialog-band" style={{ animation: 'none' }}>
        <div className="zzz-dialog-band__fill">
          <GraffitiLayer variant="dialog" className="zzz-dialog-band__watermark" />
        </div>
        <div className="zzz-dialog-band__content" style={{ animation: 'none' }}>
          <Text role="title" className="zzz-dialog-band__title">
            Craft 5 Ether Battery?
          </Text>
          <div className="zzz-dialog-band__body">
            <RewardTileGroup>
              <RewardTile name="Battery Charge" count={300} rarity="a" />
              <RewardTile name="Denny" count={500} rarity="b" />
            </RewardTileGroup>
          </div>
        </div>
        <div className="zzz-dialog-band__actions" style={{ animation: 'none' }}>
          <Button width="dialog" icon={<CloseIcon />} iconTone="cancel" pressOutset={0}>
            Cancel
          </Button>
          <Button width="dialog" icon={<CheckIcon />} iconTone="confirm" pressOutset={0}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.38,
  usage: (
    <>
      <p>
        Use the confirm dialog on game-style screens to ask before an action that spends something or can't be undone:
        crafting, recycling, leaving a run. A black band crosses the whole screen with the question, optional content
        such as the materials to spend, and Cancel and Confirm on its bottom edge. After the action, show what the
        player got with <code>RewardDialog</code>.
      </p>
      <p>
        Build other bands with <code>DialogBand</code>, which takes any content and any buttons. On a website, use a
        Modal instead.
      </p>
    </>
  ),
  usageCode: `import { ConfirmDialog } from '@angel1254mc/zone-ui';

<ConfirmDialog
  title="Recycle 3 W-Engines?"
  open={open}
  onOpenChange={setOpen}
  onConfirm={recycle}
/>`,
  examples: [
    {
      demo: 'leave-run',
      title: 'Confirm before leaving',
      description: 'A title-only band with its own labels. Focus starts on Stay, so a stray Enter keeps the run.',
    },
    {
      demo: 'claim-reward',
      title: 'Show what was obtained',
      description: 'RewardDialog lays out the rewards under "Obtained" with a single Confirm.',
    },
    {
      demo: 'notice-band',
      title: 'A notice with one button',
      description: 'DialogBand takes any content and any buttons in the actions row.',
    },
    {
      demo: 'inside-a-stage',
      title: 'Inside a Stage',
      description: 'Pass container and the band fills that element instead of the window.',
      frame: 'bleed',
    },
  ],
  notes: [
    {
      title: 'Focus and keyboard',
      items: [
        <>
          Focus moves into the band on open and Tab stays inside it. Confirm takes focus, or Cancel with{' '}
          <code className="d-inline-code">initialFocus=&quot;cancel&quot;</code> or{' '}
          <code className="d-inline-code">confirmDisabled</code>.
        </>,
        <>
          <kbd>Esc</kbd> cancels. Turn it off with{' '}
          <code className="d-inline-code">closeOnEscape=&#123;false&#125;</code>.
        </>,
        <>Focus returns to the button that opened the dialog.</>,
      ],
    },
    {
      title: 'Portals and stacking',
      items: [
        <>
          The band renders in a fixed layer on <code className="d-inline-code">&lt;body&gt;</code>. Everything else on
          the page becomes inert and stops scrolling while it is open.
        </>,
        <>
          With <code className="d-inline-code">container</code> it renders inside that element instead, and only that
          element&apos;s content becomes inert.
        </>,
        <>A dialog opened over a Drawer traps focus by itself and closes first.</>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>The band fades in and out without the pop, the flash or the pixelated freeze.</>],
    },
  ],
  related: ['modal', 'reward-tile', 'drawer'],
};

export default doc;
