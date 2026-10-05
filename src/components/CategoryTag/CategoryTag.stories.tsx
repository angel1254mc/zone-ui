import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { CategoryTag } from "./CategoryTag";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: "var(--zzz-font-size-label)",
  lineHeight: "var(--zzz-line-height-dialog-item)",
  color: "var(--zzz-color-text-muted)",
};

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(12) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

const meta = {
  title: "Data Display/CategoryTag",
  component: CategoryTag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "News category tag.",
      },
    },
  },
  args: { children: "Notices" },
} satisfies Meta<typeof CategoryTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every category, both skins. */
export const Categories: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(20) }}>
      {(["web", "game"] as const).map((skin) => (
        <Row key={skin} label={skin}>
          <div style={{ display: "flex", gap: gpx(16), alignItems: "center" }}>
            <CategoryTag skin={skin}>News</CategoryTag>
            <CategoryTag skin={skin}>Notices</CategoryTag>
            <CategoryTag skin={skin}>Events</CategoryTag>
            <CategoryTag skin={skin}>Patch Notes</CategoryTag>
          </div>
        </Row>
      ))}
    </div>
  ),
};
