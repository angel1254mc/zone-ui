import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { LockIcon, AttackIcon } from "../../icons";
import { AgentImage, ItemImage, WEngineImage } from "../../../examples/art";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { ItemCard } from "../ItemCard";
import { Panel } from "./Panel";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const muted: CSSProperties = {
  color: "var(--zzz-color-text-muted)",
  fontSize: "var(--zzz-font-size-body)",
  margin: 0,
};
const row: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: gpx(41),
  padding: `0 ${gpx(16)}`,
  borderRadius: gpx(21),
  background: "var(--zzz-color-surface-stat-row)",
  fontSize: "var(--zzz-font-size-body)",
};

/** Stand-in content. */
function DetailBody() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gpx(12),
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: gpx(-10),
          top: gpx(-30),
          width: gpx(170),
          height: gpx(170),
          opacity: 0.9,
        }}
      >
        <WEngineImage id="14104" alt="" />
      </div>
      <div style={{ display: "flex", gap: gpx(8), marginTop: gpx(10) }}>
        <span
          style={{
            width: gpx(42),
            height: gpx(42),
            borderRadius: "50%",
            background: "#000",
            display: "grid",
            placeItems: "center",
            color: "var(--zzz-color-icon-specialty)",
          }}
        >
          <AttackIcon size={24} />
        </span>
        <span
          style={{
            width: gpx(42),
            height: gpx(42),
            borderRadius: "50%",
            overflow: "hidden",
            border: `${gpx(3)} solid #000`,
          }}
        >
          <AgentImage id="1041" crop="circle" />
        </span>
      </div>
      <div style={{ height: gpx(60) }} />
      <p style={muted}>Base Stat</p>
      <div style={row}>
        <span>Base ATK</span>
        <span>684</span>
      </div>
      <p style={muted}>Advanced Stat</p>
      <div style={row}>
        <span>ATK</span>
        <span>30%</span>
      </div>
    </div>
  );
}

const detailFooter = (
  <>
    <IconButton icon={<LockIcon />} label="Lock" />
    <Button width="wide">View</Button>
  </>
);

const meta = {
  title: "Inventory/Panel",
  component: Panel,
  tags: ["autodocs"],
  args: { variant: "side", headerLabel: "Detail" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["side", "tool", "large", "drawerInner"],
    },
    footer: { control: false },
    lower: { control: false },
    aside: { control: false },
  },
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
        component: "Framed vertical container.",
      },
    },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Side: Story = {
  args: { title: "The Brimstone", footer: detailFooter },
  render: (args) => (
    <Panel {...args}>
      <DetailBody />
    </Panel>
  ),
};

function CraftingInfo() {
  return (
    <div style={{ display: "flex", gap: gpx(24), alignItems: "flex-start" }}>
      <div style={{ width: gpx(120), height: gpx(120), flex: "none" }}>
        <ItemImage id="502" alt="" />
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--zzz-font-size-title)",
            lineHeight: 1.2,
          }}
        >
          Ether Battery × 7
        </p>
        <p style={{ ...muted, color: "var(--zzz-color-text-secondary)" }}>
          Gain 60 Battery Charge when used. Can also be used for auto-combat in
          Combat Simulation.
        </p>
      </div>
    </div>
  );
}

export const Tool: Story = {
  args: {
    variant: "tool",
    headerLabel: "Crafting",
    lower: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: gpx(28),
          paddingTop: gpx(90),
        }}
      >
        <ItemCard
          size="ingredient"
          interactive={false}
          rarity="a"
          count={{ owned: 6, required: 1 }}
          art={<ItemImage id="511" alt="Prepaid Power Card" />}
        />
        <ItemCard
          size="ingredient"
          interactive={false}
          rarity="a"
          count={{ owned: 20, required: 60 }}
          art={<ItemImage id="501" alt="Battery Charge" />}
        />
      </div>
    ),
  },
  render: (args) => (
    <Panel {...args}>
      <div style={{ height: gpx(346) }}>
        <CraftingInfo />
      </div>
    </Panel>
  ),
};

export const ToolLowerTexturedFrom: Story = {
  name: "Tool (lowerTexturedFrom)",
  args: {
    variant: "tool",
    headerLabel: "W-ENGINE UPGRADE",
    lowerTexturedFrom: 506,
    footer: <Button width="wide">Auto Add</Button>,
  },
  render: (args) => (
    <Panel {...args}>
      <p style={{ margin: 0, fontSize: "var(--zzz-font-size-body-xl)" }}>
        Scorching Breath
      </p>
      <p style={{ ...muted, color: "var(--zzz-color-text-primary)" }}>
        Upon hitting an enemy with a Basic Attack, the equipper&apos;s ATK
        increases.
      </p>
    </Panel>
  ),
};

export const Large: Story = {
  args: {
    variant: "large",
    title: "The Brimstone",
    height: 700,
    asideWidth: 520,
    aside: (
      <div style={{ display: "flex", flexDirection: "column", gap: gpx(14) }}>
        <p style={muted}>Base Stat</p>
        <div
          style={{
            ...row,
            background: "var(--zzz-color-surface-stat-row-sunken)",
          }}
        >
          <span>Base ATK</span>
          <span>684</span>
        </div>
      </div>
    ),
  },
  render: (args) => (
    <div style={{ width: gpx(1500) }}>
      <Panel {...args}>
        <div style={{ position: "absolute", inset: `${gpx(80)} ${gpx(200)}` }}>
          <WEngineImage id="14104" alt="" />
        </div>
      </Panel>
    </div>
  ),
};

export const DrawerInner: Story = {
  args: {
    variant: "drawerInner",
    headerLabel: undefined,
    width: 580,
    height: 400,
  },
  render: (args) => (
    <div
      className="zzz-mat-drawer"
      style={{ padding: `${gpx(21)} ${gpx(63)} ${gpx(23)} ${gpx(41)}` }}
    >
      <Panel {...args} aria-label="Filters">
        <p style={muted}>Rarity</p>
      </Panel>
    </div>
  ),
};
