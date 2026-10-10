// Every demo file under content/<section>/<slug>/demos/, with its source text. A demo is one example: a
// default-exported component in its own file, shown live in the preview and as code in the Code view.
import type { ComponentType } from 'react';
import type { DemoRef, ResolvedDemo } from '../types';

const modules = import.meta.glob<{ default: ComponentType }>('../content/*/*/demos/*.tsx', { eager: true });
const sources = import.meta.glob<string>('../content/*/*/demos/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const KEY = /^\.\.\/content\/([^/]+\/[^/]+)\/demos\/([^/]+)\.tsx$/;

interface DemoFile {
  Demo: ComponentType;
  code: string;
}

const folders = new Map<string, Map<string, DemoFile>>();
for (const [key, mod] of Object.entries(modules)) {
  const m = KEY.exec(key);
  if (!m) continue;
  const [, folder, name] = m;
  if (!folders.has(folder)) folders.set(folder, new Map());
  folders.get(folder)!.set(name, { Demo: mod.default, code: sources[key] ?? '' });
}

/** Demo file names (without `.tsx`) in one content folder, e.g. `demoNames('components/button')`. */
export const demoNames = (folder: string): string[] => [...(folders.get(folder)?.keys() ?? [])].sort();

/** Resolves a `{ demo }` reference inside `folder`. Throws with the expected path when the file is missing. */
export function resolveDemo(folder: string, ref: DemoRef): ResolvedDemo {
  const file = folders.get(folder)?.get(ref.demo);
  if (!file) throw new Error(`Missing demo file: site/app/content/${folder}/demos/${ref.demo}.tsx`);
  if (typeof file.Demo !== 'function') {
    throw new Error(`site/app/content/${folder}/demos/${ref.demo}.tsx must default-export a component`);
  }
  return { id: ref.demo, Demo: file.Demo, code: file.code, frame: ref.frame ?? 'center' };
}
