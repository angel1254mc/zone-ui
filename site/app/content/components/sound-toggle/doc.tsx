import { SoundToggle } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: the toggle with the volume slider beside it. */
function Thumbnail() {
  return <SoundToggle volumeControl="inline" defaultVolume={0.6} />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.7,
  usage: (
    <>
      <p>
        Sound toggle is a mute button for game or app audio, with an optional volume slider. Use it in a settings bar or
        a header. The mute button is a toggle, so it reports whether sound is off.
      </p>
      <p>
        It plays no audio. Wire <code>muted</code> and <code>volume</code> to your audio layer. For a plain on or off
        setting in a form, use Switch instead.
      </p>
    </>
  ),
  usageCode: `import { SoundToggle } from '@angel1254mc/zone-ui';

<SoundToggle
  volumeControl="inline"
  muted={muted}
  onMutedChange={setMuted}
  volume={volume}
  onVolumeChange={setVolume}
/>`,
  examples: [
    {
      demo: 'muted-by-default',
      title: 'Muted by default',
      description: 'Start muted with controlled state, and read the value back to match your audio layer.',
    },
    {
      demo: 'popover-volume',
      title: 'Volume in a popover',
      description:
        'With volumeControl popover, the slider opens when the reader hovers, focuses or long-presses the button.',
    },
  ],
  notes: [
    {
      title: 'Keyboard',
      items: [
        <>
          The mute button is one tab stop. <kbd>Space</kbd> or <kbd>Enter</kbd> toggles it.
        </>,
        <>
          In the popover layout, focus on the button opens the volume. <kbd>Escape</kbd> closes it, and the slider then
          takes the usual slider keys.
        </>,
      ],
    },
    {
      title: 'Accessibility',
      items: [
        <>
          The button is named Mute by default and reports itself as pressed while muted. Use <code>label</code> to name
          it for your app.
        </>,
        <>
          The slider is named Volume and reads its percentage. Use <code>volumeLabel</code> to change the name.
        </>,
      ],
    },
    {
      title: 'Muting and volume',
      items: [<>Mute and volume are separate values. Moving the slider while muted turns sound back on.</>],
    },
  ],
  related: ['slider', 'icon-button', 'switch'],
};

export default doc;
