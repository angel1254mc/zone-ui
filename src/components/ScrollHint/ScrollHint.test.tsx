import { createRef, useRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScrollHint, remainingScroll, type ScrollHintProps } from './ScrollHint'

function layout(
    el: HTMLElement,
    box: { ch?: number; sh?: number; cw?: number; sw?: number }
) {
    Object.defineProperty(el, 'clientHeight', {
        configurable: true,
        value: box.ch ?? 100,
    })
    Object.defineProperty(el, 'scrollHeight', {
        configurable: true,
        value: box.sh ?? 100,
    })
    Object.defineProperty(el, 'clientWidth', {
        configurable: true,
        value: box.cw ?? 100,
    })
    Object.defineProperty(el, 'scrollWidth', {
        configurable: true,
        value: box.sw ?? 100,
    })
}

/** A scroll box whose layout is faked before the hint subscribes (ref callback runs before effects). */
function Auto({
    box,
    ...props
}: ScrollHintProps & { box: Parameters<typeof layout>[1] }) {
    const ref = useRef<HTMLDivElement | null>(null)
    return (
        <div style={{ position: 'relative' }}>
            <div
                data-testid="box"
                ref={(el) => {
                    if (el) layout(el, box)
                    ref.current = el
                }}
            >
                content
            </div>
            <ScrollHint target={ref} data-testid="hint" {...props} />
        </div>
    )
}

