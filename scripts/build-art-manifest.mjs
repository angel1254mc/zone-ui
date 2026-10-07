#!/usr/bin/env node
// Build the COMMITTED game-art manifest used by Storybook, the example pages and the demo:
// names + metadata + REMOTE image keys. No image file is downloaded or committed.
//
//   npm run art-manifest                 # live version → examples/art/art-manifest.json
//   npm run art-manifest -- --out x.json # write somewhere else
//
// Sources (credit both; Zenless Zone Zero © HoYoverse):
//   - static.nanoka.cc (community datamine CDN): the CDN *indexes* character.json, weapon.json,
//     equipment.json, en/item.json and en/character/<id>.json. Images are served from
//     https://static.nanoka.cc/assets/zzz/<Name>.webp.
//   - Enka.Network: the namecard index (EnkaNetwork/API-docs store/zzz/namecards.json). Images
//     are served from https://enka.network/ui/zzz/<Name>.png.
//
// Image fields in the manifest are KEYS relative to a per-source base (manifest.sources), so a
// self-hosted mirror only needs configureArt({ nanokaBase, enkaBase }) at runtime.
//
// Every referenced image is probed once with a 30-byte Range GET: that proves it exists (a miss
// becomes `null`, logged below) and yields its pixel size from the WebP/PNG header, without
// downloading the file. Concurrency ≤ 6.
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const NANOKA = 'https://static.nanoka.cc'
const NANOKA_ASSETS = `${NANOKA}/assets/zzz/`
const ENKA_ASSETS = 'https://enka.network/ui/zzz/'
const ENKA_NAMECARDS =
    'https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/zzz/namecards.json'
const ROOT = resolve(import.meta.dirname, '..')
const argValue = (flag) => {
    const i = process.argv.indexOf(flag)
    return i > 0 ? process.argv[i + 1] : undefined
}
const OUT = resolve(ROOT, argValue('--out') ?? 'examples/art/art-manifest.json')
const CONCURRENCY = 6

const RANK = { 2: 'B', 3: 'A', 4: 'S' }
const ELEMENT_CODES = {
    200: 'Physical',
    201: 'Fire',
    202: 'Ice',
    203: 'Electric',
    204: 'Wind',
    205: 'Ether',
    300: 'Lumiflux',
}
// Character crops on the CDN (fixed sizes, verified below) and what they are used for.
const AGENT_CROPS = {
    circle: {
        name: (icon) => icon.replace('IconRole', 'IconRoleCircle'),
        size: [142, 142],
    }, // round avatar
    select: {
        name: (icon) => icon.replace('IconRole', 'IconRoleSelect'),
        size: [256, 250],
    }, // agent-select card
    crop: {
        name: (icon) => icon.replace('IconRole', 'IconRoleCrop'),
        size: [384, 384],
    }, //     square bust
    general: {
        name: (icon) => icon.replace('IconRole', 'IconRoleGeneral'),
        size: [180, 64],
    }, // wide strip
    full: { name: (icon) => icon, size: null }, //                                               full body (size varies)
}
const W_ENGINE_SIZE = [400, 400]
const DISC_SIZE = [152, 152]
const ELEMENT_ICONS = {
    Physical: 'IconPhysical',
    Fire: 'IconFire',
    Ice: 'IconIce',
    Electric: 'IconElectric',
    Ether: 'IconEther',
    Wind: 'IconWind',
    Lumiflux: null,
    Frost: 'IconFrost',
    'Auric Ink': 'IconAuricInk',
    'Honed Edge': 'IconHonedEdge',
}
const SPECIALTY_ICONS = {
    Attack: 'IconAttack',
    Stun: 'IconStun',
    Anomaly: 'IconAnomaly',
    Support: 'IconSupport',
    Defense: 'IconDefense',
    Rupture: 'IconRupture',
}
// Aliases of items 100 (Polychrome) and 10 (Denny).
const MISC_ICONS = { polychrome: 'IconCurrency', coin: 'IconCoin' }
// Items: curated classes → category.
const ITEM_CLASSES = {
    1: 'currency',
    2: 'currency',
    36: 'currency',
    10: 'material',
    12: 'agent-exp',
    13: 'w-engine-exp',
    14: 'disc-tuning',
    17: 'bangboo-exp',
}
const ITEM_RARITY = { 1: 'c', 2: 'b', 3: 'a', 4: 's', 5: 's' }
// Items the stories use (examples/art/storyItems.ts); each must resolve with an image.
const STORY_ITEM_IDS = [
    '10',
    '100',
    '110',
    '112',
    '301',
    '404',
    '501',
    '502',
    '511',
    '100110',
    '103040',
    '300003',
    '301003',
    '303002',
]
// Enka namecards kept: the dark agent cards and the event cards.
const NAMECARD_GROUPS = [
    { group: 'role', re: /^ImgCardRoleS(\d{4})$/ },
    { group: 'event', re: /^ImgCardEvent(\d+)$/ },
]

