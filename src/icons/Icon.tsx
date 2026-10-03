import { icons, type IconName } from './registry'
import type { IconProps } from './types'

export interface IconLookupProps extends IconProps {
  /** Registry key, e.g. `'back'`, `'home'`, `'rankLetterS'`. */
  name: IconName
}

/**
 * Render a glyph by name: `<Icon name="filter" size={28} />`.
 * Same props as the individual `<NameIcon>` components.
 */
export function Icon({ name, ...props }: IconLookupProps) {
  const Glyph = icons[name]
  return <Glyph {...props} />
}
