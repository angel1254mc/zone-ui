import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils'
import './SiteFooter.css'

export interface SiteFooterSocial {
  /** Accessible name (the icon itself is decorative). */
  label: string
  href: string
  /** Icon slot, drawn in a 34 px box in the 64 px cell (use currentColor). */
  icon: ReactNode
}

export interface SiteFooterLink {
  label: ReactNode
  href: string
}

export interface SiteFooterProps extends ComponentPropsWithRef<'footer'> {
  /** Social icon cells, right-aligned in the 64 px top band. */
  social?: readonly SiteFooterSocial[]
  /** Open social links in a new tab (`target="_blank"` + `rel="noopener noreferrer"`). */
  externalSocial?: boolean
  /** Accessible name of the social list. Default `Social media`. */
  socialLabel?: string
  /** Logo slot, centred. */
  logo?: ReactNode
  /** Legal / policy links row. */
  links?: readonly SiteFooterLink[]
  /** Accessible name of the links navigation. Default `Legal`. */
  linksLabel?: string
  /** Legal text (copyright, trademarks), centred `tiny`. */
  legal?: ReactNode
  /** Extra content between the links and the legal text (ratings, language picker…). */
  children?: ReactNode
}

/**
 * Site footer: a #111 social band 64 tall with 64 px icon cells and a 2 px #1A1A1A rule, then a black body
 * with centred logo, policy links and legal text.
 */
export function SiteFooter({
  social,
  externalSocial = false,
  socialLabel = 'Social media',
  logo,
  links,
  linksLabel = 'Legal',
  legal,
  children,
  className,
  ...rest
}: SiteFooterProps) {
  return (
    <footer className={cx('zzz-site-footer', className)} {...rest}>
      {social && social.length > 0 && (
        <div className="zzz-site-footer__social">
          <ul role="list" className="zzz-site-footer__social-list" aria-label={socialLabel}>
            {social.map((s) => (
              <li key={s.href} className="zzz-site-footer__social-item">
                <a
                  className="zzz-site-footer__social-link zzz-focusable"
                  href={s.href}
                  aria-label={s.label}
                  target={externalSocial ? '_blank' : undefined}
                  rel={externalSocial ? 'noopener noreferrer' : undefined}
                >
                  <span className="zzz-site-footer__social-icon" aria-hidden="true">
                    {s.icon}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="zzz-site-footer__body">
        {logo != null && <div className="zzz-site-footer__logo">{logo}</div>}
        {links && links.length > 0 && (
          <nav aria-label={linksLabel}>
            <ul role="list" className="zzz-site-footer__links">
              {links.map((l) => (
                <li key={l.href}>
                  <a className="zzz-site-footer__link zzz-focusable" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {children}
        {legal != null && <div className="zzz-site-footer__legal">{legal}</div>}
      </div>
    </footer>
  )
}
