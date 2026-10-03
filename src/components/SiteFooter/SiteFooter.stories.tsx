import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteFooter } from './SiteFooter'
import { DemoLogo, demoSocial } from '../NavBar/storyArt.story-helpers'

const links = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Help Center', href: '#help' },
]

const meta = {
  title: 'Shell/SiteFooter',
  component: SiteFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Site footer for web pages.',
          '',
          '- Social band `#111`, 63 + a 2 px `#1A1A1A` rule; 64 px icon cells right-aligned in the 1920 content width, icons in a 34 px box, `#898989` (white on hover). Each cell is a link named by `label`; the `icon` slot is decorative.',
          '- Body `#000`: centred `logo` slot, policy `links` (`nav aria-label="Legal"`), `children`, then `legal` text in `tiny` `#BBB`.',
          '- The social glyphs in these stories are generic originals, not brand logos.',
        ].join('\n'),
      },
    },
  },
  args: {
    social: demoSocial,
    logo: <DemoLogo />,
    links,
    legal: (
      <>
        A fan-made demo built with Zone. All trademarks are the property of their respective owners.
        <br />
        <span style={{ color: '#FFF' }}>Copyright © Your Studio. All Rights Reserved.</span>
      </>
    ),
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Social band only. */
export const SocialOnly: Story = { args: { logo: undefined, links: undefined, legal: undefined } }
