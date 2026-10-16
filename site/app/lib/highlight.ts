// Shiki, fine-grained: the core, the JavaScript regex engine and two grammars (tsx, bash), loaded on first
// use as a separate chunk. Code renders as plain text until the highlighter is ready, then in colour.
import { useEffect, useMemo, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

export type CodeLang = 'tsx' | 'bash';

export interface CodeToken {
  content: string;
  color?: string;
}

let loaded: HighlighterCore | null = null;
let loading: Promise<HighlighterCore> | null = null;

export function loadHighlighter(): Promise<HighlighterCore> {
  loading ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript'), import('./zoneTheme')]).then(
    async ([core, engine, theme]) => {
      loaded = await core.createHighlighterCore({
        themes: [theme.zoneTheme],
        langs: [import('shiki/langs/tsx.mjs'), import('shiki/langs/bash.mjs')],
        engine: engine.createJavaScriptRegexEngine(),
      });
      return loaded;
    }
  );
  return loading;
}

/** Token lines for `code`, or null while the highlighter loads. */
export function useHighlightedLines(code: string, lang: CodeLang): CodeToken[][] | null {
  const [highlighter, setHighlighter] = useState(loaded);
  useEffect(() => {
    if (highlighter) return;
    let live = true;
    loadHighlighter().then(
      (h) => live && setHighlighter(h),
      () => {}
    );
    return () => {
      live = false;
    };
  }, [highlighter]);
  return useMemo(
    () =>
      highlighter
        ? highlighter
            .codeToTokens(code, { lang, theme: 'zone' })
            .tokens.map((line) => line.map((t) => ({ content: t.content, color: t.color })))
        : null,
    [highlighter, code, lang]
  );
}
