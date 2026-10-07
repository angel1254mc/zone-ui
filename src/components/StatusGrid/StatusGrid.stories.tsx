import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { StatusGrid } from "./StatusGrid";
import type { StatusGridItem, StatusGridStatus } from "./StatusGrid";

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

/** A phone-width frame (390 CSS px) at the web default scale. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div
      className="zzz-theme zzz-bg-hatch"
      style={{ width: 390, padding: 16, borderRadius: 12 }}
    >
      {children}
    </div>
  );
}

const quiz: StatusGridItem[] = [
  { status: "success", label: "Q1" },
  { status: "success", label: "Q2" },
  { status: "error", label: "Q3" },
  { status: "success", label: "Q4" },
  { status: "neutral", label: "Q5" },
];

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const streak: StatusGridItem[] = [
  "success",
  "success",
  "warning",
  "success",
  "error",
  "success",
  "success",
  "success",
  "success",
  "success",
  "neutral",
  "success",
  "success",
  "success",
  "success",
  "warning",
  "success",
  "success",
  "success",
  "empty",
  "empty",
].map((status, i) => ({
  status: status as StatusGridStatus,
  label: WEEK[i % 7],
  labelText: `Week ${Math.floor(i / 7) + 1} ${WEEK[i % 7]}`,
  current: i === 18,
  tooltip:
    status === "empty"
      ? "Not played yet"
      : status === "warning"
        ? "3 / 5 — played late"
        : status === "error"
          ? "Missed"
          : status === "neutral"
            ? "Skipped"
            : "5 / 5",
}));

// 90-day uptime: deterministic pseudo-random pattern
const uptime: StatusGridItem[] = Array.from({ length: 90 }, (_, i) => {
  const r = (i * 37 + 11) % 97;
  const status: StatusGridStatus =
    r < 3 ? "error" : r < 8 ? "warning" : "success";
  return {
    status,
    labelText: `Day ${i + 1}`,
    tooltip: `Day ${i + 1}: ${status === "success" ? "100%" : status === "warning" ? "99.2% (degraded)" : "93.0% (outage)"}`,
  };
});

const meta = {
  title: "Data Display/StatusGrid",
  component: StatusGrid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A row / grid of small status tiles.",
      },
    },
  },
  args: {
    items: quiz,
    "aria-label": "Quiz results",
    statusLabels: { success: "Correct", error: "Wrong", neutral: "Skipped" },
  },
} satisfies Meta<typeof StatusGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Five quiz answers: correct, wrong, skipped. */
export const Default: Story = {};

/** Every status, with and without glyphs. */
export const Statuses: Story = {
  render: () => {
    // captions are sized for short words (a cell + one gap wide); the full status word stays in
    // the accessible name ("OK: Success")
    const short: Record<StatusGridStatus, string> = {
      success: "OK",
      error: "Err",
      warning: "Warn",
      neutral: "Skip",
      empty: "Empty",
    };
    const all: StatusGridItem[] = (
      ["success", "error", "warning", "neutral", "empty"] as const
    ).map((s) => ({
      status: s,
      label: short[s],
    }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: gpx(24) }}>
        <Row label="glyphs (default)">
          <StatusGrid aria-label="Statuses" items={all} size="lg" />
        </Row>
        <Row label="glyphs={false}">
          <StatusGrid
            aria-label="Statuses"
            items={all}
            size="lg"
            glyphs={false}
          />
        </Row>
        <Row label="custom content (numbers)">
          <StatusGrid
            aria-label="Scores"
            hideLabels
            items={[5, 4, 2, 0, 3].map((n) => ({
              status:
                n >= 4
                  ? "success"
                  : n >= 3
                    ? "warning"
                    : n > 0
                      ? "error"
                      : "empty",
              content: n,
              labelText: `${n} of 5`,
            }))}
          />
        </Row>
      </div>
    );
  },
};

/** sm / md / lg. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(24) }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Row key={size} label={size}>
          <StatusGrid {...args} size={size} />
        </Row>
      ))}
    </div>
  ),
};

/** A three-week streak calendar: fixed 7 columns, today marked `current`, tooltips on focus/hover. */
export const StreakCalendar: Story = {
  args: {
    items: streak,
    columns: 7,
    size: "md",
    "aria-label": "Daily streak",
    statusLabels: undefined,
  },
};

/** 90-day uptime strip: small cells, no labels, tooltips. */
export const Uptime: Story = {
  args: {
    items: uptime,
    size: "sm",
    glyphs: false,
    "aria-label": "Uptime, last 90 days",
    statusLabels: undefined,
  },
  render: (args) => (
    <div style={{ width: gpx(1100) }}>
      <StatusGrid {...args} />
    </div>
  ),
};

/** Phone width (390 px): quiz results and the streak. */
export const Phone390: Story = {
  render: (args) => (
    <Phone>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: gpx(36),
          alignItems: "center",
        }}
      >
        <StatusGrid {...args} size="lg" />
        <StatusGrid
          aria-label="Daily streak"
          items={streak}
          columns={7}
          size="md"
        />
      </div>
    </Phone>
  ),
};

/** Desktop width (1280 px) at the web default scale: results row beside a 3-week streak. */
export const Desktop1280: Story = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div
      className="zzz-theme"
      style={{
        width: 1280,
        padding: 32,
        display: "flex",
        gap: 64,
        alignItems: "flex-start",
      }}
    >
      <StatusGrid {...args} size="lg" />
      <StatusGrid
        aria-label="Daily streak"
        items={streak}
        columns={7}
        size="md"
      />
    </div>
  ),
};
