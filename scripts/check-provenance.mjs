#!/usr/bin/env node
// Repository and package hygiene check.
//
//   node scripts/check-provenance.mjs [--source] [--package] [--staged] [--strict] [--soft]
//                                     [--paths <glob,...>] [--root <dir>] [--allow <file>]
//
// Modes (combinable; --source is the default when neither --package nor --staged is given):
//   --source   every file a commit would include: `git ls-files --cached --others --exclude-standard`
//              inside a git work tree, otherwise a directory walk that honours .gitignore.
//   --staged   only the files staged for commit, read from the git index (for a pre-commit hook).
//   --package  the files `npm pack --dry-run` would publish, plus checks on a fresh dist/ build;
//              storybook-static/ and demo-dist/ are scanned too when present, with the built-in
//              checks only (they bundle third-party code; the private patterns are not applied).
// Options:
//   --strict   the private pattern file (below) must exist; also checks the git author log.
//   --soft     print SOFT pattern hits for review (they never fail the run).
//   --paths    limit the scan to these globs / folders (comma-separated, repo-relative).
//   --root     the project root (default: current directory).
//   --allow    allowlist file (default: <root>/scripts/check-provenance.allow.json).
//
// Built-in checks (always available, no private data needed):
//   source/staged : no absolute user-home paths in text files; no media files; raster images only
//                   in the allowlisted folders; no file over 5 MB.
//   package       : the above on the pack list, plus no source maps (files or sourceMappingURL
//                   comments), a LICENSE without template placeholders, and no .d.ts that the
//                   package's type entry cannot reach (story-only helpers in particular).
//
// Private patterns: an optional JSON file kept outside this repository,
//   { "hard": [pattern...], "soft": [pattern...] }   pattern = "regex" | { "source": "...", "flags": "i" }
// read from $ZONE_PROVENANCE_PATTERNS, default ../zone-design-references/tools/provenance-patterns.json
// (relative to the root). HARD hits fail the run; SOFT hits are printed with --soft.
// Before a git repository exists, the walk also skips the paths listed (gitignore syntax) in
// $ZONE_PROVENANCE_IGNORE, default ../zone-design-references/tools/provenance-ignore — the local
// equivalent of .git/info/exclude.
//
// Allowlist entries { "glob", "pattern", "why" } suppress a content hit only when the file matches
// `glob` and `pattern` matches a span on the same line that covers the hit. `rasterDirs` lists the
// folders where raster images may live.
//
// Exit codes: 0 = pass, 1 = HARD hit or failed structural check, 2 = usage or configuration error.

import { execFileSync, execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MAX_BYTES = 5 * 1024 * 1024
const MEDIA = /\.(mp4|m4v|mov|mkv|webm|avi|wmv|flv|mpe?g)$/i
const RASTER = /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|ico|heic)$/i
const BINARY =
    /\.(woff2?|ttf|otf|eot|mp3|wav|ogg|flac|m4a|pdf|zip|gz|tgz|7z|rar|wasm|exe|dll|node)$/i
const ABSOLUTE_PATHS = [/[A-Za-z]:[\\/]Users[\\/]/, /\/(Users|home)\/[^/\s]+\//]
const LICENSE_PLACEHOLDER = [
    /<\s*(copyright|holder|name|year|owner|author)[^>]*>/i,
    /\[\s*(yyyy|year|fullname|full name|name of copyright owner|copyright holder)\s*\]/i,
]
const ALWAYS_SKIP = new Set(['.git', 'node_modules'])

// ---------------------------------------------------------------- CLI

class UsageError extends Error {}

function parseArgs(argv) {
    const o = {
        source: false,
        package: false,
        staged: false,
        strict: false,
        soft: false,
        paths: [],
        root: '.',
        allow: null,
    }
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--source') o.source = true
        else if (a === '--package') o.package = true
        else if (a === '--staged') o.staged = true
        else if (a === '--strict') o.strict = true
        else if (a === '--soft') o.soft = true
        else if (a === '--paths' || a === '--root' || a === '--allow') {
            const v = argv[++i]
            if (!v || v.startsWith('--'))
                throw new UsageError(`${a} needs a value`)
            if (a === '--paths')
                o.paths.push(
                    ...v
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                )
            else o[a.slice(2)] = v
        } else if (a === '--help' || a === '-h') {
            o.help = true
        } else throw new UsageError(`unknown option ${a}`)
    }
    if (!o.source && !o.package && !o.staged) o.source = true
    return o
}

// ---------------------------------------------------------------- globs and ignore files

