import { useControllableState } from '../../utils'
import { CheckIcon } from '../../icons'
import { Button } from '../Button'
import {
    RewardTile,
    RewardTileGroup,
    type RewardTileProps,
} from '../RewardTile'
import { DialogBand, type DialogBandProps } from './DialogBand'

export interface RewardDialogProps
    extends Omit<DialogBandProps, 'actions' | 'title' | 'children'> {
    /** Default "Obtained". */
    title?: string
    /** The rewards, rendered as RewardTiles 141 px apart and centred. */
    items: RewardTileProps[]
    /** Confirm pressed or Escape; the dialog then closes. */
    onClose?(): void
    /** Default "Confirm". */
    confirmLabel?: string
}

/**
 * The "Obtained" band: title, a centred row of RewardTiles and a single Confirm
 * (green disc, ✓) on the bottom edge line.
 */
export function RewardDialog({
    title = 'Obtained',
    items,
    onClose,
    confirmLabel = 'Confirm',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    ...rest
}: RewardDialogProps) {
    const [open, setOpen] = useControllableState(
        openProp,
        defaultOpen,
        onOpenChange
    )
    return (
        <DialogBand
            {...rest}
            title={title}
            open={open}
            onOpenChange={setOpen}
            onEscapeKeyDown={onClose}
            actions={
                <Button
                    width="dialog"
                    icon={<CheckIcon />}
                    iconTone="confirm"
                    pressOutset={0}
                    onClick={() => {
                        onClose?.()
                        setOpen(false)
                    }}
                >
                    {confirmLabel}
                </Button>
            }
        >
            <RewardTileGroup>
                {items.map((item, i) => (
                    <RewardTile key={item.id ?? i} {...item} />
                ))}
            </RewardTileGroup>
        </DialogBand>
    )
}
