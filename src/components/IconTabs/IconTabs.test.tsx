import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRef, useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconTabs } from './index'
import type { IconTabsItem } from './index'
import { TabPanel } from '../SegmentedTabs'
import {
    WEngineCategoryIcon,
    DriveDiscCategoryIcon,
    MaterialsCategoryIcon,
    ConsumablesCategoryIcon,
} from '../../icons'

const items: IconTabsItem[] = [
    { value: 'wengine', label: 'W-Engine', icon: <WEngineCategoryIcon /> },
    { value: 'disc', label: 'Drive Disc', icon: <DriveDiscCategoryIcon /> },
    { value: 'materials', label: 'Materials', icon: <MaterialsCategoryIcon /> },
    {
        value: 'consumables',
        label: 'Consumables',
        icon: <ConsumablesCategoryIcon />,
    },
]

describe('IconTabs', () => {
    it('renders a labelled tablist of icon tabs', () => {
        render(
            <IconTabs aria-label="Storage" items={items} defaultValue="disc" />
        )
        const list = screen.getByRole('tablist', { name: 'Storage' })
        expect(list).toHaveClass('zzz-icon-tabs', 'zzz-mat-pill')
        const tabs = screen.getAllByRole('tab')
        expect(tabs.map((t) => t.getAttribute('aria-label'))).toEqual([
            'W-Engine',
            'Drive Disc',
            'Materials',
            'Consumables',
        ])
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
        expect(tabs[1]).toHaveAttribute('data-active')
        expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1, -1])
        // icons are decorative inside the labelled button
        expect(tabs[0].querySelector('.zzz-icon-tabs__glyph')).toHaveAttribute(
            'aria-hidden',
            'true'
        )
    })

    it('draws the accent disc only on the active tab', () => {
        const { container } = render(<IconTabs items={items} value="wengine" />)
        expect(container.querySelectorAll('.zzz-icon-tabs__disc')).toHaveLength(
            1
        )
        expect(
            screen
                .getByRole('tab', { name: 'W-Engine' })
                .querySelector('.zzz-icon-tabs__disc')
        ).not.toBeNull()
    })

    it('uncontrolled: click selects', async () => {
        const onValueChange = vi.fn()
        render(<IconTabs items={items} onValueChange={onValueChange} />)
        expect(screen.getByRole('tab', { name: 'W-Engine' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
        await userEvent.click(screen.getByRole('tab', { name: 'Materials' }))
        expect(onValueChange).toHaveBeenCalledWith('materials')
        expect(screen.getByRole('tab', { name: 'Materials' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
    })

    it('controlled: reports without changing, round trip updates', async () => {
        const onValueChange = vi.fn()
        const { unmount } = render(
            <IconTabs
                items={items}
                value="wengine"
                onValueChange={onValueChange}
            />
        )
        await userEvent.click(screen.getByRole('tab', { name: 'Drive Disc' }))
        expect(onValueChange).toHaveBeenCalledWith('disc')
        expect(screen.getByRole('tab', { name: 'W-Engine' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
        unmount()
        function Harness() {
            const [v, setV] = useState('wengine')
            return <IconTabs items={items} value={v} onValueChange={setV} />
        }
        render(<Harness />)
        await userEvent.click(screen.getByRole('tab', { name: 'Drive Disc' }))
        expect(screen.getByRole('tab', { name: 'Drive Disc' })).toHaveAttribute(
            'aria-selected',
            'true'
        )
    })

    it('keyboard: arrows (wrap, skip disabled), Home/End', async () => {
        const withDisabled = items.map((it) =>
            it.value === 'materials' ? { ...it, disabled: true } : it
        )
        render(<IconTabs items={withDisabled} defaultValue="wengine" />)
        const tab = (name: string) => screen.getByRole('tab', { name })
        act(() => tab('W-Engine').focus())
        await userEvent.keyboard('{ArrowRight}')
        expect(tab('Drive Disc')).toHaveFocus()
        expect(tab('Drive Disc')).toHaveAttribute('aria-selected', 'true')
        await userEvent.keyboard('{ArrowRight}')
        expect(tab('Consumables')).toHaveFocus()
        await userEvent.keyboard('{ArrowRight}')
        expect(tab('W-Engine')).toHaveFocus()
        await userEvent.keyboard('{ArrowLeft}')
        expect(tab('Consumables')).toHaveFocus()
        await userEvent.keyboard('{Home}')
        expect(tab('W-Engine')).toHaveFocus()
        await userEvent.keyboard('{End}')
        expect(tab('Consumables')).toHaveFocus()
    })

    it('disabled: aria-disabled and not selectable', async () => {
        const onValueChange = vi.fn()
        render(
            <IconTabs
                items={items.map((it, i) =>
                    i === 2 ? { ...it, disabled: true } : it
                )}
                onValueChange={onValueChange}
            />
        )
        const tab = screen.getByRole('tab', { name: 'Materials' })
        expect(tab).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(tab)
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('pressed state on an inactive tab while the pointer is held (and forced)', () => {
        const { rerender } = render(
            <IconTabs items={items} defaultValue="wengine" />
        )
        const disc = screen.getByRole('tab', { name: 'Drive Disc' })
        fireEvent.pointerDown(disc, { button: 0 })
        expect(disc).toHaveAttribute('data-pressed')
        fireEvent.pointerUp(window)
        expect(disc).not.toHaveAttribute('data-pressed')
        rerender(<IconTabs items={items} value="wengine" pressed="materials" />)
        expect(screen.getByRole('tab', { name: 'Materials' })).toHaveAttribute(
            'data-pressed'
        )
    })

    it('beat flourish is opt-in', () => {
        const { container, rerender } = render(<IconTabs items={items} />)
        const root = container.firstElementChild as HTMLElement
        expect(root).not.toHaveAttribute('data-beat')
        rerender(<IconTabs items={items} beat />)
        expect(root).toHaveAttribute('data-beat')
    })

    it('panel wiring with an id', () => {
        render(
            <>
                <IconTabs id="storage" items={items} value="disc" />
                <TabPanel tabsId="storage" value="disc">
                    Discs
                </TabPanel>
            </>
        )
        const tab = screen.getByRole('tab', { name: 'Drive Disc' })
        const panel = screen.getByRole('tabpanel', { name: 'Drive Disc' })
        expect(tab).toHaveAttribute('aria-controls', panel.id)
    })

    it('passes className, style and ref through; width from item count', () => {
        const ref = createRef<HTMLDivElement>()
        const { container } = render(
            <IconTabs
                ref={ref}
                items={items.slice(0, 3)}
                className="x"
                style={{ opacity: 0.5 }}
            />
        )
        expect(ref.current).toBe(container.firstElementChild)
        expect(ref.current).toHaveClass('x')
        expect(ref.current).toHaveStyle({ opacity: '0.5' })
        expect(
            ref.current!.style.getPropertyValue('--zzz-icon-tabs-count')
        ).toBe('3')
    })
})

/** Every length in the stylesheet goes through the component's size unit (--zzz-*-u), so sm/md/lg scale it. */
function sizeUnitCss() {
    const css = readFileSync(
        resolve(process.cwd(), 'src/components/IconTabs/IconTabs.css'),
        'utf8'
    ).replace(/\/\*[\s\S]*?\*\//g, '')
    const pxDecls = css
        .split(/[;{}]/)
        .map((s) => s.trim())
        .filter((s) => s.includes('var(--zzz-px)'))
    return { css, pxDecls }
}

describe('IconTabs size', () => {
    it('defaults to md and reflects size on data-size', () => {
        const { rerender } = render(
            <IconTabs aria-label="Storage" items={items} />
        )
        expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'md')
        rerender(<IconTabs aria-label="Storage" items={items} size="sm" />)
        expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'sm')
        rerender(<IconTabs aria-label="Storage" items={items} size="lg" />)
        expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'lg')
    })

    it('routes every stylesheet length through the size unit', () => {
        const { css, pxDecls } = sizeUnitCss()
        expect(css).toMatch(/\[data-size='sm'\]/)
        expect(css).toMatch(/\[data-size='lg'\]/)
        for (const d of pxDecls) expect(d).toMatch(/^--zzz-[a-z-]+-u:/)
    })
})
