// Generates site/app/generated/props.json: the props of every component in src/components, read from the
// TypeScript source with react-docgen-typescript. Run it after changing a component's props:
//   npm run site:docgen
import { readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve, sep } from 'node:path';

const require = createRequire(import.meta.url);
const docgen = require('react-docgen-typescript');

const repo = resolve(import.meta.dirname, '../..');
const out = resolve(import.meta.dirname, '../app/generated/props.json');

const parser = docgen.withCustomConfig(join(repo, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Keep the component's own props; drop the inherited DOM and React attribute lists.
  propFilter: (prop) => !(prop.parent && /node_modules/.test(prop.parent.fileName)),
});

const isComponentFile = (f) => /\.tsx$/.test(f) && !/\.(stories|test)\.tsx$/.test(f) && !/story-helpers/.test(f);
const files = [];
for (const dir of readdirSync(join(repo, 'src/components'))) {
  for (const f of readdirSync(join(repo, 'src/components', dir))) {
    if (isComponentFile(f)) files.push(join(repo, 'src/components', dir, f));
  }
}

/** Enum types print their literal values (`"sm" | "md" | "lg"`), everything else its type name. */
const typeOf = (t) => (t.name === 'enum' && Array.isArray(t.value) ? t.value.map((v) => v.value).join(' | ') : t.name);

const result = {};
for (const c of parser.parse(files).sort((a, b) => a.displayName.localeCompare(b.displayName))) {
  result[c.displayName] = {
    file: relative(repo, c.filePath).split(sep).join('/'),
    description: c.description,
    props: Object.values(c.props)
      .map((p) => ({
        name: p.name,
        type: typeOf(p.type),
        required: p.required,
        default: p.defaultValue ? String(p.defaultValue.value) : null,
        description: p.description,
      }))
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
  };
}
writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(`${Object.keys(result).length} components -> ${relative(repo, out).split(sep).join('/')}`);
