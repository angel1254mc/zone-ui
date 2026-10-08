import { Component } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router';
import { ZzzTheme } from '@angel1254mc/zone-ui';
import { THUMBNAIL_SCALE } from '../lib/registry';
import { PendingThumb } from './Pending';

/** Keeps one broken thumbnail from taking the whole gallery down: it falls back to the placeholder. */
class ThumbnailBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.error(`Thumbnail for ${this.props.name} failed to render`, error);
  }
  override render() {
    return this.state.failed ? <PendingThumb name={this.props.name} /> : this.props.children;
  }
}

/**
 * A gallery card: a fixed 200 px preview with the live thumbnail centred in a nested ZzzTheme at a small
 * scale, then the name (the card's only link and tab stop; it covers the whole card) and the blurb.
 * The preview is `inert`, so nothing inside it can be focused or clicked. No thumbnail: a neutral
 * placeholder, and the card carries `data-pending`.
 */
export function GalleryCard({
  name,
  blurb,
  href,
  thumbnail: Thumbnail,
  scale,
}: {
  name: string;
  blurb: string;
  href: string;
  thumbnail?: ComponentType;
  scale?: number;
}) {
  return (
    <li className="d-card" data-pending={Thumbnail ? undefined : ''}>
      <div className="d-card__preview" inert>
        {Thumbnail ? (
          <ThumbnailBoundary name={name}>
            <ZzzTheme scale={scale ?? THUMBNAIL_SCALE} className="d-card__theme">
              <Thumbnail />
            </ZzzTheme>
          </ThumbnailBoundary>
        ) : (
          <PendingThumb name={name} />
        )}
      </div>
      <div className="d-card__text">
        <h3 className="d-card__name">
          <Link to={href} className="d-card__link">
            {name}
          </Link>
        </h3>
        <p className="d-card__blurb">{blurb}</p>
      </div>
    </li>
  );
}
