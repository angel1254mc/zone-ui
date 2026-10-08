import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useControllableState } from '../../utils';

/** Minimal item shape shared by SegmentedTabs and IconTabs. */
export interface TabListItem {
  value: string;
  disabled?: boolean;
  /** id of the tabpanel this tab controls (`aria-controls`). Defaults to `<id>-panel-<value>` when the list has an `id`. */
  panelId?: string;
}

const safe = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, '_');

/** DOM id of a tab inside a tab list with id `tabsId`. */
export const getTabId = (tabsId: string, value: string) => `${tabsId}-tab-${safe(value)}`;
/** DOM id of the tabpanel for `value` inside a tab list with id `tabsId`. */
export const getTabPanelId = (tabsId: string, value: string) => `${tabsId}-panel-${safe(value)}`;

export interface UseTabListOptions<T extends TabListItem> {
  items: readonly T[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Explicit list id: enables tab ids + default aria-controls wiring. */
  id?: string;
  /** Force the pressed look on this tab (docs / visual tests). */
  pressed?: string;
}

/**
 * Tablist behaviour (WAI-ARIA tabs pattern, automatic activation): roving tabindex, ←/→ (wrapping,
 * skipping disabled), Home/End, click to select, and the pressed-inactive-tab state
 * (pointer held on a tab that is not selected), released on any pointer-up.
 */
export function useTabList<T extends TabListItem>({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  id,
  pressed: forcedPressed,
}: UseTabListOptions<T>) {
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '';
  const [value, setValue] = useControllableState<string>(valueProp, defaultValue ?? firstEnabled, onValueChange);
  const autoId = useId();
  const baseId = id ?? `zzz-tabs${autoId.replace(/[^A-Za-z0-9_-]/g, '')}`;
  const tabRefs = useRef(new Map<string, HTMLElement>());
  const [pointerPressed, setPointerPressed] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (pointerPressed === undefined) return;
    const release = () => setPointerPressed(undefined);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
    };
  }, [pointerPressed]);

  const selectedIndex = items.findIndex((item) => item.value === value);
  const selectedEnabled = selectedIndex >= 0 && !items[selectedIndex].disabled;
  const tabStopValue = selectedEnabled ? value : firstEnabled;

  const pressedValue = forcedPressed ?? pointerPressed;
  const pressedIsInactive = pressedValue !== undefined && pressedValue !== value;

  const select = useCallback(
    (next: string, focus: boolean) => {
      setValue(next);
      if (focus) tabRefs.current.get(next)?.focus();
    },
    [setValue]
  );

  const move = (from: number, step: 1 | -1) => {
    const n = items.length;
    for (let k = 1; k <= n; k++) {
      const candidate = items[(from + step * k + n * k) % n];
      if (!candidate.disabled) return candidate.value;
    }
    return undefined;
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLElement>) => {
    let next: string | undefined;
    switch (event.key) {
      case 'ArrowRight':
        next = move(index, 1);
        break;
      case 'ArrowLeft':
        next = move(index, -1);
        break;
      case 'Home':
        next = items.find((item) => !item.disabled)?.value;
        break;
      case 'End':
        next = [...items].reverse().find((item) => !item.disabled)?.value;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next !== undefined) select(next, true);
  };

  const getTabProps = (item: T, index: number) => {
    const selected = item.value === value;
    const controls = item.panelId ?? (id !== undefined ? getTabPanelId(id, item.value) : undefined);
    const isPressed = pressedValue === item.value && !selected && !item.disabled;
    return {
      role: 'tab' as const,
      type: 'button' as const,
      id: getTabId(baseId, item.value),
      'aria-selected': selected,
      'aria-controls': controls,
      'aria-disabled': item.disabled ? (true as const) : undefined,
      tabIndex: item.value === tabStopValue ? 0 : -1,
      'data-pressed': isPressed ? '' : undefined,
      ref: (el: HTMLElement | null) => {
        if (el) tabRefs.current.set(item.value, el);
        else tabRefs.current.delete(item.value);
      },
      onKeyDown: onKeyDown(index),
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (event.button !== 0 || item.disabled || selected) return;
        setPointerPressed(item.value);
      },
      onClick: () => {
        if (item.disabled) return;
        select(item.value, false);
      },
    };
  };

  return { value, selectedIndex, getTabProps, pressedIsInactive, baseId };
}