const getJson = async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    return res.json()
}

async function pool(items, fn) {
    const out = new Array(items.length)
    let i = 0
    await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
            while (i < items.length) {
                const j = i++
                out[j] = await fn(items[j], j)
            }
        })
    )
    return out
}

/* ------------------------------------------------------------------ image header probe */

/** Pixel size from the first 30 bytes of a WebP (VP8 / VP8L / VP8X) or PNG file. */
function imageSize(b) {
    if (b.length >= 24 && b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG')
        return [b.readUInt32BE(16), b.readUInt32BE(20)]
    if (
        b.length < 30 ||
        b.toString('latin1', 0, 4) !== 'RIFF' ||
        b.toString('latin1', 8, 12) !== 'WEBP'
    )
        return null
    const chunk = b.toString('latin1', 12, 16)
    if (chunk === 'VP8X')
        return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
    if (chunk === 'VP8 ')
        return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
    if (chunk === 'VP8L') {
        const bits = b.readUInt32LE(21)
        return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)]
    }
    return null
}

const misses = []
let probes = 0
/** Range-GET the first 30 bytes of `base + key`. Returns the size, or null (logged) when absent. */
async function probe(base, key) {
    probes++
    const url = base + key
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(url, { headers: { Range: 'bytes=0-29' } })
            if (res.status === 404 || res.status === 403) {
                misses.push(`${key} (${res.status})`)
                return null
            }
            if (!res.ok) throw new Error(String(res.status))
            // Read only what we need even if the server ignores Range.
            const reader = res.body.getReader()
            const parts = []
            let n = 0
            while (n < 30) {
                const { done, value } = await reader.read()
                if (done) break
                parts.push(value)
                n += value.length
            }
            await reader.cancel().catch(() => {})
            const size = imageSize(Buffer.concat(parts))
            if (!size) {
                misses.push(`${key} (unreadable header)`)
                return null
            }
            return size
        } catch (e) {
            if (attempt === 2) {
                misses.push(`${key} (${e.message})`)
                return null
            }
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
        }
    }
    return null
}

const sameSize = (a, b) => a && b && a[0] === b[0] && a[1] === b[1]
const sizeWarnings = []

/* ------------------------------------------------------------------ indexes */

const firstValue = (o) =>
    o && typeof o === 'object' ? Object.values(o)[0] : undefined
const basename = (p) => p.slice(p.lastIndexOf('/') + 1).replace(/\.png$/, '')

const cdnManifest = await getJson(`${NANOKA}/manifest.json`)
const version = argValue('--version') ?? cdnManifest.zzz.live
console.log(`ZZZ live version ${version} → ${OUT}`)

const [charIndex, weaponIndex, setIndex, itemIndex, enkaNamecards] =
    await Promise.all([
        getJson(`${NANOKA}/zzz/${version}/character.json`),
        getJson(`${NANOKA}/zzz/${version}/weapon.json`),
        getJson(`${NANOKA}/zzz/${version}/equipment.json`),
        getJson(`${NANOKA}/zzz/${version}/en/item.json`), // language-scoped: zzz/<v>/item.json is 404
        getJson(ENKA_NAMECARDS),
    ])

// Enka namecards by name (ImgCardRoleS0001 …).
const namecardNames = new Set(
    Object.values(enkaNamecards)
        .map((n) => basename(n.Icon ?? ''))
        .filter(Boolean)
)

/* ------------------------------------------------------------------ agents */

