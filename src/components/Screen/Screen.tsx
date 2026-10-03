import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { GraffitiLayer, HatchBackground, StorageMuralBackground } from '../Backgrounds'
import { UidFooter } from '../BottomBar'
import type { SignalLevel } from '../BottomBar'
import './Screen.css'

export type ScreenBackgroundVariant = 'black' | 'hatch' | 'flat' | 'mural' | 'graffiti'

export interface ScreenOwnProps {
  /**
   * Full-canvas background layer:
   * - `black` (default): `#000`;
   * - `hatch`: the 39.8° hatch (Manage Item, Overclocking, Equip);
   * - `flat`: `color.bg.contentFlat` #121212 (Storage content);
   * - `mural`: flat + the dimmed mural band behind the top bar (Storage; `muralSrc`, any image URL; omitted = flat dimmed band);
   * - `graffiti`: black + the original graffiti lettering (agent screens);
   * - any ReactNode: your own art (`<img>`, `<picture>`, SVG, a 3D canvas…), covering the canvas.
   */
  background?: ScreenBackgroundVariant | ReactNode
  /** `background="mural"`: mural image URL (omitted = flat dimmed band). */
  muralSrc?: string
  /** Top bar (`<TopBar>`), placed in the `<header>` landmark. */
  topBar?: ReactNode
  /** Section-title strip (`<SectionTitleStrip>`), directly under the top bar in the header. */
  sectionStrip?: ReactNode
  /** Bottom bar (`<BottomBar>` or your own dock), placed in the `<footer>` landmark. */
  bottomBar?: ReactNode
  /** Player UID for the bottom-right `UidFooter`, or your own node. */
  uid?: ReactNode
  /** Signal level shown by the UID footer. Default 3. */
  signal?: SignalLevel
  /** Escape anywhere inside the screen (focus inside it) calls this, unless a child handled it first. */
  onBack?: () => void
  /** Fade in from black on mount (`motion.duration.screenIn` 300 ms). Default true. Off under reduced motion. */
  entrance?: boolean
  ref?: Ref<HTMLDivElement>
}

export type ScreenProps = ScreenOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof ScreenOwnProps>

const VARIANTS = new Set<string>(['black', 'hatch', 'flat', 'mural', 'graffiti'])

function backgroundLayer(background: ReactNode, muralSrc: string | undefined): ReactNode {
  switch (background) {
    case 'hatch':
      return <HatchBackground />
    case 'mural':
      return <StorageMuralBackground className="zzz-screen__mural" src={muralSrc} />
    case 'graffiti':
      return <GraffitiLayer />
    case 'black':
    case 'flat':
      return null
    default:
      return background
  }
}

/**
 * A full-screen app frame. Fills its
 * container (e.g. a `Stage` canvas): a background layer, then a column of
 * `<header>` (top bar + optional section strip), `<main>` (the rest) and `<footer>` (bottom bar or
 * a dock), with the UID footer in the bottom-right corner.
 */
export function Screen({
  background = 'black',
  muralSrc,
  topBar,
  sectionStrip,
  bottomBar,
  uid,
  signal,
  onBack,
  entrance = true,
  className,
  children,
  onKeyDown,
  ref,
  ...rest
}: ScreenProps) {
  const variant = typeof background === 'string' && VARIANTS.has(background) ? background : background == null ? 'black' : 'art'
  const layer = backgroundLayer(background, muralSrc)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!onBack || event.defaultPrevented || event.key !== 'Escape') return
    event.preventDefault()
    onBack()
  }

  const uidNode =
    uid == null || uid === false ? null : typeof uid === 'string' || typeof uid === 'number' ? (
      <UidFooter uid={String(uid)} signal={signal} />
    ) : (
      uid
    )

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('zzz-screen', className)}
      data-background={variant}
      {...(entrance ? { 'data-entrance': '' } : null)}
      onKeyDown={handleKeyDown}
    >
      <div className="zzz-screen__bg">{layer}</div>
      {topBar != null || sectionStrip != null ? (
        <header className="zzz-screen__header">
          {topBar}
          {sectionStrip != null ? <div className="zzz-screen__strip">{sectionStrip}</div> : null}
        </header>
      ) : null}
      <main className="zzz-screen__main">{children}</main>
      {bottomBar != null ? <footer className="zzz-screen__footer">{bottomBar}</footer> : null}
      {uidNode != null ? <div className="zzz-screen__uid">{uidNode}</div> : null}
    </div>
  )
}
