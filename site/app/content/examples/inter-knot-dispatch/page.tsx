import { useLayoutEffect, useRef, useState } from 'react';
import type { MouseEvent, RefObject } from 'react';
import { Link } from 'react-router';
import {
  Button,
  ChevronRightIcon,
  EventTitle,
  GraffitiLayer,
  HatchBackground,
  NavBar,
  SegmentedTabs,
  WebTabs,
} from '@angel1254mc/zone-ui';
import { InterKnotDispatchPage } from '../../../../../examples/pages/InterKnotDispatch';
import type { PageDoc } from '../../../types';
import { CodeBlock } from '../../../ui/CodeBlock';
import { Related } from '../../../ui/Related';
import './example.css';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const WIDTHS = [
  { value: 'full', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'phone', label: 'Phone' },
];

const BUILT_FROM = [
  'navbar',
  'event-title',
  'button',
  'web-tabs',
  'news-card',
  'category-tag',
  'badges',
  'pagination',
  'scroll-area',
  'panel',
  'text-field',
  'checkbox',
  'inline-error',
  'toast',
  'accordion',
  'site-footer',
];

/**
 * The preview sits inside a docs page that already has its h1: demote the app's headings one level
 * (aria-level) so the page keeps a single top-level heading. Re-applied as the app renders new screens.
 */
function useEmbeddedHeadings(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const demote = () => {
      for (const h of root.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')) {
        if (!h.hasAttribute('aria-level')) h.setAttribute('aria-level', String(Math.min(6, Number(h.tagName[1]) + 1)));
      }
    };
    demote();
    const observer = new MutationObserver(demote);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [ref]);
}

