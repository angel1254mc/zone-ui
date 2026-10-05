import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { EventDescription } from "./EventDescription";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const pastel: CSSProperties = {
  background: "linear-gradient(100deg, #E9F4F2, #F4D9E3 55%, #F6E7EC)",
};
const BLURB =
  "Next stop: the live venue to make all\nDelulus' hearts skip a beat!\nParticipate in the version event to get\nthe Angels of Delusion's limited outfits!";

const meta = {
  title: "Game/EventDescription",
  component: EventDescription,
  tags: ["autodocs"],
  args: { children: BLURB },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  decorators: [
    (Story) => (
      <div style={{ ...pastel, padding: gpx(24), width: gpx(700) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Event descriptor on the F1 menu. Example uses the Angels of Delusion styling for the background.",
      },
    },
  },
} satisfies Meta<typeof EventDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkArt: Story = {
  name: "On dark art",
  args: {
    children:
      "Miracles never appear alone. They're\nalways accompanied by soaring birds\nand the bright dawn.",
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#3C5373", padding: gpx(12) }}>
        <Story />
      </div>
    ),
  ],
};

export const AutoWrap: Story = {
  args: {
    children:
      "A long description without manual breaks wraps inside its column and stays right-aligned.",
    maxWidth: 420,
  },
};
