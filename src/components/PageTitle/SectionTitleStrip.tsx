import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { Text } from '../Text'
import './PageTitle.css'

export interface SectionTitleStripOwnProps {
  /** "W-Engine Storage", "Drive Disc Storage". */
  title: ReactNode
  /** `[current, max]` → rendered as "[ 113/2000 ]" (a space inside each bracket). */
  count?: readonly [number, number]
  /** Right-hand content (e.g. `IconTabs`, which overlap the strip). */
  right?: ReactNode
  /** Draw the 5 px `color.border.rule` + 4 px black above the strip. Default true. */
  rule?: boolean
  /** Heading element for the title. Default `h2`. */
  headingAs?: 'h1' | 'h2' | 'h3' | 'div'
  ref?: Ref<HTMLDivElement>
}

export type SectionTitleStripProps = SectionTitleStripOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof SectionTitleStripOwnProps | 'children' | 'title'>

/**
 * Section-title strip: a 60 px `effect.headerStrip`
 * gradient band with the dot texture, under a 5 px rule and a 4 px black gap.
 * Title `bodyLg` upright in `color.text.subtle`, inset 141 from the left.
 */
export function SectionTitleStrip({
  title,
  count,
  right,
  rule = true,
  headingAs = 'h2',
  className,
  ref,
  ...rest
}: SectionTitleStripProps) {
  return (
    <div {...rest} ref={ref} className={cx('zzz-section-strip', className)}>
      {rule ? <div className="zzz-section-strip__rule" aria-hidden="true" /> : null}
      <div className="zzz-section-strip__band zzz-dots">
        <Text as={headingAs} role="bodyLg" tone="subtle" className="zzz-section-strip__title">
          {title}
          {count ? (
            <>
              {' '}
              <span className="zzz-section-strip__count">
                [&nbsp;{count[0]}/{count[1]}&nbsp;]
              </span>
            </>
          ) : null}
        </Text>
        {right != null ? <div className="zzz-section-strip__right">{right}</div> : null}
      </div>
    </div>
  )
}
