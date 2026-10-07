import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import type {
    ComponentPropsWithoutRef,
    ComponentPropsWithRef,
    ElementType,
    ReactNode,
} from 'react'
import { cx, mergeRefs } from '../../utils'
import './Text.css'

/** Text roles. Sizes are design units (`fontSize.*` tokens). */
export type TextRole =
    | 'nano'
    | 'tiny'
    | 'micro'
    | 'caption'
    | 'label'
    | 'body'
    | 'bodyLg'
    | 'bodyXl'
    | 'button'
    | 'title'
    | 'titlePill'
    | 'eventTitle'
    | 'displayName'
    | 'ghostLevel'
    | 'condensedSm'
    | 'condensedMd'
    | 'condensedInterstitial'
    | 'condensedLg'
    | 'condensedXlHud'
    | 'condensedXl'
    | 'badgeNew'

/** Text colours (`color.text.*`, `color.highlight.*`, …). */
export type TextTone =
    | 'primary'
    | 'soft'
    | 'secondary'
    | 'title'
    | 'tertiary'
    | 'muted'
    | 'subtle'
    | 'disabled'
    | 'faint'
    | 'ghost'
    | 'engraved'
    | 'keyword'
    | 'value'
    | 'danger'
    | 'onAccent'
    | 'sage'

export type TextOutline = 'none' | 'sm' | 'md' | 'event' | 'new'
export type TextTracked = 'none' | 'name' | 'interstitial'

export const TEXT_ROLES: readonly TextRole[] = [
    'nano',
    'tiny',
    'micro',
    'caption',
    'label',
    'body',
    'bodyLg',
    'bodyXl',
    'button',
    'title',
    'titlePill',
    'eventTitle',
    'displayName',
    'ghostLevel',
    'badgeNew',
    'condensedSm',
    'condensedMd',
    'condensedInterstitial',
    'condensedLg',
    'condensedXlHud',
    'condensedXl',
]

export const TEXT_TONES: readonly TextTone[] = [
    'primary',
    'soft',
    'secondary',
    'title',
    'tertiary',
    'muted',
    'subtle',
    'disabled',
    'faint',
    'ghost',
    'engraved',
    'keyword',
    'value',
    'danger',
    'onAccent',
    'sage',
]

export interface TextOwnProps<E extends ElementType = 'span'> {
    /** Element to render (default `span`). */
    as?: E
    /**
     * Typographic role. NOTE: this is the *text* role, not the ARIA `role`
     * attribute; pass an ARIA role through `ariaRole` if you need one.
     */
    role?: TextRole
    /** ARIA role forwarded to the element (because `role` is the text role). */
    ariaRole?: ComponentPropsWithoutRef<'span'>['role']
    /** Text colour. Omitted = inherit (deboss defaults to `engraved`). */
    tone?: TextTone
    /** 10° synthetic italic: wraps the content in `.zzz-italic` (inline-block skewX(-10deg)). */
    italic?: boolean
    /** Stroke drawn behind the fill (`-webkit-text-stroke` + `paint-order: stroke fill`). */
    outline?: TextOutline
    /** Debossed text: `shadow.textDeboss`, tone `engraved` unless given. */
    deboss?: boolean
    /** `name`: +0.44 em, `#323232` (name watermark); `interstitial`: +1.75 em (sweep-transition label). */
    tracked?: TextTracked
    /**
     * Tabular figures (`font.numeric.tabular`), default false: the theme's plain figures. CAUTION: with
     * the Mona Sans fallback tnum draws a slashed 0 and a footed 1; prefer `Zeros` for aligned counters.
     */
    tabular?: boolean
    /**
     * Auto-shrink to the element's width, never below 16 design units.
     * The element becomes a single-line block: give it (or its parent) a width.
     */
    fit?: boolean
    children?: ReactNode
}

export type TextProps<E extends ElementType = 'span'> = TextOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps<E>> & {
        ref?: ComponentPropsWithRef<E>['ref']
    }