/** The nearest ancestor of `el` (inside `root`) that scrolls vertically. */
function scrollerOf(el: HTMLElement, root: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p && root.contains(p); p = p.parentElement) {
    const { overflowY } = getComputedStyle(p);
    if ((overflowY === 'auto' || overflowY === 'scroll') && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

/**
 * In-page links inside the preview (`#ikd-news`) scroll the site's own scroller instead of the docs page,
 * leave the docs URL alone and move focus to the target, as a real page would.
 */
function onPreviewClick(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;
  const root = event.currentTarget;
  const href = (event.target as Element).closest('a')?.getAttribute('href');
  if (!href?.startsWith('#')) return;
  event.preventDefault();
  const target = href.length > 1 ? root.querySelector<HTMLElement>(`[id="${CSS.escape(href.slice(1))}"]`) : null;
  const scroller = target && scrollerOf(target, root);
  if (!target || !scroller) return;
  const pad = parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 0;
  scroller.scrollTo({
    top: target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - pad,
  });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** The live site in a bounded viewport (it scrolls inside its own scroller), with a width switch. */
function Preview() {
  const [width, setWidth] = useState('full');
  const viewport = useRef<HTMLDivElement>(null);
  useEmbeddedHeadings(viewport);
  return (
    <div className="ikx-preview">
      <div className="ikx-preview__bar">
        <SegmentedTabs size="sm" items={WIDTHS} value={width} onValueChange={setWidth} aria-label="Preview width" />
        <p className="ikx-preview__note">Scroll inside the preview.</p>
      </div>
      <div className="ikx-preview__stage">
        <div
          ref={viewport}
          className="ikx-preview__viewport"
          data-width={width}
          role="region"
          aria-label="Inter-Knot Dispatch, live preview"
          onClick={onPreviewClick}
        >
          <InterKnotDispatchPage height="100%" />
        </div>
      </div>
    </div>
  );
}

function InterKnotDispatch() {
  return (
    <>
      <Preview />

      <section className="d-section d-prose" id="what-it-shows">
        <h2 className="d-h2">What it shows</h2>
        <p>
          A fan news website in the kit&apos;s web style. It works from 390 px phones to wide desktops: the density
          stays the same and container queries change the gutters, columns and stacking. Switch the preview width to see
          the tablet and phone layouts.
        </p>
        <ul className="d-note__list ikx-points">
          <li>
            <b>Header.</b> A nav bar with the logo, section links and a Download call to action. On narrow screens the
            links fold into a menu.
          </li>
          <li>
            <b>Hero.</b> A black band with drifting graffiti, an event title, Download and Trailer buttons and full-body
            character art.
          </li>
          <li>
            <b>News.</b> Web tabs filter a grid of news cards with category tags and NEW badges. Pagination moves
            through the pages.
          </li>
          <li>
            <b>Agents.</b> A horizontal scroll area of characters next to the selected one&apos;s details.
          </li>
          <li>
            <b>Newsletter.</b> A form in a panel with a text field and a consent checkbox. Invalid input shows inline
            errors and moves focus back to the field; a valid one confirms with a toast.
          </li>
          <li>
            <b>FAQ and footer.</b> An accordion of questions, then the site footer with links and social buttons.
          </li>
        </ul>
      </section>

      <section className="d-section" id="built-from">
        <h2 className="d-h2">Built from</h2>
        <div className="d-prose">
          <p>
            Only kit components, over the <Link to="/docs/backgrounds">hatch and graffiti backgrounds</Link>, with the{' '}
            <Link to="/docs/icons">icons</Link> and <Link to="/docs/theming">ZzzTheme</Link>.
          </p>
        </div>
        <Related slugs={BUILT_FROM} />
      </section>

      <section className="d-section d-prose" id="source">
        <h2 className="d-h2">Source</h2>
        <p>
          The site lives in <code>examples/pages/InterKnotDispatch</code> in the repository. The page scrolls inside its
          own scroller, <code>100dvh</code> tall by default. Pass <code>height="auto"</code> to let the document scroll
          instead.
        </p>
        <CodeBlock
          code={`<InterKnotDispatchPage
  skin="web"                     // flat web skin; default "game" (live accent)
  initialTab="news"
  height="auto"
  onSubscribe={(email) => save(email)}
/>`}
        />
      </section>
    </>
  );
}

/** Gallery card: the site header and hero band, built from the same components. */
function Thumbnail() {
  return (
    <div
      style={{
        position: 'relative',
        width: u(1120),
        overflow: 'hidden',
        borderRadius: u(16),
        background: '#000',
      }}
    >
      <HatchBackground />
      <div style={{ position: 'relative' }}>
        <NavBar
          collapse="never"
          logo={
            <strong style={{ fontWeight: 900, fontStretch: '125%', fontSize: u(34), whiteSpace: 'nowrap' }}>
              INTER-KNOT
            </strong>
          }
          defaultValue="news"
          items={[
            { value: 'home', label: 'Home', href: '#home' },
            { value: 'news', label: 'News', href: '#news' },
            { value: 'agents', label: 'Agents', href: '#agents' },
            { value: 'faq', label: 'FAQ', href: '#faq' },
          ]}
          cta={{ label: 'Download', href: '#download' }}
        />
        <div
          style={{
            position: 'relative',
            height: u(250),
            marginTop: u(24),
            overflow: 'hidden',
            background: 'var(--zzz-color-surface-dialog-band)',
          }}
        >
          <GraffitiLayer variant="dialog" />
          <div
            style={{
              position: 'relative',
              display: 'grid',
              alignContent: 'center',
              justifyItems: 'start',
              gap: u(26),
              height: '100%',
              padding: `0 ${u(56)}`,
            }}
          >
            <EventTitle as="h2" align="start" size={52}>
              Dispatch Weekly
            </EventTitle>
            <div style={{ display: 'flex', gap: u(20) }}>
              <Button width="auto" icon={<ChevronRightIcon />}>
                Download
              </Button>
              <Button width="auto">Trailer</Button>
            </div>
          </div>
        </div>
        <div style={{ padding: `${u(28)} ${u(56)} ${u(32)}` }}>
          <WebTabs
            skin="game"
            aria-label="News categories"
            defaultValue="all"
            items={[
              { value: 'all', label: 'All' },
              { value: 'news', label: 'News' },
              { value: 'notices', label: 'Notices' },
              { value: 'events', label: 'Events' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

const page: PageDoc = {
  Body: InterKnotDispatch,
  wide: true,
  thumbnail: Thumbnail,
  thumbnailScale: 0.3,
};

export default page;
