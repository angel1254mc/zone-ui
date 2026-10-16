import type { ComponentProps, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@angel1254mc/zone-ui';
import { isPlainClick } from './SweepNavigation';

/** The kit Button as an in-site link: a real `<a href>`, navigated client-side on a plain click. */
export function ButtonLink({ to, onClick, ...rest }: Omit<ComponentProps<typeof Button>, 'href'> & { to: string }) {
  const navigate = useNavigate();
  return (
    <Button
      {...rest}
      href={to}
      onClick={(e: MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
        onClick?.(e);
        if (!isPlainClick(e)) return;
        e.preventDefault();
        navigate(to);
      }}
    />
  );
}
