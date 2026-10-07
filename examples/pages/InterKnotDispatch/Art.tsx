/**
 * Original page art for "Inter-Knot Dispatch" (no game or brand assets): the site wordmark,
 * the play / download glyphs and generic social glyphs. All decorative (aria-hidden); the
 * accessible names live on the controls that host them.
 */
import type { CSSProperties, ReactNode, SVGProps } from 'react';
import {
  AnomalyIcon,
  AttackIcon,
  ElectricIcon,
  FireIcon,
  GoldDiamondIcon,
  HexStarIcon,
  RuptureIcon,
  SnowflakeIcon,
  StarSparkIcon,
  StunIcon,
  SupportIcon,
  DefenseIcon,
  SwirlIcon,
} from '@angel1254mc/zone-ui';
import { GameIcon } from '../../art';

const svgBase = { 'aria-hidden': true, focusable: false } as const;

/** Knot emblem: two interlocked slanted rings. */
export function KnotEmblem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...svgBase} {...props}>
      <rect x="3" y="3" width="42" height="42" rx="12" fill="#000" stroke="currentColor" strokeWidth="4" />
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        <ellipse cx="19" cy="24" rx="9" ry="12" transform="rotate(-16 19 24)" stroke="var(--zzz-accent)" />
        <ellipse cx="29" cy="24" rx="9" ry="12" transform="rotate(-16 29 24)" stroke="#fff" />
        {/* re-draw the lower-left arc of the accent ring over the white one: the interlock */}
        <path d="M14.2 33.5a9 12 -16 0 1 -3.4 -6.9" stroke="var(--zzz-accent)" />
      </g>
    </svg>
  );
}

/** Site logo: emblem + two-line wordmark (live text, so it uses the kit faces). */
export function DispatchLogo({ className }: { className?: string }) {
  return (
    <span className={['ikd-logo', className].filter(Boolean).join(' ')}>
      <KnotEmblem className="ikd-logo__emblem" />
      <span className="ikd-logo__text">
        <span className="ikd-logo__top">Inter-Knot</span>
        <span className="ikd-logo__bottom zzz-italic">Dispatch</span>
      </span>
    </span>
  );
}

/** Play triangle (Trailer button cap). */
export function PlayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...svgBase} {...props}>
      <path
        d="M8 4.8v14.4a1.2 1.2 0 0 0 1.8 1l11-7.2a1.2 1.2 0 0 0 0-2l-11-7.2A1.2 1.2 0 0 0 8 4.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Download arrow into a tray. */
export function DownloadGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...svgBase} {...props}>
      <path
        d="M12 3v11m-5-5 5 5 5-5M4 16v3.5h16V16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Envelope (newsletter field cap). */
export function MailGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...svgBase} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
    </svg>
  );
}

/* Generic social glyphs (not brand logos). */
export const SocialVideo = () => (
  <svg viewBox="0 0 24 24" {...svgBase}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" fill="currentColor" />
    <path d="m10 9 5.5 3-5.5 3Z" fill="#000" />
  </svg>
);
export const SocialChat = () => (
  <svg viewBox="0 0 24 24" {...svgBase}>
    <path
      d="M4 5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17h-9l-5 4v-4H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 5Z"
      fill="currentColor"
    />
  </svg>
);
export const SocialPhoto = () => (
  <svg viewBox="0 0 24 24" {...svgBase}>
    <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.6" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.6" />
    <circle cx="17.3" cy="6.7" r="1.4" fill="currentColor" />
  </svg>
);
export const SocialFeed = () => (
  <svg viewBox="0 0 24 24" {...svgBase}>
    <circle cx="6" cy="18" r="2.4" fill="currentColor" />
    <path
      d="M4 10.5a9.5 9.5 0 0 1 9.5 9.5M4 4a16 16 0 0 1 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
);

/* Element / specialty glyphs: the game icon (real art); our src/icons glyph only when that icon is missing. */
const fill: CSSProperties = { width: '100%', height: '100%' };

const ELEMENT_FALLBACK: Record<string, ReactNode> = {
  Fire: <FireIcon style={{ ...fill, color: 'var(--zzz-color-element-fire-solid)' }} />,
  Ether: <StarSparkIcon style={{ ...fill, color: '#C8307A' }} />,
  Ice: <SnowflakeIcon style={{ ...fill, color: 'var(--zzz-color-element-snowflake)' }} />,
  Frost: <SnowflakeIcon style={{ ...fill, color: 'var(--zzz-color-element-snowflake)' }} />,
  Physical: <GoldDiamondIcon style={{ ...fill, color: 'var(--zzz-color-element-gold-diamond)' }} />,
  Electric: <ElectricIcon style={{ ...fill, color: 'var(--zzz-color-element-electric)' }} />,
  Wind: <SwirlIcon style={{ ...fill, color: 'var(--zzz-color-element-swirl)' }} />,
};
const SPECIALTY_FALLBACK: Record<string, ReactNode> = {
  Attack: <AttackIcon style={fill} />,
  Rupture: <RuptureIcon style={fill} />,
  Stun: <StunIcon style={fill} />,
  Anomaly: <AnomalyIcon style={fill} />,
  Support: <SupportIcon style={fill} />,
  Defense: <DefenseIcon style={fill} />,
};

export function ElementGlyph({ name }: { name: string }) {
  return (
    <GameIcon
      kind="elements"
      name={name}
      fallback={
        ELEMENT_FALLBACK[name] ?? (
          <HexStarIcon
            style={{
              ...fill,
              color: 'var(--zzz-color-element-cyan-star)',
            }}
          />
        )
      }
    />
  );
}

export function SpecialtyGlyph({ name }: { name: string }) {
  return <GameIcon kind="specialties" name={name} fallback={SPECIALTY_FALLBACK[name] ?? <AttackIcon style={fill} />} />;
}
