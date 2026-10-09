import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { TagButton } from '../TagButton';
import type { TagButtonProps } from '../TagButton';
import { PageTitle } from '../PageTitle';
import { StorageMuralBackground } from '../Backgrounds';
import './TopBar.css';

export type TopBarBackground = 'solid' | 'translucent' | 'none' | 'mural';

export interface TopBarOwnProps {
  /**
   * Left group after the Back button (24 px gaps): a location `Button` ("City" with the house cap),
   * a title pill (avatar cap, two lines), a `Chip`…
   */
  left?: ReactNode;
  /** Page title ("Manage Item"): rendered as a `PageTitle` 28 px after the Back button. */
  title?: ReactNode;
  /** Right group, right-aligned (66 from the right edge): `ResourceBar`, `IconTabs`, `Button`s / `IconButton`s, `ProgressPill`… */
  right?: ReactNode;
  /** Renders the red Back tag button and calls this on click. */
  onBack?: () => void;
  /** Back button accessible name. Default "Back". */
  backLabel?: string;
  /** Extra props for the Back `TagButton` (e.g. `pressed`). */
  backProps?: Omit<TagButtonProps, 'kind' | 'onClick' | 'label'>;
  /**
   * Band fill: `solid` black (sub-pages, default), `translucent` (Home, `color.bg.topBarHome`
   * rgba(0,0,0,.68)), `none` (agent screens), `mural` (Storage: the dimmed mural band).
   */
  background?: TopBarBackground;
  /** `background="mural"`: mural image URL (omitted = flat dimmed band). */
  muralSrc?: string;
  ref?: Ref<HTMLDivElement>;
}

export type TopBarProps = TopBarOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof TopBarOwnProps | 'title'>;

/**
 * Top bar: a full-width band 102 tall with a vertically centred controls row, side margins
 * 68 / 66. No bottom line (the section rule belongs to `SectionTitleStrip`). `Screen` places it in its `<header>` landmark.
 */
export function TopBar({
  left,
  title,
  right,
  onBack,
  backLabel,
  backProps,
  background = 'solid',
  muralSrc,
  className,
  children,
  ref,
  ...rest
}: TopBarProps) {
  return (
    <div {...rest} ref={ref} className={cx('zzz-top-bar', className)} data-background={background}>
      {background === 'mural' ? <StorageMuralBackground className="zzz-top-bar__mural" src={muralSrc} /> : null}
      <div className="zzz-top-bar__left">
        {onBack ? (
          <TagButton
            {...backProps}
            kind="back"
            label={backLabel}
            className={cx('zzz-top-bar__back', backProps?.className)}
            onClick={onBack}
          />
        ) : null}
        {title != null ? <PageTitle className="zzz-top-bar__title">{title}</PageTitle> : null}
        {left}
      </div>
      {children}
      {right != null ? <div className="zzz-top-bar__right">{right}</div> : null}
    </div>
  );
}
