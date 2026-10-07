import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { SiteFooter } from './index';

const social = [
  {
    label: 'Video channel',
    href: 'https://example.com/video',
    icon: <svg data-testid="i1" />,
  },
  {
    label: 'Community',
    href: 'https://example.com/community',
    icon: <svg data-testid="i2" />,
  },
];

describe('SiteFooter', () => {
  it('renders a contentinfo landmark with named social links, links and legal text', () => {
    render(
      <SiteFooter
        social={social}
        logo={<span>LOGO</span>}
        links={[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ]}
        legal="Copyright © Example. All Rights Reserved."
      />
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('zzz-site-footer');
    const socialList = within(footer).getByRole('list', {
      name: 'Social media',
    });
    const socialLinks = within(socialList).getAllByRole('link');
    expect(socialLinks.map((l) => l.getAttribute('aria-label'))).toEqual(['Video channel', 'Community']);
    expect(socialLinks[0]).toHaveAttribute('href', 'https://example.com/video');
    expect(within(footer).getByRole('navigation', { name: 'Legal' })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('LOGO')).toBeInTheDocument();
    expect(screen.getByText('Copyright © Example. All Rights Reserved.')).toBeInTheDocument();
    // icons are decorative
    expect(screen.getByTestId('i1').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('omits empty sections and renders children', () => {
    const { container } = render(
      <SiteFooter>
        <p>Extra</p>
      </SiteFooter>
    );
    expect(container.querySelector('.zzz-site-footer__social')).toBeNull();
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByText('Extra')).toBeInTheDocument();
  });

  it('opens external social links safely when asked, and passes props through', () => {
    const ref = createRef<HTMLElement>();
    render(
      <SiteFooter
        ref={ref}
        social={social}
        socialLabel="Follow us"
        linksLabel="Site"
        externalSocial
        className="extra"
        data-testid="f"
      />
    );
    const footer = screen.getByTestId('f');
    expect(ref.current).toBe(footer);
    expect(footer).toHaveClass('extra');
    const link = within(screen.getByRole('list', { name: 'Follow us' })).getAllByRole('link')[0];
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
