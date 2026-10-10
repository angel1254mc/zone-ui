import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { sectionOfTier, tierOf } from '../catalog';
import type { CatalogEntry } from '../types';

const TIER_SINGULAR: Partial<Record<CatalogEntry['tier'], string>> = {
  atoms: 'Atom',
  molecules: 'Molecule',
  organisms: 'Organism',
  templates: 'Template',
  foundations: 'Foundation',
  start: 'Guide',
  examples: 'Example',
};

/** Page header: tier pill, package line, the name in the display face, and the blurb. */
export function PageHead({ entry, children }: { entry: CatalogEntry; children?: ReactNode }) {
  const label = TIER_SINGULAR[entry.tier] ?? tierOf(entry.tier).label;
  const main = entry.components[0];
  const section = sectionOfTier(entry.tier);
  return (
    <header className="d-head">
      <p className="d-eyebrow">
        {section === 'components' ? (
          <Link to={`/components#${entry.tier}`} className="d-eyebrow__tier">
            {label}
          </Link>
        ) : (
          <span className="d-eyebrow__tier">{label}</span>
        )}
        {main && section !== 'examples' && (
          <span className="d-eyebrow__pkg">
            @angel1254mc/zone-ui · <code>{main}</code>
          </span>
        )}
      </p>
      <h1 className="d-h1">{entry.name}</h1>
      <p className="d-lede">{entry.blurb}</p>
      {children}
    </header>
  );
}
