import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx, mergeRefs, useControllableState } from '../../utils'
import { ItemGridItemContext, type ItemCardSize } from '../ItemCard'
import { ScrollArea } from '../ScrollArea'
import './ItemGrid.css'

/** Grid density: card size + fractional column / row pitch, design units. */
export type ItemGridDensity = 'storage' | 'list' | 'material' | 'slot'

interface DensitySpec {
  size: ItemCardSize
  card: number
  pitchX: number
  pitchY: number
  /** card + gap + capsule */
  cell: number
}

export const ITEM_GRID_DENSITIES: Record<ItemGridDensity, DensitySpec> = {
  storage: { size: 'storage', card: 118, pitchX: 135.2, pitchY: 174.7, cell: 152 },
  list: { size: 'list', card: 115, pitchX: 130, pitchY: 170.8, cell: 148 },
  material: { size: 'material', card: 110, pitchX: 128.7, pitchY: 169, cell: 142 },
  slot: { size: 'slot', card: 87, pitchX: 104, pitchY: 135, cell: 115 },
}

export interface ItemGridItemState {
  selected: boolean
  index: number
}

export interface ItemGridProps<T> extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'defaultValue' | 'onChange'> {
  items: readonly T[]
  /** Stable id of an item (selection value, option id suffix, React key). */
  getId: (item: T) => string
  /** Render one tile, normally an `ItemCard` (it picks up size and selection from the grid). */
  renderItem: (item: T, state: ItemGridItemState) => ReactNode
  /** Columns (13 on Storage / Manage Item, 9 on Overclock, 5 on the equip list). */
  columns: number
  /** Card size and pitch. Default `storage` (118 at 135.2 × 174.7). */
  density?: ItemGridDensity
  /** Selected id (controlled). `null` = nothing selected. */
  value?: string | null
  /** Initially selected id (uncontrolled). */
  defaultValue?: string | null
  onValueChange?: (id: string, item: T) => void
  /** Enter / Space / click on a tile (after selecting it). */
  onActivate?: (id: string, item: T) => void
  /**
   * Entrance: each tile fades in at `33 ms + i × step`: `fast` 8.5 ms (Storage tab switch, default),
   * `slow` 18 ms (Manage Item entrance), `none`. Replays when the set of ids changes. Off under
   * reduced motion.
   */
  stagger?: 'fast' | 'slow' | 'none'
  /** Wrap in a `ScrollArea` with the bar on this side. Default: no scroll container. */
  scrollbar?: 'left' | 'right'
  /** Gap between the scroll bar and the grid's padding box (design units). Default: 14 − 7 (left) / 34 − 8 (right), i.e. a 14 / 34 bar-to-card gap. */
  scrollbarGap?: number
}

/**
 * Inventory grid: `ItemCard`s at a fractional pitch with single selection.
 * `role="listbox"` of `role="option"` cells with a roving tabindex: arrow keys move in 2-D and the
 * selection follows focus, Home / End go to the row start / end, Ctrl+Home / Ctrl+End to the first
 * / last item, Enter / Space activate. Tiles fade in with the entrance stagger; the selection ring
 * snaps between tiles.
 */
