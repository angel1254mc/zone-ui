import { CopyButton } from '@angel1254mc/zone-ui';
import { useHighlightedLines } from '../lib/highlight';
import type { CodeLang } from '../lib/highlight';

export function CodeBlock({ code, lang = 'tsx', title }: { code: string; lang?: CodeLang; title?: string }) {
  const text = code.trim();
  const lines = useHighlightedLines(text, lang);
  const label = title ?? (lang === 'bash' ? 'Terminal' : 'TSX');
  return (
    <div className="d-code">
      <div className="d-code__bar">
        <span className="d-code__title">{label}</span>
        <CopyButton size="sm" width="auto" text={text} aria-label={`Copy ${label}`} />
      </div>
      <pre className="d-code__pre zzz-scrollbar" tabIndex={0} aria-label={label}>
        <code>
          {lines
            ? lines.map((line, i) => (
                <span key={i} className="d-code__line">
                  {line.map((t, j) => (
                    <span key={j} style={{ color: t.color }}>
                      {t.content}
                    </span>
                  ))}
                  {i < lines.length - 1 ? '\n' : null}
                </span>
              ))
            : text}
        </code>
      </pre>
    </div>
  );
}

/** `inline code` spans inside prose and docgen descriptions. */
export function Prose({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') && p.length > 1 ? (
          <code key={i} className="d-inline-code">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
