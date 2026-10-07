/**
 * Currency and resource art: simplified flat originals. No tokens exist for
 * these colours.
 */
import { createIcon } from './createIcon';
import { circle, ellipse, join, poly, rect } from './geometry';
import { sparkle } from './actions';

/** Stamina battery: a tilted blue cylinder with a light cap and a yellow bolt. */
export const BatteryIcon = createIcon('BatteryIcon', 'battery', (uid) => (
  <>
    <defs>
      <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4792DF" />
        <stop offset="0.62" stopColor="#4792DF" />
        <stop offset="1" stopColor="#2F5EA8" />
      </linearGradient>
    </defs>
    <g transform="rotate(20 16 16)">
      <path fill="#303D54" d="M7.6 8.6 V26.4 A8.4 3.6 0 0 0 24.4 26.4 V8.6 Z" />
      <path fill={`url(#${uid}-body)`} d="M8.9 9 V26.1 A7.1 2.6 0 0 0 23.1 26.1 V9 Z" />
      <path fill="#303D54" d={ellipse(16, 8.6, 8.4, 3.6)} />
      <path fill="#A2CBE7" d={ellipse(16, 8.6, 7.1, 2.6)} />
      <path fill="#303D54" d={join(rect(12.3, 3.2, 7.4, 5.2, 1.2))} />
      <path fill="#A2CBE7" d={join(rect(13.3, 4.1, 5.4, 3.8, 0.8))} />
      <path
        fill="#EBBC1F"
        d={poly(
          [
            [17.9, 12.2],
            [12.4, 19.8],
            [15.7, 19.8],
            [14.1, 26.6],
            [20, 17.8],
            [16.8, 17.8],
            [18.9, 12.2],
          ],
          0.3
        )}
      />
    </g>
  </>
));

/** Denny: a silver coin at a slight angle, thick rim, embossed 4-point star. */
export const DennyIcon = createIcon('DennyIcon', 'denny', (uid) => (
  <>
    <defs>
      <linearGradient id={`${uid}-face`} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#EDF0F6" />
        <stop offset="1" stopColor="#D8DBE7" />
      </linearGradient>
    </defs>
    <path fill="#4E556E" d={ellipse(17.4, 16, 14.2, 16)} />
    <path fill="#80879E" d={ellipse(16.9, 16, 13.4, 15.1)} />
    <path fill="#AFB4CB" d={ellipse(15.6, 16, 13.2, 15.1)} />
    <path fill={`url(#${uid}-face)`} d={ellipse(15.6, 16, 10, 11.8)} />
    <path fill="#80879E" d={sparkle(16.2, 16.6, 8.4, 0.2)} />
    <path fill="#FFFFFF" d={sparkle(15.4, 15.8, 8, 0.2)} />
  </>
));

/** Polychrome: a film card tilted ~−10°, rainbow holographic face, two punched holes on the left. */
export const PolychromeIcon = createIcon('PolychromeIcon', 'polychrome', (uid) => (
  <>
    <defs>
      <linearGradient id={`${uid}-holo`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#56E4F6" />
        <stop offset="0.35" stopColor="#F65FAA" />
        <stop offset="0.7" stopColor="#EFCA73" />
        <stop offset="1" stopColor="#5677D9" />
      </linearGradient>
      <linearGradient id={`${uid}-frame`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#C1BECF" />
        <stop offset="1" stopColor="#A09BAA" />
      </linearGradient>
    </defs>
    <g transform="rotate(-10 16 16)">
      <path fill="#494851" d={rect(4.2, 1.2, 23.6, 29.6, 3)} />
      <path
        fill={`url(#${uid}-frame)`}
        fillRule="evenodd"
        d={join(rect(5.2, 2.2, 21.6, 27.6, 2.2), rect(7.3, 5.4, 2.4, 2.4, 0.5), rect(7.3, 10.2, 2.4, 2.4, 0.5))}
      />
      <path fill="#76737E" d={rect(11.2, 4.4, 13.6, 23.2, 1.6)} />
      <path fill={`url(#${uid}-holo)`} d={rect(12, 5.2, 12, 21.6, 1.2)} />
    </g>
  </>
));

/** Flat front-view Denny coin for the CurrencyActionBar (34 px). */
export const CoinSmallIcon = createIcon('CoinSmallIcon', 'coinSmall', (uid) => (
  <>
    <defs>
      <linearGradient id={`${uid}-face`} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#EDF0F6" />
        <stop offset="1" stopColor="#D8DBE7" />
      </linearGradient>
    </defs>
    <path fill="#4E556E" d={circle(16, 16, 16)} />
    <path fill="#AFB4CB" d={circle(16, 16, 14.6)} />
    <path fill={`url(#${uid}-face)`} d={circle(16, 16, 11.4)} />
    <path fill="#80879E" d={sparkle(16.6, 16.6, 8.6, 0.2)} />
    <path fill="#FFFFFF" d={sparkle(16, 16, 8.2, 0.2)} />
  </>
));
