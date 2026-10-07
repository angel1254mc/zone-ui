#!/usr/bin/env node
// Fetches extra, verifiable facts for the "ZZZ Trivia" example page (faction / full name /
// birthday / attack type per agent) from the same CDN the art manifest comes from
// (static.nanoka.cc), and writes them to examples/pages/Trivia/facts.json.
// Only plain data facts are kept (no text, no art). Usage: node scripts/fetch-trivia-data.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The committed art manifest (`npm run art-manifest`): agent ids, names and the CDN version.
const manifestPath = resolve(root, 'examples/art/art-manifest.json');
const outPath = resolve(root, 'examples/pages/Trivia/facts.json');
const CDN = 'https://static.nanoka.cc';

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const version = manifest.version;
const first = (o) => (o && typeof o === 'object' ? (Object.values(o)[0] ?? null) : null);

const agents = {};
for (const a of manifest.agents) {
  try {
    const r = await fetch(`${CDN}/zzz/${version}/en/character/${a.id}.json`);
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json();
    const info = d.partner_info ?? {};
    agents[a.id] = {
      name: a.name,
      faction: first(d.camp),
      fullName: typeof info.full_name === 'string' && info.full_name.trim() ? info.full_name.trim() : null,
      birthday: typeof info.birthday === 'string' && info.birthday.trim() ? info.birthday.trim() : null,
      attackType: first(d.hit_type),
    };
    process.stdout.write('.');
  } catch (e) {
    console.warn(`\n${a.id} ${a.name}: ${e.message}`);
  }
}

const out = {
  source: CDN,
  version,
  fetchedAt: new Date().toISOString(),
  agents,
};
await writeFile(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`\nwrote ${Object.keys(agents).length} agents → ${outPath}`);