export function ItemGrid<T>({
  items,
  getId,
  renderItem,
  columns,
  density = 'storage',
  value,
  defaultValue = null,
  onValueChange,
  onActivate,
  stagger = 'fast',
  scrollbar,
  scrollbarGap,
  className,
  style,
  ref,
  onKeyDown,
  ...rest
}: ItemGridProps<T>) {
  const spec = ITEM_GRID_DENSITIES[density]
  const cols = Math.max(1, Math.floor(columns))
  const ids = useMemo(() => items.map(getId), [items, getId])
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, (next) => {
    if (next === null) return
    const i = ids.indexOf(next)
    if (i >= 0) onValueChange?.(next, items[i])
  })
  const selectedIndex = selected === null ? -1 : ids.indexOf(selected)
  // The roving tab stop is tracked by id (so it follows its item through a sort / filter), with the
  // index it last had as the fallback when that item is removed.
  const [focus, setFocus] = useState<{ id: string; index: number } | null>(null)
  const focusIdIndex = focus === null ? -1 : ids.indexOf(focus.id)
  const tabIndexAt = Math.min(
    Math.max(focusIdIndex >= 0 ? focusIdIndex : (focus?.index ?? (selectedIndex >= 0 ? selectedIndex : 0)), 0),
    Math.max(0, items.length - 1),
  )
  const cells = useRef<Array<HTMLDivElement | null>>([])
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Replay the entrance whenever the set of items changes (not on every re-render). Cells are keyed
  // by id and never remounted: the replay flips `data-replay`, which swaps between two identical
  // keyframes and so restarts the animation in place (keyboard focus stays on its option).
  const signature = ids.join('\u0000')
  const epochRef = useRef({ signature, epoch: 0, hadFocus: false })
  if (epochRef.current.signature !== signature) {
    // Read before commit: did the grid hold focus when the item set changed?
    const grid = gridRef.current
    const active = typeof document === 'undefined' ? null : document.activeElement
    epochRef.current = { signature, epoch: epochRef.current.epoch + 1, hadFocus: !!grid && !!active && grid.contains(active) }
  }
  const epoch = epochRef.current.epoch

  // The focused item was removed: the browser dropped focus to <body>. Put it on the option now at
  // the roving tab stop so a keyboard user keeps their place.
  useLayoutEffect(() => {
    const state = epochRef.current
    if (!state.hadFocus) return
    state.hadFocus = false
    const active = document.activeElement
    if (active && active !== document.body) return
    cells.current[tabIndexAt]?.focus()
  }, [epoch]) // eslint-disable-line react-hooks/exhaustive-deps

  const uid = `zzz-ig${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  const moveTo = (index: number) => {
    if (items.length === 0) return
    const i = Math.min(Math.max(index, 0), items.length - 1)
    setFocus({ id: ids[i], index: i })
    setSelected(ids[i])
    cells.current[i]?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || items.length === 0) return
    const cur = tabIndexAt
    const rowStart = cur - (cur % cols)
    let next: number | null = null
    switch (e.key) {
      case 'ArrowRight':
        next = cur + 1
        break
      case 'ArrowLeft':
        next = cur - 1
        break
      case 'ArrowDown':
        next = cur + cols < items.length ? cur + cols : cur
        break
      case 'ArrowUp':
        next = cur - cols >= 0 ? cur - cols : cur
        break
      case 'Home':
        next = e.ctrlKey || e.metaKey ? 0 : rowStart
        break
      case 'End':
        next = e.ctrlKey || e.metaKey ? items.length - 1 : Math.min(rowStart + cols - 1, items.length - 1)
        break
      case 'Enter':
      case ' ':
      case 'Spacebar':
        e.preventDefault()
        setSelected(ids[cur])
        onActivate?.(ids[cur], items[cur])
        return
      default:
        return
    }
    e.preventDefault()
    moveTo(next)
  }

  const vars = {
    '--zzz-grid-cols': cols,
    '--zzz-grid-card': spec.card,
    '--zzz-grid-pitch-x': spec.pitchX,
    '--zzz-grid-pitch-y': spec.pitchY,
    '--zzz-grid-cell': spec.cell,
    '--zzz-grid-step': stagger === 'slow' ? 'var(--zzz-motion-duration-tile-stagger-slow)' : 'var(--zzz-motion-duration-tile-stagger)',
  } as CSSProperties

  const grid = (
    <div
      {...rest}
      ref={mergeRefs(gridRef, ref)}
      role="listbox"
      className={cx('zzz-item-grid', `zzz-item-grid--${density}`, !scrollbar && className)}
      style={scrollbar ? vars : { ...vars, ...style }}
      data-stagger={stagger === 'none' ? undefined : stagger}
      data-replay={epoch % 2 === 0 ? 'a' : 'b'}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => {
        const id = ids[index]
        const isSelected = index === selectedIndex
        return (
          <div
            key={id}
            ref={(node) => {
              cells.current[index] = node
            }}
            id={`${uid}-${index}`}
            role="option"
            aria-selected={isSelected}
            tabIndex={index === tabIndexAt ? 0 : -1}
            className="zzz-item-grid__cell"
            style={{ '--zzz-i': index } as CSSProperties}
            onFocus={() => setFocus({ id, index })}
            onClick={() => {
              setFocus({ id, index })
              setSelected(id)
              onActivate?.(id, item)
            }}
          >
            <ItemGridItemContext.Provider value={{ size: spec.size, selected: isSelected }}>
              {renderItem(item, { selected: isSelected, index })}
            </ItemGridItemContext.Provider>
          </div>
        )
      })}
    </div>
  )

  if (!scrollbar) return grid
  return (
    <ScrollArea
      side={scrollbar}
      // the listbox options are the tab stop; focusing one scrolls it into view
      viewportTabIndex={-1}
      // the gap is bar -> card; the grid's own padding (7 left / 8 right) already counts
      gap={scrollbarGap ?? (scrollbar === 'left' ? 14 - 7 : 34 - 8)}
      className={cx('zzz-item-grid-scroll', className)} style={style}>
      {grid}
    </ScrollArea>
  )
}
