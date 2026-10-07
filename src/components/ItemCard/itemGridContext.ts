import { createContext, useContext } from 'react'
import type { ItemCardSize } from './ItemCard'

/**
 * Set by `ItemGrid` around each rendered item. The grid cell is the focusable `role="option"`,
 * so an `ItemCard` inside it renders as a plain `<div>` (no nested interactive element) and takes
 * its `selected` state and default `size` from here.
 */
export interface ItemGridItemContextValue {
    /** Card size that matches the grid density. */
    size: ItemCardSize
    /** Whether this cell is the grid's selected item. */
    selected: boolean
}

export const ItemGridItemContext =
    createContext<ItemGridItemContextValue | null>(null)

/** Read the enclosing `ItemGrid` cell state (null outside a grid). For custom `renderItem` tiles. */
export function useItemGridItem(): ItemGridItemContextValue | null {
    return useContext(ItemGridItemContext)
}
