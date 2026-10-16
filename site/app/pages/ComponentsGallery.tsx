import { COMPONENT_TIERS, entriesOf, entryHref, tierOf } from '../catalog';
import { getComponentDoc } from '../lib/registry';
import { GalleryCard } from '../ui/GalleryCard';

/** Components → Overview: every component as a live thumbnail card, grouped by tier. */
export function ComponentsGallery() {
  const all = entriesOf('components');
  return (
    <div className="d-page d-page--wide">
      <article className="d-article">
        <header className="d-head">
          <h1 className="d-h1">Components</h1>
          <p className="d-lede">
            {all.length} components, from single controls up to full-screen templates. Pick one for its examples and
            every prop.
          </p>
          <ul className="d-jump" aria-label="Tiers">
            {COMPONENT_TIERS.map((tier) => (
              <li key={tier}>
                <a href={`#${tier}`} className="d-jump__link">
                  {tierOf(tier).label}
                  <span className="d-jump__count">{all.filter((c) => c.tier === tier).length}</span>
                </a>
              </li>
            ))}
          </ul>
        </header>
        {COMPONENT_TIERS.map((tier) => {
          const entries = all.filter((c) => c.tier === tier);
          return (
            <section key={tier} id={tier} className="d-section d-gallery" aria-labelledby={`${tier}-h`}>
              <div className="d-tierhead">
                <h2 id={`${tier}-h`} className="d-h2">
                  {tierOf(tier).label} <span className="d-tierhead__count">{entries.length}</span>
                </h2>
                <p className="d-muted">{tierOf(tier).blurb}</p>
              </div>
              <ul className="d-cards">
                {entries.map((entry) => {
                  const doc = getComponentDoc(entry.slug);
                  return (
                    <GalleryCard
                      key={entry.slug}
                      name={entry.name}
                      blurb={entry.blurb}
                      href={entryHref(entry)}
                      thumbnail={doc?.thumbnail}
                      scale={doc?.thumbnailScale}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </article>
    </div>
  );
}
