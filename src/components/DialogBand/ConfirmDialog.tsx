import { useRef } from 'react'
import { useControllableState } from '../../utils'
import { CheckIcon, CloseIcon } from '../../icons'
import { Button } from '../Button'
import { DialogBand, type DialogBandProps } from './DialogBand'

export interface ConfirmDialogProps
    extends Omit<DialogBandProps, 'actions' | 'initialFocus' | 'alert'> {
    /** Default "Confirm". */
    confirmLabel?: string
    /** Default "Cancel". */
    cancelLabel?: string
    /** Confirm pressed; the dialog then closes (onOpenChange(false)). */
    onConfirm(): void
    /** Cancel pressed or Escape; the dialog then closes. */
    onCancel?(): void
    /** Which button takes focus on open (default `confirm`). */
    initialFocus?: 'confirm' | 'cancel'
    /** Disable Confirm (e.g. insufficient materials). */
    confirmDisabled?: boolean
}

/**
 * DialogBand with a Cancel (red disc, ×) / Confirm (green disc, ✓) pair: 275 × 59 dialog pills,
 * 28 apart, centred on the bottom edge line, no pressed outset (`pressOutset` 0). `role="alertdialog"`;
 * Escape = Cancel. The content slot holds e.g. a RewardTileGroup of the materials to spend.
 */
export function ConfirmDialog({
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    initialFocus = 'confirm',
    confirmDisabled = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    ...rest
}: ConfirmDialogProps) {
    const [open, setOpen] = useControllableState(
        openProp,
        defaultOpen,
        onOpenChange
    )
    const confirmRef = useRef<HTMLButtonElement>(null)
    const cancelRef = useRef<HTMLButtonElement>(null)

    return (
        <DialogBand
            {...rest}
            alert
            open={open}
            onOpenChange={setOpen}
            onEscapeKeyDown={onCancel}
            initialFocus={
                initialFocus === 'cancel' || confirmDisabled
                    ? cancelRef
                    : confirmRef
            }
            actions={
                <>
                    <Button
                        ref={cancelRef}
                        width="dialog"
                        icon={<CloseIcon />}
                        iconTone="cancel"
                        pressOutset={0}
                        onClick={() => {
                            onCancel?.()
                            setOpen(false)
                        }}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        ref={confirmRef}
                        width="dialog"
                        icon={<CheckIcon />}
                        iconTone="confirm"
                        pressOutset={0}
                        disabled={confirmDisabled}
                        onClick={() => {
                            onConfirm()
                            setOpen(false)
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        />
    )
}
