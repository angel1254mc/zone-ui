import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { KeyHints } from '../KeyHint'
import type { KeyHintProps } from '../KeyHint'
import './BottomBar.css'

export interface BottomBarOwnProps {
  /** Left group, from x 66 (Compare / Recommend, the filter circle…), 24 px apart. */
  left?: ReactNode
  /** Right group, ending at the right margin (Remove / Enhance…), 24 px apart. */
  right?: ReactNode
  /** Key-hint row (e.g. "T Unlock", "R Discard / T Lock"), right-aligned inside the band. */
  hints?: KeyHintProps[]
  /** A faint separator line near the band top (5 tall, 6 below it). */
  separator?: boolean
  ref?: Ref<HTMLDivElement>
}

export type BottomBarProps = BottomBarOwnProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BottomBarOwnProps>

/**
 * Bottom bar: a solid black band, 100 tall, controls 57–58 tall on a row 22 below its top,
 * side margins 66. `Screen` places it in its
 * `<footer>` landmark; standalone it is a plain `div`.
 */
export function BottomBar({ left, right, hints, separator = false, className, children, ref, ...rest }: BottomBarProps) {
  return (
    <div {...rest} ref={ref} className={cx('zzz-bottom-bar', className)} {...(separator ? { 'data-separator': '' } : null)}>
      <div className="zzz-bottom-bar__left">{left}</div>
      {children}
      <div className="zzz-bottom-bar__right">
        {hints?.length ? <KeyHints className="zzz-bottom-bar__hints" hints={hints} /> : null}
        {right}
      </div>
    </div>
  )
}
