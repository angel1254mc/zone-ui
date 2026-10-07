import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
  ClockIcon,
  FireIcon,
  InfoAlertIcon,
  LockIcon,
  SnowflakeIcon,
  StarIcon,
} from "../../icons";
import { AgentImage } from "../../../examples/art";
import { Button } from "../Button";
import { ContentCard } from "../ContentCard";
import { ChoiceGroup } from "./ChoiceGroup";
import type { ChoiceGroupSingleProps, ChoiceItem } from "./ChoiceGroup";
import type { ChoiceResult } from "./ChoiceButton";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const caption: CSSProperties = {
  font: "600 13px/1.3 system-ui, sans-serif",
  color: "#9a9a9a",
};

/** Black backdrop at the story's own width (CSS px) and optional scale (phone = 390 px @ 0.6). */
const Frame = ({
  children,
  width,
  scale,
  style,
}: {
  children: ReactNode;
  width: number;
  scale?: number;
  style?: CSSProperties;
}) => (
  <div
    className={scale ? "zzz-theme" : undefined}
    style={{
      ...(scale ? ({ "--zzz-scale": scale } as CSSProperties) : null),
      background: "#000",
      width,
      maxWidth: "100%",
      padding: gpx(28),
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const CITY: ChoiceItem[] = [
  { value: "ballet", label: "Ballet Twins Road" },
  { value: "lumina", label: "Lumina Square" },
  { value: "sixth", label: "Sixth Street" },
  { value: "blazewood", label: "Blazewood" },
];

/** Controls / args are typed against the single-selection props (multiple-selection stories use `render`). */
const SingleChoiceGroup = ChoiceGroup as ComponentType<ChoiceGroupSingleProps>;

const meta = {
  title: "Forms/ChoiceGroup",
  component: SingleChoiceGroup,
  tags: ["autodocs"],
  args: { items: CITY, label: "Where is Random Play?" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    layout: { control: "inline-radio", options: ["grid", "list"] },
    badges: {
      control: "inline-radio",
      options: ["letters", "numbers", "none"],
    },
    hotkeys: { control: "inline-radio", options: [false, true, "global"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A set of `ChoiceButton`s with single or multiple selection.",
      },
    },
  },
  decorators: [
    (S, ctx) => (ctx.parameters.bare ? S() : <Frame width={1040}>{S()}</Frame>),
  ],
} satisfies Meta<typeof SingleChoiceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The same 2 × 2 question at sm / md / lg (pinned accent phase). */
export const Sizes: Story = {
  decorators: [(S) => <div data-accent-phase="lime">{S()}</div>],
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: gpx(40) }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <ChoiceGroup
          key={size}
          {...args}
          size={size}
          label={`${args.label} (${size})`}
          defaultValue="sixth"
        />
      ))}
    </div>
  ),
};

/** Quiz question with a reveal: pick, then "Lock in" shows correct / incorrect / revealed and locks the group. */
function QuizDemo({ width, scale }: { width: number; scale?: number }) {
  const [value, setValue] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const answer = "lumina";
  const results: Record<string, ChoiceResult> | undefined = checked
    ? value === answer
      ? { [answer]: "correct" }
      : {
          ...(value ? { [value]: "incorrect" as const } : null),
          [answer]: "revealed",
        }
    : undefined;
  return (
    <Frame width={width} scale={scale}>
      <ContentCard
        eyebrow="Question 3 / 5"
        trailing={
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: gpx(8),
            }}
          >
            <ClockIcon size={22} /> 0:24
          </span>
        }
        title="Which street is the Random Play store on?"
        footer={
          checked ? (
            <Button
              onClick={() => {
                setChecked(false);
                setValue(null);
              }}
            >
              Try again
            </Button>
          ) : (
            <Button disabled={!value} onClick={() => setChecked(true)}>
              Lock in
            </Button>
          )
        }
      >
        <ChoiceGroup
          aria-label="Answers"
          items={CITY}
          value={value}
          onValueChange={setValue}
          results={results}
          locked={checked}
          hotkeys
        />
      </ContentCard>
    </Frame>
  );
}

export const QuizWithReveal: Story = {
  parameters: { bare: true, layout: "fullscreen" },
  render: () => <QuizDemo width={1100} />,
};

export const QuizPhone: Story = {
  name: "Quiz (phone 390)",
  parameters: { bare: true, layout: "fullscreen" },
  render: () => <QuizDemo width={390} scale={0.6} />,
};

/** Static results for each outcome: the pick was wrong (incorrect + revealed) and the pick was right (correct, green or accent). */
export const Results: Story = {
  parameters: { bare: true },
  render: () => (
    <Frame
      width={1040}
      style={{ display: "flex", flexDirection: "column", gap: gpx(36) }}
    >
      <span style={caption}>
        Wrong pick: incorrect + revealed, locked (other options dim)
      </span>
      <ChoiceGroup
        aria-label="Wrong pick"
        items={CITY}
        value="ballet"
        results={{ ballet: "incorrect", lumina: "revealed" }}
        locked
      />
      <span style={caption}>Right pick: correct (green)</span>
      <ChoiceGroup
        aria-label="Right pick"
        items={CITY}
        value="lumina"
        results={{ lumina: "correct" }}
        locked
      />
      <span style={caption}>Right pick: correct (accent tone)</span>
      <ChoiceGroup
        aria-label="Right pick accent"
        items={CITY}
        value="lumina"
        results={{ lumina: "correct" }}
        correctTone="accent"
        locked
      />
    </Frame>
  ),
};

