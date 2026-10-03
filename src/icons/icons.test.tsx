import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import * as iconModule from './index'
import { BackIcon, FireIcon, HomeIcon, Icon, icons, iconNames, type IconName } from './index'

const entries = Object.entries(icons) as [IconName, (typeof icons)[IconName]][]

describe('icon set', () => {
  it('has a non-trivial number of glyphs', () => {
    expect(entries.length).toBeGreaterThanOrEqual(80)
    expect(iconNames).toEqual(Object.keys(icons))
  })

  it.each(entries)('%s renders an svg on the 32-tall grid without error', (name, Component) => {
    const { container } = render(<Component data-testid="icon" />)
    const svg = container.querySelector('svg')!
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', `0 0 ${Component.viewBoxWidth} 32`)
    expect(svg).toHaveClass('zzz-icon', `zzz-icon--${name}`)
    expect(svg.querySelectorAll('path, circle, rect, ellipse, polygon, text').length).toBeGreaterThan(0)
    // every path must have drawable data
    svg.querySelectorAll('path').forEach((p) => expect(p.getAttribute('d')).toMatch(/^M/))
    expect(Component.iconName).toBe(name)
  })

  it.each(entries)('%s is decorative by default (aria-hidden, not focusable)', (_name, Component) => {
    const { container } = render(<Component />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).not.toHaveAttribute('role')
    expect(svg.querySelector('title')).toBeNull()
  })

  it('every *Icon / glyph export from the barrel is registered in `icons`', () => {
    const registered = new Set(Object.values(icons))
    const exported = Object.entries(iconModule).filter(
      ([key, value]) => typeof value === 'function' && 'iconName' in value && key !== 'Icon',
    )
    expect(exported.length).toBe(entries.length)
    for (const [, value] of exported) expect(registered.has(value as never)).toBe(true)
  })
})

describe('wide dock glyphs', () => {
  // viewBox width = glyph width × 32 / 60 (dock glyph height)
  const wide: [IconName, number][] = [
    ['squad', 40.5],
    ['mail', 41],
    ['interKnot', 46],
    ['agents', 56],
    ['signalSearch', 37],
  ]
  it.each(wide)('%s uses a 0 0 %d 32 viewBox', (name, w) => {
    const { container } = render(<Icon name={name} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('viewBox', `0 0 ${w} 32`)
    expect(svg).toHaveAttribute('height', '1em')
    expect(svg).toHaveAttribute('width', `${w / 32}em`)
  })

  it('size is the height; the width follows the aspect ratio', () => {
    const { container } = render(<Icon name="agents" size={60} />)
    const svg = container.querySelector('svg')!
    expect(svg.style.height).toBe('calc(60 * var(--zzz-px, 1px))')
    expect(svg.style.width).toBe('calc(105 * var(--zzz-px, 1px))')
  })

  it('square icons keep the 32 grid', () => {
    for (const name of ['more', 'options', 'store', 'storage', 'achievements'] as IconName[]) {
      const { container, unmount } = render(<Icon name={name} />)
      expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 32 32')
      unmount()
    }
  })
})

describe('icon accessibility', () => {
  it('title gives role="img" and an accessible name', () => {
    render(<HomeIcon title="City" />)
    const img = screen.getByRole('img', { name: 'City' })
    expect(img).not.toHaveAttribute('aria-hidden')
    expect(img).not.toHaveAttribute('focusable')
    expect(img.querySelector('title')).toHaveTextContent('City')
  })

  it('aria-label also makes the icon an image', () => {
    render(<BackIcon aria-label="Back" />)
    expect(screen.getByRole('img', { name: 'Back' })).toBeInTheDocument()
  })

  it('titles get unique ids per instance', () => {
    const { container } = render(
      <>
        <HomeIcon title="One" />
        <HomeIcon title="Two" />
      </>,
    )
    const ids = [...container.querySelectorAll('title')].map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
    expect(screen.getByRole('img', { name: 'Two' })).toBeInTheDocument()
  })
})

describe('icon size and pass-through', () => {
  it('defaults to 1em via attributes (CSS can override)', () => {
    const { container } = render(<HomeIcon />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '1em')
    expect(svg).toHaveAttribute('height', '1em')
    expect(svg.style.width).toBe('')
  })

  it('a number is in design units, scaled by --zzz-px', () => {
    const { container } = render(<HomeIcon size={28} />)
    const svg = container.querySelector('svg')!
    expect(svg.style.width).toBe('calc(28 * var(--zzz-px, 1px))')
    expect(svg.style.height).toBe('calc(28 * var(--zzz-px, 1px))')
    expect(svg).not.toHaveAttribute('width')
  })

  it('a string is any CSS length', () => {
    const { container } = render(<HomeIcon size="2.5em" />)
    const svg = container.querySelector('svg')!
    expect(svg.style.width).toBe('2.5em')
    expect(svg.style.height).toBe('2.5em')
  })

  it('passes className, style, ref and svg props through', () => {
    const ref = createRef<SVGSVGElement>()
    const { container } = render(
      <BackIcon ref={ref} className="extra" style={{ color: 'red' }} data-x="1" />,
    )
    const svg = container.querySelector('svg')!
    expect(ref.current).toBe(svg)
    expect(svg).toHaveClass('zzz-icon', 'zzz-icon--back', 'extra')
    expect(svg.style.color).toBe('red')
    expect(svg).toHaveAttribute('data-x', '1')
    expect(svg).toHaveAttribute('fill', 'currentColor')
  })

  it('multi-colour glyphs use per-instance gradient ids', () => {
    const { container } = render(
      <>
        <FireIcon />
        <FireIcon />
      </>,
    )
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id)
    expect(ids.length).toBeGreaterThanOrEqual(2)
    expect(new Set(ids).size).toBe(ids.length)
    container.querySelectorAll('[fill^="url(#"]').forEach((el) => {
      const ref = el.getAttribute('fill')!.slice(5, -1)
      expect(container.querySelector(`[id="${ref}"]`)).not.toBeNull()
    })
  })
})

describe('<Icon name> lookup', () => {
  it('renders the named glyph', () => {
    const { container } = render(<Icon name="home" />)
    expect(container.querySelector('svg')).toHaveClass('zzz-icon--home')
  })

  it('forwards title and size', () => {
    render(<Icon name="lock" title="Locked" size={26} />)
    const img = screen.getByRole('img', { name: 'Locked' })
    expect(img).toHaveClass('zzz-icon--lock')
    expect(img.style.width).toBe('calc(26 * var(--zzz-px, 1px))')
  })

  it('renders every registered name', () => {
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />)
      expect(container.querySelector(`svg.zzz-icon--${name}`)).not.toBeNull()
      unmount()
    }
  })
})
