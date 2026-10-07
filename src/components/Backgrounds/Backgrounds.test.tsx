import { createRef } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { tokens } from '../../styles/tokens'
import { HatchBackground } from './HatchBackground'
import { DotTexture } from './DotTexture'
import { GraffitiLayer } from './GraffitiLayer'
import { FilmStripBackground } from './FilmStripBackground'
import { StorageMuralBackground } from './StorageMuralBackground'

const root = (c: HTMLElement) => c.firstElementChild as HTMLElement

describe('backgrounds are decorative', () => {
    it.each([
        ['HatchBackground', <HatchBackground />],
        ['DotTexture', <DotTexture />],
        ['GraffitiLayer', <GraffitiLayer />],
        ['GraffitiLayer dialog', <GraffitiLayer variant="dialog" drift />],
        ['FilmStripBackground', <FilmStripBackground />],
        ['StorageMuralBackground', <StorageMuralBackground />],
    ])('%s is aria-hidden with the shared layer class', (_, el) => {
        const { container } = render(el)
        expect(root(container)).toHaveAttribute('aria-hidden', 'true')
        expect(root(container)).toHaveClass('zzz-bg')
        expect(container.querySelector('[role], a, button, input')).toBeNull()
    })

    it('passes className, style and ref through', () => {
        const ref = createRef<HTMLDivElement>()
        const { container } = render(
            <HatchBackground ref={ref} className="x" style={{ opacity: 0.5 }} />
        )
        expect(root(container)).toHaveClass('x')
        expect(root(container)).toHaveStyle({ opacity: '0.5' })
        expect(ref.current).toBe(root(container))
    })
})

describe('HatchBackground', () => {
    it('uses the global hatch material on black', () => {
        const { container } = render(<HatchBackground />)
        expect(root(container)).toHaveClass('zzz-bg-hatch')
        expect(root(container)).toHaveAttribute('data-tone', 'black')
    })

    it.each(['sage', 'teal', 'deep'] as const)(
        'tone %s is a tinted hatch',
        (tone) => {
            const { container } = render(<HatchBackground tone={tone} />)
            expect(root(container)).toHaveClass(
                'zzz-hatch-bg--tinted',
                `zzz-hatch-bg--${tone}`
            )
        }
    )

    it('accepts custom light/dark stripe colours', () => {
        const { container } = render(
            <HatchBackground tone={{ light: '#445566', dark: '#112233' }} />
        )
        const el = root(container)
        expect(el).toHaveClass('zzz-hatch-bg--tinted')
        expect(el.style.getPropertyValue('--zzz-hatch-light')).toBe('#445566')
        expect(el.style.getPropertyValue('--zzz-hatch-dark')).toBe('#112233')
    })
})

describe('DotTexture', () => {
    it('sets the lattice size and alpha', () => {
        const { container } = render(<DotTexture size="lg" alpha={0.05} />)
        const el = root(container)
        expect(el).toHaveClass('zzz-dots')
        expect(el.style.getPropertyValue('--zzz-dots-size')).toBe(
            'var(--zzz-pattern-dots-lg)'
        )
        expect(el.style.getPropertyValue('--zzz-dots-alpha')).toBe('0.05')
    })
})

describe('GraffitiLayer', () => {
    it('renders original SVG lettering from the watermark copy', () => {
        const { container } = render(<GraffitiLayer />)
        expect(container.querySelector('svg')).not.toBeNull()
        const copy = tokens.pattern.watermark.content
            .split('/')
            .map((s) => s.trim())
            .filter(Boolean)
        expect(container.textContent).toContain(copy[0].split(' ')[0])
        expect(container.textContent).toContain(copy[3])
        expect(root(container)).toHaveAttribute('data-variant', 'agent')
    })

    it('derives every glyph run from the watermark copy (no hard-coded lettering)', () => {
        const { container } = render(<GraffitiLayer />)
        const compact = (s: string) => s.replace(/[^A-Za-z0-9]/g, '')
        const copy = compact(tokens.pattern.watermark.content)
        const runs = Array.from(container.querySelectorAll('svg text'))
            .map((t) => compact(t.textContent ?? ''))
            .filter(Boolean)
        expect(runs.length).toBeGreaterThan(0)
        for (const run of runs) expect(copy).toContain(run)
    })

    it('marks the dialog variant as drifting only when asked', () => {
        const { container, rerender } = render(
            <GraffitiLayer variant="dialog" />
        )
        expect(root(container)).not.toHaveAttribute('data-drift')
        rerender(<GraffitiLayer variant="dialog" drift />)
        expect(root(container)).toHaveAttribute('data-drift')
    })
})

