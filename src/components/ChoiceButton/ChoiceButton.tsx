import { useId } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { cx, usePressFlash } from '../../utils';
import { CheckIcon, CloseIcon } from '../../icons';
import './ChoiceButton.css';

/**
 * Outcome shown on a choice. `success` / `error` are aliases of `correct` / `incorrect`.
 * - `correct`: this choice was picked and is right (green, or accent with `correctTone="accent"`) + check
 * - `incorrect`: this choice was picked and is wrong (red) + x
 * - `revealed`: the right choice, shown after the user picked another one (green outline + check)
 */
export type ChoiceResult = 'correct' | 'incorrect' | 'revealed' | 'success' | 'error';

/** Normalised visual state, mirrored on `data-state`. */
export type ChoiceState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'revealed';

/** `inline`: a small square thumbnail beside the label. `cover`: a wide image above the label (image options). */
export type ChoiceMediaLayout = 'inline' | 'cover';

/** Colour of the `correct` result: `green` (`color.icon.confirm`, default) or the live accent fill. */
export type ChoiceCorrectTone = 'green' | 'accent';

/**
 * Web size scale. `md` (default) is a 78-unit min-height plate with a 56 badge cap and a 26 label;
 * `sm` / `lg` scale every length by 46/57 / 69/57 and use the control label sizes 21 / 30.
 */
export type ChoiceSize = 'sm' | 'md' | 'lg';

export interface ChoiceButtonOwnProps {
  /** The heavy, sheared label (wraps to 2–3 lines). */
  children?: ReactNode;
  /** Secondary line under the label (upright, muted). Exposed as the accessible description. */
  description?: ReactNode;
  /** Content of the leading round cap: a letter, a number or an icon. Omit for no cap. */
  badge?: ReactNode;
  /** Image / avatar / SVG slot (decorative: it is hidden from assistive tech, so the label must stand alone). */
  media?: ReactNode;
  /** Default `inline`. */
  mediaLayout?: ChoiceMediaLayout;
  /** Selected look (pulsing accent ring + accent cap). Standalone buttons also get `aria-pressed`. */
  selected?: boolean;
  /** Outcome; overrides the selected look. */
  result?: ChoiceResult | null;
  /** Default `green`. */
  correctTone?: ChoiceCorrectTone;
  /** Screen-reader text appended to the label for `result`. Defaults: "Correct", "Incorrect", "Correct answer". */
  resultLabel?: string;
  /** Force the pressed look (stories, tests, externally driven presses). */
  pressed?: boolean;
  /** Mirrored on `data-value` (handy for delegation and tests). */
  value?: string;
  /**
   * `sm` / `md` / `lg` (default `md`): min-height 63 / 78 / 94, badge cap 45 / 56 / 68 design units,
   * label `fontSize.control.{sm,md,lg}` (21 / 26 / 30), description label / body / bodyLg; ring,
   * radius, padding, media and press outset scale with it. Mirrored on `data-size`.
   */
  size?: ChoiceSize;
  ref?: ComponentPropsWithRef<'button'>['ref'];
}

export type ChoiceButtonProps = ChoiceButtonOwnProps &
  Omit<ComponentPropsWithRef<'button'>, keyof ChoiceButtonOwnProps>;

const RESULT_STATE: Record<ChoiceResult, ChoiceState> = {
  correct: 'correct',
  success: 'correct',
  incorrect: 'incorrect',
  error: 'incorrect',
  revealed: 'revealed',
};

export const DEFAULT_RESULT_LABELS: Record<'correct' | 'incorrect' | 'revealed', string> = {
  correct: 'Correct',
  incorrect: 'Incorrect',
  revealed: 'Correct answer',
};

/** Map a result (including the aliases) and the selected flag to the visual state. */
export function choiceState(selected: boolean | undefined, result: ChoiceResult | null | undefined): ChoiceState {
  if (result) return RESULT_STATE[result];
  return selected ? 'selected' : 'idle';
}

/**
 * A string label is sheared word by word (each word its own inline-block), so a label that wraps
 * to 2–3 lines keeps every line on the same left edge instead of the staircase a sheared block makes.
 */
function shearWords(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  text.split(/(\s+)/).forEach((part, i) => {
    if (part === '') return;
    out.push(
      /^\s+$/.test(part) ? (
        ' '
      ) : (
        <span key={i} className="zzz-italic">
          {part}
        </span>
      )
    );
  });
  return out;
}

const TOGGLE_ROLES = new Set(['radio', 'checkbox', 'menuitemradio', 'menuitemcheckbox', 'switch', 'option']);

