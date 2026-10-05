import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { NewsCard } from "./NewsCard";
import { NamecardImage } from "../../../examples/art";

/** calc(N * var(--zzz-px)) */
const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;
const lightPage: CSSProperties = {
  background: "#EFEFEF",
  width: "fit-content",
};

const posts = [
  {
    date: "2024/07/04",
    category: "Notices",
    title: "Signal Search Probability Details",
    description:
      "Exclusive Channel, W-Engine Channel and Bangboo Channel rates, pity rules and guarantees for the current version.",
  },
  {
    date: "2024/07/03",
    category: "Events",
    title: "Surprise Screening Plan: Daily Check-In",
    description:
      "Check in every day during the event to claim Polychromes, Denny and Master Tapes.",
  },
  {
    date: "2024/06/28",
    category: "News",
    title: "Version 1.0 Update Preview Special Program Recap",
    description:
      "New Agents, new W-Engines, the Hollow Zero rework and more from the livestream.",
  },
  {
    date: "2024/06/21",
    category: "Notices",
    title: "Server Maintenance Compensation Details",
    description:
      "Proxies who reached Inter-Knot Level 4 before the maintenance will receive 300 Polychromes.",
  },
  {
    date: "2024/06/19",
    category: "Events",
    title: "Angels Support Operation",
    description:
      "Complete support missions with the new Agents to earn event rewards.",
  },
  {
    date: "2024/06/12",
    category: "News",
    title: "Developer Diary: The Sound of New Eridu",
    description:
      "The audio team talks about the city soundscape, the soundtrack and the vinyl store.",
  },
];

/** Banner art: real Inter-Knot namecards by URL (Enka.Network), one per post, cover-cropped into the 396×220 banner. */
const BANNERS: { id?: string; agentId?: string }[] = [
  { agentId: "1191" },
  { id: "ImgCardEvent03" },
  { id: "ImgCardEvent02" },
  { id: "ImgCardEvent04" },
  { agentId: "1311" },
  { agentId: "1031" },
];
const art = (i: number) => (
  <NamecardImage {...BANNERS[i % BANNERS.length]} alt="" />
);

const meta = {
  title: "Data Display/NewsCard",
  component: NewsCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "News article card.",
      },
    },
  },
  args: { href: "#", art: art(0), ...posts[0] },
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The light page tone. */
export const Light: Story = {
  args: { tone: "light" },
  render: (args) => (
    <div style={{ ...lightPage, padding: gpx(24) }}>
      <NewsCard {...args} />
    </div>
  ),
};

/** Game-skin category tag (live accent). */
export const GameSkin: Story = { args: { skin: "game" } };

/** Long title and description: one-line ellipsis, two-line clamp. No art: the slot's backdrop. */
export const Truncation: Story = {
  args: {
    art: undefined,
    title:
      "A very long headline that keeps going well past the width of the card so it has to be cut",
    description:
      "A long description that runs over two lines is clamped with an ellipsis at the end of the second line, so every card in the grid keeps the same height no matter how much text the editors wrote.",
  },
};

/** A 3-column grid: column gap 46, row gap 84. */
export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${gpx(396)})`,
        columnGap: gpx(46),
        rowGap: gpx(84),
      }}
    >
      {posts.map((p, i) => (
        <NewsCard key={p.title} href="#" art={art(i)} {...p} />
      ))}
    </div>
  ),
};
