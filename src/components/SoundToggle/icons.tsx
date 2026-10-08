import { createIcon } from '../../icons/createIcon';

/*
 * Original speaker glyphs on the 32-unit icon grid (filled, currentColor), drawn in the kit's chunky style:
 * a squared driver + a flared cone, with 0 / 1 / 2 thick sound arcs or an X.
 */
const cone = <path d="M3 11.5h6.2L17 4.6v22.8l-7.8-6.9H3z" />;

const arc1 = <path d="M20.3 10.6a7.6 7.6 0 0 1 0 10.8l-2-2a4.8 4.8 0 0 0 0-6.8z" />;
const arc2 = <path d="M23.6 6.7a13 13 0 0 1 0 18.6l-2.1-2.1a10 10 0 0 0 0-14.4z" />;

/** Speaker with two sound waves (sound on). */
export const SpeakerIcon = createIcon(
  'SpeakerIcon',
  'speaker',
  <>
    {cone}
    {arc1}
    {arc2}
  </>
);

/** Speaker with one sound wave (low volume). */
export const SpeakerLowIcon = createIcon(
  'SpeakerLowIcon',
  'speaker-low',
  <>
    {cone}
    {arc1}
  </>
);

/** Speaker with an X (muted). */
export const SpeakerMutedIcon = createIcon(
  'SpeakerMutedIcon',
  'speaker-muted',
  <>
    {cone}
    <path
      d="M20.2 11.9l2.1-2.1 3.2 3.2 3.2-3.2 2.1 2.1-3.2 3.2 3.2 3.2-2.1 2.1-3.2-3.2-3.2 3.2-2.1-2.1 3.2-3.2z"
      transform="translate(-1 0.9)"
    />
  </>
);
