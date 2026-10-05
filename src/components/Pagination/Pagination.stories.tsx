import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Pagination } from "./Pagination";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  fontSize: "var(--zzz-font-size-label)",
  lineHeight: "var(--zzz-line-height-dialog-item)",
  color: "var(--zzz-color-text-muted)",
};
/** A light news-page background. */
const lightPage: CSSProperties = {
  background: "#EFEFEF",
  padding: `${gpx(11)} ${gpx(13)}`,
  width: "fit-content",
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
  title: "Forms/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Pager for web lists.",
      },
    },
  },
  args: { count: 175, defaultPage: 1 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Page 1 of 175. */
export const Default: Story = {};

/** Web skin on a light page. */
export const OnLightPage: Story = {
  render: (args) => (
    <div style={lightPage}>
      <Pagination {...args} />
    </div>
  ),
};

/** Both ellipses, page 50. */
export const Middle: Story = { args: { defaultPage: 50 } };

/** Last page: next is disabled. */
export const LastPage: Story = { args: { defaultPage: 175 } };

/** Few pages: every page listed. */
export const FewPages: Story = { args: { count: 4, defaultPage: 2 } };

/** Game skin: mesh pill, accent chips, 26.5°. */
export const GameSkin: Story = {
  args: { skin: "game", defaultPage: 3, count: 12 },
};

/** Whole bar disabled: numbers and arrows `color.text.disabled`, shapes unchanged. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(24) }}>
      <Row label="web">
        <Pagination count={12} defaultPage={3} disabled />
      </Row>
      <Row label="game">
        <Pagination count={12} defaultPage={3} disabled skin="game" />
      </Row>
    </div>
  ),
};

/** Links (server-rendered lists): `getPageHref`. */
export const AsLinks: Story = {
  args: { count: 9, defaultPage: 4, getPageHref: (p: number) => `#page-${p}` },
};

/** Controlled. */
export const Controlled: Story = {
  render: () => {
    const [page, setPage] = useState(7);
    return (
      <Row label={`page ${page}`}>
        <Pagination count={30} page={page} onPageChange={setPage} />
      </Row>
    );
  },
};

const SIZES = ["sm", "md", "lg"] as const;

/** sm / md / lg at the default scale, both skins (skew angles do not change with size). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(24) }}>
      {SIZES.map((size) => (
        <Row key={size} label={`size="${size}" (web / game skin)`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: gpx(16),
            }}
          >
            <Pagination count={175} defaultPage={3} size={size} />
            <Pagination count={12} defaultPage={3} skin="game" size={size} />
          </div>
        </Row>
      ))}
    </div>
  ),
};
