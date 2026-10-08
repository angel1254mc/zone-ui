#!/usr/bin/env node
// Generates src/styles/tokens.css and src/styles/tokens.ts from src/styles/tokens.json.
//
//   npm run tokens
//
// Rules:
// - Variable name: --zzz- + JSON path, camelCase keys -> kebab-case
//   (color.accent.lime -> --zzz-color-accent-lime, size.control.pillTop -> --zzz-size-control-pill-top).
// - Numeric leaves are lengths in design units: emitted scaled (--x: calc(N * var(--zzz-px))) AND raw (--x-n: N),
//   except the unitless paths listed in _meta.unitless, which are emitted as plain numbers.
// - String leaves are emitted as-is, but every "<number>px" is rewritten to calc(<number> * var(--zzz-px)).
//   Whole declaration lists ("prop: value; prop: value") are split into one variable per property.
//   Keyframe descriptions and other non-values are left out of the CSS.
// - Object leaves: CSS-valued fields become sub-variables; structured data is left out of the CSS.
// - tokens.ts gets every leaf (objects included) with its raw value, as a nested `as const` object.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'src/styles/tokens.json');
const OUT_CSS = resolve(root, 'src/styles/tokens.css');
const OUT_TS = resolve(root, 'src/styles/tokens.ts');

const json = JSON.parse(readFileSync(SRC, 'utf8'));
const meta = json._meta ?? {};

// ---------------------------------------------------------------------------
// Unitless paths (_meta.unitless): numbers emitted as-is, without --zzz-px scaling.
const UNITLESS = meta.unitless;
if (!Array.isArray(UNITLESS)) throw new Error('tokens.json: _meta.unitless must list the unitless token paths');
const isUnitless = (path) => UNITLESS.some((p) => (p.endsWith('.*') ? path.startsWith(p.slice(0, -1)) : path === p));

// Leaves that are not CSS values: left out of tokens.css (still exported from tokens.ts).
const SKIP = [
  (p) => p.startsWith('motion.keyframes.'), // keyframe description; the @keyframes live in component CSS
  (p) => p === 'font.family.googleFontsCss', // Google Fonts URL; the shipped import lives in fonts.css
  (p) => p === 'pattern.watermark.content', // copy text for the SVG lettering
];

// Object leaves: which fields are CSS values.
const OBJECT_FIELDS = {
  'color.accent.pulse': ['from', 'to', 'period', 'phaseOffset', 'interpolation'],
};

// ---------------------------------------------------------------------------
const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
const varName = (segments) => `--zzz-${segments.map(kebab).join('-')}`;
const fmtNum = (n) => String(n);

/** calc(N * var(--zzz-px)) for every "<number>px" in a string. */
const scalePx = (s) =>
  s.replace(
    /(^|[^\w#.-])(-?(?:\d+\.?\d*|\.\d+))px\b/g,
    (_, pre, n) => `${pre}calc(${fmtNum(Number(n))} * var(--zzz-px))`
  );

/** Split "prop: value; prop: value" at top level (not inside parentheses). */
function splitDeclarations(s) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) {
      parts.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf(':');
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    });
}
const isDeclarationList = (s) => /^\s*-?[a-z][a-z-]*\s*:\s*(?!\/\/)\S/.test(s) && !/^\s*https?:/.test(s);

// ---------------------------------------------------------------------------
const cssLines = [];
const stats = { vars: 0, skipped: 0 };
const emit = (name, value) => {
  cssLines.push(`  ${name}: ${value};`);
  stats.vars++;
};
const skip = () => {
  stats.skipped++;
};

function emitLeaf(segments, value) {
  const path = segments.join('.');
  if (SKIP.some((match) => match(path))) return skip();
  const name = varName(segments);

  if (typeof value === 'number') {
    if (isUnitless(path)) return emit(name, fmtNum(value));
    emit(name, `calc(${fmtNum(value)} * var(--zzz-px))`);
    emit(`${name}-n`, fmtNum(value));
    return;
  }
  if (typeof value === 'string') {
    if (isDeclarationList(value)) {
      for (const [prop, v] of splitDeclarations(value)) emit(`${name}-${prop}`, scalePx(v));
      return;
    }
    return emit(name, scalePx(value));
  }
  if (value && typeof value === 'object') {
    // Structured data for code (tokens.ts); only the OBJECT_FIELDS of a path are CSS values.
    const fields = OBJECT_FIELDS[path];
    if (!fields) return skip();
    for (const f of fields) if (value[f] !== undefined) emitLeaf([...segments, f], value[f]);
    return;
  }
  skip();
}

