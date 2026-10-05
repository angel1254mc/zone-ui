import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LevelPill } from "./LevelPill";
import { Specimen, Specimens } from "../StatRow/Specimens.story-helpers";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const meta = {
  title: "Data Display/LevelPill",
  component: LevelPill,
  tags: ["autodocs"],
  args: { variant: "panel", level: 60, max: 60, rank: "S" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["panel", "equip", "large", "agent"],
    },
    rank: { control: "inline-radio", options: ["S", "A", "B", undefined] },
    level: { control: { type: "number", min: 0, max: 60 } },
    max: { control: { type: "number", min: 1, max: 60 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Wrapper around the standard pill. Best for displaying levels, can be combined with rank icon on the left-hand side.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(20), background: "#1A1A1A" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LevelPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {};
export const Equip: Story = { args: { variant: "equip", rank: "A" } };
export const Large: Story = { args: { variant: "large", onInfo: fn() } };
export const LargeInfoPressed: Story = {
  args: { variant: "large", onInfo: fn(), infoProps: { pressed: true } },
};
export const LargeInfoDisabled: Story = {
  args: { variant: "large", onInfo: fn(), infoProps: { disabled: true } },
};
export const Agent: Story = { args: { variant: "agent", rank: undefined } };
/** Agent variant below max level: the MAX capsule is empty. */
export const AgentBelowMax: Story = {
  args: { variant: "agent", rank: undefined, level: 45 },
};

export const AllVariants: Story = {
  render: () => (
    <Specimens column>
      <Specimen label="panel · S / A / B">
        <div style={{ display: "flex", gap: gpx(12) }}>
          <LevelPill level={60} max={60} rank="S" />
          <LevelPill level={45} max={50} rank="A" />
          <LevelPill level={9} max={10} rank="B" />
        </div>
      </Specimen>
      <Specimen label="equip">
        <LevelPill variant="equip" level={60} max={60} rank="A" />
      </Specimen>
      <Specimen label="large (with / without Details)">
        <div style={{ display: "flex", gap: gpx(20) }}>
          <LevelPill
            variant="large"
            level={60}
            max={60}
            rank="S"
            onInfo={() => {}}
          />
          <LevelPill variant="large" level={12} max={20} rank="A" />
        </div>
      </Specimen>
      <Specimen label="agent (MAX / below max)">
        <div style={{ display: "flex", gap: gpx(20) }}>
          <LevelPill variant="agent" level={60} max={60} />
          <LevelPill variant="agent" level={45} max={60} />
        </div>
      </Specimen>
    </Specimens>
  ),
};