/**
 * A large selectable option on the dark pill material (ring + lit bevel + dot mesh), with an
 * optional round badge cap (like Button's icon cap), a heavy 10°-sheared label that wraps,
 * an optional description and an optional media slot. General purpose: quiz answers, polls,
 * onboarding pickers, plan selection, settings.
 *
 * States: idle · selected (accent ring + accent cap, pulsing with the shared accent clock) ·
 * pressed (the shared accent-fill recipe) · disabled (grey label, shape unchanged) · results
 * `correct` / `incorrect` / `revealed`. The state is mirrored on `data-state`.
 * Standalone it is a toggle `<button aria-pressed>`; give it `role="radio" | "checkbox"` (as
 * ChoiceGroup does) and it reports `aria-checked` instead.
 */
export function ChoiceButton(props: ChoiceButtonProps) {
  const {
    children,
    description,
    badge,
    media,
    mediaLayout = 'inline',
    selected,
    result,
    correctTone = 'green',
    resultLabel,
    pressed = false,
    value,
    size = 'md',
    disabled = false,
    type = 'button',
    role,
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    ref,
    ...rest
  } = props;

  const uid = useId();
  const labelId = `${uid}-label`;
  const descId = `${uid}-desc`;
  const ariaDisabled = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const inert = disabled || ariaDisabled;
  const state = choiceState(selected, result);
  const isResult = state === 'correct' || state === 'incorrect' || state === 'revealed';
  const hasCap = badge != null && badge !== false;
  const hasMedia = media != null && media !== false;
  const hasDesc = description != null && description !== false;

  const flash = usePressFlash<HTMLButtonElement>({
    disabled: inert,
    onKeyDown,
    onKeyUp,
    onBlur,
  });
  const isPressed = !inert && (pressed || 'data-pressed' in flash);

  const glyph = state === 'incorrect' ? <CloseIcon /> : <CheckIcon />;
  const srResult = isResult
    ? (resultLabel ?? DEFAULT_RESULT_LABELS[state as keyof typeof DEFAULT_RESULT_LABELS])
    : null;

  const toggleRole = role != null && TOGGLE_ROLES.has(role);
  const stateAria =
    selected === undefined
      ? null
      : toggleRole
        ? { 'aria-checked': selected }
        : role == null
          ? { 'aria-pressed': selected }
          : null;

  const named = rest['aria-label'] != null || rest['aria-labelledby'] != null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inert) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      {...stateAria}
      ref={ref}
      type={type}
      role={role}
      disabled={disabled}
      aria-labelledby={named ? rest['aria-labelledby'] : labelId}
      aria-describedby={rest['aria-describedby'] ?? (hasDesc ? descId : undefined)}
      data-state={state}
      data-value={value}
      data-size={size}
      data-tone={state === 'correct' ? correctTone : undefined}
      {...(isPressed ? { 'data-pressed': '' } : null)}
      className={cx(
        'zzz-choice',
        `zzz-choice--${size}`,
        'zzz-mat-pill',
        'zzz-pressable',
        'zzz-focusable',
        hasCap && 'zzz-choice--capped',
        hasMedia && `zzz-choice--media-${mediaLayout}`,
        className
      )}
      onClick={handleClick}
      onKeyDown={flash.onKeyDown as (e: KeyboardEvent<HTMLButtonElement>) => void}
      onKeyUp={flash.onKeyUp as (e: KeyboardEvent<HTMLButtonElement>) => void}
      onBlur={flash.onBlur}
    >
      {hasMedia && mediaLayout === 'cover' ? (
        <span className="zzz-choice__media" aria-hidden="true">
          {media}
        </span>
      ) : null}
      <span className="zzz-choice__row">
        {hasCap ? (
          <span className="zzz-choice__cap" aria-hidden="true">
            <span className="zzz-choice__disc zzz-pressable__hide" />
            {isResult ? <span className="zzz-choice__dot zzz-pressable__hide" /> : null}
            <span className="zzz-choice__badge">
              {isResult ? <span className="zzz-choice__glyph">{glyph}</span> : badge}
            </span>
          </span>
        ) : null}
        {hasMedia && mediaLayout === 'inline' ? (
          <span className="zzz-choice__media" aria-hidden="true">
            {media}
          </span>
        ) : null}
        <span className="zzz-choice__body">
          <span className="zzz-choice__label">
            {typeof children === 'string' ? (
              <span id={labelId} className="zzz-choice__text zzz-choice__text--words">
                {shearWords(children)}
                {srResult ? <span className="zzz-sr-only">, {srResult}</span> : null}
              </span>
            ) : (
              <span id={labelId} className="zzz-choice__text zzz-italic">
                {children}
                {srResult ? <span className="zzz-sr-only">, {srResult}</span> : null}
              </span>
            )}
          </span>
          {hasDesc ? (
            <span id={descId} className="zzz-choice__desc">
              {description}
            </span>
          ) : null}
        </span>
        {isResult && !hasCap ? (
          <span className="zzz-choice__mark" aria-hidden="true">
            <span className="zzz-choice__disc zzz-pressable__hide" />
            <span className="zzz-choice__dot zzz-pressable__hide" />
            <span className="zzz-choice__glyph">{glyph}</span>
          </span>
        ) : null}
      </span>
    </button>
  );
}
