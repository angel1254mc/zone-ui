// Kit styles the way a production app loads them: fonts, then the foundations, then every component's CSS
// (via the package entry). tokens.css and base.css are imported explicitly because a production build drops
// the package entry's own side-effect imports of them.
import '../../../src/styles/fonts.css';
import '../../../src/styles/tokens.css';
import '../../../src/styles/base.css';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Button, Drawer, ZzzTheme } from '@angel1254mc/zone-ui';
import '../styles/docs.css';
import { sectionOfPath } from '../lib/nav';
import { Header } from '../ui/Header';
import { Sidebar, sectionLabel } from '../ui/Sidebar';
import { SweepNavigation } from '../ui/SweepNavigation';

function MenuGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M3 5.5h18v2.6H3zM3 10.7h18v2.6H3zM3 15.9h12v2.6H3z" />
    </svg>
  );
}

/**
 * Header on top; the current section's sidebar beside the page. Below 960 px the sidebar opens from Browse.
 * The Get started links play a Sweep Transition, mounted here so it outlives the route it leaves.
 */
export default function Shell() {
  const { pathname } = useLocation();
  const section = sectionOfPath(pathname);
  const [browseOpen, setBrowseOpen] = useState(false);
  const label = sectionLabel(section);

  return (
    <ZzzTheme className="d-app">
      <SweepNavigation>
        <a href="#main" className="d-skip">
          Skip to content
        </a>
        <Header section={section} />
        <div className="d-shell">
          <div className="d-shell__side zzz-scrollbar">
            <Sidebar section={section} />
          </div>
          <main className="d-shell__main" id="main" tabIndex={-1}>
            <div className="d-browse">
              <Button size="sm" width="auto" icon={<MenuGlyph />} onClick={() => setBrowseOpen(true)}>
                Browse {label.toLowerCase()}
              </Button>
            </div>
            <Outlet />
          </main>
        </div>
        <Drawer title={label} open={browseOpen} onOpenChange={setBrowseOpen} width={460}>
          <Sidebar section={section} onNavigate={() => setBrowseOpen(false)} />
        </Drawer>
      </SweepNavigation>
    </ZzzTheme>
  );
}
