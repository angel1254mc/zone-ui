import { fireEvent, render } from '@testing-library/react'
import { ArtSlot } from './ArtSlot'

const slotOf = (c: HTMLElement) =>
    c.querySelector('picture.zart') as HTMLElement

describe('ArtSlot', () => {
    it('starts in the loading state with a lazy, async <img> carrying its intrinsic size', () => {
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                width={384}
                height={384}
                alt="Anby"
            />
        )
        const slot = slotOf(container)
        expect(slot.tagName).toBe('PICTURE')
        expect(slot).toHaveAttribute('data-state', 'loading')
        expect(slot).toHaveAttribute('aria-busy', 'true')
        const img = slot.querySelector('img')!
        expect(img).toHaveAttribute('src', 'https://cdn.test/a.webp')
        expect(img).toHaveAttribute('width', '384')
        expect(img).toHaveAttribute('height', '384')
        expect(img).toHaveAttribute('loading', 'lazy')
        expect(img).toHaveAttribute('decoding', 'async')
        expect(img).toHaveAttribute('alt', 'Anby')
        expect(container.querySelector('svg')).toBeNull()
    })

    it('moves to loaded on load (with a fade, not instant)', async () => {
        const { container } = render(
            <ArtSlot src="https://cdn.test/a.webp" width={10} height={10} />
        )
        fireEvent.load(container.querySelector('img')!)
        await vi.waitFor(() =>
            expect(slotOf(container)).toHaveAttribute('data-state', 'loaded')
        )
        expect(slotOf(container)).not.toHaveAttribute('data-instant')
        expect(slotOf(container)).not.toHaveAttribute('aria-busy')
    })

    it('moves to missing on error, drops the <img> and reports the URL once', () => {
        const onImageError = vi.fn()
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                width={10}
                height={10}
                alt="Anby"
                onImageError={onImageError}
            />
        )
        fireEvent.error(container.querySelector('img')!)
        const slot = slotOf(container)
        expect(slot).toHaveAttribute('data-state', 'missing')
        expect(slot.querySelector('img')).toBeNull()
        // The alt text survives on the empty frame.
        expect(slot).toHaveAttribute('role', 'img')
        expect(slot).toHaveAttribute('aria-label', 'Anby')
        expect(onImageError).toHaveBeenCalledTimes(1)
        expect(onImageError).toHaveBeenCalledWith('https://cdn.test/a.webp')
    })

    it('a new src after an error starts loading again', () => {
        const { container, rerender } = render(
            <ArtSlot src="https://cdn.test/a.webp" width={10} height={10} />
        )
        fireEvent.error(container.querySelector('img')!)
        rerender(
            <ArtSlot src="https://cdn.test/b.webp" width={10} height={10} />
        )
        expect(slotOf(container)).toHaveAttribute('data-state', 'loading')
        expect(container.querySelector('img')).toHaveAttribute(
            'src',
            'https://cdn.test/b.webp'
        )
    })

    it('status loading shows the skeleton without requesting anything', () => {
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                status="loading"
                width={10}
                height={10}
            />
        )
        expect(slotOf(container)).toHaveAttribute('data-state', 'loading')
        expect(container.querySelector('img')).toBeNull()
    })

    it('status missing, or src null, renders a decorative empty frame', () => {
        const a = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                status="missing"
                width={10}
                height={10}
            />
        )
        expect(slotOf(a.container)).toHaveAttribute('data-state', 'missing')
        expect(slotOf(a.container)).toHaveAttribute('aria-hidden', 'true')
        expect(a.container.querySelector('img, svg')).toBeNull()
        const b = render(<ArtSlot src={null} width={10} height={10} />)
        expect(slotOf(b.container)).toHaveAttribute('data-state', 'missing')
    })

    it('priority loads eagerly with high fetch priority', () => {
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                width={10}
                height={10}
                priority
            />
        )
        const img = container.querySelector('img')!
        expect(img).toHaveAttribute('loading', 'eager')
        expect(img).toHaveAttribute('fetchpriority', 'high')
    })

    it('puts className/style/fit/position on the wrapper; ratio layout reserves the aspect ratio', () => {
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                width={180}
                height={64}
                layout="ratio"
                fit="contain"
                position="50% 28%"
                className="x"
                style={{ borderRadius: 4 }}
            />
        )
        const slot = slotOf(container)
        expect(slot).toHaveClass('zart', 'x')
        expect(slot).toHaveAttribute('data-layout', 'ratio')
        expect(slot.style.aspectRatio).toBe('180 / 64')
        expect(slot.style.objectFit).toBe('contain')
        expect(slot.style.objectPosition).toBe('50% 28%')
        expect(slot.style.borderRadius).toBe('4px')
        expect(container.querySelector('img')!.getAttribute('class')).toBeNull()
    })

    it('fill layout sets no inline fit unless given (parent slot rules flow through)', () => {
        const { container } = render(
            <ArtSlot src="https://cdn.test/a.webp" width={10} height={10} />
        )
        const slot = slotOf(container)
        expect(slot).toHaveAttribute('data-layout', 'fill')
        expect(slot.style.objectFit).toBe('')
        expect(slot.style.aspectRatio).toBe('')
        expect(slot).not.toHaveAttribute('data-fit')
    })

    it('defaultFit is a data-fit attribute (zero-specificity CSS), never inline', () => {
        const { container } = render(
            <ArtSlot
                src="https://cdn.test/a.webp"
                width={10}
                height={10}
                defaultFit="contain"
            />
        )
        const slot = slotOf(container)
        expect(slot).toHaveAttribute('data-fit', 'contain')
        expect(slot.style.objectFit).toBe('')
    })
})
