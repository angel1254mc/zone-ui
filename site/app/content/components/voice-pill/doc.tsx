import { VoicePill } from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

/** Gallery preview: a pill partway through playback, set through props (nothing plays in the card). */
function Thumbnail() {
  return <VoicePill name="Mira Kessler" playing progress={0.6} />;
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.62,
  usage: (
    <>
      <p>
        A voice pill plays a short audio clip, like a character's voice line, and names the voice actor after "CV:". The
        round button toggles playing, and the mic glyph fills from the bottom as <code>progress</code> goes from 0 to 1.
      </p>
      <p>
        It plays no audio itself: connect <code>playing</code> and <code>progress</code> to your audio element. For a
        site-wide mute control, use Sound Toggle.
      </p>
    </>
  ),
  usageCode: `import { VoicePill } from '@angel1254mc/zone-ui';

<VoicePill
  name="Mira Kessler"
  playing={playing}
  progress={progress}
  onPlayingChange={setPlaying}
/>`,
  examples: [
    {
      demo: 'with-playback',
      title: 'With playback',
      description: 'Controlled playing and progress: press play and the glyph fills over a four-second clip.',
    },
    {
      demo: 'tones-and-skins',
      title: 'Tones and skins',
      description:
        'The web and game skins on the dark pill, and the light pill with a language switch in its trailing slot.',
      frame: 'start',
    },
  ],
  notes: [
    {
      title: 'Accessibility',
      items: [
        <>
          The play button is a toggle button (<code>aria-pressed</code>) named by <code>playLabel</code>, "Play voice
          sample" by default.
        </>,
        <>
          With <code>progress</code>, a hidden progress bar named by <code>progressLabel</code> reports how far the clip
          has played.
        </>,
      ],
    },
    {
      title: 'Skins',
      items: [
        <>
          <code>web</code> fills the glyph with a fixed lime. <code>game</code> uses the theme accent, which pulses.
        </>,
      ],
    },
  ],
  related: ['sound-toggle', 'info-pill', 'split-pill'],
};

export default doc;
