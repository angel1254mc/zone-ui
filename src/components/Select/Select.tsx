import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithRef, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { cx, mergeRefs, useControllableState } from '../../utils';
import { CaretDownIcon } from '../../icons';
import { Text } from '../Text';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Control size. sm / md / lg sit on the shared control heights 46 / 57 / 69 design units (≈ 32 / 40 / 48 CSS px
 * at the default 0.7 scale), like TextField and Button; sm / lg scale every length by 46/57 and 69/57.
 * `drawer` is the compact drawer select (460 × 53, md proportions), opt-in for filter drawers and game-style scenes.
 */
export type SelectSize = 'sm' | 'md' | 'lg' | 'drawer';

export interface SelectProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  options: SelectOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  onValueChange?(value: string): void;
  /** Shown (muted) while nothing is selected. */
  placeholder?: ReactNode;
  /**
   * Control size (default `md`). Trigger height is `size.control.{sm,md,lg}` (46 / 57 / 69 units, the same
   * as TextField / Button); padding, caret, value text, ring, pressed outset and the open list (item height,
   * radius, padding) scale by the control-size ratio (sm 46/57, lg 69/57). `drawer` = the compact drawer
   * select, 53 units tall with md proportions (opt-in).
   */
  size?: SelectSize;
  /**
   * Trigger width in design units. Default 460 (`size.control.selectWidth`) scaled to `size`; an
   * explicit number is literal (not size-scaled). `'fill'` = 100% of the parent (responsive forms).
   */
  width?: number | 'fill';
  disabled?: boolean;
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  /** Form field name: renders a hidden input carrying the value. */
  name?: string;
  /** Force the trigger's pressed look (visual tests). */
  pressed?: boolean;
}

const TYPEAHEAD_MS = 500;

/**
 * Dropdown select: a 460-wide dark pill with the value in italic
 * `fontSize.bodyLg` 31 px from the left and a 15 × 14 white caret 15 px from the right. Its height follows
 * the web control scale (md 57 units ≈ 40 CSS px at 0.7, matching TextField); `size="drawer"` gives the
 * compact 53-unit drawer height.
 *
 * The open list is a dotted dark popover
 * under the trigger, 48 px items, the selected item on the live accent with a black label.
 *
 * Accessibility: WAI-ARIA select-only combobox. Enter / Space / ↓ / ↑ open; ↑ ↓ Home End move
 * the active option; Enter / Space pick; Escape closes; typing jumps to a matching option
 * (while closed it selects it, like a native select). `aria-label` / `aria-labelledby` /
 * `aria-describedby` go to the combobox; other props go to the root wrapper.
 */
