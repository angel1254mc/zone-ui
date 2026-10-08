import type { CSSProperties } from 'react';
import {
  Button,
  ChipGroup,
  FilterIcon,
  HatchBackground,
  ItemCard,
  ResetIcon,
  Select,
  SortToggle,
  TagButton,
  Text,
} from '@angel1254mc/zone-ui';
import type { ComponentDoc } from '../../../types';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

/**
 * Gallery preview: an open filter drawer laid out inline over a dimmed grid, built from the drawer's own
 * classes. The real drawer portals and traps focus, so it never renders in a card.
 */
function Thumbnail() {
  return (
    <div
      style={
        {
          position: 'relative',
          width: u(1040),
          height: u(790),
          overflow: 'hidden',
          borderRadius: 12,
          '--zzz-drawer-width': u(688),
        } as CSSProperties
      }
    >
      <HatchBackground />
      <div style={{ position: 'absolute', left: u(40), top: u(60), display: 'grid', gap: u(20) }}>
        {(['s', 'a', 'b'] as const).map((r) => (
          <div key={r} style={{ display: 'flex', gap: u(17) }}>
            <ItemCard rarity={r} level={60} interactive={false} />
            <ItemCard rarity={r} level={50} interactive={false} />
          </div>
        ))}
      </div>
      <div className="zzz-drawer-scrim" style={{ animation: 'none' }} />
      <div className="zzz-drawer" style={{ animation: 'none' }}>
        <div className="zzz-drawer__header">
          <span className="zzz-drawer__icon">
            <FilterIcon />
          </span>
          <Text role="button" className="zzz-drawer__title">
            Filter W-Engines
          </Text>
          <TagButton kind="close" label="Close" className="zzz-drawer__close" />
        </div>
        <div className="zzz-drawer__body zzz-mat-drawer">
          <div className="zzz-drawer__panel">
            <div className="zzz-filter-drawer__sort">
              <Select aria-label="Sort by" defaultValue="rarity" options={[{ value: 'rarity', label: 'Rarity' }]} />
              <SortToggle />
            </div>
            <hr className="zzz-filter-drawer__divider" />
            <div className="zzz-filter-drawer__groups">
              <ChipGroup
                label="Rarity"
                defaultValue={['s']}
                options={[
                  { value: 's', label: 'S' },
                  { value: 'a', label: 'A' },
                  { value: 'b', label: 'B' },
                ]}
              />
              <ChipGroup
                label="Agent Specialties"
                defaultValue={['attack']}
                options={[
                  { value: 'attack', label: 'Attack' },
                  { value: 'stun', label: 'Stun' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="zzz-drawer__footer">
          <Button width="wide" icon={<ResetIcon />} iconTone="reset">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  hero: { demo: 'hero' },
  thumbnail: Thumbnail,
  thumbnailScale: 0.24,
  usage: (
    <>
      <p>
        A drawer slides in from the right and keeps the page in view behind it. Use it for content people adjust while
        they look at the page: filters and sorting for a list, settings, details of a selected item.{' '}
        <code>FilterDrawer</code> is the ready-made filter panel: a sort row, chip sections as data and a Reset button.
      </p>
      <p>
        For a short question or a small form on a website, use a Modal. To confirm an action on a game-style screen, use
        a Confirm Dialog.
      </p>
    </>
  ),
  usageCode: `import { FilterDrawer } from '@angel1254mc/zone-ui';

<FilterDrawer
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: 'Rarity',
      options: [
        { value: 's', label: 'S' },
        { value: 'a', label: 'A' },
      ],
    },
  ]}
/>`,
  examples: [
    {
      demo: 'filter-a-list',
      title: 'Filter a list',
      description: 'Control the chips and the sort row, and the list updates as people pick. Reset clears both.',
      frame: 'start',
    },
    {
      demo: 'settings-drawer',
      title: 'Your own content',
      description: 'Drawer takes any children, a header icon, a footer action and a width.',
    },
  ],
  types: [
    {
      name: 'FilterDrawerSection',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, description: 'Section heading, also the group name.' },
        {
          name: 'options',
          type: 'ChipGroupOption[]',
          required: true,
          description: 'The chips: `{ value, label, disabled? }`.',
        },
        { name: 'value', type: 'string[]', description: 'Selected values (controlled).' },
        { name: 'defaultValue', type: 'string[]', description: 'Initially selected values (uncontrolled).' },
        { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called when a chip is toggled.' },
        { name: 'multiple', type: 'boolean', description: 'Default `true`. `false` makes the section single-choice.' },
        { name: 'columns', type: 'number', description: 'Chip columns. Default 2.' },
        { name: 'id', type: 'string', description: 'React key. Defaults to the label when it is a string.' },
      ],
    },
    {
      name: 'FilterDrawerSort',
      rows: [
        {
          name: 'options',
          type: 'SelectOption[]',
          required: true,
          description: 'The sort fields: `{ value, label }`.',
        },
        { name: 'value', type: 'string', description: 'Selected field (controlled). `defaultValue` for uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the field changes.' },
        { name: 'direction', type: "'asc' | 'desc'", description: 'Sort direction (controlled).' },
        { name: 'defaultDirection', type: "'asc' | 'desc'", description: 'Initial direction. Default `desc`.' },
        { name: 'onDirectionChange', type: '(direction) => void', description: 'Called when the toggle flips.' },
        {
          name: 'directionLabels',
          type: '{ asc: string; desc: string }',
          description: 'Accessible names of the toggle.',
        },
      ],
    },
  ],
  notes: [
    {
      title: 'Focus and keyboard',
      items: [
        <>Focus moves into the drawer on open and Tab stays inside it.</>,
        <>
          <kbd>Esc</kbd>, the Close tag or a click on the dimmed page closes it. Turn the last two off with{' '}
          <code className="d-inline-code">closeOnEscape</code> and <code className="d-inline-code">closeOnScrim</code>.
        </>,
        <>Focus returns to the button that opened it.</>,
      ],
    },
    {
      title: 'Portals and stacking',
      items: [
        <>
          The drawer renders in a fixed layer on <code className="d-inline-code">&lt;body&gt;</code> and the page behind
          becomes inert. Pass <code className="d-inline-code">container</code> to keep it inside one element.
        </>,
        <>A Confirm Dialog or Modal opened from the drawer stacks on top and closes first.</>,
      ],
    },
    {
      title: 'Reduced motion',
      items: [<>The drawer fades in and out instead of sliding.</>],
    },
  ],
  related: ['modal', 'chip', 'sort-toggle'],
};

export default doc;
