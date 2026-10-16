import { createContext, useContext } from 'react';

export type TableAlign = 'start' | 'center' | 'end';
export type SortDirection = 'ascending' | 'descending';
/** `medium` rows are 57 design units tall (the md control height), `small` rows 46. */
export type TableSize = 'medium' | 'small';
/** A number is design units; a string is any CSS length (`'20%'`, `'12rem'`, `'min(70dvh, 640px)'`). */
export type TableLength = number | string;
/** How a cell handles text longer than its column. */
export type TableCellOverflow = 'nowrap' | 'truncate' | 'wrap';

export function toLength(value: TableLength | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? `calc(${value} * var(--zzz-px))` : value;
}

/** Set by TableContainer: whether its height is fixed or capped (the body then scrolls). */
export const TableContainerContext = createContext<{ bounded: 'height' | 'max' | null } | null>(null);
export const useTableContainer = () => useContext(TableContainerContext);

/** Which part of the table a cell sits in; head cells render as column headers. */
export type TableSection = 'head' | 'body' | 'footer';
export const TableSectionContext = createContext<TableSection | null>(null);
export const useTableSection = () => useContext(TableSectionContext);
