import type { Meta, StoryObj } from "@storybook/react-vite";
import { FireIcon, RuptureIcon, SnowflakeIcon, AttackIcon } from "../../icons";
import { GameIcon } from "../../../examples/art";
import { SplitPill } from "./SplitPill";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const iconStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain" as const,
};

const meta = {
  title: "Data Display/SplitPill",
  component: SplitPill,
  tags: ["autodocs"],
  args: {
    items: [
      {
        icon: (
          <GameIcon
            kind="elements"
            name="Fire"
            style={iconStyle}
            fallback={<FireIcon style={{ color: "#F0602A" }} />}
          />
        ),
        label: "Fire",
      },
      {
        icon: (
          <GameIcon
            kind="specialties"
            name="Rupture"
            style={iconStyle}
            fallback={<RuptureIcon style={{ color: "#B8B8B8" }} />}
          />
        ),
        label: "Rupture",
      },
    ],
  },
  argTypes: {
    items: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: "Element / specialty tag pill",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: gpx(20),
          background: "var(--zzz-color-surface-agent-info)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** Library SVG icons only (no game art). */
export const OriginalIcons: Story = {
  args: {
    items: [
      { icon: <SnowflakeIcon style={{ color: "#8FD8F8" }} />, label: "Ice" },
      { icon: <AttackIcon style={{ color: "#B8B8B8" }} />, label: "Attack" },
    ],
  },
};
export const TextOnly: Story = {
  args: { items: [{ label: "Fire" }, { label: "Rupture" }] },
};
