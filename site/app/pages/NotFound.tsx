import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="d-page">
      <article className="d-article">
        <header className="d-head" data-not-found="">
          <p className="d-eyebrow">
            <span className="d-eyebrow__tier">404</span>
          </p>
          <h1 className="d-h1">Page not found</h1>
          <p className="d-lede">
            Nothing lives at this address. Try the search, browse <Link to="/components">all components</Link>, or start
            from the <Link to="/">introduction</Link>.
          </p>
        </header>
      </article>
    </div>
  );
}