describe('FilmStripBackground', () => {
    it('renders custom frames inside the strips', () => {
        const { container, getAllByText } = render(
            <FilmStripBackground
                frames={[
                    <span key="a">A1</span>,
                    <span key="b">B2</span>,
                    <span key="c">C3</span>,
                ]}
            />
        )
        expect(getAllByText('A1').length).toBeGreaterThan(0)
        expect(getAllByText('C3').length).toBeGreaterThan(0)
        expect(container.querySelectorAll('.zzz-filmstrip__strip').length).toBe(
            3
        )
    })

    it('default stencils use neutral lettering (no game abbreviation)', () => {
        const { container } = render(<FilmStripBackground />)
        expect(
            container.querySelectorAll('.zzz-filmstrip__glyph').length
        ).toBeGreaterThan(0)
        expect(container.textContent).not.toMatch(/ZZZ/)
    })

    it('supports two strips', () => {
        const { container } = render(<FilmStripBackground strips={2} />)
        expect(container.querySelectorAll('.zzz-filmstrip__strip').length).toBe(
            2
        )
    })
})

describe('StorageMuralBackground', () => {
    it('renders no <svg> and no <img> without src: a flat band under the veil', () => {
        const { container } = render(<StorageMuralBackground />)
        expect(container.querySelector('svg')).toBeNull()
        expect(container.querySelector('img')).toBeNull()
        expect(root(container)).toHaveClass('zzz-mural')
        expect(root(container).querySelector('.zzz-mural__veil')).not.toBeNull()
        expect(root(container).children).toHaveLength(1)
    })

    it('renders any image URL as a decorative <img> under the veil with src', () => {
        const url = 'https://cdn.example.com/banner.png'
        const { container } = render(<StorageMuralBackground src={url} />)
        const img = container.querySelector('img')
        expect(img).toHaveAttribute('src', url)
        expect(img).toHaveAttribute('alt', '')
        expect(img).toHaveAttribute('decoding', 'async')
        expect(img).toHaveClass('zzz-mural__art')
        expect(container.querySelector('svg')).toBeNull()
        // the veil sits after (on top of) the image
        expect(img?.nextElementSibling).toHaveClass('zzz-mural__veil')
    })

    it('keeps the image hidden until it has loaded (no partial paint), then marks it loaded', () => {
        const { container, rerender } = render(
            <StorageMuralBackground src="https://x.invalid/a.png" />
        )
        const img = container.querySelector('img')!
        expect(img).not.toHaveAttribute('data-loaded')
        fireEvent.load(img)
        expect(img).toHaveAttribute('data-loaded')
        expect(img).not.toHaveAttribute('data-instant')
        rerender(<StorageMuralBackground src="https://x.invalid/b.png" />)
        expect(container.querySelector('img')).not.toHaveAttribute(
            'data-loaded'
        )
    })

    it('drops a failed image (unreachable URL → flat band) and retries a new src', () => {
        const { container, rerender } = render(
            <StorageMuralBackground src="https://x.invalid/a.png" />
        )
        fireEvent.error(container.querySelector('img')!)
        expect(container.querySelector('img')).toBeNull()
        expect(container.querySelector('.zzz-mural__veil')).not.toBeNull()
        rerender(<StorageMuralBackground src="https://x.invalid/b.png" />)
        expect(container.querySelector('img')).toHaveAttribute(
            'src',
            'https://x.invalid/b.png'
        )
    })

    it('passes className, style and ref through', () => {
        const ref = createRef<HTMLDivElement>()
        const { container } = render(
            <StorageMuralBackground
                ref={ref}
                className="m"
                style={{ height: '10px' }}
            />
        )
        expect(root(container)).toHaveClass('zzz-bg', 'zzz-mural', 'm')
        expect(root(container)).toHaveStyle({ height: '10px' })
        expect(ref.current).toBe(root(container))
    })
})
