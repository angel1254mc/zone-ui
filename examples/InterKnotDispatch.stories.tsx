import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GameArtProvider, type GameArtState } from './art';
import { InterKnotDispatchPage, type InterKnotDispatchPageProps } from './pages/InterKnotDispatch';

/** Viewports offered in the toolbar (Storybook core viewport feature). */
const VIEWPORTS = {
  ikdDesktop: {
    name: 'Desktop 1440 × 900',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
  ikdTablet: {
    name: 'Tablet 834 × 1112',
    styles: { width: '834px', height: '1112px' },
    type: 'tablet',
  },
  ikdMobile: {
    name: 'Phone 390 × 844',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
} as const;

/** A fixed-size device frame, so the phone layout shows at any canvas size (container queries do the rest). */
function DeviceFrame({ width, height, ...props }: InterKnotDispatchPageProps & { width: number; height: number }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0b0b0b',
        padding: '24px 0',
      }}
    >
      <InterKnotDispatchPage
        {...props}
        height={height}
        style={{
          width,
          maxWidth: '100vw',
          boxShadow: '0 0 0 1px #2a2a2a, 0 24px 60px rgb(0 0 0 / .6)',
        }}
      />
    </div>
  );
}

/** Pins the art state for one story (reviewers can see the loading and no-art states). */
const withArtState =
  (state: GameArtState): Decorator =>
  (Story) => (
    <GameArtProvider state={state}>
      <Story />
    </GameArtProvider>
  );

const meta = {
  title: 'Examples/Website — Inter-Knot Dispatch',
  component: InterKnotDispatchPage,
  tags: ['autodocs'],
  args: { onDownload: fn(), onTrailer: fn(), onSubscribe: fn() },
  argTypes: {
    initialTab: {
      control: 'inline-radio',
      options: ['all', 'news', 'notices', 'events'],
    },
    skin: { control: 'inline-radio', options: ['game', 'web'] },
    height: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    viewport: { options: VIEWPORTS },
    docs: {
      story: { inline: false, iframeHeight: 720 },
      description: {
        component: ['An original ZZZ-style fan news site. Built only from `zone-ui` '].join('\n'),
      },
    },
  },
} satisfies Meta<typeof InterKnotDispatchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop, 1440 × 900 (toolbar viewport). The page scrolls inside its own `.zzz-scrollbar`. */
export const Desktop: Story = {
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
};

/** Phone, 390 × 844 device frame (works at any canvas width). */
export const Mobile: Story = {
  render: (args) => <DeviceFrame {...args} width={390} height={844} />,
};

/** Tablet, 834 wide: one-column newsletter / FAQ, two news columns. */
export const Tablet: Story = {
  render: (args) => <DeviceFrame {...args} width={834} height={1112} />,
};

/** No art reachable (art state `missing`): every image slot is a quiet empty frame; the page and its copy are intact. */
export const NoArt: Story = {
  name: 'No art',
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
  decorators: [withArtState({ status: 'missing', manifest: null })],
};

/** Phone without art: empty frames in the hero, news cards and roster; layout unchanged. */
export const MobileNoArt: Story = {
  name: 'Mobile — no art',
  render: (args) => <DeviceFrame {...args} width={390} height={844} />,
  decorators: [withArtState({ status: 'missing', manifest: null })],
};

/** Art still loading (pinned): neutral skeletons with a faint sheen in every image slot — never imitation art. */
export const Loading: Story = {
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
  decorators: [withArtState({ status: 'loading', manifest: null })],
};

/** The "Notices" tab selected (filtered grid, one page). */
export const NoticesTab: Story = {
  args: { initialTab: 'notices' },
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
};

/** The last page of "All". */
export const LastPage: Story = {
  args: { initialPage: 3 },
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
};

/** The web skin of the web components (flat #222122 tracks, static lime, white chips). */
export const WebSkin: Story = {
  args: { skin: 'web' },
  globals: { viewport: { value: 'ikdDesktop', isRotated: false } },
};

/** No inner scroller: the document scrolls (full-length view). */
export const FullLength: Story = {
  args: { height: 'auto' },
};

/** Newsletter submitted with an invalid address: inline errors, focus back on the field, no toast. */
export const NewsletterInvalid: Story = {
  args: { height: 'auto' },
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', {
      name: 'Newsletter',
    });
    form.scrollIntoView({ block: 'center' });
    await userEvent.type(within(form).getByRole('textbox', { name: 'Email' }), 'proxy@');
    await userEvent.click(within(form).getByRole('button', { name: 'Subscribe' }));
    await expect(within(form).getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  },
};

/** Newsletter submitted: the success Toast (top centre, portalled to the body). */
export const NewsletterSubscribed: Story = {
  args: { height: 'auto' },
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', {
      name: 'Newsletter',
    });
    form.scrollIntoView({ block: 'center' });
    await userEvent.type(within(form).getByRole('textbox', { name: 'Email' }), 'belle@random-play.ne');
    await userEvent.click(within(form).getByRole('checkbox', { name: /weekly digest/ }));
    await userEvent.click(within(form).getByRole('button', { name: 'Subscribe' }));
    await expect(await within(canvasElement.ownerDocument.body).findByText(/Subscribed!/)).toBeInTheDocument();
  },
};