const agents = await pool(Object.entries(charIndex), async ([id, c]) => {
    const detail = await getJson(
        `${NANOKA}/zzz/${version}/en/character/${id}.json`
    ).catch(() => null)
    const images = {}
    let fullSize
    for (const [crop, { name, size }] of Object.entries(AGENT_CROPS)) {
        const key = `${name(c.icon)}.webp`
        const got = await probe(NANOKA_ASSETS, key)
        images[crop] = got ? key : null
        if (got && crop === 'full') fullSize = got
        else if (got && !sameSize(got, size))
            sizeWarnings.push(
                `${key} is ${got.join('x')} (expected ${size.join('x')})`
            )
    }
    const baseElement =
        firstValue(detail?.element_type) ?? ELEMENT_CODES[c.element] ?? null
    const special = detail?.special_element_type?.name?.replace(/ /g, ' ') // e.g. { id: 205, name: 'Auric Ink' }
    // The Inter-Knot namecard is keyed by the IconRole number, not the agent id (IconRole01 → ImgCardRoleS0001 = Anby).
    const iconNo = /^IconRole(\d+)$/.exec(c.icon)?.[1]
    const cardName = iconNo ? `ImgCardRoleS${iconNo.padStart(4, '0')}` : null
    return {
        id,
        name: c.en,
        code: c.code,
        rank: RANK[c.rank] ?? null,
        element: special ?? baseElement,
        baseElement,
        specialty: firstValue(detail?.weapon_type) ?? null,
        faction: c.camp,
        images,
        ...(fullSize ? { fullSize } : {}),
        namecard: cardName && namecardNames.has(cardName) ? cardName : null,
    }
})
const specialtyByCode = Object.fromEntries(
    agents
        .filter((a) => a.specialty)
        .map((a) => [charIndex[a.id].type, a.specialty])
)
for (const a of agents) {
    const absent = Object.entries(a.images)
        .filter(([, v]) => !v)
        .map(([k]) => k)
    if (absent.length)
        console.warn(
            `WARN agent ${a.id} ${a.name}: no ${absent.join(', ')} art`
        )
}

/* ------------------------------------------------------------------ W-Engines, drive discs */

const wEngines = await pool(Object.entries(weaponIndex), async ([id, w]) => {
    const key = `${w.icon}.webp`
    const size = await probe(NANOKA_ASSETS, key)
    return {
        id,
        name: w.en,
        rank: RANK[w.rank] ?? null,
        specialty: specialtyByCode[w.type] ?? null,
        baseAtk: w.atk,
        advancedStat: w.sub,
        description: w.desc,
        image: size ? key : null,
        ...(size && !sameSize(size, W_ENGINE_SIZE) ? { size } : {}),
    }
})

const driveDiscSets = await pool(Object.entries(setIndex), async ([id, s]) => {
    const key = `${basename(s.icon)}.webp`
    const size = await probe(NANOKA_ASSETS, key)
    const en = s.en ?? {}
    return {
        id,
        name: en.name,
        twoPiece: en.desc2,
        fourPiece: en.desc4?.replace(/<\/?color[^>]*>/g, ''),
        image: size ? key : null,
        ...(size && !sameSize(size, DISC_SIZE) ? { size } : {}),
    }
})

/* ------------------------------------------------------------------ items (curation) */

const seenNames = new Set()
const wantedItems = Object.entries(itemIndex)
    .filter(
        ([, it]) =>
            ITEM_CLASSES[it.class] &&
            it.icon &&
            it.name &&
            !it.name.startsWith('Item_')
    )
    .filter(
        ([, it]) => !/^Test/i.test(basename(it.icon)) && !it.icon.includes('​')
    )
    .sort(([a], [b]) => Number(a) - Number(b))
    .filter(([, it]) =>
        seenNames.has(it.name) ? false : (seenNames.add(it.name), true)
    )

const items = await pool(wantedItems, async ([id, it]) => {
    const iconName = basename(it.icon)
    const base = {
        id,
        name: it.name,
        rarity: ITEM_RARITY[it.rank] ?? null,
        category: ITEM_CLASSES[it.class],
        class: it.class,
        iconName,
    }
    // Boss materials point at a 2048px animated spritesheet (13 columns, 156px cells), not an icon.
    if (it.boss || !it.icon.endsWith('.png'))
        return {
            ...base,
            image: null,
            sprite: { sheet: `${iconName}.webp`, cell: 156, cols: 13 },
        }
    const key = `${iconName}.webp`
    const size = await probe(NANOKA_ASSETS, key)
    return { ...base, image: size ? key : null, ...(size ? { size } : {}) }
})

