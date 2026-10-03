import React, { useEffect, useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { addons, types, useGlobals } from 'storybook/manager-api'
// Real zone-ui components, bundled into the manager by Storybook's esbuild manager builder. The
// entry is the generated barrel, so the manager also receives every component stylesheet (all
// rules are scoped to .zzz-* classes, so nothing leaks into Storybook's own UI).
import { SegmentedTabs } from '../../src/index'

/** Toolbar density: design units -> CSS px inside the tools (the toolbar is 40 CSS px tall). */
const TOOL_SCALE = 0.5

export const SCALE_ITEMS = [
  { value: '0.5', label: '0.5×', 'aria-label': '0.5× compact' },
  { value: '0.7', label: '0.7×', 'aria-label': '0.7× web default' },
  { value: '1', label: '1×', 'aria-label': '1× game density' },
  { value: '1.333', label: '1.333×', 'aria-label': '1.333× large' },
] as const

const themeStyle = { ['--zzz-scale' as string]: TOOL_SCALE } as CSSProperties

interface PillToolProps {
  label: string
  global: 'zzzScale'
  items: readonly { value: string; label: string; 'aria-label': string }[]
  fallback: string
  /** Outer width in design units. */
  width: number
}

function PillTool({ label, global, items, fallback, width }: PillToolProps) {
  const [globals, updateGlobals] = useGlobals()
  const value = String(globals[global] ?? fallback)
  const rootRef = useRef<HTMLDivElement>(null)

  // Semantics: a single-choice setting with no panels, so it is a radiogroup of radios, not a
  // tablist. SegmentedTabs (src/, not ours to change) renders tab semantics; the root role is
  // overridden through its prop spread and the buttons are re-labelled after every render
  // (React only re-writes aria-selected when it changes, and this runs again right after).
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('.zzz-segmented-tabs__tab').forEach((button) => {
      const selected = button.getAttribute('aria-selected')
      if (selected !== null) {
        button.setAttribute('aria-checked', selected)
        button.removeAttribute('aria-selected')
      }
      if (button.getAttribute('role') !== 'radio') button.setAttribute('role', 'radio')
    })
  })

  // Keyboard, as in the WAI-ARIA toolbar pattern: Storybook's toolbar is a react-aria toolbar
  // (one Tab stop, ←/→ move between tools). Inside this tool ←/→ only move focus between the
  // options and Enter / Space chooses one (native button click), so arrowing across the toolbar
  // never flips a global. On the first / last option the arrow is left alone, so react-aria moves
  // focus on to the previous / next tool. The handler runs at the window capture phase because
  // the toolbar otherwise swallows ←/→ before SegmentedTabs sees them.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const root = rootRef.current
      const target = event.target as HTMLElement | null
      if (!root || !target || !root.contains(target) || !target.classList.contains('zzz-segmented-tabs__tab')) return
      const options = [...root.querySelectorAll<HTMLElement>('.zzz-segmented-tabs__tab')]
      const index = options.indexOf(target)
      if (index < 0) return
      let next: number
      if (event.key === 'ArrowRight') next = index + 1
      else if (event.key === 'ArrowLeft') next = index - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = options.length - 1
      else return
      if (next < 0 || next >= options.length) return // leave the tool: react-aria handles it
      event.preventDefault()
      event.stopPropagation()
      options[next].focus()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  return (
    <div ref={rootRef} className="zzz-theme sbz-tool" style={themeStyle} data-sbz-tool={global}>
      <span className="sbz-tool__label" aria-hidden="true">
        {label}
      </span>
      <SegmentedTabs
        role="radiogroup"
        aria-label={label}
        surface="mesh"
        width={width}
        items={items}
        value={value}
        onValueChange={(next) => updateGlobals({ [global]: next })}
      />
    </div>
  )
}

export const ScaleTool = () => (
  <PillTool label="Scale" global="zzzScale" items={SCALE_ITEMS} fallback="0.7" width={600} />
)

export const ZZZ_TOOLBAR_ADDON = 'zone-ui/toolbar'

/** Registers the Scale toolbar tool (types.TOOL). It drives the same global that preview.tsx
 * reads (zzzScale -> --zzz-scale). */
export function registerZzzToolbar() {
  addons.register(ZZZ_TOOLBAR_ADDON, () => {
    addons.add(`${ZZZ_TOOLBAR_ADDON}/scale`, {
      type: types.TOOL,
      title: 'Scale',
      match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
      render: ScaleTool,
    })
  })
}
