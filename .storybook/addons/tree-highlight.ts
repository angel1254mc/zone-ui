/**
 * Keyboard highlight hook for the sidebar tree.
 *
 * Storybook marks the arrow-key row only on the tree itself (`nav[data-highlighted-item-id]`) and
 * tints that row with a 15% emotion background (~1.2–1.5:1 on the hatched sidebar), with no
 * attribute on the row. This mirrors the id onto the row as `data-sbz-highlighted` so manager.css
 * can draw the focus ring on it while the tree has keyboard focus.
 */
const ATTR = 'data-sbz-highlighted'

function sync(tree: HTMLElement) {
  const id = tree.getAttribute('data-highlighted-item-id')
  const current = tree.querySelector<HTMLElement>(`[${ATTR}]`)
  const row = id ? tree.querySelector<HTMLElement>(`.sidebar-item[data-item-id="${CSS.escape(id)}"]`) : null
  if (current === row) return
  current?.removeAttribute(ATTR)
  row?.setAttribute(ATTR, '')
}

export function installTreeHighlight() {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return
  let tree: HTMLElement | null = null
  let treeObserver: MutationObserver | null = null
  const attach = () => {
    const next = document.getElementById('storybook-explorer-tree')
    if (next === tree) return
    treeObserver?.disconnect()
    tree = next
    if (!tree) return
    const target = tree
    treeObserver = new MutationObserver(() => sync(target))
    treeObserver.observe(target, {
      attributes: true,
      attributeFilter: ['data-highlighted-item-id'],
      childList: true,
      subtree: true,
    })
    sync(target)
  }
  // The sidebar mounts (and can remount) after the manager entry runs.
  new MutationObserver(attach).observe(document.documentElement, { childList: true, subtree: true })
  attach()
}
