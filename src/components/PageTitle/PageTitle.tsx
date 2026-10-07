import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { cx } from '../../utils';
import { Text } from '../Text';
import './PageTitle.css';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'div' | 'span';

export interface PageTitleOwnProps {
  /** Element to render. Default `h1` (the screen's title). */
  as?: HeadingTag;
  children?: ReactNode;
  ref?: Ref<HTMLHeadingElement>;
}

export type PageTitleProps = PageTitleOwnProps & Omit<ComponentPropsWithoutRef<'h1'>, keyof PageTitleOwnProps>;

/**
 * Top-bar page title: plain upright `fontSize.title` text in
 * `color.text.title` (#C3C3C3, cap 25), 28 px after the Back button, e.g. "Manage Item".
 * It replaces the location pill.
 */
export function PageTitle({ as = 'h1', className, children, ref, ...rest }: PageTitleProps) {
  return (
    <Text {...rest} as={as} ref={ref} role="title" tone="title" className={cx('zzz-page-title', className)}>
      {children}
    </Text>
  );
}
