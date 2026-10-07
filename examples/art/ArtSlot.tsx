/**
 * ArtSlot — a neutral image slot for remote art (purely presentational: it knows nothing
 * about the art manifest; the store-aware wrappers in gameArt.tsx feed it).
 *
 *  - Renders `<picture class="zart" data-state="loading|loaded|missing">` with an optional
 *    `<img>` inside. It never contains an `<svg>` and never draws imitation art.
 *  - loading: kit art-stage surface with a faint slanted sheen (no shapes, no text).
 *  - loaded:  the `<img>` fades in after load + decode (240 ms); cached images appear instantly
 *    (`data-instant`, no fade).
 *  - missing: a quiet empty frame (no manifest entry, `src` null, or the URL failed to load).
 *  - prefers-reduced-motion: no sheen, no fade.
 *
 * `className` / `style` go on the `<picture>` wrapper. `fit` / `position` are set inline on the
 * wrapper only when given; the `<img>` inherits them, so a parent's `> picture` rule still applies.
 * `defaultFit` (what the store-aware image components pass) is NOT inline: it becomes
 * `data-fit="cover|contain"`, styled at zero specificity (`:where()`), so a library slot rule
 * (`> picture`, `> *`, `> :is(img, picture)`) that sets object-fit still wins over it.
 * `layout="fill"` (default) fills the parent; `layout="ratio"` is full width with a reserved
 * `aspect-ratio` from `width` / `height`, so nothing shifts when the image arrives.
 *
 * Written against kit tokens only, so it can later move verbatim into src/ as a public primitive.
 */
import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
    type SyntheticEvent,
} from 'react'
import './artSlot.css'

/** Manifest/store status the slot is rendered for. */
export type ArtStatus = 'loading' | 'ready' | 'missing'
/** What the slot shows (its `data-state`). */
export type ArtSlotState = 'loading' | 'loaded' | 'missing'

export interface ArtSlotProps {
    /** Resolved image URL, or null when there is no art (renders the empty frame once `status` is 'ready'). */
    src: string | null
    /** Store status. 'loading' shows the skeleton without requesting anything. Default 'ready'. */
    status?: ArtStatus
    /** Intrinsic pixel size of the asset: `width`/`height` attributes and the `ratio` aspect-ratio. */
    width: number
    height: number
    /** Alternative text. Empty (default) = decorative. */
    alt?: string
    /** Explicit object-fit, set inline on the wrapper (wins over any stylesheet rule). */
    fit?: 'cover' | 'contain'
    /**
     * Fallback object-fit when the parent has no rule: emitted as `data-fit` and styled under
     * `:where(.zart[data-fit=…])` (zero specificity), so library slot rules override it.
     */
    defaultFit?: 'cover' | 'contain'
    /** CSS object-position, e.g. '50% 28%'. */
    position?: string
    /** 'fill' (default): 100% × 100% of the parent. 'ratio': full width, height from the aspect ratio. */
    layout?: 'fill' | 'ratio'
    /** Above-the-fold / LCP art: loading="eager" + fetchpriority="high". Default lazy. */
    priority?: boolean
    className?: string
    style?: CSSProperties
    /** Called once per URL when the image fails to load (the slot then shows the empty frame). */
    onImageError?: (src: string) => void
}

type ImgState = {
    src: string | null
    state: 'pending' | 'loaded' | 'error'
    instant: boolean
}

export function ArtSlot({
    src,
    status = 'ready',
    width,
    height,
    alt = '',
    fit,
    defaultFit,
    position,
    layout = 'fill',
    priority = false,
    className,
    style,
    onImageError,
}: ArtSlotProps) {
    const [img, setImg] = useState<ImgState>({
        src: null,
        state: 'pending',
        instant: false,
    })
    const cur: ImgState =
        img.src === src ? img : { src, state: 'pending', instant: false }

    // Cached images can already be complete when the element is attached: show them without a fade.
    const ref = useCallback((el: HTMLImageElement | null) => {
        if (el && el.complete && el.naturalWidth > 0) {
            const s = el.getAttribute('src')
            setImg((p) =>
                p.src === s && p.state === 'loaded'
                    ? p
                    : { src: s, state: 'loaded', instant: true }
            )
        }
    }, [])

    const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const el = e.currentTarget
        const s = src
        const done = () =>
            setImg((p) =>
                p.src === s && p.state === 'loaded'
                    ? p
                    : { src: s, state: 'loaded', instant: false }
            )
        // decode() avoids painting a half-decoded frame of large art; fall back when unsupported / rejected.
        if (typeof el.decode === 'function') el.decode().then(done, done)
        else done()
    }

    const errorReported = useRef<string | null>(null)
    const onError = () => {
        setImg({ src, state: 'error', instant: false })
        if (src && errorReported.current !== src) {
            errorReported.current = src
            onImageError?.(src)
        }
    }

    const slot: ArtSlotState =
        status === 'loading'
            ? 'loading'
            : status === 'missing' || !src || cur.state === 'error'
              ? 'missing'
              : cur.state === 'loaded'
                ? 'loaded'
                : 'loading'
    const showImg = status === 'ready' && !!src && cur.state !== 'error'

    // A slot without an <img> still exposes its alt text; decorative slots are hidden.
    const a11y = showImg
        ? {}
        : alt
          ? { role: 'img' as const, 'aria-label': alt }
          : { 'aria-hidden': true as const }

    return (
        <picture
            className={className ? `zart ${className}` : 'zart'}
            data-state={slot}
            data-layout={layout}
            data-fit={defaultFit}
            data-instant={(slot === 'loaded' && cur.instant) || undefined}
            aria-busy={slot === 'loading' || undefined}
            {...a11y}
            style={{
                ...(layout === 'ratio'
                    ? { aspectRatio: `${width} / ${height}` }
                    : null),
                ...(fit ? { objectFit: fit } : null),
                ...(position ? { objectPosition: position } : null),
                ...style,
            }}
        >
            {showImg ? (
                <img
                    key={src}
                    ref={ref}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    decoding="async"
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    draggable={false}
                    onLoad={onLoad}
                    onError={onError}
                />
            ) : null}
        </picture>
    )
}
