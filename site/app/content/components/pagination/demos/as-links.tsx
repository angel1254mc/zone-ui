import { Pagination } from '@angel1254mc/zone-ui';

export default function AsLinks() {
  return (
    <Pagination
      aria-label="Archive pages"
      count={9}
      defaultPage={4}
      getPageHref={(page) => `#page-${page}`}
      getPageLabel={(page) => `Archive page ${page}`}
    />
  );
}
