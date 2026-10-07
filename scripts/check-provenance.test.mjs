// @vitest-environment node
// Self-test for scripts/check-provenance.mjs: runs the real CLI against throw-away fixture folders.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'check-provenance.mjs');
const WORD = 'forbidden-word';
const fixtures = [];

function fixture(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'zone-check-'));
  fixtures.push(root);
  for (const [rel, content] of Object.entries(files)) put(root, rel, content);
  return root;
}

function put(root, rel, content) {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, typeof content === 'string' || Buffer.isBuffer(content) ? content : JSON.stringify(content));
}

/** Runs the CLI. `patterns` = object to write as the private pattern file, or null for none. */
function run(root, args = [], { patterns = null } = {}) {
  const patternFile = join(root, '..', `${root.split(/[\\/]/).pop()}-patterns.json`);
  if (patterns) writeFileSync(patternFile, JSON.stringify(patterns));
  else rmSync(patternFile, { force: true });
  const res = spawnSync(process.execPath, [SCRIPT, '--root', root, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      ZONE_PROVENANCE_PATTERNS: patternFile,
      ZONE_PROVENANCE_IGNORE: join(root, '..', `${root.split(/[\\/]/).pop()}-ignore`),
    },
  });
  return { code: res.status, out: `${res.stdout}${res.stderr}` };
}

const PATTERNS = {
  hard: [WORD, { source: 'be+f', flags: 'i' }],
  soft: ['softish'],
};

afterEach(() => {
  while (fixtures.length) {
    const root = fixtures.pop();
    rmSync(root, { recursive: true, force: true });
    for (const suffix of ['-patterns.json', '-ignore']) rmSync(`${root}${suffix}`, { force: true });
  }
});

