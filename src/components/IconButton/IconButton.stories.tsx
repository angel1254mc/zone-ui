import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { CSSProperties } from "react";
import {
  CameraModeIcon,
  FilterIcon,
  InfoAlertIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  SortIcon,
  StarIcon,
  TrashIcon,
  UnlockIcon,
} from "../../icons";
import { Button } from "../Button";
import { IconButton } from "./IconButton";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--zzz-space-control-gap)",
  flexWrap: "wrap",
};
const caption: CSSProperties = {
  font: "600 13px/1.3 system-ui, sans-serif",
  color: "#9a9a9a",
};

const meta = {
  title: "Primitives/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: <FilterIcon />, label: "Filter" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "stepper", "key", "mission", "sort"],
    },
    tone: { control: "inline-radio", options: ["default", "lockOn"] },
    icon: { control: false },
    iconOn: { control: false },
  },
  decorators: [
    (S) => <div style={{ background: "#000", padding: gpx(28) }}>{S()}</div>,
  ],
  parameters: {
    docs: {
      description: {
        component: "Round icon-only button.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Glyphs: Story = {
  render: () => (
    <div style={row}>
      <IconButton icon={<FilterIcon />} label="Filter" />
      <IconButton icon={<LockIcon />} label="Lock" />
      <IconButton icon={<UnlockIcon />} label="Unlock" />
      <IconButton icon={<LockIcon />} label="Unlock" tone="lockOn" />
      <IconButton icon={<TrashIcon />} label="Discard" />
      <IconButton icon={<InfoAlertIcon />} label="Details" />
      <IconButton icon={<SearchIcon />} label="Search" />
      <IconButton icon={<StarIcon />} label="Favourite" />
      <IconButton icon={<CameraModeIcon />} label="Camera mode" />
    </div>
  ),
};

const SIZES = ["sm", "md", "lg"] as const;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(28) }}>
      {SIZES.map((size) => (
        <div key={size} style={row}>
          <span style={{ ...caption, width: 32 }}>{size}</span>
          <IconButton size={size} icon={<FilterIcon />} label="Filter" />
          <IconButton size={size} icon={<TrashIcon />} label="Discard" />
          <IconButton size={size} icon={<StarIcon />} label="Favourite" />
          <IconButton
            size={size}
            icon={<LockIcon />}
            label="Unlock"
            tone="lockOn"
          />
          <IconButton
            size={size}
            icon={<InfoAlertIcon />}
            label="Details"
            pressed
          />
          <IconButton
            size={size}
            icon={<SearchIcon />}
            label="Search"
            disabled
          />
          <Button size={size}>Apply</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`sm` 46 · `md` 57 · `lg` 69 design units (≈ 32 / 40 / 48 px at the default scale): rest, `lockOn`, pressed (outset scales too), disabled, and a `Button` of the same size for alignment.",
      },
    },
  },
};

export const Presets: Story = {
  render: () => (
    <div style={row}>
      <IconButton icon={<FilterIcon />} label="Filter" size="md" />
      <IconButton icon={<SortIcon />} label="Sort descending" size="sort" />
      <IconButton icon={<MinusIcon />} label="Decrease" size="stepper" />
      <IconButton icon={<PlusIcon />} label="Increase" size="stepper" />
      <IconButton
        icon={<span style={{ fontSize: gpx(17.5), lineHeight: 1 }}>T</span>}
        label="Lock (T)"
        size="key"
      />
      <div style={{ background: "#F58DB0", padding: gpx(12), display: "flex" }}>
        <IconButton
          icon={<SearchIcon />}
          label="Mission details"
          size="mission"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The fixed presets next to `md` 57: `sort` 56 (deprecated → `md`), `stepper` 47, `key` 38, `mission` 48.",
      },
    },
  },
};

function LockToggleDemo() {
  const [locked, setLocked] = useState(true);
  return (
    <div style={row}>
      <IconButton
        toggle
        pressedState={locked}
        onPressedStateChange={setLocked}
        icon={<UnlockIcon />}
        iconOn={<LockIcon />}
        tone={locked ? "lockOn" : "default"}
        label="Lock"
      />
      <span style={caption}>
        {locked ? "locked (aria-pressed=true)" : "unlocked"}
      </span>
    </div>
  );
}

export const LockToggle: Story = {
  render: () => <LockToggleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled toggle: locked = light fill + black closed padlock; unlocked = dark + white open padlock.",
      },
    },
  },
};

export const Favourite: Story = {
  args: {
    toggle: true,
    defaultPressedState: false,
    icon: <StarIcon />,
    label: "Favourite",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled toggle; only `aria-pressed` changes (pass `iconOn` for an "on" glyph).',
      },
    },
  },
};

export const Pressed: Story = {
  render: () => (
    <div style={row}>
      <IconButton icon={<FilterIcon />} label="Filter" pressed />
      <IconButton icon={<SortIcon />} label="Sort" pressed />
      <IconButton icon={<PlusIcon />} label="Increase" size="stepper" pressed />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Forced (`pressed`): the pill rule (accent + 4 px outset).",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <IconButton
        icon={<MinusIcon />}
        label="Decrease"
        size="stepper"
        disabled
      />
      <IconButton
        icon={<PlusIcon />}
        label="Increase"
        size="stepper"
        disabled
      />
      <IconButton icon={<TrashIcon />} label="Discard" disabled />
    </div>
  ),
};
