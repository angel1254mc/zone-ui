import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils'
import { useTabList } from '../SegmentedTabs/useTabList'
import type { TabListItem } from '../SegmentedTabs/useTabList'
import './WebTabs.css'

/**
 * Look of the web components.
 * - `web`: the website skin (flat #222122 track, white skewed chips, hover scale 1.12).
 * - `game`: the game-menu skin (dark mesh pill, live `--zzz-accent` chips, 26.5° slant, no hover).
 */
export type WebSkin = 'web' | 'game'

/** Control size: sm / md / lg ≈ 32 / 40 / 48 CSS px controls at the default scale (md = the original look). */
export type WebTabsSize = 'sm' | 'md' | 'lg'

export interface WebTabsItem extends TabListItem {
    value: string
    label: ReactNode
    disabled?: boolean
    /** Accessible name when `label` is not plain text. */
    'aria-label'?: string
}

export interface WebTabsProps
    extends Omit<
        ComponentPropsWithRef<'div'>,
        'children' | 'defaultValue' | 'onChange'
    > {
    items: readonly WebTabsItem[]
    /** Selected value (controlled). */
    value?: string
    /** Initial value (uncontrolled). Default: the first enabled item. */
    defaultValue?: string
    onValueChange?: (value: string) => void
    /** Default `web`. */
    skin?: WebSkin
    /**
     * Control size (default `md`). Track height (64 web / 59 game), padding, chip, label and ring scale
     * by the control-size ratio (sm 46/57, lg 69/57); skew angles stay; the label never drops below the
     * `label` text role.
     */
    size?: WebTabsSize
    /**
     * Outer width in design units (default 40 + 195 per tab = 820 for 4 tabs, scaled to `size`). An
     * explicit number is literal (not size-scaled); `'fill'` = 100%.
     */
    width?: number | 'fill'
    /** Force the pressed look on this (inactive) tab — game skin only. Docs / visual tests. */
    pressed?: string
}

const PAD = 20
const PER_TAB = 195

/**
 * Web section tabs: a 64 px pill track, 195 px items, the active item on a skewed chip.
 * Keyboard/ARIA behaviour is shared with SegmentedTabs (`useTabList`).
 */
export function WebTabs({
    items,
    value: valueProp,
    defaultValue,
    onValueChange,
    skin = 'web',
    size = 'md',
    width,
    pressed,
    id,
    className,
    style,
    ref,
    ...rest
}: WebTabsProps) {
    const { getTabProps } = useTabList({
        items,
        value: valueProp,
        defaultValue,
        onValueChange,
        id,
        pressed,
    })
    const cssWidth =
        width === 'fill'
            ? '100%'
            : typeof width === 'number'
              ? `calc(${width} * var(--zzz-px))`
              : `calc(${PAD * 2 + PER_TAB * items.length} * var(--zzz-web-tabs-u))`

    return (
        <div
            role="tablist"
            aria-orientation="horizontal"
            id={id}
            ref={ref}
            className={cx(
                'zzz-web-tabs',
                skin === 'game' && 'zzz-mat-pill',
                className
            )}
            data-skin={skin}
            data-size={size}
            style={
                { '--zzz-web-tabs-width': cssWidth, ...style } as CSSProperties
            }
            {...rest}
        >
            {items.map((item, index) => (
                <button
                    key={item.value}
                    {...getTabProps(item, index)}
                    aria-label={item['aria-label']}
                    className="zzz-web-tabs__tab zzz-focusable"
                >
                    <span className="zzz-web-tabs__chip" aria-hidden="true" />
                    <span
                        className={cx(
                            'zzz-web-tabs__label',
                            skin === 'game' && 'zzz-italic'
                        )}
                    >
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
