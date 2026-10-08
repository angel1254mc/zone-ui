import { Link } from 'react-router';
import pkg from '../../../../../package.json';
import { COMPONENT_TIERS, entriesOf, tierOf } from '../../../catalog';
import type { PageDoc } from '../../../types';
import { ButtonLink } from '../../../ui/ButtonLink';
import { IntroShowcase } from './IntroShowcase';

function TierCards() {
  const components = entriesOf('components');
  return (
    <ul className="d-tiers">
      {COMPONENT_TIERS.map((tier) => {
        const entries = components.filter((c) => c.tier === tier);
        return (
          <li key={tier} className="d-tier">
            <Link to={`/components#${tier}`} className="d-tier__link">
              <span className="d-tier__count">{entries.length}</span>
              <span className="d-tier__name">{tierOf(tier).label}</span>
              <span className="d-tier__blurb">{tierOf(tier).blurb}</span>
              <span className="d-tier__names">
                {entries
                  .slice(0, 6)
                  .map((c) => c.name)
                  .join(' · ')}
                {entries.length > 6 ? ' …' : ''}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Introduction() {
  const total = entriesOf('components').length;
  return (
    <>
      <header className="d-intro">
        <p className="d-eyebrow">
          <span className="d-eyebrow__tier">v{pkg.version}</span>
          <span className="d-eyebrow__pkg">@angel1254mc/zone-ui</span>
        </p>
        <h1 className="d-h1 d-h1--xl">Zone</h1>
        <p className="d-lede">
          A React UI kit inspired by Zenless Zone Zero, for game-flavoured web apps and sites. {total} components, built
          on one pulsing accent and a dark pill material.
        </p>
        <div className="d-intro__actions">
          <ButtonLink to="/docs/installation" width="compact">
            Get started
          </ButtonLink>
          <ButtonLink to="/components" width="auto">
            Browse components
          </ButtonLink>
        </div>
      </header>

      <section className="d-section" id="live">
        <h2 className="d-h2">Live</h2>
        <p className="d-muted">Everything here is interactive: switch tabs, pick an answer, let the timer run out.</p>
        <div className="d-showcase">
          <IntroShowcase />
        </div>
      </section>

      <section className="d-section" id="tiers">
        <h2 className="d-h2">Browse by tier</h2>
        <TierCards />
      </section>

      <section className="d-section d-prose" id="good-to-know">
        <h2 className="d-h2">Good to know</h2>
        <p>
          <b>No hover state.</b> The core controls behave like a game menu: they answer to press and focus, not to the
          pointer passing over them. Web components such as the nav bar and links add hover where it helps.
        </p>
        <p>
          <b>One accent.</b> Selected, active and pressed elements share a single accent that pulses from lime to
          yellow. <Link to="/docs/theming">Theming</Link> shows how to pin or freeze it.
        </p>
        <p>
          <b>Fonts.</b> The display face the kit is designed around, Inpin Hongmeng, is a commercial font and is not
          included. Mona Sans (SIL OFL) stands in for it and loads from <code>fonts.css</code>; a licensed copy takes
          over automatically when you self-host it.
        </p>
        <p>
          <b>Fan project.</b> Zone is unofficial and not affiliated with HoYoverse. Zenless Zone Zero and its art are ©
          HoYoverse.
        </p>
      </section>
    </>
  );
}

const page: PageDoc = { Body: Introduction, ownHeader: true, wide: true };

export default page;
