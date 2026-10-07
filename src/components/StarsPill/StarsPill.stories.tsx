import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { StarsPill } from "./StarsPill";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const meta = {
  title: "Data Display/StarsPill",
  component: StarsPill,
  tags: ["autodocs"],
  args: { value: 1, size: "panel" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 5, step: 1 } },
    size: { control: "inline-radio", options: ["panel", "large"] },
  },
  parameters: {
    docs: {
      description: {
        component: "The stat pill that holds the refinement stars.",
      },
    },
  },
} satisfies Meta<typeof StarsPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {};
export const Large: Story = { args: { size: "large", value: 1 } };
export const LargeWithEnhance: Story = {
  args: { size: "large", value: 1, onEnhance: fn() },
};
export const EnhancePressed: Story = {
  args: {
    size: "large",
    value: 1,
    onEnhance: fn(),
    enhanceProps: { "data-pressed": "" } as object,
  },
};
export const EnhanceDisabled: Story = {
  args: {
    size: "large",
    value: 5,
    onEnhance: fn(),
    enhanceProps: { disabled: true },
  },
};
export const EmptyDriveDisc: Story = { args: { value: 0, empty: true } };
export const CustomAction: Story = {
  args: {
    size: "large",
    value: 3,
    action: (
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: gpx(81),
          borderRadius: gpx(30),
          background: "#080808",
          color: "#8C8C8C",
        }}
      >
        MAX
      </span>
    ),
  },
};
