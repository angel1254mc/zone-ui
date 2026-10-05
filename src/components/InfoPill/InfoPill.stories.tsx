import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { ClockIcon, InfoAlertIcon } from "../../icons";
import { InfoPill } from "./InfoPill";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const pastel: CSSProperties = {
  background: "linear-gradient(100deg, #E9F4F2, #F4D9E3 55%, #F6E7EC)",
};
const row: CSSProperties = {
  display: "flex",
  gap: gpx(11),
  alignItems: "center",
};

const meta = {
  title: "Game/InfoPill",
  component: InfoPill,
  tags: ["autodocs"],
  args: { children: "66d" },
  argTypes: { icon: { control: false } },
  render: (args) => <InfoPill {...args} icon={<ClockIcon />} />,
  decorators: [
    (Story) => (
      <div style={{ ...pastel, padding: gpx(24) }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: "Event timer / info pill",
      },
    },
  },
} satisfies Meta<typeof InfoPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Timer: Story = {};

export const EventDetails: Story = {
  args: { children: "Event Details", onClick: () => {} },
  render: (args) => <InfoPill {...args} icon={<InfoAlertIcon />} />,
};

export const Pair: Story = {
  render: () => (
    <div style={row}>
      <InfoPill icon={<ClockIcon />}>66d</InfoPill>
      <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
        Event Details
      </InfoPill>
    </div>
  ),
};

export const CheckInEvent: Story = {
  render: () => (
    <div style={row}>
      <InfoPill icon={<ClockIcon />}>25d</InfoPill>
      <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
        Check-In Event
      </InfoPill>
    </div>
  ),
};

export const Pressed: Story = {
  args: { children: "Event Details", onClick: () => {}, pressed: true },
  render: (args) => <InfoPill {...args} icon={<InfoAlertIcon />} />,
};

export const Disabled: Story = {
  args: { children: "Event Details", onClick: () => {}, disabled: true },
  render: (args) => <InfoPill {...args} icon={<InfoAlertIcon />} />,
};

export const NoIcon: Story = {
  render: () => <InfoPill>Limited Time</InfoPill>,
};
