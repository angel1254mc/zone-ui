import { Children, Fragment, isValidElement, useId } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { Button, type ButtonIconTone } from '../Button';
import { EventTitle, type EventTitleLevel } from '../EventTitle';
import { GraffitiLayer, HatchBackground } from '../Backgrounds';
import { Text } from '../Text';
import './Hero.css';

/** A call-to-action rendered as a pill `Button` (primary gets the accent ring). */
export interface HeroAction {
  label: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Render as a link. */
  href?: string;
  icon?: ReactNode;
  iconTone?: ButtonIconTone;
  disabled?: boolean;
  'aria-label'?: string;
}

export type HeroArtPosition = 'right' | 'left' | 'background';
export type HeroBackground = 'hatch' | 'graffiti' | 'plain';

export interface HeroOwnProps {
  /** Small accent tag above the headline ("Daily", "New season", "Beta"). */
  eyebrow?: ReactNode;
  /** The headline (sticker-outlined EventTitle look). */
  title: ReactNode;
  /** Heading level of the headline. Default `h1`. */
  headingLevel?: EventTitleLevel;
  /** Subtitle / meta line under the headline. An array is joined with " · " ("Puzzle #42", "Oct 1"). */
  meta?: ReactNode;
  /** Paragraph(s) of description. */
  description?: ReactNode;
  /** Bullet list (feature list, rules). */
  bullets?: ReactNode[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Extra actions after the primary / secondary buttons. */
  actions?: ReactNode;
  /** Status / summary slot under the actions (e.g. "Already played today" + a countdown). */
  summary?: ReactNode;
  /** Art slot (portrait / illustration): an `<img>`, `<picture>` or SVG. */
  art?: ReactNode;
  /** Where the art goes. Default `right`. On narrow containers `left` / `right` stack the art above the text. */
  artPosition?: HeroArtPosition;
  /** `contain` (default, a standing portrait anchored at the bottom) or `cover`. */
  artFit?: 'contain' | 'cover';
  /** Background layer. Default `hatch`. */
  background?: HeroBackground;
  /**
   * Sticker outline on the meta, description and bullets (legibility over light or busy art).
   * Default: on when `artPosition="background"` and art is given.
   */
  textOutline?: boolean;
  /** Text alignment. Default `start`. */
  align?: 'start' | 'center';
  /** Extra content after the summary. */
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export type HeroProps = HeroOwnProps & Omit<ComponentPropsWithoutRef<'section'>, keyof HeroOwnProps | 'title'>;

function joinMeta(meta: ReactNode): ReactNode {
  if (!Array.isArray(meta)) return meta;
  // toArray drops null / undefined / booleans.
  const items = Children.toArray(meta).filter((m) => m !== '');
  return items.map((m, i) => (
    <Fragment key={isValidElement(m) && m.key != null ? m.key : i}>
      {i > 0 ? (
        <span className="zzz-hero__meta-sep" aria-hidden="true">
          {' · '}
        </span>
      ) : null}
      {m}
    </Fragment>
  ));
}

function ActionButton({ action, kind }: { action: HeroAction; kind: 'primary' | 'secondary' }) {
  return (
    <Button
      size="lg"
      className={cx('zzz-hero__action', `zzz-hero__action--${kind}`)}
      onClick={action.onClick}
      href={action.href}
      icon={action.icon}
      iconTone={action.iconTone}
      disabled={action.disabled}
      aria-label={action['aria-label']}
    >
      {action.label}
    </Button>
  );
}

/**
 * Landing / entry section for apps and pages: an accent eyebrow tag,
 * the sticker-outlined headline (EventTitle look), a meta line, description and bullets, primary +
 * secondary actions, a status/summary slot and an art slot left, right or behind the text, over a hatch,
 * graffiti or plain background. Responsive: below a 720 px wide container the art stacks above the text.
 * Labelled by its headline (`aria-labelledby`).
 */
export function Hero({
  eyebrow,
  title,
  headingLevel = 'h1',
  meta,
  description,
  bullets,
  primaryAction,
  secondaryAction,
  actions,
  summary,
  art,
  artPosition = 'right',
  artFit = 'contain',
  background = 'hatch',
  align = 'start',
  textOutline,
  children,
  className,
  ref,
  ...rest
}: HeroProps) {
  const titleId = `${useId()}-title`;
  const hasActions = primaryAction || secondaryAction || actions != null;
  const onArt = textOutline ?? (artPosition === 'background' && art != null);
  return (
    <section
      {...rest}
      aria-labelledby={rest['aria-labelledby'] ?? (rest['aria-label'] != null ? undefined : titleId)}
      ref={ref}
      className={cx(
        'zzz-hero',
        `zzz-hero--art-${artPosition}`,
        `zzz-hero--bg-${background}`,
        `zzz-hero--align-${align}`,
        art == null && 'zzz-hero--no-art',
        className
      )}
    >
      <div className="zzz-hero__layout">
        {background === 'hatch' ? <HatchBackground className="zzz-hero__bg" /> : null}
        {background === 'graffiti' ? <GraffitiLayer className="zzz-hero__bg" /> : null}
        {art != null ? <div className={cx('zzz-hero__art', `zzz-hero__art--${artFit}`)}>{art}</div> : null}
        <div className="zzz-hero__content">
          {eyebrow != null ? (
            <Text role="bodyLg" className="zzz-hero__eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <EventTitle as={headingLevel} id={titleId} align={align} className="zzz-hero__title">
            {title}
          </EventTitle>
          {meta != null ? (
            <Text as="p" role="bodyXl" tone="secondary" outline={onArt ? 'sm' : 'none'} className="zzz-hero__meta">
              {joinMeta(meta)}
            </Text>
          ) : null}
          {description != null ? (
            <Text as="div" role="bodyXl" tone="soft" outline={onArt ? 'sm' : 'none'} className="zzz-hero__description">
              {description}
            </Text>
          ) : null}
          {bullets && bullets.length > 0 ? (
            <ul className="zzz-hero__bullets">
              {bullets.map((b, i) => (
                <li key={i} className="zzz-hero__bullet">
                  <Text role="body" tone="secondary" outline={onArt ? 'sm' : 'none'}>
                    {b}
                  </Text>
                </li>
              ))}
            </ul>
          ) : null}
          {hasActions ? (
            <div className="zzz-hero__actions">
              {primaryAction ? <ActionButton action={primaryAction} kind="primary" /> : null}
              {secondaryAction ? <ActionButton action={secondaryAction} kind="secondary" /> : null}
              {actions}
            </div>
          ) : null}
          {summary != null ? <div className="zzz-hero__summary zzz-mat-panel">{summary}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
