import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { Text } from '../Text'
import './EventDescription.css'

export interface EventDescriptionOwnProps {
    /** Horizontal alignment. Default `end` (right-aligned under the title). */
    align?: 'start' | 'center' | 'end'
    /** Maximum width in design units. Default 620; `none` for no limit. */
    maxWidth?: number | 'none'
    children?: ReactNode
    ref?: Ref<HTMLParagraphElement>
}

export type EventDescriptionProps = EventDescriptionOwnProps &
    Omit<ComponentPropsWithoutRef<'p'>, keyof EventDescriptionOwnProps>

/**
 * Event blurb under the title and info pills: `bodyXl`
 * white, upright, with the sticker outline (`shadow.textOutlineMd`, rim ~2.5 px) on a 30 px line pitch
 * (`lineHeight.description`). Right-aligned by default.
 */
export function EventDescription({
    align = 'end',
    maxWidth = 620,
    className,
    style,
    children,
    ref,
    ...rest
}: EventDescriptionProps) {
    return (
        <Text
            {...rest}
            as="p"
            ref={ref}
            role="bodyXl"
            outline="md"
            tone="primary"
            className={cx(
                'zzz-event-description',
                `zzz-event-description--${align}`,
                className
            )}
            style={{
                maxWidth:
                    maxWidth === 'none'
                        ? 'none'
                        : `calc(${maxWidth} * var(--zzz-px))`,
                ...style,
            }}
        >
            {children}
        </Text>
    )
}
