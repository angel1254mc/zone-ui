import { useId, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { SearchIcon } from '../../icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { NewBadge } from '../Badges';
import { ClaimedCheck } from '../CheckInCalendar/ClaimedCheck';
import { Text } from '../Text';
import './MissionCard.css';

/** `go`: the mission can be done (black "Go"); `claimed`: reward taken; `locked`: not yet available ("Stay Tuned"). */
export type MissionStatus = 'go' | 'claimed' | 'locked';

/** Per-event colours. Defaults: ring `content.eventTeal`, body `content.eventPink`. */
export interface MissionCardTheme {
  /** Frame ring, left strip, reward-circle ring and the button halos. */
  ring?: string;
  /** Body band colour (drawn as a lighter-at-the-top gradient with a faint diagonal pattern). */
  body?: string;
  /** Optional sticker ornament on the bottom-left corner (e.g. an orange candy). Omitted = none. */
  ornament?: string;
}

export interface MissionCardOwnProps {
  /** Mission text in the dark header (1–2 lines; a single line renders at `bodyLg`, two at `body`). */
  title: ReactNode;
  /** Reward art slot (an `<img>`, `<picture>` or SVG), fitted into the 80 px teal-ringed circle (54 px art window). */
  reward?: ReactNode;
  /** Accessible name of the reward (e.g. "Outfit: Angels of Delusion"). */
  rewardLabel?: string;
  /** Default `go`. */
  status?: MissionStatus;
  theme?: MissionCardTheme;
  /** Shows the "NEW!" tag over the header's top-right corner. */
  isNew?: boolean;
  /** Action button ("Go"). Only fires when `status="go"`. */
  onGo?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Magnifier button (reward / mission details). */
  onInspect?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Override the action label. Defaults: Go / Claimed / Stay Tuned. */
  actionLabel?: ReactNode;
  /** Accessible name of the magnifier. Default "Details". */
  inspectLabel?: string;
  ref?: Ref<HTMLElement>;
}

export type MissionCardProps = MissionCardOwnProps &
  Omit<ComponentPropsWithoutRef<'article'>, keyof MissionCardOwnProps>;

const LABELS: Record<MissionStatus, string> = {
  go: 'Go',
  claimed: 'Claimed',
  locked: 'Stay Tuned',
};
const MISSION_STATE = {
  go: 'default',
  claimed: 'claimed',
  locked: 'locked',
} as const;

/**
 * Event mission card: 581 × 150, 8 px teal
 * ring (radius 14) with a light notch ornament on the top-right corner; a 54 px dark header with the mission
 * text; an 80 px event-theme body with a teal left strip, an 80 px teal-ringed reward circle (lime tick when
 * claimed), a magnifier `IconButton size="mission"` and a `Button variant="mission"` (Go / Claimed / Stay Tuned).
 */
export function MissionCard(props: MissionCardProps) {
  const {
    title,
    reward,
    rewardLabel,
    status = 'go',
    theme,
    isNew = false,
    onGo,
    onInspect,
    actionLabel,
    inspectLabel = 'Details',
    className,
    style,
    ref,
    ...rest
  } = props;
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  // Auto-sizing: a one-line mission renders at bodyLg (cap 19), a wrapped one at
  // body (cap 17, 24 px pitch). Try the large size first; drop to the small one when it wraps.
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const fit = () => {
      el.dataset.lines = '1';
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      if (lh && el.scrollHeight > lh * 1.5) el.dataset.lines = '2';
    };
    fit();
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    let alive = true;
    fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
  }, [title]);

  const vars: Record<string, string> = {};
  if (theme?.ring) vars['--zzz-mission-card-ring'] = theme.ring;
  if (theme?.body) vars['--zzz-mission-card-body'] = theme.body;
  if (theme?.ornament) vars['--zzz-mission-card-ornament'] = theme.ornament;

  return (
    <article
      {...rest}
      ref={ref}
      aria-labelledby={titleId}
      data-status={status}
      className={cx('zzz-mission-card', className)}
      style={{ ...(vars as CSSProperties), ...style }}
    >
      <div className="zzz-mission-card__frame">
        <div className="zzz-mission-card__header">
          <Text id={titleId} ref={titleRef} as="h3" role="body" className="zzz-mission-card__title" data-lines="2">
            {title}
          </Text>
        </div>
        <div className="zzz-mission-card__body">
          <span className="zzz-mission-card__strip" aria-hidden="true" />
          <IconButton
            className="zzz-mission-card__inspect"
            size="mission"
            icon={<SearchIcon />}
            label={inspectLabel}
            onClick={onInspect}
          />
          <Button
            className="zzz-mission-card__action"
            variant="mission"
            missionState={MISSION_STATE[status]}
            onClick={status === 'go' ? onGo : undefined}
          >
            {actionLabel ?? LABELS[status]}
          </Button>
        </div>
      </div>
      {/* Outside the frame so the circle can overlap the bottom ring (the frame clips at its padding box). */}
      <div
        className="zzz-mission-card__reward"
        role={rewardLabel ? 'img' : undefined}
        aria-label={rewardLabel ? `${rewardLabel}${status === 'claimed' ? ', claimed' : ''}` : undefined}
      >
        <span className="zzz-mission-card__reward-art" aria-hidden={rewardLabel ? true : undefined}>
          {reward}
        </span>
      </div>
      {status === 'claimed' ? <ClaimedCheck className="zzz-mission-card__check" /> : null}
      <svg className="zzz-mission-card__notch" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M2 1.5 H7.5 L14.5 8.5 V14 L11 10.5 L5.5 5 Z" />
      </svg>
      {theme?.ornament ? <span className="zzz-mission-card__ornament" aria-hidden="true" /> : null}
      {isNew ? <NewBadge size="sm" placement="top-right" offset={[2, -4]} className="zzz-mission-card__new" /> : null}
    </article>
  );
}
