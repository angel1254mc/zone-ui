import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils'
import type { WebSkin } from '../WebTabs'
import './CategoryTag.css'

export interface CategoryTagProps extends ComponentPropsWithRef<'span'> {
  /** `web` (default): `#BFDB5A` text. `game`: the live `--zzz-accent`. */
  skin?: WebSkin
}

/**
 * News category tag: a 26 px black tag,
 * round left end, slanted right end, lime micro text. Static label (not interactive).
 */
export function CategoryTag({ skin = 'web', className, children, ...rest }: CategoryTagProps) {
  return (
    <span className={cx('zzz-category-tag', className)} data-skin={skin} {...rest}>
      {children}
    </span>
  )
}
