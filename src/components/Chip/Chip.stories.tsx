import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { userEvent } from "storybook/test";
import type { CSSProperties, ReactNode } from "react";
import { Chip } from "./Chip";
import { ChipGroup } from "./ChipGroup";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

/** The drawer's inner panel (#030303, radius 12) the chips sit on. */
const panel: CSSProperties = {
  background: "var(--zzz-color-surface-drawer-inner)",
  borderRadius: "var(--zzz-radius-inner)",
  padding: gpx(24),
};
const caption: CSSProperties = {
  color: "var(--zzz-color-text-muted)",
  fontSize: gpx(14),
  lineHeight: 1.2,
};

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gpx(10),
        alignItems: "flex-start",
      }}
    >
      {children}
      <span style={caption}>{label}</span>
    </div>
  );
}

const SPECIALTIES = [
  { value: "attack", label: "Attack" },
  { value: "stun", label: "Stun" },
  { value: "anomaly", label: "Anomaly" },
  { value: "support", label: "Support" },
  { value: "defense", label: "Defense" },
  { value: "rupture", label: "Rupture" },
  { value: "armorer", label: "Armorer", disabled: true },
];
const RARITY = [
  { value: "s", label: "S" },
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

const meta = {
  title: "Forms/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Filter toggle chip and `ChipGroup`.",
      },
    },
  },
  args: { children: "Attack" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={panel}>
      <Chip {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        display: "grid",
        gridTemplateColumns: `repeat(2, auto)`,
        gap: gpx(28),
      }}
    >
      <Cell label="default">
        <Chip>Attack</Chip>
      </Cell>
      <Cell label="pressed (forced data-pressed)">
        <Chip pressed>Attack</Chip>
      </Cell>
      <Cell label="disabled">
        <Chip disabled>Armorer</Chip>
      </Cell>
      <Cell label="selected">
        <Chip defaultSelected>Stun</Chip>
      </Cell>
      <Cell label="selected + disabled (the disabled look wins)">
        <Chip defaultSelected disabled>
          Armorer
        </Chip>
      </Cell>
      <Cell label="selected + pressed">
        <Chip defaultSelected pressed>
          Stun
        </Chip>
      </Cell>
    </div>
  ),
};

export const Group: Story = {
  name: "ChipGroup (multiple)",
  render: () => (
    <div
      style={{
        ...panel,
        display: "flex",
        flexDirection: "column",
        gap: gpx(24),
      }}
    >
      <ChipGroup label="Rarity" options={RARITY} />
      <ChipGroup label="Agent Specialties" options={SPECIALTIES} />
    </div>
  ),
};

export const SingleSelect: Story = {
  name: "ChipGroup (single)",
  render: () => (
    <div style={panel}>
      <ChipGroup
        label="Rarity"
        options={RARITY}
        multiple={false}
        defaultValue={["s"]}
      />
    </div>
  ),
};

/** Keyboard entry into a single-select group lands on the checked chip (roving tab stop): the
 * focus ring (`--zzz-focus-ring`) must show on the selected (accent) chip too. The play function tabs in. */
export const FocusedSelected: Story = {
  name: "Focus on a selected chip",
  render: () => (
    <div
      style={{
        ...panel,
        display: "flex",
        flexDirection: "column",
        gap: gpx(24),
      }}
    >
      <ChipGroup
        label="Rarity"
        options={RARITY}
        multiple={false}
        defaultValue={["a"]}
      />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(["attack", "support"]);
    return (
      <div
        style={{
          ...panel,
          display: "flex",
          flexDirection: "column",
          gap: gpx(16),
        }}
      >
        <ChipGroup
          label="Agent Specialties"
          options={SPECIALTIES}
          value={value}
          onValueChange={setValue}
        />
        <span style={caption}>value: [{value.join(", ")}]</span>
      </div>
    );
  },
};

export const Columns: Story = {
  name: "ChipGroup (3 columns)",
  render: () => (
    <div style={panel}>
      <ChipGroup label="Agent Specialties" options={SPECIALTIES} columns={3} />
    </div>
  ),
};

const SIZES = ["sm", "md", "lg"] as const;

/** sm / md / lg at the default scale: default, selected, pressed and disabled chips, plus a sized ChipGroup. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        ...panel,
        display: "flex",
        flexDirection: "column",
        gap: gpx(32),
      }}
    >
      {SIZES.map((size) => (
        <Cell key={size} label={`size="${size}"`}>
          <div style={{ display: "flex", gap: gpx(20), flexWrap: "wrap" }}>
            <Chip size={size}>Attack</Chip>
            <Chip size={size} defaultSelected>
              Stun
            </Chip>
            <Chip size={size} pressed>
              Anomaly
            </Chip>
            <Chip size={size} disabled>
              Armorer
            </Chip>
          </div>
        </Cell>
      ))}
      <Cell label='ChipGroup size="sm" (grid columns and gaps follow)'>
        <ChipGroup
          label="Rarity"
          options={RARITY}
          defaultValue={["s"]}
          size="sm"
        />
      </Cell>
    </div>
  ),
};
