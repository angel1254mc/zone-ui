import { entriesOf, entryHref } from '../catalog';
import { getPageDoc } from '../lib/registry';
import { GalleryCard } from '../ui/GalleryCard';

/** Examples → Overview: the complete apps built from the kit. */
export function ExamplesOverview() {
  return (
    <div className="d-page d-page--wide">
      <article className="d-article">
        <header className="d-head">
          <h1 className="d-h1">Examples</h1>
          <p className="d-lede">
            Complete apps built only from the kit. Open one to use it live and see how it is put together.
          </p>
        </header>
        <div className="d-body">
          <ul className="d-cards d-cards--wide">
            {entriesOf('examples').map((entry) => {
              const page = getPageDoc('examples', entry.slug);
              return (
                <GalleryCard
                  key={entry.slug}
                  name={entry.name}
                  blurb={entry.blurb}
                  href={entryHref(entry)}
                  thumbnail={page?.thumbnail}
                  scale={page?.thumbnailScale}
                />
              );
            })}
          </ul>
        </div>
      </article>
    </div>
  );
}
