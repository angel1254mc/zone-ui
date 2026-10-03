import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import { cx } from '../../utils'
import { Keyword, Value } from '../Text'
import './EffectText.css'

/** Line pitch: `compact` 21.5 (side DETAIL panel), `paragraph` 26 (big / Overclock panel), `loose` 28 (equip). */
export type EffectTextDensity = 'compact' | 'paragraph' | 'loose'

export interface EffectTextOwnProps {
  /** Default `p`. */
  as?: 'p' | 'div' | 'span'
  /** Default `compact`. */
  density?: EffectTextDensity
  /**
   * `primary` (white body), `muted` (the grey "Next Phase" heading and next-phase paragraph; `<strong>`
   * inside it stays white, so changed words stand out). Default `primary`.
   */
  tone?: 'primary' | 'muted'
  /**
   * Plain-string alternative to `children` with a tiny markup: `{kw}Attack{/kw}` → `<Keyword>`,
   * `{val}3.5%{/val}` → `<Value>`, `{b}Basic Attack{/b}` → `<strong>`. Ignored when `children` is given.
   */
  markup?: string
  /** Paragraph content; use `<Keyword icon={…}>` and `<Value>` inline. */
  children?: ReactNode
  ref?: Ref<HTMLParagraphElement>
}

export type EffectTextProps = EffectTextOwnProps & Omit<ComponentPropsWithoutRef<'p'>, keyof EffectTextOwnProps>

const TOKEN = /\{(kw|val|b)\}([\s\S]*?)\{\/\1\}/g

/** Parse the `{kw}…{/kw}` / `{val}…{/val}` / `{b}…{/b}` markup into React nodes. */
export function parseEffectMarkup(markup: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of markup.matchAll(TOKEN)) {
    const at = m.index ?? 0
    if (at > last) out.push(markup.slice(last, at))
    const [, tag, text] = m
    if (tag === 'kw') out.push(<Keyword key={key++}>{text}</Keyword>)
    else if (tag === 'val') out.push(<Value key={key++}>{text}</Value>)
    else out.push(<strong key={key++}>{text}</strong>)
    last = at + m[0].length
  }
  if (last < markup.length) out.push(markup.slice(last))
  return out
}

/**
 * Effect paragraph: white `fontSize.body`, weight 900, upright. Inline `<Keyword>` is the
 * orange specialty name (its icon renders as the 23 × 20 grey glyph with a 6 px gap) and `<Value>`
 * the green number.
 */
export function EffectText({
  as: Tag = 'p',
  density = 'compact',
  tone = 'primary',
  markup,
  className,
  children,
  ref,
  ...rest
}: EffectTextProps) {
  const content = children ?? (markup != null ? parseEffectMarkup(markup) : null)
  return (
    <Tag
      {...rest}
      ref={ref as Ref<HTMLParagraphElement & HTMLDivElement & HTMLSpanElement>}
      className={cx('zzz-effect-text', `zzz-effect-text--${density}`, tone !== 'primary' && `zzz-effect-text--${tone}`, className)}
    >
      {content}
    </Tag>
  )
}