/** A leaf is { value }. (A group may legitimately contain a token named "value", e.g. color.highlight.value.) */
const isLeaf = (node) =>
  node &&
  typeof node === 'object' &&
  !Array.isArray(node) &&
  'value' in node &&
  Object.keys(node).every((k) => k === 'value') &&
  !(node.value && typeof node.value === 'object' && !Array.isArray(node.value) && 'value' in node.value);

function walk(node, segments, ts) {
  for (const [key, child] of Object.entries(node)) {
    if (segments.length === 0 && key === '_meta') continue;
    if (isLeaf(child)) {
      emitLeaf([...segments, key], child.value);
      ts[key] = child.value;
    } else if (child && typeof child === 'object') {
      if (segments.length === 0) cssLines.push('');
      ts[key] = {};
      walk(child, [...segments, key], ts[key]);
    }
  }
}

const tsTree = {};
walk(json, [], tsTree);

// ---------------------------------------------------------------------------
const header = `/*
 * GENERATED by scripts/build-tokens.mjs from src/styles/tokens.json — do not edit by hand.
 * Regenerate with: npm run tokens
 *
 * Lengths are written in design units; one unit renders as var(--zzz-px) = 1rem/16 × --zzz-scale:
 *   --zzz-px = calc(1rem / 16 * var(--zzz-scale))     --zzz-scale: 0.7 (default, on :root)
 * so every size follows the user's font-size setting and zoom, never the screen resolution.
 * At the default and a 16 px root font size, an md control is ~40 px tall (57 units) and body
 * text ~14 px (20 units). --zzz-scale: 1 renders one unit as one CSS px (larger controls).
 *
 * Each length token exists twice:
 *   --zzz-<path>    calc(N * var(--zzz-px))   scaled length, use in CSS
 *   --zzz-<path>-n  N                          raw number of design units, for calc() maths
 * --zzz-px is a registered <length>, so descendants inherit an absolute length.
 * --zzz-scale is declared on :root only: a top-level .zzz-theme inherits it (so a global
 * ":root { --zzz-scale: 1 }" reaches every theme root) and recomputes its own --zzz-px from it.
 * Re-scale a subtree by giving it the class "zzz-theme" and a new --zzz-scale (or --zzz-px) in
 * its inline style (or use <ZzzTheme scale>). A nested .zzz-theme without an inline scale keeps
 * its parent's --zzz-px (base.css). --zzz-focus-ring is the keyline + accent ring that
 * :focus-visible draws.
 */
`;
const css = `${header}
@property --zzz-px {
  syntax: '<length>';
  inherits: true;
  initial-value: 1px;
}

@property --zzz-accent {
  syntax: '<color>';
  inherits: true;
  initial-value: #93BA00;
}

:root {
  --zzz-scale: 0.7;
}

:root,
.zzz-theme {
  --zzz-px: calc(1rem / 16 * var(--zzz-scale, 0.7));
${cssLines.join('\n')}

  --zzz-focus-ring: 0 0 0 calc(3 * var(--zzz-px)) #000000, 0 0 0 calc(6 * var(--zzz-px)) var(--zzz-accent);
}
`;

/** TS literal: identifier keys unquoted, short arrays inline, strings single-quoted. */
function toTs(v, indent = '') {
  const next = indent + '  ';
  if (Array.isArray(v)) return `[${v.map((x) => toTs(x, next)).join(', ')}]`;
  if (v && typeof v === 'object') {
    const body = Object.entries(v)
      .map(([k, x]) => `${next}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${toTs(x, next)},`)
      .join('\n');
    return `{\n${body}\n${indent}}`;
  }
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return JSON.stringify(v);
}

const ts = `/*
 * GENERATED by scripts/build-tokens.mjs from src/styles/tokens.json — do not edit by hand.
 * Regenerate with: npm run tokens
 *
 * Raw token values: numbers are design units unless the path is unitless; CSS renders them as
 * N * --zzz-px = N / 16 rem × --zzz-scale. In CSS use the custom properties from tokens.css
 * (--zzz-{path}, kebab-case); read this object for values that are structured data
 * (e.g. tokens.layout.wheelSlotOffsets) or for JS maths.
 */
export const tokens = ${toTs(tsTree)} as const

export type Tokens = typeof tokens
`;

mkdirSync(dirname(OUT_CSS), { recursive: true });
writeFileSync(OUT_CSS, css);
writeFileSync(OUT_TS, ts);
console.log(`tokens.css: ${stats.vars} custom properties (${stats.skipped} non-values left out) -> ${OUT_CSS}`);
console.log(`tokens.ts: typed token object -> ${OUT_TS}`);