/** Minimum auto-fit size in design units. */
const FIT_MIN = 16

/**
 * Every piece of text. Maps `role` → `.zzz-text-<role>` and `tone` → `.zzz-tone-<tone>`
 * (from base.css), plus italic / outline / deboss / tracking / auto-fit.
 */
export function Text<E extends ElementType = 'span'>(props: TextProps<E>) {
    const {
        as,
        role = 'body',
        ariaRole,
        tone,
        italic = false,
        outline = 'none',
        deboss = false,
        tracked = 'none',
        tabular = false,
        fit = false,
        className,
        children,
        ref,
        ...rest
    } = props as TextProps<'span'>
    const Component = (as ?? 'span') as ElementType
    const innerRef = useRef<HTMLElement | null>(null)

    const mergedRef = useMemo(() => mergeRefs(innerRef, ref), [ref])

    const effectiveTone = tone ?? (deboss ? 'engraved' : undefined)

    /** True while the inline font-size on the element was written by `measure` (not by the user). */
    const fitApplied = useRef(false)

    const clearFit = useCallback(() => {
        const el = innerRef.current
        if (el && fitApplied.current) el.style.removeProperty('font-size')
        fitApplied.current = false
    }, [])

    const measure = useCallback(() => {
        const el = innerRef.current
        if (!el || !fit) return
        el.style.removeProperty('font-size')
        fitApplied.current = false
        if (!el.clientWidth || el.scrollWidth <= el.clientWidth) return
        const cs = getComputedStyle(el)
        const unit = parseFloat(cs.getPropertyValue('--zzz-px')) || 1
        const base = parseFloat(cs.fontSize) / unit
        if (!base) return
        // First guess from the overflow ratio, then step down until it fits (glyph hinting makes the
        // width not quite linear in the size). Never below FIT_MIN design units.
        let n = Math.max(
            FIT_MIN,
            Math.floor(base * (el.clientWidth / el.scrollWidth) * 10) / 10
        )
        fitApplied.current = true
        for (let i = 0; i < 12; i++) {
            el.style.setProperty('font-size', `calc(${n} * var(--zzz-px))`)
            if (el.scrollWidth <= el.clientWidth || n <= FIT_MIN) break
            n = Math.max(FIT_MIN, Math.round((n - 0.25) * 100) / 100)
        }
    }, [fit])

    // Re-measure when the content or role changes (cheap: no listener churn).
    useLayoutEffect(() => {
        if (fit) measure()
    }, [fit, measure, children, role])

    // Long-lived listeners: registered once per `fit` session. Turning fit off removes the
    // inline font-size `measure` wrote so the text returns to its role size.
    useLayoutEffect(() => {
        if (!fit) {
            clearFit()
            return
        }
        window.addEventListener('resize', measure)
        // Web fonts change the metrics: re-measure when any font finishes loading.
        const fonts =
            typeof document !== 'undefined' ? document.fonts : undefined
        let alive = true
        fonts?.ready.then(() => alive && measure())
        fonts?.addEventListener?.('loadingdone', measure)
        return () => {
            alive = false
            window.removeEventListener('resize', measure)
            fonts?.removeEventListener?.('loadingdone', measure)
        }
    }, [fit, measure, clearFit])

    return (
        <Component
            ref={mergedRef}
            role={ariaRole}
            className={cx(
                'zzz-text',
                `zzz-text-${role}`,
                effectiveTone && `zzz-tone-${effectiveTone}`,
                outline !== 'none' && `zzz-text--outline-${outline}`,
                deboss && 'zzz-text--deboss',
                tracked !== 'none' && `zzz-text--tracked-${tracked}`,
                tabular && 'zzz-text--tabular',
                fit && 'zzz-text--fit',
                className
            )}
            {...rest}
        >
            {italic ? <span className="zzz-italic">{children}</span> : children}
        </Component>
    )
}
