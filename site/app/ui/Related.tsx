import { Link } from 'react-router';
import { findEntry, entryHref } from '../catalog';

export function Related({ slugs }: { slugs: string[] }) {
  const entries = slugs.map((s) => findEntry('components', s)).filter((e) => e !== undefined);
  if (!entries.length) return null;
  return (
    <ul className="d-related">
      {entries.map((r) => (
        <li key={r.slug}>
          <Link to={entryHref(r)} className="d-related__card">
            <span className="d-related__name">{r.name}</span>
            <span className="d-related__blurb">{r.blurb}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
