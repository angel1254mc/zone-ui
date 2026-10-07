import type { ComponentPropsWithoutRef, Ref } from 'react'

/** Props shared by every background layer (a decorative, absolutely positioned div). */
export interface BackgroundLayerProps
    extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
    ref?: Ref<HTMLDivElement>
}
