import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AgentImage,
  DriveDiscImage,
  GameArtProvider,
  GameIcon,
  ItemImage,
  NamecardImage,
  WEngineImage,
  configureArt,
  preloadGameArt,
  resetGameArtForTests,
  useGameArt,
  useGameArtState,
  useItem,
  useNamecard,
  type GameArtState,
} from './gameArt'
import { artFixture } from './fixture'

const N = 'https://static.nanoka.cc/assets/zzz/'
const E = 'https://enka.network/ui/zzz/'
const ready: GameArtState = { status: 'ready', manifest: artFixture }
const pin = (state: GameArtState) => ({ children }: { children: ReactNode }) => <GameArtProvider state={state}>{children}</GameArtProvider>

const allKinds = (
  <>
    <div data-testid="agent"><AgentImage id="1011" crop="crop" /></div>
    <div data-testid="wengine"><WEngineImage id="14001" /></div>
    <div data-testid="disc"><DriveDiscImage id="31000" /></div>
    <div data-testid="item"><ItemImage id="10" /></div>
    <div data-testid="namecard"><NamecardImage agentId="1011" /></div>
  </>
)
const kinds = ['agent', 'wengine', 'disc', 'item', 'namecard'] as const
const slotIn = (testId: string) => screen.getByTestId(testId).querySelector('picture.zart') as HTMLElement

describe('game art store', () => {
  afterEach(() => {
    resetGameArtForTests()
    vi.restoreAllMocks()
  })

  it('is ready from the first render with the bundled manifest (no fetch)', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useGameArtState())
    expect(result.current.status).toBe('ready')
    expect(result.current.manifest!.agents.length).toBeGreaterThanOrEqual(50)
    expect(await preloadGameArt()).toBe(result.current.manifest)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('GameArtProvider pins the state for its subtree', () => {
    const loading = renderHook(() => useGameArt(), { wrapper: pin({ status: 'loading', manifest: null }) })
    expect(loading.result.current).toBeNull()
    const fixture = renderHook(() => useGameArt(), { wrapper: pin(ready) })
    expect(fixture.result.current).toBe(artFixture)
  })

  it('loading renders an aria-busy skeleton slot and no <svg>/<img> for every kind', () => {
    const { container } = render(<GameArtProvider state={{ status: 'loading', manifest: null }}>{allKinds}</GameArtProvider>)
    for (const k of kinds) {
      const slot = slotIn(k)
      expect(slot).toHaveAttribute('data-state', 'loading')
      expect(slot).toHaveAttribute('aria-busy', 'true')
    }
    expect(container.querySelector('svg, img')).toBeNull()
  })

  it('ready renders <img> with the remote URL and intrinsic size', () => {
    render(<GameArtProvider state={ready}>{allKinds}</GameArtProvider>)
    const img = (k: string) => slotIn(k).querySelector('img')!
    expect(img('agent')).toHaveAttribute('src', `${N}IconRoleCrop01.webp`)
    expect(img('agent')).toHaveAttribute('width', '384')
    expect(img('agent')).toHaveAttribute('alt', 'Anby')
    expect(img('wengine')).toHaveAttribute('src', `${N}Weapon_A_1001.webp`)
    expect(img('wengine')).toHaveAttribute('width', '400')
    expect(img('disc')).toHaveAttribute('src', `${N}SuitWoodpeckerElectro.webp`)
    expect(img('disc')).toHaveAttribute('height', '152')
    expect(img('item')).toHaveAttribute('src', `${N}IconCoin.webp`)
    expect(img('namecard')).toHaveAttribute('src', `${E}ImgCardRoleS0001.png`)
    expect(img('namecard')).toHaveAttribute('width', '4096')
    expect(img('namecard')).toHaveAttribute('alt', 'Anby namecard')
    expect(document.querySelector('svg')).toBeNull()
  })

  it('uses per-entry sizes (full crop, odd W-Engines) and the agent default fits', () => {
    render(
      <GameArtProvider state={ready}>
        <div data-testid="full"><AgentImage id="1021" crop="full" /></div>
        <div data-testid="odd"><WEngineImage id="14158" /></div>
        <div data-testid="circle"><AgentImage id="1011" crop="circle" alt="" /></div>
        <div data-testid="explicit"><WEngineImage id="14158" fit="cover" /></div>
      </GameArtProvider>,
    )
    expect(slotIn('full').querySelector('img')).toHaveAttribute('width', '932')
    // Component defaults are a data attribute styled at zero specificity (library slot rules win) …
    expect(slotIn('full')).toHaveAttribute('data-fit', 'contain')
    expect(slotIn('full').style.objectFit).toBe('')
    expect(slotIn('odd').querySelector('img')).toHaveAttribute('width', '156')
    expect(slotIn('odd')).toHaveAttribute('data-fit', 'contain')
    expect(slotIn('circle')).toHaveAttribute('data-fit', 'cover')
    expect(slotIn('circle').style.objectFit).toBe('')
    // … only an explicit `fit` prop is inline.
    expect(slotIn('explicit').style.objectFit).toBe('cover')
    expect(slotIn('circle').querySelector('img')).toHaveAttribute('alt', '')
  })

  it('missing (pinned), an unknown id, or a crop without art renders an empty frame', () => {
    render(<GameArtProvider state={{ status: 'missing', manifest: null }}>{allKinds}</GameArtProvider>)
    for (const k of kinds) expect(slotIn(k)).toHaveAttribute('data-state', 'missing')
    expect(document.querySelector('svg, img')).toBeNull()
  })

  it('an unknown id or an absent crop is missing, not a random pick', () => {
    render(
      <GameArtProvider state={ready}>
        <div data-testid="unknown"><AgentImage id="9999" /></div>
        <div data-testid="nocrop"><AgentImage id="1021" crop="select" /></div>
        <div data-testid="boss"><ItemImage id="110001" /></div>
      </GameArtProvider>,
    )
    for (const k of ['unknown', 'nocrop', 'boss']) expect(slotIn(k)).toHaveAttribute('data-state', 'missing')
  })

  it('an image error moves the slot to missing; one console.info across several failures', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    render(<GameArtProvider state={ready}>{allKinds}</GameArtProvider>)
    for (const k of kinds) fireEvent.error(slotIn(k).querySelector('img')!)
    for (const k of kinds) expect(slotIn(k)).toHaveAttribute('data-state', 'missing')
    expect(info).toHaveBeenCalledTimes(1)
    expect(info.mock.calls[0][0]).toMatch(/^\[zone examples\] No game art at "https:\/\//)
  })

  it('configureArt rebases image URLs per source and re-renders', () => {
    render(<GameArtProvider state={ready}>{allKinds}</GameArtProvider>)
    act(() => configureArt({ nanokaBase: '/mirror/nanoka', enkaBase: '/mirror/enka/' }))
    expect(slotIn('agent').querySelector('img')).toHaveAttribute('src', '/mirror/nanoka/IconRoleCrop01.webp')
    expect(slotIn('namecard').querySelector('img')).toHaveAttribute('src', '/mirror/enka/ImgCardRoleS0001.png')
    act(() => configureArt({ nanokaBase: null }))
    expect(slotIn('agent').querySelector('img')).toHaveAttribute('src', `${N}IconRoleCrop01.webp`)
  })
})

