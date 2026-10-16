// WCAG contrast check for the docs chrome: header, sidebars, page header, tabs, buttons, tables and the
// on-this-page rail. For every visible text run it reads the computed text colour, finds the effective
// background by compositing every element painted under the text (ancestors and positioned siblings such
// as tab chips, each with its opacity), and computes the contrast ratio. Live demos, gallery previews and
// syntax-highlighted code are skipped: those colours belong to the components and the code theme.
//
//   npm run site:dev                    # in another terminal (or point BASE at a preview server)
//   PLAYWRIGHT_CORE=<path to a playwright-core package> node site/scripts/contrast.mjs [base-url]
//
// Thresholds: 4.5:1 for body text, 3:1 for large text (≥ 24 px, or ≥ 18.66 px at weight ≥ 700), and a 7:1
// target for navigation links (reported, not failed). Exits 1 when any text is under its AA threshold.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const base = (process.argv[2] ?? process.env.BASE ?? 'http://localhost:5180').replace(/\/$/, '');
const PAGES = [
  ['/components/button', 1440],
  ['/components/button/properties', 1440],
  ['/components/select/properties', 1440],
  ['/components', 1440],
  ['/', 1440],
  ['/components/button', 390],
];

async function loadPlaywright() {
  const p = process.env.PLAYWRIGHT_CORE;
  if (!p) return import('playwright-core');
  const entry = existsSync(p) && statSync(p).isDirectory() ? join(p, 'index.mjs') : p;
  return import(pathToFileURL(entry).href);
}

/** Runs in the page: returns one record per visible text run inside the chrome. */
function measure() {
  const ROOTS = '.d-header, .d-shell__side, .d-article, .d-toc';
  const SKIP = '.d-stage, .d-play__stage, .d-card__preview, .d-showcase, .d-code__pre, [aria-hidden="true"], [inert]';
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return [0, 0, 0, 0];
    const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
    return [+r, +g, +b, +a];
  };
  const over = (top, under) => {
    const a = top[3];
    return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1);
  };
  const lum = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const opacityOf = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity;
    return o;
  };
  const hex = (c) =>
    '#' +
    c
      .slice(0, 3)
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('');
  const backgroundAt = (x, y) => {
    const stack = document.elementsFromPoint(x, y).reverse();
    if (!stack.length) return null;
    let bg = [255, 255, 255, 1];
    for (const el of stack) {
      const o = opacityOf(el);
      for (const pseudo of [null, '::before', '::after']) {
        const cs = getComputedStyle(el, pseudo);
        if (pseudo && (cs.content === 'none' || cs.content === 'normal' || cs.position !== 'absolute')) continue;
        const c = parse(cs.backgroundColor);
        if (c[3] > 0) bg = over([c[0], c[1], c[2], c[3] * o], bg);
      }
    }
    return bg;
  };
  const category = (el) => {
    const is = (s) => el.closest(s);
    if (is('.d-nav__link')) return is('[aria-current]') ? 'header link (current)' : 'header link';
    if (is('.d-cta')) return 'header CTA';
    if (is('.d-header')) return 'header other';
    if (is('.d-side__link')) return is('[aria-current]') ? 'sidebar link (current)' : 'sidebar link';
    if (is('.d-shell__side')) return 'sidebar label / count';
    if (is('.d-tabs [role="tab"]')) return is('[aria-selected="true"]') ? 'page tab (selected)' : 'page tab';
    if (is('[role="tab"]')) return is('[aria-selected="true"]') ? 'preview/code tab (selected)' : 'preview/code tab';
    if (is('th')) return 'table header';
    if (is('td')) return 'table cell';
    if (is('button, .zzz-button')) return 'button';
    if (is('.d-toc')) return 'on-this-page rail';
    return 'page text';
  };

  const style = document.createElement('style');
  style.textContent = '* { pointer-events: auto !important; }';
  document.head.append(style);
  const out = [];
  for (const root of document.querySelectorAll(ROOTS)) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      const el = node.parentElement;
      if (!text || !el || el.closest(SKIP)) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility !== 'visible' || cs.display === 'none') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = [...range.getClientRects()].find((r) => r.width > 1 && r.height > 1);
      const y = rect && rect.top + rect.height / 2;
      if (!rect || y < 0 || y >= innerHeight) continue;
      const fg0 = parse(cs.color);
      const alpha = fg0[3] * opacityOf(el);
      if (alpha < 0.05) continue;
      let worst = null;
      for (const f of [0.2, 0.5, 0.8]) {
        const x = rect.left + rect.width * f;
        const bg = x >= 0 && x < innerWidth ? backgroundAt(x, y) : null;
        if (!bg) continue;
        const fg = over([fg0[0], fg0[1], fg0[2], alpha], bg);
        const r = ratio(fg, bg);
        if (!worst || r < worst.ratio) worst = { ratio: r, fg: hex(fg), bg: hex(bg) };
      }
      if (!worst) continue;
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      out.push({ text: text.slice(0, 40), category: category(el), size, weight, large, ...worst });
    }
  }
  // Placeholders are text too.
  for (const input of document.querySelectorAll('.d-header input, .d-shell__side input')) {
    const r = input.getBoundingClientRect();
    if (!r.width || !input.placeholder) continue;
    const ph = parse(getComputedStyle(input, '::placeholder').color);
    const bg = backgroundAt(r.left + r.width / 2, r.top + r.height / 2);
    if (!bg) continue;
    const fg = over(ph, bg);
    out.push({
      text: `placeholder "${input.placeholder}"`,
      category: 'placeholder',
      size: parseFloat(getComputedStyle(input).fontSize),
      weight: 400,
      large: false,
      ratio: ratio(fg, bg),
      fg: hex(fg),
      bg: hex(bg),
    });
  }
  style.remove();
  return out;
}

const pw = await loadPlaywright();
const browser = await pw.chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' });
let failures = 0;
const summary = new Map();
for (const [path, width] of PAGES) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const rows = await page.evaluate(measure);
  await page.close();
  for (const r of rows) {
    const need = r.large ? 3 : 4.5;
    const key = r.category;
    const s = summary.get(key) ?? { min: Infinity, max: 0, n: 0, minAt: '' };
    s.n++;
    if (r.ratio < s.min)
      Object.assign(s, { min: r.ratio, minAt: `"${r.text}" ${r.fg} on ${r.bg} (${path} @${width})` });
    s.max = Math.max(s.max, r.ratio);
    summary.set(key, s);
    if (r.ratio < need) {
      failures++;
      console.log(
        `FAIL ${r.ratio.toFixed(2)}:1 < ${need}  [${r.category}] "${r.text}" ${r.fg} on ${r.bg}  ${path} @${width}`
      );
    } else if (/link/.test(r.category) && r.ratio < 7) {
      console.log(`note ${r.ratio.toFixed(2)}:1 < 7 target  [${r.category}] "${r.text}"  ${path} @${width}`);
    }
  }
}
await browser.close();

console.log('\ncategory                       texts   min      max      lowest');
for (const [k, s] of [...summary].sort()) {
  console.log(
    `${k.padEnd(30)} ${String(s.n).padStart(5)}   ${s.min.toFixed(2).padStart(5)}:1  ${s.max.toFixed(2).padStart(5)}:1  ${s.minAt}`
  );
}
console.log(failures ? `\n${failures} text run(s) under WCAG AA` : '\nAll text meets WCAG AA.');
process.exitCode = failures ? 1 : 0;
