import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { cx, mergeRefs } from '../../utils'
import { tokens } from '../../styles/tokens'
import './ScreenTransition.css'

/**
 * - `cut` (default): fade to black 220 ms, hold, hard cut to the new screen (tiles then stagger in).
 * - `fadeThroughBlack`: fade to black 220 ms, hold, fade from black 300 ms.
 * - `fadeFromBlack`: no fade-out; the new screen starts black and fades in over 300 ms.
 * - `blurThrough`: the old screen blurs (σ 8) under a #1A1A1A scrim .28 → .70 for ~100 ms,
 *   then the new screen cuts in on top. No black hold.
 */
export type ScreenTransitionMode = 'cut' | 'fadeThroughBlack' | 'fadeFromBlack' | 'blurThrough'

type Phase = 'idle' | 'out' | 'hold' | 'in' | 'blur' | 'xfade'

const ms = (v: string) => parseFloat(v)
const D = tokens.motion.duration
export const SCREEN_TIMING = {
  out: ms(D.screenOut),
  hold: ms(D.blackHold),
  in: ms(D.screenIn),
  blur: ms(D.blurThrough),
  reduced: 100,
} as const

const ScreenEnteredContext = createContext(true)

/**
 * True once the current screen is visible (after the cut / during its fade-in); false while the
 * outgoing screen is still showing. Grids use it to start their tile stagger after the cut.
 */
export function useScreenEntered(): boolean {
  return useContext(ScreenEnteredContext)
}

/**
 * Props for one tile of an entrance stagger: `className` + `--i`. Tiles fade 0 → 1 in 100 ms with a delay
 * of 33 ms + i × 8.5 ms (`motion.duration.tileStagger`) or i × 18 ms with `slow`
 * (`tileStaggerSlow`). The animation runs when the tile mounts.
 */
export function tileStagger(index: number, options: { slow?: boolean } = {}): { className: string; style: CSSProperties } {
  return {
    className: cx('zzz-stagger-tile', options.slow && 'zzz-stagger-tile--slow'),
    style: { '--i': String(index) } as CSSProperties,
  }
}

export interface ScreenTransitionProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Identity of the current screen; changing it runs the transition. */
  screenKey: string | number
  /** Default `cut`. */
  mode?: ScreenTransitionMode
  /** Alias of `mode`. */
  variant?: ScreenTransitionMode
  /** Black hold between fade-out and the new screen, in ms (default 130, `motion.duration.blackHold`). */
  hold?: number
  /** Run `fadeFromBlack` on first mount. */
  appear?: boolean
  /** After the transition, focus the new screen's heading (`[data-screen-heading]`, else the first h1/h2). Default true. */
  focusOnEnter?: boolean
  /** Called when the new screen is fully shown. */
  onDone?(screenKey: string | number): void
  /** Force reduced motion (100 ms cross-fade). Default: the OS setting / a `data-reduced-motion` ancestor. */
  reducedMotion?: boolean
  children?: ReactNode
}

