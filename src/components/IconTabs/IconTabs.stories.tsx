import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { IconTabs } from "./IconTabs";
import type { IconTabsItem } from "./IconTabs";
import { TabPanel } from "../SegmentedTabs";
import {
  WEngineCategoryIcon,
  DriveDiscCategoryIcon,
  MaterialsCategoryIcon,
  ConsumablesCategoryIcon,
} from "../../icons";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const storage: IconTabsItem[] = [
  { value: "wengine", label: "W-Engine", icon: <WEngineCategoryIcon /> },
  { value: "disc", label: "Drive Disc", icon: <DriveDiscCategoryIcon /> },
  { value: "materials", label: "Materials", icon: <MaterialsCategoryIcon /> },
  {
    value: "consumables",
    label: "Consumables",
    icon: <ConsumablesCategoryIcon />,
  },
];
const titles: Record<string, string> = {
  wengine: "W-Engine Storage",
  disc: "Drive Disc Storage",
  materials: "Materials",
  consumables: "Consumables",
};

const caption: CSSProperties = {
  fontSize: "var(--zzz-font-size-label)",
  lineHeight: "var(--zzz-line-height-dialog-item)",
  color: "var(--zzz-color-text-muted)",
};

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(22) }}>
      <span style={caption}>{label}</span>
      {children}
    </div>
  );
}

const meta = {
  title: "Forms/IconTabs",
  component: IconTabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Storage category switcher",
      },
    },
  },
  args: {
    items: storage,
    defaultValue: "wengine",
    "aria-label": "Storage category",
  },
} satisfies Meta<typeof IconTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** W-Engine active. */
export const Default: Story = {};

/** Each tab active in turn. */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(44) }}>
      {storage.map((item) => (
        <Row key={item.value} label={`${item.label} active`}>
          <IconTabs
            aria-label="Storage category"
            items={storage}
            value={item.value}
          />
        </Row>
      ))}
    </div>
  ),
};

/** Pointer held on an inactive tab, and a disabled tab. */
export const PressedAndDisabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(44) }}>
      <Row label="Drive Disc held">
        <IconTabs
          aria-label="Storage category"
          items={storage}
          value="wengine"
          pressed="disc"
        />
      </Row>
      <Row label="Consumables disabled">
        <IconTabs
          aria-label="Storage category"
          items={storage.map((it) =>
            it.value === "consumables" ? { ...it, disabled: true } : it,
          )}
          value="wengine"
        />
      </Row>
    </div>
  ),
};

/** Optional selection beat. */
export const Beat: Story = { args: { beat: true } };

/** Controlled, with panels: click or use ←/→. */
export const WithPanels: Story = {
  render: () => {
    const [value, setValue] = useState("wengine");
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: gpx(30),
          alignItems: "flex-start",
        }}
      >
        <IconTabs
          id="storage-tabs"
          aria-label="Storage category"
          items={storage}
          value={value}
          onValueChange={setValue}
        />
        {storage.map((item) => (
          <TabPanel
            key={item.value}
            tabsId="storage-tabs"
            value={item.value}
            hidden={item.value !== value}
            style={{ ...caption, color: "var(--zzz-color-text-soft)" }}
          >
            {titles[item.value]}
          </TabPanel>
        ))}
      </div>
    );
  },
};

const SIZES = ["sm", "md", "lg"] as const;

/** sm / md / lg at the default scale: pill, pitch, glyph and the overflowing active circle scale together. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(48) }}>
      {SIZES.map((size) => (
        <Row key={size} label={`size="${size}"`}>
          <IconTabs
            aria-label={`Storage (${size})`}
            items={storage}
            defaultValue="disc"
            pressed="materials"
            size={size}
          />
        </Row>
      ))}
    </div>
  ),
};