/* ------------------------------------------------------------------ icons */

const iconEntries = async (map) =>
    Object.fromEntries(
        await pool(Object.entries(map), async ([label, name]) => {
            if (!name) return [label, null]
            const key = `${name}.webp`
            return [label, (await probe(NANOKA_ASSETS, key)) ? key : null]
        })
    )
const icons = {
    elements: await iconEntries(ELEMENT_ICONS),
    specialties: await iconEntries(SPECIALTY_ICONS),
    misc: await iconEntries(MISC_ICONS),
}

/* ------------------------------------------------------------------ namecards (Enka) */

const agentByCard = new Map(
    agents.filter((a) => a.namecard).map((a) => [a.namecard, a])
)
const namecardList = [...namecardNames]
    .map((name) => {
        const g = NAMECARD_GROUPS.find(({ re }) => re.test(name))
        return g
            ? { name, group: g.group, n: Number(g.re.exec(name)[1]) }
            : null
    })
    .filter(Boolean)
    .sort((a, b) => a.group.localeCompare(b.group) || a.n - b.n)
const namecards = (
    await pool(namecardList, async ({ name, group }) => {
        const key = `${name}.png`
        const size = await probe(ENKA_ASSETS, key)
        if (!size) return null
        const agent = agentByCard.get(name)
        return {
            id: name,
            group,
            ...(agent ? { agentId: agent.id, name: agent.name } : {}),
            image: key,
            size,
        }
    })
).filter(Boolean)
// Drop agent → namecard links whose image failed the probe.
const cardIds = new Set(namecards.map((n) => n.id))
for (const a of agents)
    if (a.namecard && !cardIds.has(a.namecard)) a.namecard = null
for (const a of agents) if (a.namecard) a.namecard = `${a.namecard}.png`

/* ------------------------------------------------------------------ checks + write */

const itemById = new Map(items.map((i) => [i.id, i]))
const badStory = STORY_ITEM_IDS.filter((id) => !itemById.get(id)?.image)
if (badStory.length)
    throw new Error(`story items without an image: ${badStory.join(', ')}`)
if (items.length < 150 || items.length > 300)
    throw new Error(`unexpected item count ${items.length}`)

const manifest = {
    schema: 2,
    source: NANOKA,
    version,
    generatedAt: new Date().toISOString().slice(0, 10),
    credits:
        'Game data and art: static.nanoka.cc (community datamine) and Enka.Network (namecards). Zenless Zone Zero © HoYoverse. ' +
        'Images are loaded by URL at runtime and are not part of this repository or the published package.',
    sources: { nanoka: NANOKA_ASSETS, enka: ENKA_ASSETS },
    agents,
    wEngines,
    driveDiscSets,
    items,
    namecards,
    icons,
}

/** JSON with one array entry per line: small diffs, still readable. */
function serialize(m) {
    const lines = ['{']
    const keys = Object.keys(m)
    keys.forEach((k, i) => {
        const v = m[k]
        const comma = i < keys.length - 1 ? ',' : ''
        if (Array.isArray(v)) {
            lines.push(` ${JSON.stringify(k)}: [`)
            v.forEach((e, j) =>
                lines.push(
                    `  ${JSON.stringify(e)}${j < v.length - 1 ? ',' : ''}`
                )
            )
            lines.push(` ]${comma}`)
        } else lines.push(` ${JSON.stringify(k)}: ${JSON.stringify(v)}${comma}`)
    })
    lines.push('}')
    return lines.join('\n') + '\n'
}
await writeFile(OUT, serialize(manifest))

const withArt = (list, f) => list.filter(f).length
console.log(
    `agents ${agents.length} (full art ${withArt(agents, (a) => a.images.full)}, namecards ${withArt(agents, (a) => a.namecard)})`
)
console.log(
    `w-engines ${wEngines.length}, drive-disc sets ${driveDiscSets.length}, items ${items.length} (${withArt(items, (i) => i.image)} with image, ${withArt(items, (i) => i.sprite)} boss sheets), namecards ${namecards.length}`
)
console.log(`probed ${probes} images, missing ${misses.length}`)
if (misses.length) console.log('missing:\n  ' + misses.join('\n  '))
if (sizeWarnings.length)
    console.log('unexpected sizes:\n  ' + sizeWarnings.join('\n  '))
