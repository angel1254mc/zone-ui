import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { ItemImage, STORY_ITEMS } from "../../../examples/art";
import { ItemCard } from "../ItemCard";
import { ScrollArea } from "../ScrollArea";
import { ScrollHint } from "./ScrollHint";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: "var(--zzz-font-size-micro)",
  lineHeight: "var(--zzz-line-height-single)",
  color: "var(--zzz-color-text-muted)",
};

function StatRows({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(8) }}>
      {Array.from({ length: n }, (_, i) => (
        <div
          key={i}
          style={{
            height: gpx(38),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${gpx(18)}`,
            borderRadius: gpx(19),
            background: "#161616",
            fontSize: "var(--zzz-font-size-body)",
            lineHeight: "var(--zzz-line-height-single)",
          }}
        >
          <span>
            {
              [
                "HP",
                "ATK",
                "DEF",
                "CRIT DMG",
                "CRIT Rate",
                "PEN",
                "Impact",
                "Anomaly",
              ][i % 8]
            }
          </span>
          <span>{(3 + i * 1.3).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

/** A box that shows the hint on its bottom / right edge (placement="end" needs a positioned ancestor). */
function Frame({
  w,
  h,
  children,
  style,
}: {
  w: number;
  h: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: gpx(w),
        height: gpx(h),
        background: "#000",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: "Primitives/ScrollHint",
  component: ScrollHint,
  tags: ["autodocs"],
  args: { direction: "down", size: "panel", placement: "end" },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["down", "up", "right", "left"],
    },
    glyph: {
      control: "inline-radio",
      options: [undefined, "triangle", "chevron"],
    },
    size: { control: "inline-radio", options: ["panel", "list"] },
    placement: { control: "inline-radio", options: ["end", "static"] },
    visible: { control: "boolean" },
    interactive: { control: "boolean" },
  },
  render: (args) => (
    <Frame w={200} h={120}>
      <ScrollHint {...args} />
    </Frame>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(24), background: "#141414" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Overflow affordances for containers that show no scrollbar (detail panels, the Events list, the Reward Preview row).",
      },
    },
  },
} satisfies Meta<typeof ScrollHint>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Detail-panel ▼, 32 × 15, on the bottom edge. */
export const PanelTriangle: Story = {};
/** Events-list ▼, 25 × 12.5. */
export const ListTriangle: Story = { args: { size: "list" } };
/** Reward Preview ›, 19 × 32, on the right edge. */
export const Chevron: Story = { args: { direction: "right" } };

/** Every glyph and direction (up / left are mirrors). */
export const Directions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(4, ${gpx(120)})`,
        gap: gpx(16),
      }}
    >
      {(["triangle", "chevron"] as const).flatMap((glyph) =>
        (["down", "up", "right", "left"] as const).map((direction) => (
          <figure
            key={glyph + direction}
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: gpx(6),
            }}
          >
            <Frame w={120} h={80}>
              <ScrollHint glyph={glyph} direction={direction} />
            </Frame>
            <figcaption style={caption}>
              {glyph} {direction}
            </figcaption>
          </figure>
        )),
      )}
    </div>
  ),
};

/** Auto mode: the ▼ shows while the panel body has more below. Scroll it (wheel / keyboard) to the end and it hides. */
export const AutoInPanel: Story = {
  render: () => {
    function Panel() {
      const vp = useRef<HTMLDivElement | null>(null);
      return (
        <div
          style={{
            width: gpx(440),
            padding: gpx(20),
            background: "#000",
            borderRadius: gpx(20),
            border: `${gpx(4)} solid #1F1F1F`,
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              ref={vp}
              tabIndex={0}
              role="region"
              aria-label="Stats"
              className="zzz-scrollbar"
              style={{
                height: gpx(230),
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              <StatRows n={8} />
            </div>
            <ScrollHint target={vp} />
          </div>
        </div>
      );
    }
    return <Panel />;
  },
};

/** Interactive: a button ("Scroll down") that pages the target; pressed turns the glyph accent (forced here). */
export const Interactive: Story = {
  render: () => {
    function Panel() {
      const vp = useRef<HTMLDivElement | null>(null);
      return (
        <div
          style={{ display: "flex", gap: gpx(40), alignItems: "flex-start" }}
        >
          <ScrollArea
            variant="panel"
            label="Details"
            viewportRef={vp}
            style={{ width: gpx(420), height: gpx(230) }}
            hint={<ScrollHint target={vp} interactive />}
          >
            <StatRows n={10} />
          </ScrollArea>
          <Frame w={120} h={80}>
            <ScrollHint interactive data-pressed="" />
          </Frame>
        </div>
      );
    }
    return <Panel />;
  },
};

/** Hidden (forced `visible={false}`): kept in the DOM, faded out and out of the tab order. */
export const Hidden: Story = { args: { visible: false } };

/** Reward Preview: preview cards at a 107 pitch, clipped at the right; the › pages the row. */
export const RewardRow: Story = {
  render: () => {
    function Row() {
      const vp = useRef<HTMLDivElement | null>(null);
      return (
        <div
          style={{
            position: "relative",
            width: gpx(680),
            paddingRight: gpx(36),
          }}
        >
          <div
            ref={vp}
            className="zzz-scrollbar"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
          >
            <div
              style={{
                display: "flex",
                gap: gpx(20),
                width: "max-content",
                padding: gpx(4),
              }}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const item = STORY_ITEMS[(i * 3) % STORY_ITEMS.length];
                return (
                  <ItemCard
                    key={i}
                    interactive={false}
                    size="preview"
                    caption={false}
                    name={item.name}
                    rarity={item.rarity}
                    art={<ItemImage id={item.id} alt="" />}
                  />
                );
              })}
            </div>
          </div>
          <ScrollHint
            direction="right"
            target={vp}
            interactive
            label="More rewards"
          />
        </div>
      );
    }
    return <Row />;
  },
};