/** A poll: multiple selection (up to 2), then the results replace the descriptions. */
export const Poll: Story = {
  render: function Render() {
    const OPTIONS = [
      { value: "shiyu", label: "Shiyu Defense", pct: 41 },
      { value: "hollow", label: "Hollow Zero", pct: 27 },
      { value: "arcade", label: "Arcade games", pct: 19 },
      { value: "fishing", label: "Fishing", pct: 13 },
    ];
    const [value, setValue] = useState<string[]>([]);
    const [voted, setVoted] = useState(false);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: gpx(24),
          alignItems: "flex-start",
        }}
      >
        <ChoiceGroup
          selectionMode="multiple"
          maxSelected={2}
          layout="list"
          badges="none"
          label="Weekly poll — pick up to two favourite modes"
          items={OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            description: voted ? `${o.pct}% of votes` : undefined,
          }))}
          value={value}
          onValueChange={setValue}
          locked={voted}
          announcement={
            voted ? "Thanks! Results are shown under each option." : undefined
          }
        />
        <Button disabled={!value.length} onClick={() => setVoted((v) => !v)}>
          {voted ? "Change vote" : "Vote"}
        </Button>
      </div>
    );
  },
};

/** A settings picker: list layout, icon badges, descriptions, one disabled option. */
export const SettingsPicker: Story = {
  args: {
    layout: "list",
    label: "Difficulty",
    defaultValue: "normal",
    items: [
      {
        value: "story",
        label: "Story",
        badge: <StarIcon />,
        description: "Enemies hit softer. Best if you are here for the plot.",
      },
      {
        value: "normal",
        label: "Normal",
        badge: <FireIcon />,
        description: "The intended balance.",
      },
      {
        value: "hard",
        label: "Hard",
        badge: <SnowflakeIcon />,
        description: "Tighter dodge windows, tougher elites.",
      },
      {
        value: "nightmare",
        label: "Nightmare",
        badge: <LockIcon />,
        description: "Clear Hard once to unlock.",
        disabled: true,
      },
    ],
  },
};

/** Image options: cover media (real agent art by URL; static labels, so nothing changes once the art loads). */
export const ImageOptions: Story = {
  render: () => {
    const agents = [
      { id: "1021", name: "Nekomata" },
      { id: "1031", name: "Nicole" },
      { id: "1041", name: "Soldier 11" },
      { id: "1051", name: "Yidhari" },
    ];
    const items: ChoiceItem[] = agents.map((a) => ({
      value: a.id,
      label: a.name,
      media: (
        <AgentImage
          id={a.id}
          crop="crop"
          fit="cover"
          position="50% 28%"
          alt=""
        />
      ),
    }));
    return (
      <ChoiceGroup
        label="Who is this? (pick a portrait)"
        items={items}
        mediaLayout="cover"
        defaultValue="1031"
      />
    );
  },
};

/** Inline avatar media with a list layout: "choose your host". */
export const AvatarList: Story = {
  render: () => {
    const hosts = [
      { id: "1061", name: "Corin", description: "Rank A · Attack" },
      { id: "1091", name: "Miyabi", description: "Rank S · Anomaly" },
      { id: "1121", name: "Ben", description: "Rank A · Defense" },
    ];
    const items: ChoiceItem[] = hosts.map((h) => ({
      value: h.id,
      label: h.name,
      description: h.description,
      media: <AgentImage id={h.id} crop="circle" alt="" />,
    }));
    return (
      <ChoiceGroup
        label="Choose today's host"
        layout="list"
        badges="numbers"
        hotkeys
        items={items}
      />
    );
  },
};

/** Six options: three columns on wide containers (≥ 960 CSS px), two on medium, one on phones. */
export const SixOptions: Story = {
  decorators: [(S) => <Frame width={1300}>{S()}</Frame>],
  parameters: { bare: true },
  args: {
    label: "Pick a name for your squad",
    items: [
      "Cunning Hares",
      "Belobog",
      "Victoria Housekeeping",
      "Sons of Calydon",
      "Section 6",
      "OBOLS",
    ].map((l) => ({ value: l, label: l })),
  },
};

/** Global hotkeys: press A–D anywhere on the page (except in text fields). */
export const GlobalHotkeys: Story = {
  args: { hotkeys: "global", label: "Press A, B, C or D" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "sixth" },
};

/** Phone (390 CSS px at --zzz-scale 0.6): the grid collapses to one column. */
export const Phone: Story = {
  parameters: { bare: true, layout: "fullscreen" },
  render: () => (
    <Frame width={390} scale={0.6}>
      <ChoiceGroup
        label="Where is Random Play?"
        items={[
          ...CITY.slice(0, 3),
          {
            value: "long",
            label:
              "The waterfront warehouse district past the old Brant Street construction site",
          },
        ]}
        defaultValue="lumina"
      />
    </Frame>
  ),
};

/** Desktop width with an info badge on the label (labels accept any node). */
export const Desktop: Story = {
  parameters: { bare: true, layout: "fullscreen" },
  render: () => (
    <Frame width={1280} scale={0.75}>
      <ChoiceGroup
        label={
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: gpx(8),
            }}
          >
            <InfoAlertIcon size={22} /> Pick the odd one out
          </span>
        }
        items={CITY}
        defaultValue="blazewood"
      />
    </Frame>
  ),
};
