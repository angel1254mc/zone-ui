import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Hero } from './Hero'

describe('Hero', () => {
    it('renders a region labelled by its headline, with eyebrow, meta, description and bullets', () => {
        render(
            <Hero
                eyebrow="Daily"
                title="Proxy Trivia"
                meta={['Puzzle #42', 'Oct 1']}
                description="Five questions a day."
                bullets={['30 seconds each', 'One try']}
            />
        )
        const region = screen.getByRole('region', { name: 'Proxy Trivia' })
        expect(
            screen.getByRole('heading', { level: 1, name: 'Proxy Trivia' })
        ).toBeInTheDocument()
        expect(region).toHaveTextContent('Daily')
        expect(region.querySelector('.zzz-hero__meta')).toHaveTextContent(
            'Puzzle #42 · Oct 1'
        )
        expect(region).toHaveTextContent('Five questions a day.')
        const list = within(region).getByRole('list')
        expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    })

    it('headingLevel changes the heading element', () => {
        render(<Hero title="Season 2" headingLevel="h2" />)
        expect(
            screen.getByRole('heading', { level: 2, name: 'Season 2' })
        ).toBeInTheDocument()
    })

    it('primary and secondary actions are buttons that fire their handlers; primary first', async () => {
        const play = vi.fn()
        const how = vi.fn()
        render(
            <Hero
                title="Daily"
                primaryAction={{ label: 'Play', onClick: play }}
                secondaryAction={{ label: 'How to play', onClick: how }}
                actions={<button type="button">Extra</button>}
            />
        )
        const buttons = screen.getAllByRole('button')
        expect(buttons.map((b) => b.textContent)).toEqual([
            'Play',
            'How to play',
            'Extra',
        ])
        expect(buttons[0]).toHaveClass('zzz-hero__action--primary')
        await userEvent.click(screen.getByRole('button', { name: 'Play' }))
        expect(play).toHaveBeenCalledTimes(1)
        screen.getByRole('button', { name: 'How to play' }).focus()
        await userEvent.keyboard('{Enter}')
        expect(how).toHaveBeenCalledTimes(1)
    })

    it('an action with href renders a link; a disabled action does not fire', async () => {
        const onClick = vi.fn()
        render(
            <Hero
                title="T"
                primaryAction={{ label: 'Archive', href: '/archive' }}
                secondaryAction={{ label: 'Locked', onClick, disabled: true }}
            />
        )
        expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute(
            'href',
            '/archive'
        )
        const locked = screen.getByRole('button', { name: 'Locked' })
        expect(locked).toBeDisabled()
        await userEvent.click(locked)
        expect(onClick).not.toHaveBeenCalled()
    })

    it('summary slot renders its content (status + countdown)', () => {
        render(
            <Hero
                title="T"
                summary={
                    <>
                        <span>Already played today</span>
                        <time dateTime="PT3H">03:00:00</time>
                    </>
                }
            />
        )
        const summary = document.querySelector(
            '.zzz-hero__summary'
        ) as HTMLElement
        expect(summary).toHaveTextContent('Already played today')
        expect(within(summary).getByText('03:00:00').tagName).toBe('TIME')
    })

    it('no summary / actions / art: those containers are not rendered', () => {
        render(<Hero title="T" />)
        expect(document.querySelector('.zzz-hero__summary')).toBeNull()
        expect(document.querySelector('.zzz-hero__actions')).toBeNull()
        expect(document.querySelector('.zzz-hero__art')).toBeNull()
        expect(document.querySelector('.zzz-hero')).toHaveClass(
            'zzz-hero--no-art',
            'zzz-hero--bg-hatch'
        )
    })

    it('art slot, art position, fit and background variants map to classes', () => {
        const { rerender } = render(
            <Hero title="T" art={<img alt="Portrait" src="x.png" />} />
        )
        const root = document.querySelector('.zzz-hero') as HTMLElement
        expect(
            screen.getByRole('img', { name: 'Portrait' })
        ).toBeInTheDocument()
        expect(root).toHaveClass('zzz-hero--art-right')
        rerender(
            <Hero
                title="T"
                art={<img alt="Portrait" src="x.png" />}
                artPosition="background"
                artFit="cover"
                background="graffiti"
                align="center"
            />
        )
        expect(root).toHaveClass(
            'zzz-hero--art-background',
            'zzz-hero--bg-graffiti',
            'zzz-hero--align-center'
        )
        expect(root.querySelector('.zzz-hero__art--cover')).not.toBeNull()
        expect(root.querySelector('.zzz-hero__bg')).not.toBeNull()
        rerender(
            <Hero
                title="T"
                art={<img alt="Portrait" src="x.png" />}
                artPosition="left"
                background="plain"
            />
        )
        expect(root).toHaveClass('zzz-hero--art-left', 'zzz-hero--bg-plain')
        expect(root.querySelector('.zzz-hero__bg')).toBeNull()
    })

    it('text outline: on over background art by default, or forced with textOutline', () => {
        const { rerender } = render(<Hero title="T" description="D" />)
        const desc = () =>
            document.querySelector('.zzz-hero__description') as HTMLElement
        expect(desc().className).not.toContain('outline-sm')
        rerender(
            <Hero
                title="T"
                description="D"
                art={<span />}
                artPosition="background"
            />
        )
        expect(desc().className).toContain('outline-sm')
        rerender(<Hero title="T" description="D" textOutline />)
        expect(desc().className).toContain('outline-sm')
    })

    it('forwards ref, className, style, native props; aria-label overrides the headline label', () => {
        const ref = { current: null as HTMLElement | null }
        render(
            <Hero
                ref={ref}
                title="T"
                className="extra"
                style={{ minHeight: 10 }}
                id="top"
                aria-label="Welcome"
            />
        )
        const root = screen.getByRole('region', { name: 'Welcome' })
        expect(ref.current).toBe(root)
        expect(root).toHaveClass('zzz-hero', 'extra')
        expect(root).toHaveAttribute('id', 'top')
        expect(root.style.minHeight).toBe('10px')
    })
})
