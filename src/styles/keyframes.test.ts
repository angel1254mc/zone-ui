// @keyframes names are global: two components defining the same name silently override each
// other depending on stylesheet order (this hid every Screen once ScreenTransition loaded).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = join(import.meta.dirname, '..')

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return cssFiles(p)
    return p.endsWith('.css') ? [p] : []
  })
}

it('every @keyframes name in the library is defined exactly once', () => {
  const owners = new Map<string, string[]>()
  for (const file of cssFiles(SRC)) {
    for (const m of readFileSync(file, 'utf8').matchAll(/@keyframes\s+([\w-]+)/g)) {
      owners.set(m[1], [...(owners.get(m[1]) ?? []), relative(SRC, file)])
    }
  }
  const dupes = [...owners].filter(([, files]) => files.length > 1).map(([name, files]) => `${name}: ${files.join(', ')}`)
  expect(dupes).toEqual([])
})

it('every zzz-* animation name used in the library has a matching @keyframes', () => {
  const defined = new Set<string>()
  const used = new Map<string, string>()
  for (const file of cssFiles(SRC)) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) defined.add(m[1])
    for (const m of css.matchAll(/animation(?:-name)?\s*:([^;}]+)/g)) {
      for (const n of m[1].matchAll(/(?<![\w-])zzz-[\w-]+/g)) used.set(n[0], relative(SRC, file))
    }
  }
  expect(defined).toContain('zzz-screen-out-fade')
  const missing = [...used].filter(([name]) => !defined.has(name)).map(([name, file]) => `${name} (${file})`)
  expect(missing).toEqual([])
})
