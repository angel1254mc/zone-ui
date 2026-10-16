import { CategoryTag } from '@angel1254mc/zone-ui';

const posts = [
  { date: '2026-09-30', category: 'Events', title: 'Night Market Festival starts this week' },
  { date: '2026-09-26', category: 'Notices', title: 'Server maintenance on October 2' },
  { date: '2026-09-18', category: 'News', title: 'Version 2.3 preview program recap' },
];

export default function NewsList() {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 4,
        width: '100%',
        maxWidth: 560,
        margin: 0,
        padding: 8,
        listStyle: 'none',
        borderRadius: 16,
        background: '#efefef',
        color: '#222',
      }}
    >
      {posts.map((post) => (
        <li key={post.title} style={{ display: 'grid', gap: 6, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <time dateTime={post.date} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {post.date.split('-').join('/')}
            </time>
            <CategoryTag>{post.category}</CategoryTag>
          </div>
          <a href="#news" style={{ color: 'inherit', fontWeight: 800, textDecoration: 'none' }}>
            {post.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
