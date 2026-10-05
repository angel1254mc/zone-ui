import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { EventDescription } from "../EventDescription";
import { EventTitle } from "../EventTitle";
import { EventRibbon } from "./EventRibbon";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
/** Stand-in for dark blue key art behind an event header. */
const dusk: CSSProperties = {
  background: "linear-gradient(160deg, #2E3B55, #50668C 60%, #3A4A68)",
};
const BLURB =
  "Miracles never appear alone. They're\nalways accompanied by soaring birds\nand the bright dawn.";

const meta = {
  title: "Game/EventRibbon",
  component: EventRibbon,
  tags: ["autodocs"],
  args: { children: "Main Story Season 3 New Chapter Unlocked" },
  decorators: [
    (Story) => (
      <div style={{ ...dusk, padding: gpx(24) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: "Event subtitle ribbon",
      },
    },
  },
} satisfies Meta<typeof EventRibbon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Short: Story = { args: { children: "New Chapter" } };

function Header() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <EventTitle size={47}>Their Secret Histories</EventTitle>
      <EventRibbon style={{ marginTop: gpx(23) }}>
        Main Story Season 3 New Chapter Unlocked
      </EventRibbon>
      <EventDescription style={{ marginTop: gpx(32) }}>
        {BLURB}
      </EventDescription>
    </div>
  );
}

/** An event header: title, ribbon, description, right-aligned. */
export const EventHeader: Story = { render: () => <Header /> };
