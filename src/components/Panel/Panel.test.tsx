import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Panel } from './Panel'

describe('Panel', () => {
  it('renders a side panel section labelled by its header', () => {
    render(<Panel headerLabel="Detail">body</Panel>)
    const region = screen.getByRole('region', { name: 'Detail' })
    expect(region.tagName).toBe('SECTION')
    expect(region).toHaveClass('zzz-panel', 'zzz-panel--side')
    expect(region.querySelector('.zzz-panel__surface')).toHaveClass('zzz-mat-panel')
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('prefers the title as the label and renders it as a heading', () => {
    render(<Panel headerLabel="Detail" title="The Brimstone" />)
    expect(screen.getByRole('region', { name: 'The Brimstone' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Brimstone' })).toBeInTheDocument()
  })

  it('tool variant: textured header, lower section and lowerTexturedFrom', () => {
    const { container } = render(
      <Panel variant="tool" headerLabel="Crafting" lower={<span>tiles</span>} lowerTexturedFrom={300}>
        info
      </Panel>,
    )
    expect(container.querySelector('.zzz-panel__header')).toHaveClass('zzz-mat-textured')
    expect(screen.getByText('tiles').parentElement).toHaveClass('zzz-panel__lower', 'zzz-mat-textured--body')
    expect(container.querySelector('.zzz-panel__lower-bg')).not.toBeNull()
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--zzz-panel-lower-from')).toBe('300')
  })

  it('large variant: title band, stage and aside', () => {
    const { container } = render(
      <Panel variant="large" title="The Brimstone" headerLabel="ignored" aside={<span>stats</span>}>
        art
      </Panel>,
    )
    expect(container.querySelector('.zzz-panel__surface')).toHaveClass('zzz-mat-panel--large')
    expect(screen.getByRole('heading', { name: 'The Brimstone' }).parentElement).toHaveClass('zzz-panel__title-band')
    expect(screen.getByText('art')).toHaveClass('zzz-panel__stage')
    expect(screen.getByText('stats').parentElement).toHaveClass('zzz-panel__aside')
    expect(container.querySelector('.zzz-panel__header')).toBeNull()
  })

  it('drawerInner variant has no ring material', () => {
    const { container } = render(<Panel variant="drawerInner">x</Panel>)
    expect(container.firstElementChild).toHaveClass('zzz-panel--drawer-inner')
    expect(container.querySelector('.zzz-panel__surface')).not.toHaveClass('zzz-mat-panel')
  })

  it('renders a footer', () => {
    render(<Panel footer={<button type="button">View</button>} />)
    expect(screen.getByRole('button', { name: 'View' }).parentElement).toHaveClass('zzz-panel__footer')
  })

  it('width/height set the outer size vars; props, className, style, ref and aria-labelledby pass through', () => {
    const ref = createRef<HTMLElement>()
    render(
      <>
        <span id="ext">External</span>
        <Panel ref={ref} width={500} height={400} className="x" style={{ margin: 1 }} aria-labelledby="ext" headerLabel="Detail" data-testid="p" />
      </>,
    )
    const el = screen.getByTestId('p')
    expect(ref.current).toBe(el)
    expect(el).toHaveClass('x')
    expect(el.style.getPropertyValue('--zzz-panel-w')).toBe('500')
    expect(el.style.getPropertyValue('--zzz-panel-h')).toBe('400')
    expect(el.style.margin).toBe('1px')
    expect(el).toHaveAccessibleName('External')
  })
})
