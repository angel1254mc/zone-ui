import type { Meta, StoryObj } from "@storybook/react-vite";
import { PolychromeIcon } from "../../icons";
import { GameIcon } from "../../../examples/art";
import { OverclockBar, ProgressPill, XpBar } from "./Progress";
import { Specimen, Specimens } from "../StatRow/Specimens.story-helpers";

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const fill = { width: "100%", height: "100%", objectFit: "contain" as const };
const polychrome = (
  <GameIcon
    kind="misc"
    name="polychrome"
    style={fill}
    fallback={<PolychromeIcon />}
  />
);

const meta = {
  title: "Data Display/Progress",
  component: OverclockBar,
  tags: ["autodocs"],
  args: { current: 1, next: 2 },
  parameters: {
    docs: {
      description: {
        component: "Simple progress display component.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: gpx(24), background: "#000" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OverclockBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overclock: Story = {};
export const OverclockPhases: Story = {
  render: () => (
    <Specimens column>
      {[
        [0, 1],
        [2, 3],
        [4, 5],
        [5, 5],
      ].map(([c, n]) => (
        <Specimen key={`${c}-${n}`} label={`current ${c} → next ${n}`}>
          <OverclockBar current={c!} next={n!} />
        </Specimen>
      ))}
    </Specimens>
  ),
};

export const Xp: StoryObj<typeof XpBar> = {
  render: () => (
    <Specimens column>
      <Specimen label="MAX">
        <XpBar value={1} max={1} />
      </Specimen>
      <Specimen label="partial">
        <XpBar value={2350} max={6000} />
      </Specimen>
    </Specimens>
  ),
};

export const Polychrome: StoryObj<typeof ProgressPill> = {
  render: () => (
    <Specimens column>
      <Specimen label="with NEW!">
        <div style={{ paddingTop: gpx(12) }}>
          <ProgressPill
            icon={polychrome}
            label={"Polychrome\nProgress:"}
            value="19%"
            isNew
          />
        </div>
      </Specimen>
      <Specimen label="plain">
        <ProgressPill
          icon={<PolychromeIcon />}
          label={"Polychrome\nProgress:"}
          value="100%"
        />
      </Specimen>
    </Specimens>
  ),
};
