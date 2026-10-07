import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { cx, useControllableState } from '../../utils'
import { CheckIcon, CloseIcon, createIcon } from '../../icons'
import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import './CopyButton.css'

/** Original "two sheets" copy glyph on the 32 grid. */
export const CopyGlyphIcon = createIcon(
    'CopyGlyphIcon',
    'copy',
    <path
        fillRule="evenodd"
        d="M11 3h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3h-2v-4h1V7H12v1H8V6a3 3 0 0 1 3-3ZM6 10h15a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3Zm1 4v11h13V14H7Z"
    />
)

export type CopyButtonStatus = 'idle' | 'copied' | 'failed'

/** Hidden-textarea + `document.execCommand('copy')` fallback. Returns false when the browser refuses. */
function legacyCopy(text: string): boolean {
    if (
        typeof document === 'undefined' ||
        typeof document.execCommand !== 'function'
    )
        return false
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '0'
    area.style.left = '0'
    area.style.opacity = '0'
    area.style.pointerEvents = 'none'
    const previous = document.activeElement as HTMLElement | null
    document.body.appendChild(area)
    area.focus()
    area.select()
    let ok = false
    try {
        ok = document.execCommand('copy')
    } catch {
        ok = false
    }
    area.remove()
    previous?.focus?.()
    return ok
}

/**
 * Copy `text` to the clipboard: `navigator.clipboard.writeText` first, then the hidden-textarea
 * `execCommand('copy')` fallback (older browsers, insecure origins, denied permission).
 * Resolves when one of them succeeds, rejects with an `Error` otherwise.
 */
export async function copyToClipboard(text: string): Promise<void> {
    let apiError: unknown
    const clip =
        typeof navigator !== 'undefined' ? navigator.clipboard : undefined
    if (clip && typeof clip.writeText === 'function') {
        try {
            await clip.writeText(text)
            return
        } catch (err) {
            apiError = err
        }
    }
    if (legacyCopy(text)) return
    throw apiError instanceof Error
        ? apiError
        : new Error('Copy to clipboard failed')
}

export interface CopyButtonOwnProps {
    /** The text to copy. */
    text?: string
    /** Lazy text (read at click time), e.g. a share message built from current state. May be async. Wins over `text`. */
    getText?: () => string | Promise<string>
    /** Idle label. Default "Copy". */
    children?: ReactNode
    /** Label + live announcement after a successful copy. Default "Copied". */
    copiedLabel?: ReactNode
    /** Label + live announcement when copying failed. Default "Copy failed". */
    failedLabel?: ReactNode
    /** How long the copied / failed state shows before returning to idle, ms. Default 2000. */
    resetAfter?: number
    /** Called with the copied text. */
    onCopy?: (text: string) => void
    /** Called with the error when every copy method failed (or `getText` threw). */
    onError?: (error: unknown) => void
    /** Controlled status (force the copied / failed look, or drive it from outside). */
    status?: CopyButtonStatus
    /** Called whenever the status changes (after a copy and when it resets to idle). */
    onStatusChange?: (status: CopyButtonStatus) => void
    /** Leading glyph while idle. Default the copy glyph; `null` for none (the status glyphs still show). */
    icon?: ReactNode
}

export type CopyButtonProps = CopyButtonOwnProps &
    Omit<
        ButtonProps,
        | keyof CopyButtonOwnProps
        | 'iconTone'
        | 'avatar'
        | 'twoLine'
        | 'variant'
        | 'missionState'
        | 'href'
    >

const TONE = { idle: 'plain', copied: 'confirm', failed: 'cancel' } as const

/**
 * Copy-to-clipboard button built on `Button`. Click → `navigator.clipboard` (textarea fallback)
 * → "Copied" + check on a confirm disc for `resetAfter` ms, or "Copy failed" + cross on a cancel
 * disc. All three labels are stacked in one grid cell so the pill keeps the width of the widest
 * one; the result is announced through a polite `role="status"` region next to the button.
 */
export function CopyButton({
    text,
    getText,
    children = 'Copy',
    copiedLabel = 'Copied',
    failedLabel = 'Copy failed',
    resetAfter = 2000,
    onCopy,
    onError,
    icon,
    status: statusProp,
    onStatusChange,
    onClick,
    disabled,
    className,
    ...rest
}: CopyButtonProps) {
    const [status, setStatus] = useControllableState<CopyButtonStatus>(
        statusProp,
        'idle',
        onStatusChange
    )
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const mounted = useRef(true)

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
            clearTimeout(timer.current)
        }
    }, [])

    const settle = useCallback(
        (next: CopyButtonStatus) => {
            if (!mounted.current) return
            clearTimeout(timer.current)
            setStatus(next)
            timer.current = setTimeout(() => {
                if (mounted.current) setStatus('idle')
            }, resetAfter)
        },
        [resetAfter, setStatus]
    )

    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
        ;(
            onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined
        )?.(event)
        if (event.defaultPrevented || disabled) return
        let value: string
        try {
            value = getText ? await getText() : (text ?? '')
            await copyToClipboard(value)
        } catch (err) {
            settle('failed')
            onError?.(err)
            return
        }
        settle('copied')
        onCopy?.(value)
    }

    const idleIcon = icon === undefined ? <CopyGlyphIcon /> : icon
    const glyph =
        status === 'copied' ? (
            <CheckIcon />
        ) : status === 'failed' ? (
            <CloseIcon />
        ) : (
            idleIcon
        )
    const labels: [CopyButtonStatus, ReactNode][] = [
        ['idle', children],
        ['copied', copiedLabel],
        ['failed', failedLabel],
    ]
    const announce =
        status === 'copied'
            ? copiedLabel
            : status === 'failed'
              ? failedLabel
              : null

    return (
        <>
            <Button
                {...rest}
                disabled={disabled}
                className={cx('zzz-copy-button', className)}
                data-copy-status={status}
                icon={glyph ?? undefined}
                iconTone={TONE[status]}
                onClick={handleClick as ButtonProps['onClick']}
            >
                <span className="zzz-copy-button__labels">
                    {labels.map(([key, label]) => (
                        <span
                            key={key}
                            className="zzz-copy-button__label"
                            data-active={key === status ? '' : undefined}
                            aria-hidden={key === status ? undefined : true}
                        >
                            {label}
                        </span>
                    ))}
                </span>
            </Button>
            <span
                className="zzz-sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {announce}
            </span>
        </>
    )
}