describe('GameIcon', () => {
  afterEach(() => resetGameArtForTests())
  const fallback = <svg data-testid="fallback" />

  it('loading: an empty sized span, no fallback', () => {
    const { container } = render(
      <GameArtProvider state={{ status: 'loading', manifest: null }}>
        <GameIcon kind="elements" name="Electric" fallback={fallback} className="ico" style={{ width: 20 }} />
      </GameArtProvider>,
    )
    const span = container.querySelector('span.ico') as HTMLElement
    expect(span).not.toBeNull()
    expect(span.style.width).toBe('20px')
    expect(screen.queryByTestId('fallback')).toBeNull()
  })

  it('missing: the fallback', () => {
    render(<GameArtProvider state={{ status: 'missing', manifest: null }}><GameIcon kind="elements" name="Electric" fallback={fallback} /></GameArtProvider>)
    expect(screen.getByTestId('fallback')).toBeInTheDocument()
  })

  it('ready: an <img>; a null icon (Lumiflux) or a failed URL falls back', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const { container } = render(
      <GameArtProvider state={ready}>
        <div data-testid="ok"><GameIcon kind="elements" name="Electric" fallback={fallback} alt="Electric" /></div>
        <div data-testid="null"><GameIcon kind="elements" name="Lumiflux" fallback={<i data-testid="fb2" />} /></div>
      </GameArtProvider>,
    )
    const img = screen.getByTestId('ok').querySelector('img')!
    expect(img).toHaveAttribute('src', `${N}IconElectric.webp`)
    expect(img.parentElement).toHaveAttribute('data-fit', 'contain')
    expect(img.parentElement!.style.objectFit).toBe('')
    expect(screen.queryByTestId('fallback')).toBeNull()
    expect(screen.getByTestId('fb2')).toBeInTheDocument()
    fireEvent.error(img)
    expect(screen.getByTestId('fallback')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="ok"] img')).toBeNull()
  })
})

describe('lookups', () => {
  const wrapper = pin(ready)

  it('useItem resolves by id, then exact name, then seed (icons only)', () => {
    expect(renderHook(() => useItem({ id: '100' }), { wrapper }).result.current?.name).toBe('Polychrome')
    expect(renderHook(() => useItem({ name: 'Denny' }), { wrapper }).result.current?.id).toBe('10')
    expect(renderHook(() => useItem({ id: 'nope', name: 'Polychrome' }), { wrapper }).result.current?.id).toBe('100')
    expect(renderHook(() => useItem({ id: 'nope' }), { wrapper }).result.current).toBeNull()
    const seeded = [0, 1, 2, 3].map((seed) => renderHook(() => useItem({ seed }), { wrapper }).result.current?.id)
    expect(seeded).toEqual(['10', '100', '10', '100'])
  })

  it('useNamecard resolves by id, agentId, then seed within a group', () => {
    expect(renderHook(() => useNamecard({ id: 'ImgCardEvent05' }), { wrapper }).result.current?.group).toBe('event')
    expect(renderHook(() => useNamecard({ agentId: '1011' }), { wrapper }).result.current?.id).toBe('ImgCardRoleS0001')
    expect(renderHook(() => useNamecard({ group: 'event', seed: 7 }), { wrapper }).result.current?.id).toBe('ImgCardEvent05')
    expect(renderHook(() => useNamecard({ agentId: '1021' }), { wrapper }).result.current).toBeNull()
  })
})