describe('check-provenance --source', () => {
  it('passes a clean tree and says when the private patterns are absent', () => {
    const root = fixture({
      'README.md': '# Hello\n',
      'src/a.ts': 'export const a = 1\n',
    });
    const r = run(root);
    expect(r.out).toContain('running built-in checks only');
    expect(r.code).toBe(0);
  });

  it('exits 2 under --strict when the private patterns are missing', () => {
    const root = fixture({ 'README.md': 'ok\n' });
    expect(run(root, ['--strict']).code).toBe(2);
  });

  it('exits 2 on an unknown option or an invalid pattern file', () => {
    const root = fixture({ 'README.md': 'ok\n' });
    expect(run(root, ['--nope']).code).toBe(2);
    expect(run(root, [], { patterns: { hard: ['('] } }).code).toBe(2);
  });

  it('fails on a HARD pattern and names file and line', () => {
    const root = fixture({ 'notes.md': `line one\nsee the ${WORD} here\n` });
    const r = run(root, [], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('notes.md:2');
  });

  it('checks file names against the HARD patterns', () => {
    const root = fixture({ [`docs/${WORD}.md`]: 'clean\n' });
    const r = run(root, [], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('FILE NAME');
  });

  it('ignores matches inside hex colour literals', () => {
    const root = fixture({ 'a.css': '.x { color: #beef; }\n' });
    expect(run(root, [], { patterns: PATTERNS }).code).toBe(0);
    const bad = fixture({ 'a.css': '/* beef */\n' });
    expect(run(bad, [], { patterns: PATTERNS }).code).toBe(1);
    // A non-hex match after '#' (id selector, URL fragment) is still a hit.
    const fragment = fixture({ 'a.md': `[link](#${WORD})\n` });
    expect(run(fragment, [], { patterns: PATTERNS }).code).toBe(1);
  });

  it('suppresses a hit only when an allow entry covers the same span in a matching file', () => {
    // The allowlist is scanned like any other file, so its pattern must not spell the term out.
    const allow = {
      entries: [
        {
          glob: 'docs/**',
          pattern: `the ${WORD.slice(0, -1)}[${WORD.slice(-1)}] badge`,
          why: 'test',
        },
      ],
    };
    const ok = fixture({
      'scripts/check-provenance.allow.json': allow,
      'docs/a.md': `the ${WORD} badge\n`,
    });
    expect(run(ok, [], { patterns: PATTERNS }).code).toBe(0);

    const otherSpan = fixture({
      'scripts/check-provenance.allow.json': allow,
      'docs/a.md': `the ${WORD} badge, ${WORD}\n`,
    });
    expect(run(otherSpan, [], { patterns: PATTERNS }).code).toBe(1);

    const otherFile = fixture({
      'scripts/check-provenance.allow.json': allow,
      'src/a.md': `the ${WORD} badge\n`,
    });
    expect(run(otherFile, [], { patterns: PATTERNS }).code).toBe(1);
  });

  it('rejects allow entries without a reason', () => {
    const root = fixture({
      'scripts/check-provenance.allow.json': {
        entries: [{ glob: '**', pattern: 'x' }],
      },
    });
    expect(run(root).code).toBe(2);
  });

  it('prints SOFT hits only with --soft and never fails on them', () => {
    const root = fixture({ 'a.md': 'a softish line\n' });
    expect(run(root, [], { patterns: PATTERNS }).out).not.toContain('SOFT');
    const r = run(root, ['--soft'], { patterns: PATTERNS });
    expect(r.code).toBe(0);
    expect(r.out).toContain('a.md:1');
  });

  it('fails on absolute user-home paths without any private patterns', () => {
    const winPath = ['C:', 'Users', 'someone', 'file.txt'].join('\\');
    const root = fixture({ 'a.md': `path ${winPath}\n` });
    expect(run(root).code).toBe(1);
    const posix = fixture({
      'a.md': `path ${['', 'home', 'someone', 'x'].join('/')}\n`,
    });
    expect(run(posix).code).toBe(1);
  });

  it('fails on media files, oversized files and raster images outside the allowed folders', () => {
    expect(run(fixture({ 'clip.webm': Buffer.from([0, 1, 2]) })).out).toContain('media file');
    expect(run(fixture({ 'big.txt': Buffer.alloc(5 * 1024 * 1024 + 1, 97) })).code).toBe(1);

    const raster = fixture({
      'img/a.png': Buffer.from([137, 80, 78, 71, 0]),
    });
    expect(run(raster).code).toBe(1);
    put(raster, 'scripts/check-provenance.allow.json', {
      rasterDirs: ['img'],
    });
    const r = run(raster);
    expect(r.code).toBe(0);
    expect(r.out).toContain('BINARY FILES');
  });

  it('honours .gitignore and the local ignore file before a repository exists', () => {
    const root = fixture({
      '.gitignore': 'build/\n*.log\n',
      'build/a.md': WORD,
      'x.log': WORD,
      'private/b.md': WORD,
      'ok.md': 'ok',
    });
    writeFileSync(`${root}-ignore`, '/private/\n');
    expect(run(root, [], { patterns: PATTERNS }).code).toBe(0);
    rmSync(`${root}-ignore`);
    expect(run(root, [], { patterns: PATTERNS }).out).toContain('private/b.md:1');
  });

  it('limits the scan with --paths', () => {
    const root = fixture({ 'a/one.md': WORD, 'b/two.md': WORD });
    const r = run(root, ['--paths', 'a'], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('a/one.md');
    expect(r.out).not.toContain('b/two.md');
    expect(run(root, ['--paths', 'c/**/*.md'], { patterns: PATTERNS }).code).toBe(0);
  });
});

describe('check-provenance with git', () => {
  const git = (root, ...args) => execFileSync('git', args, { cwd: root, stdio: 'ignore' });
  const repo = (files) => {
    const root = fixture(files);
    git(root, 'init', '-q');
    git(root, 'config', 'user.name', 'Test');
    git(root, 'config', 'user.email', 'test@example.com');
    git(root, 'config', 'commit.gpgsign', 'false');
    return root;
  };

  it('--staged reads the index, not the working copy', () => {
    const root = repo({ 'a.md': 'clean\n' });
    git(root, 'add', 'a.md');
    put(root, 'a.md', `${WORD}\n`);
    expect(run(root, ['--staged'], { patterns: PATTERNS }).code).toBe(0);
    git(root, 'add', 'a.md');
    const r = run(root, ['--staged'], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('staged  a.md:1');
  });

  it('--staged outside a repository is a usage error', () => {
    expect(run(fixture({ 'a.md': 'x' }), ['--staged']).code).toBe(2);
  });

  it('--strict also checks the commit log', () => {
    const root = repo({ 'a.md': 'clean\n' });
    git(root, 'add', '-A');
    git(root, 'commit', '-q', '-m', `add ${WORD}`);
    const r = run(root, ['--strict'], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('(commit log)');
  });
});

describe('check-provenance --package', () => {
  const MIT = 'MIT License\n\nCopyright (c) 2026 Someone\n';
  const pkg = (extra = {}) => ({
    name: 'fixture-pkg',
    version: '1.0.0',
    types: 'dist/index.d.ts',
    files: ['dist', '!dist/**/*.map'],
    ...extra,
  });

  it('passes a clean package', () => {
    const root = fixture({
      'package.json': pkg(),
      LICENSE: MIT,
      'dist/index.js': 'export const a = 1\n',
      'dist/index.d.ts': "export * from './a'\nexport type { B } from './b/index.js'\n",
      'dist/a.d.ts': 'export declare const a: number\n',
      'dist/b/index.d.ts': 'export type B = 1\n',
    });
    const r = run(root, ['--package']);
    expect(r.out).toContain('passed');
    expect(r.code).toBe(0);
  }, 60000);

  it('fails on source maps, unreachable or story-only .d.ts files and a placeholder LICENSE', () => {
    const root = fixture({
      'package.json': pkg({ files: ['dist'] }),
      LICENSE: 'MIT License\n\nCopyright (c) <COPYRIGHT HOLDER>\n',
      'dist/index.js': 'export const a = 1\n//# sourceMappingURL=index.js.map\n',
      'dist/index.js.map': '{}',
      'dist/index.d.ts': "export * from './a'\n",
      'dist/a.d.ts': 'export declare const a: number\n',
      'dist/stray.d.ts': 'export {}\n',
      'dist/x.story-helpers.d.ts': 'export {}\n',
    });
    const r = run(root, ['--package']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('sourceMappingURL');
    expect(r.out).toContain('dist/index.js.map: source map in the package');
    expect(r.out).toContain('dist/stray.d.ts: not reachable');
    expect(r.out).toContain('story-only helper');
    expect(r.out).toContain('LICENSE still has template placeholder text');
  }, 60000);

  it('fails when dist/ is missing, stale or the LICENSE is not packed', () => {
    expect(run(fixture({ 'package.json': pkg(), LICENSE: MIT }), ['--package']).out).toContain('dist/ missing');

    const stale = fixture({
      'package.json': pkg(),
      LICENSE: MIT,
      'dist/index.js': 'x\n',
      'dist/index.d.ts': 'export {}\n',
      'src/a.ts': 'x\n',
    });
    const future = new Date(Date.now() + 60_000);
    utimesSync(join(stale, 'src/a.ts'), future, future);
    expect(run(stale, ['--package']).out).toContain('older than src/');

    const noLicence = fixture({
      'package.json': pkg(),
      'dist/index.js': 'x\n',
      'dist/index.d.ts': 'export {}\n',
    });
    expect(run(noLicence, ['--package']).out).toContain('LICENSE file missing');
  }, 60000);

  it('scans packed file contents with the private patterns', () => {
    const root = fixture({
      'package.json': pkg(),
      LICENSE: MIT,
      'dist/index.js': `// ${WORD}\n`,
      'dist/index.d.ts': 'export {}\n',
    });
    const r = run(root, ['--package'], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('npm  dist/index.js:1');
  }, 60000);

  it('scans the site builds with the built-in rules only, not the private patterns', () => {
    const base = {
      'package.json': pkg(),
      LICENSE: MIT,
      'dist/index.js': 'x\n',
      'dist/index.d.ts': 'export {}\n',
    };
    const vendorOnly = fixture({
      ...base,
      'storybook-static/assets/vendor.js': `// ${WORD}\n`,
      'demo-dist/assets/index.js': `// ${WORD}\n`,
    });
    const ok = run(vendorOnly, ['--package', '--strict'], {
      patterns: PATTERNS,
    });
    expect(ok.out).toContain('passed');
    expect(ok.code).toBe(0);

    const leaky = fixture({
      ...base,
      'storybook-static/assets/a.js': `// built from ${['C:', 'Users', 'someone', 'x'].join('\\')}\n`,
      'demo-dist/clip.webm': 'x',
    });
    const r = run(leaky, ['--package', '--strict'], { patterns: PATTERNS });
    expect(r.code).toBe(1);
    expect(r.out).toContain('storybook-static/assets/a.js:1');
    expect(r.out).toContain('demo-dist/clip.webm  media file');
  }, 60000);
});
