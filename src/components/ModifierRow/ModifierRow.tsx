import { isValidElement } from 'react'
import type {
    ComponentPropsWithoutRef,
    ReactElement,
    ReactNode,
    Ref,
} from 'react'
import { cx } from '../../utils'
import { CombatBadge } from '../Badges'
import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import './ModifierRow.css'

export interface ModifierRowOwnProps {
    /** Default "Active Modifier Count". */
    label?: ReactNode
    /** The count, in `color.sage.base`. */
    count: ReactNode
    /**
     * Right-hand button. Button props are merged over the Combat Readiness defaults (CombatBadge cap,
     * two-line italic "Combat / Readiness"); a React element is rendered as given. Omit for no button.
     */
    action?: ButtonProps | ReactElement
    ref?: Ref<HTMLDivElement>
}

export type ModifierRowProps = ModifierRowOwnProps &
    Omit<
        ComponentPropsWithoutRef<'div'>,
        keyof ModifierRowOwnProps | 'children'
    >

/**
 * Modifier row: a 69 px capsule (5 px black rim, #202020 fill) with
 * "Active Modifier Count" in `text.secondary`, the count in sage, and a nested dark pill button
 * ("Combat Readiness") flush right.
 */
export function ModifierRow({
    label = 'Active Modifier Count',
    count,
    action,
    className,
    ref,
    ...rest
}: ModifierRowProps) {
    let button: ReactNode = null
    if (isValidElement(action)) button = action
    else if (action) {
        const {
            className: actionClass,
            children,
            ...props
        } = action as ButtonProps
        button = (
            <Button
                avatar={<CombatBadge decorative size={40} />}
                twoLine
                {...props}
                className={cx('zzz-modifier-row__action', actionClass)}
            >
                {children ?? 'Combat\nReadiness'}
            </Button>
        )
    }
    return (
        <div
            {...rest}
            ref={ref}
            className={cx(
                'zzz-modifier-row',
                button != null && 'zzz-modifier-row--has-action',
                className
            )}
        >
            <span className="zzz-modifier-row__label">
                {label} <span className="zzz-modifier-row__count">{count}</span>
            </span>
            {button != null ? (
                <span className="zzz-modifier-row__slot">{button}</span>
            ) : null}
        </div>
    )
}
