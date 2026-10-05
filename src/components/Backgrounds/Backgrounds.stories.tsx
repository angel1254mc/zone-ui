import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { HatchBackground } from "./HatchBackground";
import { DotTexture } from "./DotTexture";
import { GraffitiLayer } from "./GraffitiLayer";
import { FilmStripBackground } from "./FilmStripBackground";
import { StorageMuralBackground } from "./StorageMuralBackground";
import { gameArtUrl, useNamecard } from "../../../examples/art";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const meta = {
  title: "Foundations/Backgrounds",
  component: HatchBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Decorative full-bleed layers. Matches the general design language of ZZZ",
      },
    },
  },
} satisfies Meta<typeof HatchBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

const caption: CSSProperties = {
  fontSize: "var(--zzz-font-size-label)",
  lineHeight: "var(--zzz-line-height-dialog-item)",
  color: "var(--zzz-color-text-muted)",
};

/** A clipped box: `w` / `h` in design units, or `w="full"` for the full story width (full-bleed backgrounds). */
function Frame({
  w = 1200,
  h = 600,
  label,
  children,
  style,
}: {
  w?: number | "full";
  h?: number;
  label?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(8) }}>
      {label && <span style={caption}>{label}</span>}
      <div
        style={{
          position: "relative",
          width: w === "full" ? "100%" : gpx(w),
          height: gpx(h),
          overflow: "hidden",
          background: "#000",
          flex: "none",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const Hatch: Story = {
  args: { tone: "black" },
  render: (args) => (
    <Frame label="HatchBackground (tone from controls)">
      <HatchBackground {...args} />
    </Frame>
  ),
};

export const HatchTones: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${gpx(380)})`,
        gap: gpx(24),
      }}
    >
      {(["black", "sage", "teal", "deep"] as const).map((t) => (
        <Frame key={t} w={380} h={240} label={`tone="${t}"`}>
          <HatchBackground tone={t} />
        </Frame>
      ))}
      <Frame
        w={380}
        h={240}
        label="tone={{ light: '#5A4A7A', dark: '#3A2A5A' }}"
      >
        <HatchBackground tone={{ light: "#5A4A7A", dark: "#3A2A5A" }} />
      </Frame>
    </div>
  ),
};

export const Dots: Story = {
  render: () => (
    <div style={{ display: "flex", gap: gpx(24) }}>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Frame
          key={s}
          w={300}
          h={200}
          label={`DotTexture size="${s}"`}
          style={{
            background:
              s === "lg" ? "#222" : s === "md" ? "#1A1A1A" : "#070707",
          }}
        >
          <DotTexture size={s} alpha={0.05} shade={0.4} />
        </Frame>
      ))}
    </div>
  ),
};

/** Agent-screen graffiti on black (the black between the letters is pure #000). Full width, 1080 units tall. */
export const GraffitiAgent: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Frame w="full" h={1080}>
      <GraffitiLayer />
    </Frame>
  ),
};

/** Dialog band (390 tall): dim #0E0E0E / #181818 lettering, drifting (−23.3, +6.4) px/s. */
export const GraffitiDialog: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Frame w="full" h={600} style={{ background: "#101010" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: gpx(105),
          height: gpx(390),
          background: "var(--zzz-color-surface-dialog-band)",
          overflow: "hidden",
        }}
      >
        <GraffitiLayer variant="dialog" drift />
      </div>
    </Frame>
  ),
};

/** Film strips on the left third of the agent screen, over the graffiti. */
export const FilmStrips: Story = {
  render: () => (
    <Frame w={1200} h={1080}>
      <GraffitiLayer />
      <FilmStripBackground />
    </Frame>
  ),
};

export const FilmStripsCustomFrames: Story = {
  render: () => (
    <Frame w={900} h={800} label="frames={[…]} (2 strips)">
      <FilmStripBackground
        strips={2}
        frames={["A", "B", "C"].map((l) => (
          <svg
            key={l}
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%" }}
          >
            <text
              x="50"
              y="80"
              textAnchor="middle"
              fontSize="90"
              fontWeight="900"
              fill="#000"
            >
              {l}
            </text>
          </svg>
        ))}
      />
    </Frame>
  ),
};

/** Default: no `src` → a flat dimmed band (`color.bg.artMax` under the 82 % veil ≈ #080808). The library ships no art. */
export const StorageMural: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Frame w="full" h={102}>
      <StorageMuralBackground />
    </Frame>
  ),
};

/** Story-only: resolves an Enka.Network namecard URL from the examples art manifest (falls back to the flat band). */
function NamecardMural({ id, agentId }: { id?: string; agentId?: string }) {
  const card = useNamecard({
    id,
    agentId,
    group: id || agentId ? undefined : "event",
    seed: "mural",
  });
  return (
    <StorageMuralBackground
      src={card ? gameArtUrl(card.image, "enka") : undefined}
    />
  );
}

/**
 * With `src`: any image URL, cover-cropped and dimmed per the material (veil 82 %, no pixel above #2E2E2E).
 * Here: game namecards loaded by URL from Enka.Network (Zenless Zone Zero © HoYoverse) — story art only.
 * While the image loads (or if the URL is unreachable — the failed `<img>` is removed) the flat band shows, so nothing flashes.
 */
export const StorageMuralWithImage: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(16) }}>
      <Frame w="full" h={102} label="src = event namecard URL (ImgCardEvent02)">
        <NamecardMural id="ImgCardEvent02" />
      </Frame>
      <Frame w="full" h={102} label='src = agent namecard URL (agentId "1011")'>
        <NamecardMural agentId="1011" />
      </Frame>
    </div>
  ),
};
