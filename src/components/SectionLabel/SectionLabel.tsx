import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import './SectionLabel.css'

export interface SectionLabelOwnProps {
  /** Heading level. Default `h3`; `div` / `p` for a non-heading label. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'div' | 'p'
  /** Remove the 16 px indent (when the label is not above stat rows). */
  flush?: boolean
  children?: ReactNode
  ref?: Ref<HTMLHeadingElement>
}

export type SectionLabelProps = SectionLabelOwnProps & Omit<ComponentPropsWithoutRef<'h3'>, keyof SectionLabelOwnProps>

/**
 * Grey section label above stat rows ("Base Stat", "Advanced Stat", "W-Engine Effect"):
 * `color.text.muted` #8C8C8C, `fontSize.label` (17.5) in a 20 px line box, upright, indented 16 px past the rows' left edge.
 */
export function SectionLabel({ as: Tag = 'h3', flush = false, className, ref, ...rest }: SectionLabelProps) {
  return (
    <Tag
      {...rest}
      ref={ref as Ref<HTMLHeadingElement & HTMLDivElement & HTMLParagraphElement>}
      className={cx('zzz-section-label', flush && 'zzz-section-label--flush', className)}
    />
  )
}
