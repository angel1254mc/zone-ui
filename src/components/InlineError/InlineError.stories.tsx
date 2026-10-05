import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClockIcon } from "../../icons";
import { InlineError, Notice } from "./InlineError";
import { Specimen, Specimens } from "../StatRow/Specimens.story-helpers";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

/** A busy backdrop so the Notice's 50 % black is visible. */
const backdrop =
  "linear-gradient(100deg, #9FB4C8 0%, #C9D6E0 35%, #58677A 55%, #2E3947 100%)";

const meta = {
  title: "Primitives/InlineError",
  component: InlineError,
  tags: ["autodocs"],
  args: { children: "Insufficient crafting materials" },
  parameters: {
    docs: {
      description: {
        component: "Inline error indicator for form fields",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(20), background: "#000", width: gpx(620) }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Alert: Story = { args: { alert: true } };

export const NoticePill: StoryObj<typeof Notice> = {
  render: () => (
    <Specimens column>
      <Specimen label="default glyph (InfoAlertIcon)" bg={backdrop}>
        <Notice>"Unlock Early" has been unlocked</Notice>
      </Specimen>
      <Specimen label="ClockIcon" bg={backdrop}>
        <Notice icon={<ClockIcon />}>Event ends in 66d</Notice>
      </Specimen>
      <Specimen label="no icon" bg={backdrop}>
        <Notice icon={null}>Saved</Notice>
      </Specimen>
    </Specimens>
  ),
};