export function Select({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  size = 'md',
  width,
  disabled = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  pressed,
  id,
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SelectProps) {
  const [value, setValue] = useControllableState<string | undefined>(
    valueProp,
    defaultValue,
    onValueChange as (v: string | undefined) => void
  );
  const [open, setOpenState] = useControllableState(openProp, defaultOpen, onOpenChange);
  const autoId = useId();
  const baseId = id ?? `zzz-select${autoId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const listId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({
    buffer: '',
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const [activeIndex, setActiveIndex] = useState(-1);

  const enabledIndices = useMemo(() => options.flatMap((o, i) => (o.disabled ? [] : [i])), [options]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next && disabled) return;
      // A new list session starts a new type-ahead search.
      clearTimeout(typeahead.current.timer);
      typeahead.current.buffer = '';
      setOpenState(next);
    },
    [disabled, setOpenState]
  );

  const openList = (index?: number) => {
    const start =
      index ?? (selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : (enabledIndices[0] ?? -1));
    setActiveIndex(start);
    setOpen(true);
  };

  const pick = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setValue(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Keep an active option while open (also when opened via the controlled `open` prop).
  useEffect(() => {
    if (open && activeIndex < 0) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1));
    }
    if (!open) setActiveIndex(-1);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll the active option into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = document.getElementById(optionId(activeIndex));
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on an outside pointer down.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent | MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, setOpen]);

  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  const move = (from: number, delta: 1 | -1) => {
    if (enabledIndices.length === 0) return -1;
    const pos = enabledIndices.indexOf(from);
    if (pos < 0) return delta > 0 ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1];
    const next = Math.min(enabledIndices.length - 1, Math.max(0, pos + delta));
    return enabledIndices[next];
  };

  const findByText = (char: string, from: number) => {
    const t = typeahead.current;
    clearTimeout(t.timer);
    t.buffer += char.toLowerCase();
    t.timer = setTimeout(() => (t.buffer = ''), TYPEAHEAD_MS);
    const repeated = t.buffer.split('').every((c) => c === t.buffer[0]);
    const query = repeated ? t.buffer[0] : t.buffer;
    const n = options.length;
    // A fresh (or repeated-char) search starts after the current option; a longer query can match it.
    const offset = repeated || t.buffer.length === 1 ? 1 : 0;
    for (let k = 0; k < n; k++) {
      const i = (Math.max(from, 0) + offset + k) % n;
      const o = options[i];
      if (!o.disabled && o.label.toLowerCase().startsWith(query)) return i;
    }
    return -1;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { key } = event;
    const printable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        openList();
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        openList(key === 'Home' ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1]);
      } else if (printable) {
        const i = findByText(key, selectedIndex);
        if (i >= 0) setValue(options[i].value);
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey) break;
        setActiveIndex((i) => move(i, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) {
          pick(activeIndex);
          break;
        }
        setActiveIndex((i) => move(i, -1));
        break;
      case 'Home':
      case 'PageUp':
        event.preventDefault();
        setActiveIndex(enabledIndices[0] ?? -1);
        break;
      case 'End':
      case 'PageDown':
        event.preventDefault();
        setActiveIndex(enabledIndices[enabledIndices.length - 1] ?? -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0) pick(activeIndex);
        else setOpen(false);
        break;
      case ' ':
        event.preventDefault();
        if (typeahead.current.buffer) findAndActivate(' ');
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (printable) {
          event.preventDefault();
          findAndActivate(key);
        }
    }
  };

  const findAndActivate = (char: string) => {
    const i = findByText(char, activeIndex);
    if (i >= 0) setActiveIndex(i);
  };

  const rootStyle =
    width != null
      ? ({
          '--zzz-select-width': width === 'fill' ? '100%' : `calc(${width} * var(--zzz-px))`,
          ...style,
        } as CSSProperties)
      : style;

  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      className={cx('zzz-select', className)}
      style={rootStyle}
      data-size={size}
      data-open={open ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...rest}
    >
      <div
        ref={triggerRef}
        id={baseId}
        role="combobox"
        tabIndex={disabled ? undefined : 0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-disabled={disabled || undefined}
        data-pressed={pressed ? '' : undefined}
        className="zzz-select__trigger zzz-mat-pill zzz-pressable zzz-focusable"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
      >
        <span className="zzz-select__value">
          <Text role="bodyLg" italic tone={selected ? undefined : 'muted'}>
            {selected ? selected.label : placeholder}
          </Text>
        </span>
        <CaretDownIcon className="zzz-select__caret" preserveAspectRatio="none" />
      </div>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={ariaLabelledBy ?? baseId}
          className="zzz-select__list zzz-mat-pill"
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={optionId(i)}
              role="option"
              aria-selected={i === selectedIndex}
              aria-disabled={option.disabled || undefined}
              data-active={i === activeIndex ? '' : undefined}
              className="zzz-select__option"
              onPointerDown={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
              onPointerMove={() => !option.disabled && setActiveIndex(i)}
              onClick={() => pick(i)}
            >
              <Text role="bodyLg" italic>
                {option.label}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}
      {name != null ? <input type="hidden" name={name} value={value ?? ''} /> : null}
    </div>
  );
}