function osReducedMotion(el: Element | null): boolean {
  if (el?.closest('[data-reduced-motion]')) return true
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Layer {
  key: string | number
  node: ReactNode
}

/**
 * Screen changes through black. Wrap the routed screen and give it a
 * `screenKey`; on a key change the outgoing screen stays rendered (frozen, inert) until the cut. Children of
 * the new screen can read `useScreenEntered()` and use `tileStagger(i)` for the grid entrance.
 * Reduced motion: a plain 100 ms cross-fade.
 */
export function ScreenTransition({
  screenKey,
  mode: modeProp,
  variant,
  hold = SCREEN_TIMING.hold,
  appear = false,
  focusOnEnter = true,
  onDone,
  reducedMotion,
  className,
  children,
  ref,
  ...rest
}: ScreenTransitionProps) {
  const mode: ScreenTransitionMode = modeProp ?? variant ?? 'cut'
  const [shownKey, setShownKey] = useState(screenKey)
  const [phase, setPhase] = useState<Phase>(appear ? 'in' : 'idle')
  const [oldLayer, setOldLayer] = useState<Layer | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const lastShown = useRef<ReactNode>(children)
  const latestKey = useRef(screenKey)
  latestKey.current = screenKey
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const pendingFocus = useRef(false)

  // While the displayed screen is current, keep its latest children; during out/hold/blur keep showing them.
  if (shownKey === screenKey) lastShown.current = children

  useEffect(() => {
    if (screenKey === shownKey) return
    const reduced = reducedMotion ?? osReducedMotion(rootRef.current)
    const timers: number[] = []
    const at = (t: number, fn: () => void) => timers.push(window.setTimeout(fn, t))
    const prev: Layer = { key: shownKey, node: lastShown.current }
    const swap = () => {
      pendingFocus.current = focusOnEnter
      setShownKey(latestKey.current)
    }
    const done = (t: number) =>
      at(t, () => {
        setPhase('idle')
        setOldLayer(null)
        onDoneRef.current?.(latestKey.current)
      })

    if (reduced) {
      setOldLayer(prev)
      swap()
      setPhase('xfade')
      done(SCREEN_TIMING.reduced)
    } else if (mode === 'blurThrough') {
      setPhase('blur')
      at(SCREEN_TIMING.blur, swap)
      done(SCREEN_TIMING.blur)
    } else if (mode === 'fadeFromBlack') {
      swap()
      setPhase('in')
      done(SCREEN_TIMING.in)
    } else {
      setPhase('out')
      at(SCREEN_TIMING.out, () => setPhase('hold'))
      const cutAt = SCREEN_TIMING.out + hold
      if (mode === 'fadeThroughBlack') {
        at(cutAt, () => {
          swap()
          setPhase('in')
        })
        done(cutAt + SCREEN_TIMING.in)
      } else {
        at(cutAt, swap)
        done(cutAt)
      }
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
    // A newer key while a transition runs restarts it from the screen still shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey])

  // Appear: fade from black once on mount.
  useEffect(() => {
    if (!appear) return
    const t = window.setTimeout(() => setPhase((p) => (p === 'in' ? 'idle' : p)), SCREEN_TIMING.in)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Move focus to the new screen's heading after a swap (not on first mount).
  useLayoutEffect(() => {
    if (!pendingFocus.current) return
    pendingFocus.current = false
    const layer = rootRef.current?.querySelector<HTMLElement>('.zzz-screen-transition__layer[data-current]')
    const heading = layer?.querySelector<HTMLElement>('[data-screen-heading]') ?? layer?.querySelector<HTMLElement>('h1, h2')
    if (!heading) return
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
  }, [shownKey])

  const entered = phase === 'idle' || phase === 'in' || phase === 'xfade'
  const layers: (Layer & { current: boolean })[] = []
  if (oldLayer && oldLayer.key !== shownKey) layers.push({ ...oldLayer, current: false })
  layers.push({ key: shownKey, node: shownKey === screenKey ? children : lastShown.current, current: true })

  return (
    <div
      {...rest}
      ref={mergeRefs(ref, rootRef)}
      className={cx('zzz-screen-transition', className)}
      data-phase={phase}
      data-mode={mode}
      style={{ ...rest.style, ...({ '--zzz-screen-hold': `${hold}ms` } as CSSProperties) }}
    >
      <ScreenEnteredContext.Provider value={entered}>
        {layers.map((layer) => (
          <div
            key={layer.key}
            className="zzz-screen-transition__layer"
            data-current={layer.current ? '' : undefined}
            aria-hidden={!layer.current || !entered ? true : undefined}
            inert={!layer.current || !entered ? true : undefined}
          >
            {layer.node}
          </div>
        ))}
      </ScreenEnteredContext.Provider>
      <div className="zzz-screen-transition__veil" aria-hidden="true" />
    </div>
  )
}

export interface ScreenFadeProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** true: fade to black (220 ms ease-in) and stay black; false: leave black (`exit`). */
  active: boolean
  /** How the black clears when `active` turns false: a hard `cut` (default) or a 300 ms `fade`. */
  exit?: 'cut' | 'fade'
  /** Called with 'black' once fully black, and 'clear' once cleared. */
  onDone?(state: 'black' | 'clear'): void
}

/**
 * Imperative fade-through-black veil for app-level transitions you drive yourself: set `active`, swap
 * your screen in `onDone('black')`, then clear it. Fixed over its positioned parent (position: absolute).
 */
export function ScreenFade({ active, exit = 'cut', onDone, className, ...rest }: ScreenFadeProps) {
  const [state, setState] = useState<'clear' | 'toBlack' | 'black' | 'fromBlack'>(active ? 'black' : 'clear')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    let t: number
    if (active) {
      setState('toBlack')
      t = window.setTimeout(() => {
        setState('black')
        onDoneRef.current?.('black')
      }, SCREEN_TIMING.out)
    } else if (exit === 'fade') {
      setState('fromBlack')
      t = window.setTimeout(() => {
        setState('clear')
        onDoneRef.current?.('clear')
      }, SCREEN_TIMING.in)
    } else {
      setState('clear')
      t = window.setTimeout(() => onDoneRef.current?.('clear'), 0)
    }
    return () => window.clearTimeout(t)
  }, [active, exit])
  return <div {...rest} aria-hidden="true" data-state={state} className={cx('zzz-screen-fade', className)} />
}
