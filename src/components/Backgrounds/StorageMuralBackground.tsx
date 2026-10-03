import { useState } from 'react'
import { cx } from '../../utils'
import type { BackgroundLayerProps } from './types'
import './Backgrounds.css'

export interface StorageMuralBackgroundProps extends BackgroundLayerProps {
  /**
   * Mural image URL (any `src`), cover-cropped and dimmed by the veil. Omitted = a flat dimmed band
   * (`color.bg.artMax` under the veil, ≈ #080808). The image stays invisible until it has fully
   * loaded and then fades in (no progressive / partial paint); while it loads, or if the URL fails
   * (the failed `<img>` is removed, so no broken-image glyph), the same flat band shows.
   */
  src?: string
}

/**
 * Dimmed mural band behind a top bar (101 tall). A black veil at 82 % caps every
 * pixel at `color.bg.artMax` #2E2E2E (255 × 0.18 = 46). The layer itself is `color.bg.artMax`, so
 * with no `src` the band reads ≈ #080808 — the tone of a typical mural behind the veil.
 */
export function StorageMuralBackground({ src, className, ref, ...rest }: StorageMuralBackgroundProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<{ src: string; instant: boolean } | null>(null)
  const showImage = Boolean(src) && failedSrc !== src
  const isLoaded = loaded !== null && loaded.src === src

  /** Cached images are complete on mount: show them at once, without a fade. */
  const checkCached = (img: HTMLImageElement | null) => {
    if (img && src && img.complete && img.naturalWidth > 0 && !(loaded && loaded.src === src)) {
      setLoaded({ src, instant: true })
    }
  }

  return (
    <div ref={ref} aria-hidden="true" className={cx('zzz-bg', 'zzz-mural', className)} {...rest}>
      {showImage ? (
        <img
          ref={checkCached}
          className="zzz-mural__art"
          src={src}
          alt=""
          decoding="async"
          data-loaded={isLoaded ? '' : undefined}
          data-instant={isLoaded && loaded.instant ? '' : undefined}
          onLoad={() => src && setLoaded((l) => (l && l.src === src ? l : { src, instant: false }))}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : null}
      <div className="zzz-mural__veil" />
    </div>
  )
}
