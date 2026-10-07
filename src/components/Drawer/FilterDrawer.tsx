import type { ReactNode } from 'react';
import { FilterIcon, ResetIcon } from '../../icons';
import { Button } from '../Button';
import { ChipGroup, type ChipGroupProps } from '../Chip';
import { Select, type SelectProps } from '../Select';
import { SortToggle, type SortDirection } from '../SortToggle';
import { Drawer, type DrawerProps } from './Drawer';

export interface FilterDrawerSort extends SelectProps {
  /** Sort direction (controlled). */
  direction?: SortDirection;
  /** Initial direction (uncontrolled). Default `desc`. */
  defaultDirection?: SortDirection;
  onDirectionChange?(direction: SortDirection): void;
  /** Accessible names of the sort toggle per state. */
  directionLabels?: { asc: string; desc: string };
}

export interface FilterDrawerSection extends ChipGroupProps {
  /** React key (default: the label when it is a string, else the index). */
  id?: string;
}

export interface FilterDrawerProps extends Omit<DrawerProps, 'children' | 'footer' | 'title'> {
  /** Default "Filter W-Engines". */
  title?: ReactNode;
  /** The sort row (Select + SortToggle). Omit for no sort row. */
  sort?: FilterDrawerSort;
  /** Chip sections, as data ("Rarity" S/A/B, "Agent Specialties" …). */
  groups: FilterDrawerSection[];
  /** Reset pressed. */
  onReset?(): void;
  /** Default "Reset". */
  resetLabel?: string;
  /** Extra content under the sections. */
  children?: ReactNode;
}

/**
 * A filter drawer (e.g. "Filter W-Engines"): a Select (460) + SortToggle row, a 4 px divider, labelled
 * ChipGroup sections (2 columns, 262 × 41 chips) and the orange-disc Reset button in the footer.
 * Generic: the sort options and the sections are data.
 */
export function FilterDrawer({
  title = 'Filter W-Engines',
  icon,
  sort,
  groups,
  onReset,
  resetLabel = 'Reset',
  children,
  ...rest
}: FilterDrawerProps) {
  const { direction, defaultDirection, onDirectionChange, directionLabels, ...select } =
    sort ?? ({} as FilterDrawerSort);
  return (
    <Drawer
      {...rest}
      title={title}
      icon={icon ?? <FilterIcon />}
      footer={
        <Button width="wide" icon={<ResetIcon />} iconTone="reset" onClick={onReset}>
          {resetLabel}
        </Button>
      }
    >
      {sort ? (
        <>
          <div className="zzz-filter-drawer__sort">
            <Select aria-label="Sort by" {...(select as SelectProps)} />
            <SortToggle
              direction={direction}
              defaultDirection={defaultDirection}
              onDirectionChange={onDirectionChange}
              labels={directionLabels}
            />
          </div>
          <hr className="zzz-filter-drawer__divider" />
        </>
      ) : null}
      <div className="zzz-filter-drawer__groups" style={sort ? undefined : { marginTop: 0 }}>
        {groups.map(({ id, ...group }, i) => (
          <ChipGroup key={id ?? (typeof group.label === 'string' ? group.label : i)} {...group} />
        ))}
      </div>
      {children}
    </Drawer>
  );
}
