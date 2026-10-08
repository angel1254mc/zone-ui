import { Table } from '@angel1254mc/zone-ui';
import type { TableColumn } from '@angel1254mc/zone-ui';
import { docgen } from '../lib/docgen';
import type { DocProp } from '../lib/docgen';
import type { TypeRow } from '../types';
import { Prose } from './CodeBlock';

const typeCell = (type: string) => (
  <span className="d-types">
    {type.split(' | ').map((t, i) => (
      <code key={i} className="d-type">
        {t}
      </code>
    ))}
  </span>
);

const propColumns: TableColumn<DocProp>[] = [
  {
    key: 'name',
    header: 'Prop',
    align: 'start',
    rowHeader: true,
    width: 230,
    sortable: true,
    cell: (p) => (
      <span className="d-prop-name">
        <code>{p.name}</code>
        {p.required && <span className="d-required">Required</span>}
      </span>
    ),
  },
  { key: 'type', header: 'Type', align: 'start', width: 330, cell: (p) => typeCell(p.type) },
  {
    key: 'default',
    header: 'Default',
    align: 'start',
    width: 140,
    cell: (p) => (p.default ? <code className="d-default">{p.default}</code> : <span className="d-dash">—</span>),
  },
  {
    key: 'description',
    header: 'Description',
    align: 'start',
    cell: (p) => (
      <span className="d-prop-desc">
        <Prose text={p.description.replace(/\s*\n\s*/g, ' ')} />
      </span>
    ),
  },
];

export function PropsTable({ component }: { component: string }) {
  const doc = docgen[component];
  if (!doc) return null;
  return (
    <section className="d-api" id={`api-${component}`}>
      <div className="d-api__head">
        <h2 className="d-h2">
          <code className="d-h2-code">&lt;{component} /&gt;</code>
        </h2>
        <span className="d-api__file">{doc.file}</span>
      </div>
      {doc.props.length ? (
        <div className="d-table-wrap zzz-scrollbar" tabIndex={0} role="region" aria-label={`${component} props`}>
          <Table
            caption={`${component} props`}
            hideCaption
            columns={propColumns}
            rows={doc.props}
            rowKey={(p) => p.name}
          />
        </div>
      ) : (
        <p className="d-muted">No props of its own. Pass children and native attributes.</p>
      )}
    </section>
  );
}

const typeColumns: TableColumn<TypeRow>[] = [
  {
    key: 'name',
    header: 'Field',
    align: 'start',
    rowHeader: true,
    width: 230,
    cell: (r) => (
      <span className="d-prop-name">
        <code>{r.name}</code>
        {r.required && <span className="d-required">Required</span>}
      </span>
    ),
  },
  { key: 'type', header: 'Type', align: 'start', width: 330, cell: (r) => typeCell(r.type) },
  {
    key: 'description',
    header: 'Description',
    align: 'start',
    cell: (r) => (
      <span className="d-prop-desc">
        <Prose text={r.description} />
      </span>
    ),
  },
];

export function TypeTable({ name, rows }: { name: string; rows: TypeRow[] }) {
  return (
    <section className="d-api" id={`type-${name}`}>
      <div className="d-api__head">
        <h2 className="d-h2">
          <code className="d-h2-code">{name}</code>
        </h2>
        <span className="d-api__file">type</span>
      </div>
      <div className="d-table-wrap zzz-scrollbar" tabIndex={0} role="region" aria-label={`${name} fields`}>
        <Table caption={`${name} fields`} hideCaption columns={typeColumns} rows={rows} rowKey={(r) => r.name} />
      </div>
    </section>
  );
}