describe('ScrollHint', () => {
    it('is a decorative aria-hidden glyph by default', () => {
        render(<ScrollHint data-testid="h" />)
        const h = screen.getByTestId('h')
        expect(h.tagName).toBe('SPAN')
        expect(h).toHaveAttribute('aria-hidden', 'true')
        expect(h).toHaveClass(
            'zzz-scroll-hint',
            'zzz-scroll-hint--down',
            'zzz-scroll-hint--triangle',
            'zzz-scroll-hint--panel',
            'zzz-scroll-hint--end'
        )
        expect(h).toHaveAttribute('data-visible', 'true')
        expect(h.querySelector('svg')).toHaveAttribute('viewBox', '0 0 32 15')
        expect(screen.queryByRole('button')).toBeNull()
    })

    it('picks the glyph from the direction and size', () => {
        const { rerender } = render(
            <ScrollHint data-testid="h" direction="right" />
        )
        expect(screen.getByTestId('h')).toHaveClass('zzz-scroll-hint--chevron')
        expect(screen.getByTestId('h').querySelector('svg')).toHaveAttribute(
            'viewBox',
            '0 0 19 32'
        )
        rerender(<ScrollHint data-testid="h" size="list" />)
        expect(screen.getByTestId('h').querySelector('svg')).toHaveAttribute(
            'viewBox',
            '0 0 25 12.5'
        )
        rerender(
            <ScrollHint
                data-testid="h"
                direction="up"
                glyph="chevron"
                placement="static"
            />
        )
        expect(screen.getByTestId('h')).toHaveClass(
            'zzz-scroll-hint--up',
            'zzz-scroll-hint--chevron'
        )
        expect(screen.getByTestId('h')).not.toHaveClass('zzz-scroll-hint--end')
    })

    it('respects a forced visible=false', () => {
        render(<ScrollHint data-testid="h" visible={false} />)
        expect(screen.getByTestId('h')).toHaveAttribute('data-visible', 'false')
    })

    it('auto: shows while content remains below and hides at the end', () => {
        render(<Auto box={{ ch: 100, sh: 300 }} />)
        const hint = screen.getByTestId('hint')
        const box = screen.getByTestId('box')
        expect(hint).toHaveAttribute('data-visible', 'true')
        box.scrollTop = 200
        fireEvent.scroll(box)
        expect(hint).toHaveAttribute('data-visible', 'false')
        box.scrollTop = 150
        fireEvent.scroll(box)
        expect(hint).toHaveAttribute('data-visible', 'true')
    })

    it('auto: hidden when nothing overflows', () => {
        render(<Auto box={{ ch: 100, sh: 100 }} />)
        expect(screen.getByTestId('hint')).toHaveAttribute(
            'data-visible',
            'false'
        )
    })

    it('auto: horizontal and upward directions', () => {
        render(<Auto box={{ cw: 100, sw: 400 }} direction="right" />)
        const box = screen.getByTestId('box')
        const hint = screen.getByTestId('hint')
        expect(hint).toHaveAttribute('data-visible', 'true')
        box.scrollLeft = 300
        fireEvent.scroll(box)
        expect(hint).toHaveAttribute('data-visible', 'false')
        expect(remainingScroll(box, 'left')).toBe(300)
        expect(remainingScroll(box, 'up')).toBe(0)
    })

    it('interactive: a named button that scrolls the target a page', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()
        render(<Auto box={{ ch: 100, sh: 1000 }} onClick={onClick} />)
        const box = screen.getByTestId('box')
        const button = screen.getByRole('button', { name: 'Scroll down' })
        expect(button).not.toHaveAttribute('aria-hidden')
        expect(button).toHaveAttribute('type', 'button')
        await user.click(button)
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(box.scrollTop).toBe(90)
    })

    it('interactive: keyboard activation, custom label, preventDefault skips the scroll', async () => {
        const user = userEvent.setup()
        render(
            <Auto
                box={{ cw: 200, sw: 1000 }}
                direction="right"
                label="More rewards"
                onClick={(e) => e.preventDefault()}
            />
        )
        const button = screen.getByRole('button', { name: 'More rewards' })
        button.focus()
        await user.keyboard('{Enter}')
        expect(screen.getByTestId('box').scrollLeft).toBe(0)
    })

    it('interactive without onClick scrolls right; hidden hint leaves the tab order', async () => {
        const user = userEvent.setup()
        render(
            <Auto box={{ cw: 200, sw: 1000 }} direction="right" interactive />
        )
        const button = screen.getByRole('button', { name: 'Scroll right' })
        await user.click(button)
        expect(screen.getByTestId('box').scrollLeft).toBe(180)
        render(<ScrollHint interactive visible={false} data-testid="off" />)
        expect(screen.getByTestId('off')).toHaveAttribute('tabindex', '-1')
    })

    it('passes className, style, ref and native props through', () => {
        const ref = createRef<HTMLElement>()
        render(
            <ScrollHint
                ref={ref}
                className="x"
                style={{ bottom: 4 }}
                id="hint"
                data-testid="h"
            />
        )
        const h = screen.getByTestId('h')
        expect(ref.current).toBe(h)
        expect(h).toHaveClass('x')
        expect(h.style.bottom).toBe('4px')
        expect(h.id).toBe('hint')
    })

    it('unsubscribes on unmount', () => {
        const { unmount } = render(<Auto box={{ ch: 100, sh: 300 }} />)
        act(() => unmount())
        expect(screen.queryByTestId('hint')).toBeNull()
    })

    /** Hint first, scroll box rendered conditionally (and swappable) after it. */
    function Late({ show, which = 'a' }: { show: boolean; which?: 'a' | 'b' }) {
        const ref = useRef<HTMLDivElement | null>(null)
        const box = { a: { ch: 100, sh: 500 }, b: { ch: 100, sh: 100 } }[which]
        return (
            <div>
                <ScrollHint target={ref} data-testid="hint" />
                {show && (
                    <div
                        key={which}
                        data-testid={`box-${which}`}
                        ref={(el) => {
                            if (el) layout(el, box)
                            ref.current = el
                        }}
                    />
                )}
            </div>
        )
    }

    it('auto: subscribes to a target that mounts after the hint', () => {
        const { rerender } = render(<Late show={false} />)
        const hint = screen.getByTestId('hint')
        expect(hint).toHaveAttribute('data-visible', 'false')
        rerender(<Late show />)
        expect(hint).toHaveAttribute('data-visible', 'true')
        const box = screen.getByTestId('box-a')
        box.scrollTop = 400
        fireEvent.scroll(box)
        expect(hint).toHaveAttribute('data-visible', 'false')
    })

    it('auto: follows a swapped target and resets when it unmounts', () => {
        const { rerender } = render(<Late show />)
        const hint = screen.getByTestId('hint')
        expect(hint).toHaveAttribute('data-visible', 'true')
        const old = screen.getByTestId('box-a')
        rerender(<Late show which="b" />)
        expect(hint).toHaveAttribute('data-visible', 'false')
        // the detached node no longer drives the hint
        old.scrollTop = 0
        fireEvent.scroll(old)
        expect(hint).toHaveAttribute('data-visible', 'false')
        rerender(<Late show which="a" />)
        expect(hint).toHaveAttribute('data-visible', 'true')
        rerender(<Late show={false} which="a" />)
        expect(hint).toHaveAttribute('data-visible', 'false')
    })

    it('auto: accepts an element (e.g. from a state callback ref) as target', () => {
        const el = document.createElement('div')
        layout(el, { ch: 100, sh: 300 })
        const { rerender } = render(
            <ScrollHint data-testid="hint" target={null} />
        )
        expect(screen.getByTestId('hint')).toHaveAttribute(
            'data-visible',
            'false'
        )
        rerender(<ScrollHint data-testid="hint" target={el} />)
        expect(screen.getByTestId('hint')).toHaveAttribute(
            'data-visible',
            'true'
        )
        el.scrollTop = 200
        fireEvent.scroll(el)
        expect(screen.getByTestId('hint')).toHaveAttribute(
            'data-visible',
            'false'
        )
    })
})
