/** Shape of the committed art manifest (examples/art/art-manifest.json, `npm run art-manifest`). */
import raw from './art-manifest.json'
import type { GameArtManifest } from './gameArt'
import { STORY_ITEMS } from './storyItems'

const m = raw as unknown as GameArtManifest
const CROPS = ['circle', 'select', 'crop', 'general', 'full'] as const
/** An image key: a bare file name (no scheme, no path), resolved against a per-source base. */
const KEY = /^[^/?#\s]+\.(webp|png)$/

describe('art-manifest.json', () => {
    it('declares schema 2, both sources (https bases ending in /) and HoYoverse credits', () => {
        expect(m.schema).toBe(2)
        expect(m.sources?.nanoka).toMatch(
            /^https:\/\/static\.nanoka\.cc\/.*\/$/
        )
        expect(m.sources?.enka).toMatch(/^https:\/\/enka\.network\/.*\/$/)
        expect(m.credits).toMatch(/HoYoverse/)
        expect(m.credits).toMatch(/nanoka/)
        expect(m.credits).toMatch(/Enka/)
    })

    it('has agents with metadata, all five crops as keys, and a full-art size', () => {
        expect(m.agents.length).toBeGreaterThanOrEqual(50)
        for (const a of m.agents) {
            expect(a.id).toMatch(/^\d+$/)
            expect(a.name).toBeTruthy()
            expect(['S', 'A', 'B', null]).toContain(a.rank)
            for (const c of CROPS) expect(a.images[c]).toMatch(KEY)
            expect(a.fullSize).toHaveLength(2)
            if (a.namecard != null)
                expect(a.namecard).toMatch(/^ImgCardRoleS\d{4}\.png$/)
        }
        expect(m.agents.find((a) => a.id === '1011')?.namecard).toBe(
            'ImgCardRoleS0001.png'
        )
    })

    it('has W-Engines and drive-disc sets with keys and stats', () => {
        expect(m.wEngines.length).toBeGreaterThanOrEqual(80)
        for (const w of m.wEngines) {
            expect(w.name).toBeTruthy()
            expect(typeof w.baseAtk).toBe('number')
            if (w.image !== null) expect(w.image).toMatch(KEY)
        }
        expect(m.driveDiscSets.length).toBeGreaterThanOrEqual(20)
        for (const d of m.driveDiscSets) {
            expect(d.name).toBeTruthy()
            expect(d.twoPiece).toBeTruthy()
            expect(d.image).toMatch(KEY)
        }
    })

    it('has the curated item subset; every STORY_ITEMS entry resolves with an icon and matches its name/rarity', () => {
        const items = m.items ?? []
        expect(items.length).toBeGreaterThanOrEqual(200)
        expect(items.length).toBeLessThanOrEqual(240)
        expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
        for (const i of items) {
            if (i.image !== null) expect(i.image).toMatch(KEY)
            else if (i.sprite) expect(i.sprite.cell).toBe(156)
            expect(['s', 'a', 'b', 'c', null]).toContain(i.rarity)
        }
        for (const s of STORY_ITEMS) {
            const it = items.find((i) => i.id === s.id)
            expect(it?.image, s.id).toMatch(KEY)
            expect(it?.name).toBe(s.name)
            expect(it?.rarity).toBe(s.rarity)
        }
    })

    it('has Enka namecards (agent + event) with sizes', () => {
        const cards = m.namecards ?? []
        expect(
            cards.filter((n) => n.group === 'role').length
        ).toBeGreaterThanOrEqual(50)
        expect(
            cards.filter((n) => n.group === 'event').length
        ).toBeGreaterThanOrEqual(20)
        for (const n of cards) {
            expect(n.image).toMatch(/^ImgCard(RoleS\d{4}|Event\d+)\.png$/)
            expect(n.size).toHaveLength(2)
        }
    })

    it('has element / specialty / misc icon keys (Lumiflux has none)', () => {
        expect(m.icons.elements.Electric).toMatch(KEY)
        expect(m.icons.elements.Lumiflux).toBeNull()
        expect(Object.keys(m.icons.specialties)).toEqual(
            expect.arrayContaining([
                'Attack',
                'Stun',
                'Anomaly',
                'Support',
                'Defense',
                'Rupture',
            ])
        )
        expect(m.icons.misc.coin).toBe('IconCoin.webp')
    })

    it('contains no absolute image URLs or local paths in entries (bases live in `sources` only)', () => {
        const { sources: _s, source: _src, credits: _c, ...rest } = m
        expect(JSON.stringify(rest)).not.toMatch(/https?:\/\/|game-art\//)
    })
})
