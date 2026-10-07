/**
 * Specialty glyphs. Monochrome (currentColor): grey
 * `color.icon.specialty` (#939293) on item cards, #8B8B8B inline in text.
 */
import { createIcon } from './createIcon';
import { circle, join, poly, rect } from './geometry';
import { crossPoints } from './actions';

/**
 * A heavy rounded block with two crossed blades: the inner field is knocked out
 * except for a thick X (the blades) and two crossguards near the lower hilts.
 * Sized for item cards at 22 × 18.
 */
export const AttackIcon = createIcon('AttackIcon', 'attack', (uid) => (
  <>
    <defs>
      <mask id={`${uid}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
        <rect x="0" y="0" width="32" height="32" fill="#fff" />
        <path d={rect(3.6, 6.4, 24.8, 19.2, 1.6)} fill="#000" />
        <path d="M5.2 7.6 L26.8 24.4 M26.8 7.6 L5.2 24.4" stroke="#fff" strokeWidth="5.2" strokeLinecap="butt" />
        <path d="M5.6 17.6 L12.2 24.8 M26.4 17.6 L19.8 24.8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </mask>
    </defs>
    <path mask={`url(#${uid}-m)`} d={rect(0, 3, 32, 26, 4.4)} />
  </>
));

/** A ring enclosing a flat-topped peak ("A") with a split base (~30 px on a pill). */
export const RuptureIcon = createIcon(
  'RuptureIcon',
  'rupture',
  <>
    <path fillRule="evenodd" d={join(circle(16, 16, 16), circle(16, 16, 12.9))} />
    <path
      d={poly(
        [
          [14.4, 4.8],
          [17.6, 4.8],
          [26.2, 22.4],
          [22.1, 24.6],
          [16, 13.4],
          [9.9, 24.6],
          [5.8, 22.4],
        ],
        [0.8, 0.8, 1, 0.8, 0.8, 0.8, 1]
      )}
    />
    <path
      d={poly(
        [
          [16, 17.6],
          [20.4, 25.6],
          [16, 28.4],
          [11.6, 25.6],
        ],
        [0.6, 0.8, 0.8, 0.8]
      )}
    />
  </>
);

/** A hammer, tilted. */
export const StunIcon = createIcon(
  'StunIcon',
  'stun',
  <g transform="rotate(-38 16 16)">
    <path fillRule="evenodd" d={join(rect(4.6, 2.2, 22.8, 11.2, 2.4), rect(8.2, 6.9, 15.6, 1.8, 0.9))} />
    <path d={rect(13.4, 12.4, 5.2, 18.6, 1.8)} />
  </g>
);

/** Three swirling droplets in a triangle. */
export const AnomalyIcon = createIcon(
  'AnomalyIcon',
  'anomaly',
  <>
    {[0, 120, 240].map((a) => (
      <path
        key={a}
        transform={`rotate(${a} 16 16) translate(16 9.2)`}
        d="M1.8 -8.6 C3 -5.2 5.2 -2.8 5.2 0.6 A5.2 5.2 0 0 1 -5.2 0.6 C-5.2 -3.6 -1.6 -5.8 1.8 -8.6 Z"
      />
    ))}
  </>
);

const SHIELD_ROUND = 'M16 0 L30 4.6 V14.6 C30 23 23.6 28.8 16 32 C8.4 28.8 2 23 2 14.6 V4.6 Z';

/** A shield with a plus knocked out. */
export const SupportIcon = createIcon(
  'SupportIcon',
  'support',
  <path fillRule="evenodd" d={join(SHIELD_ROUND, poly(crossPoints(16, 14.8, 7.4, 2.5), 0.4))} />
);

/** A heater shield with a border and a vertical ridge. */
export const DefenseIcon = createIcon(
  'DefenseIcon',
  'defense',
  <path
    fillRule="evenodd"
    d={join(
      'M2 1 H30 V13.4 C30 22.2 24 28.4 16 32 C8 28.4 2 22.2 2 13.4 Z',
      'M4.6 3.6 H27.4 V13.4 C27.4 20.6 22.6 25.8 16 29 C9.4 25.8 4.6 20.6 4.6 13.4 Z',
      'M6.6 5.6 H14.9 V26.2 C10 23.4 6.6 19 6.6 13.4 Z',
      'M17.1 5.6 H25.4 V13.4 C25.4 19 22 23.4 17.1 26.2 Z'
    )}
  />
);

/** A spanner crossed over an armour plate. */
export const ArmorerIcon = createIcon('ArmorerIcon', 'armorer', (uid) => {
  const spannerHandle = poly(
    [
      [3.2, 25.6],
      [19.4, 9.4],
      [22.6, 12.6],
      [6.4, 28.8],
    ],
    1.4
  );
  const head = circle(23.8, 8.2, 7.4);
  const jaw = poly(
    [
      [22.1, 6.5],
      [28.4, 0.2],
      [31.8, 3.6],
      [25.5, 9.9],
    ],
    0.6
  );
  return (
    <>
      <defs>
        <mask id={`${uid}-plate`} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <path d={join(spannerHandle, head)} fill="#000" stroke="#000" strokeWidth="3.4" strokeLinejoin="round" />
        </mask>
        <mask id={`${uid}-jaw`} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
          <rect width="32" height="32" fill="#fff" />
          <path d={jaw} fill="#000" />
        </mask>
      </defs>
      <path
        mask={`url(#${uid}-plate)`}
        fillRule="evenodd"
        d={join(rect(0.8, 3.4, 20.6, 20.6, 3), circle(5.6, 8.2, 1.3), circle(16.6, 19.2, 1.3), circle(5.6, 19.2, 1.3))}
      />
      <g mask={`url(#${uid}-jaw)`}>
        <path d={spannerHandle} />
        <path d={head} />
      </g>
    </>
  );
});
