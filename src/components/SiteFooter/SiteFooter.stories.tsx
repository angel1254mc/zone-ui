import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteFooter } from "./SiteFooter";
import { DemoLogo, demoSocial } from "../NavBar/storyArt.story-helpers";

const links = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#contact" },
  { label: "Help Center", href: "#help" },
];

const meta = {
  title: "Shell/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Site footer for web pages.",
      },
    },
  },
  args: {
    social: demoSocial,
    logo: <DemoLogo />,
    links,
    legal: (
      <>
        A fan-made demo built with Zone. All trademarks are the property of
        their respective owners.
        <br />
        <span style={{ color: "#FFF" }}>
          Copyright © Your Studio. All Rights Reserved.
        </span>
      </>
    ),
  },
  argTypes: {
    social: { control: false },
    logo: { control: false },
    legal: { control: false },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Social band only. */
export const SocialOnly: Story = {
  args: { logo: undefined, links: undefined, legal: undefined },
};
