import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { tokens } from '../styles/tokens'

// Vitest runs with css: false, so the generated stylesheets are checked as text.
const read = (file: string) => readFileSync(resolve(__dirname, '../styles', file), 'utf8')
const tokensCss = read('tokens.css')
const baseCss = read('base.css')

/** The value of a custom property declared in the `:root, .zzz-theme` block. */
const declared = (name: string) => tokensCss.match(new RegExp(`\\n\\s*${name}:\\s*([^;]+);`))?.[1]

describe('tokens.css: web-standard (rem) sizing', () => {
  it('keeps --zzz-px a registered, inherited <length> with an absolute initial value', () => {
    expect(tokensCss).toMatch(/@property --zzz-px \{\s*syntax: '<length>';\s*inherits: true;\s*initial-value: 1px;\s*\}/)
  })

  it('derives --zzz-px from the root font size: 1 design unit = 1/16 rem x --zzz-scale', () => {
    expect(declared('--zzz-px')).toBe('calc(1rem / 16 * var(--zzz-scale, 0.7))')
    expect(tokensCss).toMatch(/:root,\s*\.zzz-theme \{\s*--zzz-px: calc\(1rem \/ 16 \* var\(--zzz-scale, 0\.7\)\);/)
    expect(tokensCss).not.toContain('calc(1px * var(--zzz-scale))')
  })

  it('defaults --zzz-scale to 0.7 on :root, inherited (not reset) by top-level .zzz-theme roots', () => {
    expect(tokensCss).toMatch(/:root \{\s*--zzz-scale: 0\.7;/)
    // A .zzz-theme must not re-declare the scale, so `:root { --zzz-scale: 1 }` reaches <ZzzTheme>.
    expect(tokensCss).not.toMatch(/\.zzz-theme \{[^}]*--zzz-scale:/)
  })

  it('re-scales a nested .zzz-theme with an inline --zzz-scale using the same rem formula', () => {
    expect(baseCss).toMatch(/\.zzz-theme \.zzz-theme\[style\*='--zzz-scale'\] \{\s*--zzz-px: calc\(1rem \/ 16 \* var\(--zzz-scale\)\);/)
    expect(baseCss).not.toMatch(/--zzz-px: calc\(1px \* var\(--zzz-scale\)\)/)
  })

  it('keeps existing token names (scaled + raw)', () => {
    expect(declared('--zzz-size-control-pill')).toBe('calc(57 * var(--zzz-px))')
    expect(declared('--zzz-size-control-pill-n')).toBe('57')
    expect(declared('--zzz-size-control-pill-top')).toBe('calc(59 * var(--zzz-px))')
    expect(declared('--zzz-font-size-button')).toBe('calc(26 * var(--zzz-px))')
    expect(declared('--zzz-border-width-ring')).toMatch(/var\(--zzz-px\)/)
  })
})

describe('control size scale (sm / md / lg)', () => {
  const scale = {
    '--zzz-size-control-sm': 46,
    '--zzz-size-control-md': 57,
    '--zzz-size-control-lg': 69,
    '--zzz-size-control-cap-sm': 46,
    '--zzz-size-control-cap-md': 57,
    '--zzz-size-control-cap-lg': 69,
    '--zzz-size-control-disc-sm': 27,
    '--zzz-size-control-disc-md': 34,
    '--zzz-size-control-disc-lg': 41,
    '--zzz-size-control-icon-sm': 22,
    '--zzz-size-control-icon-md': 28,
    '--zzz-size-control-icon-lg': 34,
    '--zzz-size-control-padding-x-sm': 36,
    '--zzz-size-control-padding-x-md': 44,
    '--zzz-size-control-padding-x-lg': 53,
    '--zzz-font-size-control-sm': 21,
    '--zzz-font-size-control-md': 26,
    '--zzz-font-size-control-lg': 30,
  }

  it.each(Object.entries(scale))('%s = %i design units (scaled + raw)', (name, n) => {
    expect(declared(name)).toBe(`calc(${n} * var(--zzz-px))`)
    expect(declared(`${name}-n`)).toBe(String(n))
  })

  it('md matches the default pill and button label', () => {
    expect(tokens.size.control.md).toBe(tokens.size.control.pill)
    expect(tokens.size.control.cap.md).toBe(tokens.size.control.iconCap)
    expect(tokens.size.control.disc.md).toBe(tokens.size.control.iconDisc)
    expect(tokens.fontSize.control.md).toBe(tokens.fontSize.button)
  })

  it('lands on the conventional web 32 / 40 / 48 px heights at the default scale and a 16 px root', () => {
    const css = (n: number) => Math.round(n * 0.7)
    expect([tokens.size.control.sm, tokens.size.control.md, tokens.size.control.lg].map(css)).toEqual([32, 40, 48])
  })
})