const toPosix = (p) => p.split('\\').join('/')

function globSource(glob) {
    let s = ''
    for (let i = 0; i < glob.length; i++) {
        const c = glob[i]
        if (c === '*') {
            if (glob[i + 1] === '*') {
                if (glob[i + 2] === '/') {
                    s += '(?:.*/)?'
                    i += 2
                } else {
                    s += '.*'
                    i++
                }
            } else s += '[^/]*'
        } else if (c === '?') s += '[^/]'
        else if (c === '{') {
            const end = glob.indexOf('}', i)
            if (end < 0) {
                s += '\\{'
                continue
            }
            s +=
                '(?:' +
                glob
                    .slice(i + 1, end)
                    .split(',')
                    .map(globSource)
                    .join('|') +
                ')'
            i = end
        } else s += c.replace(/[.+^$()|[\]\\]/g, '\\$&')
    }
    return s
}

/** A repo-relative glob, or a plain folder/file path that also matches everything below it. */
function pathMatcher(glob) {
    const g = toPosix(glob).replace(/^\.\//, '').replace(/\/$/, '')
    if (!/[*?{]/.test(g)) return (rel) => rel === g || rel.startsWith(g + '/')
    const re = new RegExp('^' + globSource(g) + '$')
    return (rel) => re.test(rel)
}

function compileIgnore(text) {
    const rules = []
    for (const raw of text.split(/\r?\n/)) {
        let l = raw.replace(/\s+$/, '')
        if (!l || l.startsWith('#')) continue
        const neg = l.startsWith('!')
        if (neg) l = l.slice(1)
        const dirOnly = l.endsWith('/')
        if (dirOnly) l = l.slice(0, -1)
        const anchored = l.includes('/')
        if (l.startsWith('/')) l = l.slice(1)
        rules.push({
            re: new RegExp(
                (anchored ? '^' : '(?:^|/)') + globSource(l) + '(?:/|$)'
            ),
            neg,
            dirOnly,
        })
    }
    return rules
}

function isIgnored(rules, rel, isDir) {
    let ignored = false
    for (const r of rules) {
        const m = r.re.exec(rel)
        if (!m) continue
        if (r.dirOnly && !isDir && m.index + m[0].length === rel.length)
            continue
        ignored = !r.neg
    }
    return ignored
}

// ---------------------------------------------------------------- patterns

function compilePattern(p, where) {
    const { source, flags = '' } =
        typeof p === 'string' ? { source: p } : (p ?? {})
    if (typeof source !== 'string')
        throw new UsageError(`${where}: pattern without "source"`)
    try {
        return new RegExp(source, flags.replace(/g/g, '') + 'g')
    } catch (e) {
        throw new UsageError(
            `${where}: invalid regex /${source}/: ${e.message}`
        )
    }
}

function readJson(file, what) {
    try {
        return JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
        throw new UsageError(`cannot read ${what} ${file}: ${e.message}`)
    }
}

function loadPatterns(root, strict) {
    const file = resolve(
        root,
        process.env.ZONE_PROVENANCE_PATTERNS ||
            '../zone-design-references/tools/provenance-patterns.json'
    )
    if (!existsSync(file)) {
        if (strict)
            throw new UsageError(
                `provenance patterns not found at ${file} (required by --strict)`
            )
        console.log(
            'provenance patterns not found; running built-in checks only'
        )
        return { hard: [], soft: [], file: null }
    }
    const j = readJson(file, 'pattern file')
    return {
        hard: (j.hard ?? []).map((p, i) => compilePattern(p, `hard[${i}]`)),
        soft: (j.soft ?? []).map((p, i) => compilePattern(p, `soft[${i}]`)),
        file,
    }
}

function loadAllow(file) {
    if (!existsSync(file)) return { entries: [], rasterDirs: [] }
    const j = readJson(file, 'allowlist')
    return {
        entries: (j.entries ?? []).map((e, i) => {
            if (!e.glob || !e.pattern || !e.why)
                throw new UsageError(
                    `allowlist entry ${i} needs glob, pattern and why`
                )
            return {
                match: pathMatcher(e.glob),
                re: compilePattern(e.pattern, `allow[${i}]`),
            }
        }),
        rasterDirs: (j.rasterDirs ?? []).map(pathMatcher),
    }
}

// ---------------------------------------------------------------- scanning

function createReport() {
    return { hard: [], soft: [], review: [], files: 0 }
}

const clip = (line, idx, len) => {
    const start = Math.max(0, idx - 60)
    const s = line.slice(start, idx + len + 60).trim()
    return (
        (start > 0 ? '…' : '') + s + (idx + len + 60 < line.length ? '…' : '')
    )
}

/** Inside a hex colour literal such as #ab12f0 — never a real hit. */
const inHexLiteral = (line, idx) =>
    /#[0-9a-f]*$/i.test(line.slice(Math.max(0, idx - 8), idx))

function firstHit(line, regexes, allowed) {
    for (const re of regexes) {
        re.lastIndex = 0
        for (const m of line.matchAll(re)) {
            if (
                m[0] === '' ||
                (inHexLiteral(line, m.index) && /^[0-9a-f]+$/i.test(m[0]))
            )
                continue
            const end = m.index + m[0].length
            const suppressed = allowed.some((a) => {
                a.re.lastIndex = 0
                for (const am of line.matchAll(a.re))
                    if (am.index <= m.index && am.index + am[0].length >= end)
                        return true
                return false
            })
            if (!suppressed) return { re, m }
        }
    }
    return null
}

function scanText(ctx, label, rel, text) {
    const allowed = ctx.allow.entries.filter((e) => e.match(rel))
    const hardRes = [
        ...ABSOLUTE_PATHS.map((r) => new RegExp(r.source, r.flags + 'g')),
        ...ctx.patterns.hard,
    ]
    text.split(/\r?\n/).forEach((line, i) => {
        const h = firstHit(line, hardRes, allowed)
        if (h)
            ctx.report.hard.push(
                `${label}  ${rel}:${i + 1}  [/${h.re.source}/]  ${clip(line, h.m.index, h.m[0].length)}`
            )
        if (ctx.opts.soft && ctx.patterns.soft.length) {
            const s = firstHit(line, ctx.patterns.soft, allowed)
            if (s)
                ctx.report.soft.push(
                    `${label}  ${rel}:${i + 1}  ${clip(line, s.m.index, s.m[0].length)}`
                )
        }
    })
}

function scanName(ctx, label, rel) {
    for (const re of ctx.patterns.hard) {
        re.lastIndex = 0
        if (re.test(rel)) {
            ctx.report.hard.push(`${label}  FILE NAME ${rel}  [/${re.source}/]`)
            return
        }
    }
}

const looksBinary = (buf) => buf.subarray(0, 8192).includes(0)

/** Name, size, media/raster and content checks for one file. `read` returns a Buffer. */
function scanFile(ctx, label, rel, size, read, { rasterRule = true } = {}) {
    ctx.report.files++
    scanName(ctx, label, rel)
    if (size > MAX_BYTES)
        ctx.report.hard.push(
            `${label}  ${rel}  larger than 5 MB (${(size / 1048576).toFixed(1)} MB)`
        )
    if (MEDIA.test(rel)) {
        ctx.report.hard.push(`${label}  ${rel}  media file`)
        return
    }
    if (RASTER.test(rel)) {
        if (rasterRule && !ctx.allow.rasterDirs.some((m) => m(rel)))
            ctx.report.hard.push(
                `${label}  ${rel}  raster image outside the allowed folders`
            )
        else ctx.report.review.push(`${label}  ${rel}`)
        return
    }
    if (BINARY.test(rel) || size > MAX_BYTES) {
        ctx.report.review.push(`${label}  ${rel}`)
        return
    }
    const buf = read()
    if (looksBinary(buf)) {
        ctx.report.review.push(`${label}  ${rel}`)
        return
    }
    scanText(ctx, label, rel, buf.toString('utf8'))
}

// ---------------------------------------------------------------- file lists

const git = (root, args) =>
    execFileSync('git', args, {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 256 * 1024 * 1024,
    })
const gitBuf = (root, args) =>
    execFileSync('git', args, { cwd: root, maxBuffer: 256 * 1024 * 1024 })
const isGitRepo = (root) => existsSync(join(root, '.git'))

function walk(root, base, rules, out = []) {
    const dir = join(root, base)
    if (!existsSync(dir)) return out
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
        if (ALWAYS_SKIP.has(ent.name)) continue
        const rel = base ? `${base}/${ent.name}` : ent.name
        const isDir = ent.isDirectory()
        if (rules && isIgnored(rules, rel, isDir)) continue
        if (isDir) walk(root, rel, rules, out)
        else if (ent.isFile()) out.push(rel)
    }
    return out
}

function sourceFiles(root) {
    if (isGitRepo(root)) {
        return git(root, [
            'ls-files',
            '-z',
            '--cached',
            '--others',
            '--exclude-standard',
        ])
            .split('\0')
            .filter(Boolean)
    }
    let text = existsSync(join(root, '.gitignore'))
        ? readFileSync(join(root, '.gitignore'), 'utf8')
        : ''
    const local = resolve(
        root,
        process.env.ZONE_PROVENANCE_IGNORE ||
            '../zone-design-references/tools/provenance-ignore'
    )
    if (existsSync(local)) text += '\n' + readFileSync(local, 'utf8')
    return walk(root, '', compileIgnore(text))
}

function newestMtime(root, base, filter = () => true) {
    let newest = 0
    for (const rel of walk(root, base, null)) {
        if (filter(rel))
            newest = Math.max(newest, statSync(join(root, rel)).mtimeMs)
    }
    return newest
}

// ---------------------------------------------------------------- modes

function runSource(ctx) {
    const { root } = ctx
    for (const rel of sourceFiles(root).filter(ctx.inScope)) {
        const abs = join(root, rel)
        if (!existsSync(abs)) continue
        scanFile(ctx, 'source', rel, statSync(abs).size, () =>
            readFileSync(abs)
        )
    }
}

function runStaged(ctx) {
    const { root } = ctx
    if (!isGitRepo(root))
        throw new UsageError('--staged needs a git repository')
    const files = git(root, [
        'diff',
        '--cached',
        '--name-only',
        '-z',
        '--diff-filter=ACMR',
    ])
        .split('\0')
        .filter(Boolean)
    for (const rel of files.filter(ctx.inScope)) {
        const buf = gitBuf(root, ['show', `:${rel}`])
        scanFile(ctx, 'staged', rel, buf.length, () => buf)
    }
}

function dtsSpecifiers(text) {
    const out = []
    const re =
        /(?:\bfrom\s*|\bimport\s*\(\s*|^\s*import\s+)['"](\.{1,2}\/[^'"]+)['"]/gm
    for (const m of text.matchAll(re)) out.push(m[1])
    return out
}

function resolveDts(fromRel, spec, exists) {
    const base = toPosix(join(dirname(fromRel), spec)).replace(
        /\.(m?js|cjs|tsx?)$/,
        ''
    )
    for (const c of [`${base}.d.ts`, `${base}/index.d.ts`])
        if (exists(c)) return c
    return null
}

function packageTypesEntry(pkg) {
    const dot = pkg.exports?.['.']
    const t =
        pkg.types ??
        pkg.typings ??
        (typeof dot === 'object' ? dot?.types : undefined)
    return t ? toPosix(t).replace(/^\.\//, '') : null
}

function runPackage(ctx) {
    const { root, report } = ctx
    const fail = (msg) => report.hard.push(`package  ${msg}`)
    const pkg = readJson(join(root, 'package.json'), 'package.json')

    if (!existsSync(join(root, 'dist')))
        fail('dist/ missing: run `npm run build` first')
    else {
        const bundles = (rel) => /\.(m?js|cjs)$/.test(rel)
        const built =
            newestMtime(root, 'dist', bundles) || newestMtime(root, 'dist')
        const src = newestMtime(root, 'src')
        if (src > built)
            fail('dist/ is older than src/: rebuild with `npm run build`')

        for (const rel of walk(root, 'dist', null)) {
            if (!/\.(m?js|cjs|css)$/.test(rel)) continue
            const text = readFileSync(join(root, rel), 'utf8')
            if (/[#@]\s*sourceMappingURL=/.test(text))
                fail(`${rel} contains a sourceMappingURL comment`)
        }

        const entry = packageTypesEntry(pkg)
        if (entry && existsSync(join(root, entry))) {
            const all = new Set(
                walk(root, 'dist', null).filter((rel) => rel.endsWith('.d.ts'))
            )
            const seen = new Set([entry])
            const queue = [entry]
            while (queue.length) {
                const cur = queue.pop()
                for (const spec of dtsSpecifiers(
                    readFileSync(join(root, cur), 'utf8')
                )) {
                    const next = resolveDts(cur, spec, (c) => all.has(c))
                    if (next && !seen.has(next)) {
                        seen.add(next)
                        queue.push(next)
                    }
                }
            }
            for (const rel of all) {
                if (rel.endsWith('.story-helpers.d.ts'))
                    fail(`${rel}: story-only helper in the type output`)
                else if (!seen.has(rel))
                    fail(`${rel}: not reachable from ${entry}`)
            }
        }
    }

    let list
    try {
        const out = execSync('npm pack --dry-run --json --ignore-scripts', {
            cwd: root,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            maxBuffer: 64 * 1024 * 1024,
        })
        list = JSON.parse(out.slice(out.indexOf('[')))[0].files.map((f) => ({
            path: toPosix(f.path),
            size: f.size,
        }))
    } catch (e) {
        throw new UsageError(
            `npm pack --dry-run failed: ${e.message.split('\n')[0]}`
        )
    }
    if (!list.some((f) => /^LICEN[CS]E(\.\w+)?$/i.test(f.path)))
        fail('LICENSE is not in the package')
    const licence = ['LICENSE', 'LICENSE.md', 'LICENCE']
        .map((f) => join(root, f))
        .find(existsSync)
    if (!licence) fail('LICENSE file missing')
    else if (
        LICENSE_PLACEHOLDER.some((re) => re.test(readFileSync(licence, 'utf8')))
    )
        fail('LICENSE still has template placeholder text')

    for (const f of list.filter((x) => ctx.inScope(x.path))) {
        if (f.path.endsWith('.map'))
            fail(`${f.path}: source map in the package`)
        if (/story-helpers/.test(f.path))
            fail(`${f.path}: story-only helper in the package`)
        const abs = join(root, f.path)
        scanFile(
            ctx,
            'npm',
            f.path,
            f.size ?? (existsSync(abs) ? statSync(abs).size : 0),
            () => readFileSync(abs)
        )
    }

    // The site builds bundle third-party code (Storybook, React, axe…) that the private patterns
    // cannot be tuned for, so they get the built-in rules only: paths, media, size, binary review.
    const siteCtx = { ...ctx, patterns: { hard: [], soft: [] } }
    for (const dir of ['storybook-static', 'demo-dist']) {
        for (const rel of walk(root, dir, null).filter(ctx.inScope)) {
            const abs = join(root, rel)
            scanFile(
                siteCtx,
                dir,
                rel,
                statSync(abs).size,
                () => readFileSync(abs),
                { rasterRule: false }
            )
        }
    }
}

function runGitLog(ctx) {
    if (!isGitRepo(ctx.root)) return
    let log
    try {
        log = git(ctx.root, ['log', '--format=%an <%ae>%n%B'])
    } catch {
        return // no commits yet
    }
    scanText(
        { ...ctx, allow: { entries: [], rasterDirs: [] } },
        'git-log',
        '(commit log)',
        log
    )
}

// ---------------------------------------------------------------- main

export function main(argv) {
    let opts
    try {
        opts = parseArgs(argv)
    } catch (e) {
        console.error(`check-provenance: ${e.message}`)
        return 2
    }
    if (opts.help) {
        console.log(
            'usage: node scripts/check-provenance.mjs [--source] [--package] [--staged] [--strict] [--soft] [--paths <glob,...>] [--root <dir>] [--allow <file>]'
        )
        return 0
    }
    const root = resolve(opts.root)
    const report = createReport()
    try {
        const patterns = loadPatterns(root, opts.strict)
        const allow = loadAllow(
            opts.allow
                ? resolve(opts.allow)
                : join(root, 'scripts', 'check-provenance.allow.json')
        )
        const scope = opts.paths.map(pathMatcher)
        const inScope = (rel) => !scope.length || scope.some((m) => m(rel))
        const ctx = { root, opts, patterns, allow, report, inScope }
        if (opts.source) runSource(ctx)
        if (opts.staged) runStaged(ctx)
        if (opts.package) runPackage(ctx)
        if (opts.strict) runGitLog(ctx)
    } catch (e) {
        if (e instanceof UsageError) {
            console.error(`check-provenance: ${e.message}`)
            return 2
        }
        throw e
    }

    const uniq = (a) => [...new Set(a)]
    const modes = ['source', 'staged', 'package']
        .filter((m) => opts[m])
        .join(' + ')
    console.log(
        `check-provenance: ${modes}, ${report.files} files scanned${opts.paths.length ? ` (paths: ${opts.paths.join(', ')})` : ''}`
    )
    if (report.review.length)
        console.log(
            `\nBINARY FILES (review by eye):\n  ${uniq(report.review).join('\n  ')}`
        )
    if (opts.soft && report.soft.length)
        console.log(
            `\nSOFT (${report.soft.length}, review):\n  ${uniq(report.soft).join('\n  ')}`
        )
    if (report.hard.length) {
        console.log(
            `\nHARD (${report.hard.length}):\n  ${uniq(report.hard).join('\n  ')}`
        )
        console.log('\ncheck-provenance: FAILED')
        return 1
    }
    console.log('\ncheck-provenance: passed')
    return 0
}

if (
    process.argv[1] &&
    resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    process.exitCode = main(process.argv.slice(2))
}
