import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEventHandler, ReactNode } from 'react';
import { cx, useControllableState } from '../../utils';
import type { WebSkin } from '../WebTabs';
import './NavBar.css';

export interface NavBarItem {
  value: string;
  label: ReactNode;
  /** Renders a link; without it the item is a button (client-side routing via onValueChange). */
  href?: string;
  disabled?: boolean;
}

export interface NavBarCta {
  label: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export type NavBarCollapse = 'auto' | 'always' | 'never';

export interface NavBarProps extends Omit<ComponentPropsWithRef<'header'>, 'children' | 'defaultValue' | 'onChange'> {
  /** Logo slot (left). Wrap it in your own link if it should navigate. */
  logo?: ReactNode;
  items: readonly NavBarItem[];
  /** Active item (controlled): `aria-current="page"` + the white pill. */
  value?: string;
  /** Initial active item (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Call-to-action pill after the items (e.g. "Download Now"). */
  cta?: NavBarCta;
  /** Right-hand slot, e.g. circular icon buttons. */
  actions?: ReactNode;
  /** `web` (default): CTA static `#D8FA00`. `game`: CTA and menu bar in the live `--zzz-accent`. */
  skin?: WebSkin;
  /**
   * `auto` (default): the items fold into a menu button as soon as they no longer fit the bar
   * (measured with a ResizeObserver; the CTA stays in the bar), and the CTA folds too below
   * 900 px of bar width (container query). `always` / `never` force either layout.
   */
  collapse?: NavBarCollapse;
  /** Collapsed menu open (controlled). */
  menuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  /** Accessible name of the navigation landmark. Default `Main`. */
  navLabel?: string;
  /** Accessible name of the menu button. Default `Menu`. */
  menuLabel?: string;
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg className="zzz-navbar__menu-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path
          d="M4 6.5h16M4 12h16M4 17.5h11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * Site header: a 100 px black bar, logo left, 44 px nav pills (grey text; active/hover = white pill + scale
 * 1.12), a lime CTA pill and round icon actions. The items fold into a menu button when they
 * no longer fit (the CTA too below 900 px).
 */
export function NavBar({
  logo,
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  cta,
  actions,
  skin = 'web',
  collapse = 'auto',
  menuOpen: menuOpenProp,
  defaultMenuOpen = false,
  onMenuOpenChange,
  navLabel = 'Main',
  menuLabel = 'Menu',
  className,
  ref,
  ...rest
}: NavBarProps) {
  const [value, setValue] = useControllableState<string | undefined>(
    valueProp,
    defaultValue,
    onValueChange as (v: string | undefined) => void
  );
  const [menuOpen, setMenuOpen] = useControllableState(menuOpenProp, defaultMenuOpen, onMenuOpenChange);
  const menuId = `${useId().replace(/[^A-Za-z0-9_-]/g, '')}-menu`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);

  // Auto collapse: fold the items as soon as they overflow. While folded, the nav stays in the
  // flex row (visibility: hidden, flex 1 1 0), so scrollWidth is still the room it needs and
  // clientWidth plus the menu button's footprint (button + gap) the room it would get unfolded:
  // both states make the same decision, so the layout does not depend on resize history.
  // Observing the list too catches a --zzz-scale change without a container resize.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const list = listRef.current;
    if (collapse !== 'auto' || !nav || typeof ResizeObserver === 'undefined') {
      setOverflow(false);
      return;
    }
    const measure = () => {
      // display: none (CSS-collapsed below 900 px) measures 0 / 0 → not overflowing.
      const button = toggleRef.current;
      let room = nav.clientWidth;
      if (button && button.offsetWidth > 0) {
        const gap = parseFloat(getComputedStyle(nav.parentElement ?? nav).columnGap) || 0;
        room += button.offsetWidth + gap;
      }
      setOverflow(nav.scrollWidth > room + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    if (list) observer.observe(list);
    measure();
    return () => observer.disconnect();
  }, [collapse]);

  const renderItem = (item: NavBarItem, inMenu: boolean) => {
    const current = item.value === value;
    const common = {
      className: cx('zzz-navbar__link', 'zzz-focusable'),
      'aria-current': current ? ('page' as const) : undefined,
      'aria-disabled': item.disabled ? (true as const) : undefined,
      onClick: (event: { preventDefault: () => void }) => {
        if (item.disabled) {
          event.preventDefault();
          return;
        }
        setValue(item.value);
        if (inMenu) setMenuOpen(false);
      },
    };
    return (
      <li key={item.value} className="zzz-navbar__item">
        {item.href !== undefined ? (
          <a {...common} href={item.disabled ? undefined : item.href} role={item.disabled ? 'link' : undefined}>
            <span className="zzz-navbar__label">{item.label}</span>
          </a>
        ) : (
          <button {...common} type="button">
            <span className="zzz-navbar__label">{item.label}</span>
          </button>
        )}
      </li>
    );
  };

  const renderCta = (inMenu: boolean) => {
    if (!cta) return null;
    const common = {
      className: cx('zzz-navbar__cta', 'zzz-focusable'),
      onClick: (event: Parameters<MouseEventHandler<HTMLElement>>[0]) => {
        cta.onClick?.(event);
        if (inMenu) setMenuOpen(false);
      },
    };
    return cta.href !== undefined ? (
      <a {...common} href={cta.href}>
        <span className="zzz-navbar__label">{cta.label}</span>
      </a>
    ) : (
      <button {...common} type="button">
        <span className="zzz-navbar__label">{cta.label}</span>
      </button>
    );
  };

  const onMenuKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header
      ref={ref}
      className={cx('zzz-navbar', className)}
      data-skin={skin}
      data-collapse={collapse}
      data-overflow={overflow ? 'true' : undefined}
      {...rest}
    >
      <div className="zzz-navbar__inner">
        {logo != null && <div className="zzz-navbar__logo">{logo}</div>}
        <nav ref={navRef} className="zzz-navbar__nav" aria-label={navLabel}>
          <ul ref={listRef} role="list" className="zzz-navbar__links">
            {items.map((item) => renderItem(item, false))}
          </ul>
        </nav>
        {cta && <div className="zzz-navbar__cta-slot">{renderCta(false)}</div>}
        {actions != null && <div className="zzz-navbar__actions">{actions}</div>}
        <button
          ref={toggleRef}
          type="button"
          className="zzz-navbar__menu-button zzz-focusable"
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MenuGlyph open={menuOpen} />
        </button>
      </div>
      <div id={menuId} className="zzz-navbar__menu" hidden={!menuOpen} onKeyDown={onMenuKeyDown}>
        <nav aria-label={navLabel}>
          <ul role="list" className="zzz-navbar__menu-links">
            {items.map((item) => renderItem(item, true))}
          </ul>
        </nav>
        {cta && <div className="zzz-navbar__menu-cta">{renderCta(true)}</div>}
      </div>
    </header>
  );
}
