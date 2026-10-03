import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { ZZZ_DEFAULT_SCALE, ZzzTheme } from './ZzzTheme'

const styleVar = (el: HTMLElement, name: string) => el.style.getPropertyValue(name)

describe('ZzzTheme', () => {
  it('renders a .zzz-theme div around its children', () => {
    render(
      <ZzzTheme data-testid="theme">
        <span>Craft</span>
      </ZzzTheme>,
    )
    const theme = screen.getByTestId('theme')
    expect(theme.tagName).toBe('DIV')
    expect(theme).toHaveClass('zzz-theme')
    expect(theme).toContainElement(screen.getByText('Craft'))
  })

  it('inherits scale and accent when no props are given', () => {
    render(<ZzzTheme data-testid="theme" />)
    const theme = screen.getByTestId('theme')
    expect(styleVar(theme, '--zzz-scale')).toBe('')
    expect(styleVar(theme, '--zzz-px')).toBe('')
    expect(theme).not.toHaveAttribute('data-accent-phase')
    expect(theme).not.toHaveAttribute('data-reduced-motion')
  })

  it('sets --zzz-scale (and recomputes the rem-based --zzz-px) for a numeric scale', () => {
    render(<ZzzTheme data-testid="theme" scale={0.75} />)
    const theme = screen.getByTestId('theme')
    expect(styleVar(theme, '--zzz-scale')).toBe('0.75')
    expect(styleVar(theme, '--zzz-px')).toBe('calc(1rem / 16 * var(--zzz-scale))')
  })

  it('scale={1} opts into game density, still rem-based', () => {
    render(<ZzzTheme data-testid="theme" scale={1} />)
    const theme = screen.getByTestId('theme')
    expect(styleVar(theme, '--zzz-scale')).toBe('1')
    expect(styleVar(theme, '--zzz-px')).toBe('calc(1rem / 16 * var(--zzz-scale))')
  })

  it('exports the web default scale', () => {
    expect(ZZZ_DEFAULT_SCALE).toBe(0.7)
  })

  it('scales with the viewport height for scale="viewport"', () => {
    render(<ZzzTheme data-testid="theme" scale="viewport" />)
    const theme = screen.getByTestId('theme')
    expect(styleVar(theme, '--zzz-px')).toBe('calc(100vh / 1080)')
  })

  it.each(['live', 'lime', 'mid', 'yellow'] as const)('maps accentPhase="%s" to data-accent-phase', (phase) => {
    render(<ZzzTheme data-testid="theme" accentPhase={phase} />)
    expect(screen.getByTestId('theme')).toHaveAttribute('data-accent-phase', phase)
  })

  it('marks reducedMotion with data-reduced-motion', () => {
    render(<ZzzTheme data-testid="theme" reducedMotion />)
    expect(screen.getByTestId('theme')).toHaveAttribute('data-reduced-motion')
  })

  it('merges className and style, and passes native div props and ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ZzzTheme ref={ref} data-testid="theme" className="page" style={{ color: 'red' }} scale={2} id="root" aria-label="Game UI" />,
    )
    const theme = screen.getByTestId('theme')
    expect(theme).toHaveClass('zzz-theme', 'page')
    expect(theme.style.color).toBe('red')
    expect(styleVar(theme, '--zzz-scale')).toBe('2')
    expect(theme).toHaveAttribute('id', 'root')
    expect(theme).toHaveAttribute('aria-label', 'Game UI')
    expect(ref.current).toBe(theme)
  })

  it('lets an explicit style override the computed scale variables', () => {
    render(<ZzzTheme data-testid="theme" scale={2} style={{ ['--zzz-scale' as string]: '3' }} />)
    expect(styleVar(screen.getByTestId('theme'), '--zzz-scale')).toBe('3')
  })
})
