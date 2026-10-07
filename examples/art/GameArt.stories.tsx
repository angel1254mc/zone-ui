import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { ArtSlot } from './ArtSlot';
import {
  AgentImage,
  DriveDiscImage,
  GameArtProvider,
  GameIcon,
  ItemImage,
  NamecardImage,
  WEngineImage,
  useGameArt,
  type AgentCrop,
  type GameArtState,
} from './gameArt';
import { STORY_ITEMS } from './storyItems';

const meta = {
  title: 'Foundations/Game Art',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const u = (n: number) => `calc(${n} * var(--zzz-px))`;
const tile = (w = 140, h = 140): CSSProperties => ({
  width: u(w),
  height: u(h),
  background: 'var(--zzz-color-surface-art-stage)',
  borderRadius: u(12),
  overflow: 'hidden',
});
const grid: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: u(16),
  alignItems: 'flex-start',
};
const heading: CSSProperties = { margin: `0 0 ${u(10)}` };

function Labelled({ label, children, width = 140 }: { label: ReactNode; children: ReactNode; width?: number }) {
  return (
    <div style={{ width: u(width) }}>
      {children}
      <div
        className="zzz-text-caption"
        style={{
          color: 'var(--zzz-color-text-secondary)',
          marginTop: u(6),
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Status() {
  const art = useGameArt();
  return (
    <p className="zzz-text-body" style={{ color: 'var(--zzz-color-text-secondary)', marginTop: 0 }}>
      {art
        ? `Manifest v${art.version}: ${art.agents.length} agents, ${art.wEngines.length} W-Engines, ${art.driveDiscSets.length} drive-disc sets, ${art.items?.length ?? 0} items, ${art.namecards?.length ?? 0} namecards.`
        : 'No manifest.'}
    </p>
  );
}

const CROP_TILE: Record<AgentCrop, [number, number]> = {
  circle: [96, 96],
  select: [128, 125],
  crop: [140, 140],
  general: [180, 64],
  full: [140, 220],
};

/** The five agent crops: circle (avatar), select (agent-select card), crop (square bust), general (strip), full (body). */
export const AgentCrops: Story = {
  render: () => {
    const art = useGameArt();
    return (
      <div>
        <Status />
        {(['circle', 'select', 'crop', 'general', 'full'] as AgentCrop[]).map((crop) => (
          <section key={crop} style={{ marginBottom: u(24) }}>
            <h3 className="zzz-text-label" style={heading}>
              {crop}
            </h3>
            <div style={grid}>
              {[0, 1, 2, 3, 4, 5].map((seed) => {
                const [w, h] = CROP_TILE[crop];
                return (
                  <Labelled key={seed} width={w} label={art ? art.agents[seed].name : ''}>
                    <div
                      style={{
                        ...tile(w, h),
                        borderRadius: crop === 'circle' ? '50%' : u(12),
                      }}
                    >
                      <AgentImage seed={seed} crop={crop} priority={seed < 3} />
                    </div>
                  </Labelled>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

/** W-Engines (400², a few 156²) and drive-disc sets (152²). */
export const Equipment: Story = {
  render: () => {
    const art = useGameArt();
    return (
      <div>
        <Status />
        <h3 className="zzz-text-label" style={heading}>
          W-Engines
        </h3>
        <div style={grid}>
          {Array.from({ length: 12 }, (_, i) => (
            <Labelled key={i} label={art?.wEngines[i].name}>
              <div style={tile()}>
                <WEngineImage seed={i} />
              </div>
            </Labelled>
          ))}
        </div>
        <h3 className="zzz-text-label" style={{ ...heading, marginTop: u(24) }}>
          Drive-disc sets
        </h3>
        <div style={grid}>
          {Array.from({ length: 8 }, (_, i) => (
            <Labelled key={i} label={art?.driveDiscSets[i].name}>
              <div style={tile()}>
                <DriveDiscImage seed={i} />
              </div>
            </Labelled>
          ))}
        </div>
      </div>
    );
  },
};

/** Items, materials and currencies: the static `STORY_ITEMS` list (labels never depend on loading). */
export const Items: Story = {
  render: () => (
    <div style={grid}>
      {STORY_ITEMS.map((it) => (
        <Labelled key={it.id} width={112} label={`${it.name} · ${it.rarity.toUpperCase()}`}>
          <div style={tile(112, 112)}>
            <ItemImage id={it.id} />
          </div>
        </Labelled>
      ))}
    </div>
  ),
};

/** Enka.Network Inter-Knot namecards (≈4096×404): agent cards and event cards, cover-cropped. */
export const Namecards: Story = {
  render: () => {
    const art = useGameArt();
    const role = art?.namecards?.filter((n) => n.group === 'role').slice(0, 3) ?? [];
    const event = art?.namecards?.filter((n) => n.group === 'event').slice(0, 3) ?? [];
    return (
      <div style={{ display: 'grid', gap: u(16), maxWidth: u(900) }}>
        {[...role, ...event].map((n) => (
          <Labelled key={n.id} width={900} label={`${n.id}${n.name ? ` — ${n.name}` : ''}`}>
            <div style={{ borderRadius: u(12), overflow: 'hidden' }}>
              <NamecardImage id={n.id} layout="ratio" />
            </div>
          </Labelled>
        ))}
        <Labelled width={396} label="Cover-cropped into a 396×220 news card">
          <div style={tile(396, 220)}>
            <NamecardImage agentId="1011" />
          </div>
        </Labelled>
      </div>
    );
  },
};

const ICON_FALLBACK = (
  <span
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      boxShadow: `inset 0 0 0 ${u(2)} var(--zzz-color-text-faint)`,
    }}
  />
);

/** Element and specialty icons. Lumiflux has no game icon and shows the `fallback`. */
export const Icons: Story = {
  render: () => (
    <div style={grid}>
      {['Physical', 'Fire', 'Ice', 'Electric', 'Ether', 'Wind', 'Frost', 'Auric Ink', 'Honed Edge', 'Lumiflux'].map(
        (n) => (
          <Labelled key={n} width={64} label={n}>
            <div style={{ width: u(64), height: u(64) }}>
              <GameIcon kind="elements" name={n} fallback={ICON_FALLBACK} alt={n} />
            </div>
          </Labelled>
        )
      )}
      {['Attack', 'Stun', 'Anomaly', 'Support', 'Defense', 'Rupture'].map((n) => (
        <Labelled key={n} width={64} label={n}>
          <div style={{ width: u(64), height: u(64) }}>
            <GameIcon kind="specialties" name={n} fallback={ICON_FALLBACK} alt={n} />
          </div>
        </Labelled>
      ))}
    </div>
  ),
};

function StateColumn({ title }: { title: string }) {
  return (
    <div style={{ display: 'grid', gap: u(12), width: u(200) }}>
      <h3 className="zzz-text-label" style={{ margin: 0 }}>
        {title}
      </h3>
      <div style={tile(200, 200)}>
        <AgentImage id="1011" crop="crop" priority />
      </div>
      <div style={{ display: 'flex', gap: u(8) }}>
        <div style={tile(96, 96)}>
          <WEngineImage id="14001" priority />
        </div>
        <div style={tile(96, 96)}>
          <ItemImage id="100" priority />
        </div>
      </div>
      <div
        style={{
          ...tile(200, 60),
          display: 'flex',
          alignItems: 'center',
          gap: u(12),
          padding: u(10),
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: u(40), height: u(40) }}>
          <GameIcon kind="elements" name="Electric" fallback={ICON_FALLBACK} />
        </div>
        <span className="zzz-text-caption" style={{ color: 'var(--zzz-color-text-secondary)' }}>
          GameIcon
        </span>
      </div>
    </div>
  );
}

const LOADING: GameArtState = { status: 'loading', manifest: null };
const MISSING: GameArtState = { status: 'missing', manifest: null };

/**
 * The three states side by side. **loading** (pinned with `GameArtProvider`): the neutral skeleton
 * sheen; GameIcon renders an empty box. **ready** (the real store): art fades in once decoded.
 * **missing** (pinned): quiet empty frames; GameIcon shows its `fallback`. No state ever draws
 * imitation art, and the boxes never change size.
 */
export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: u(32), flexWrap: 'wrap' }}>
      <GameArtProvider state={LOADING}>
        <StateColumn title="loading" />
      </GameArtProvider>
      <StateColumn title="ready" />
      <GameArtProvider state={MISSING}>
        <StateColumn title="missing" />
      </GameArtProvider>
    </div>
  ),
};

/** The bare `ArtSlot` (no store): loading skeleton and missing frame; plus `layout="ratio"` reserving 180×64 for an agent strip. */
export const ArtSlotStates: Story = {
  render: () => (
    <div style={grid}>
      <Labelled label="status loading">
        <div style={tile()}>
          <ArtSlot src={null} status="loading" width={1} height={1} />
        </div>
      </Labelled>
      <Labelled label="src null → missing">
        <div style={tile()}>
          <ArtSlot src={null} width={1} height={1} />
        </div>
      </Labelled>
      <Labelled width={180} label='layout="ratio" (180×64)'>
        <AgentImage id="1011" crop="general" layout="ratio" priority />
      </Labelled>
    </div>
  ),
};
