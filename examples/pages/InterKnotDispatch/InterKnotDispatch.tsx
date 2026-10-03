/**
 * Example page — "Inter-Knot Dispatch": an original ZZZ-style fan news website
 * built only from zone-ui. Responsive (390 → 1440+), NOT inside a Stage: the kit keeps the web
 * default density (inherited --zzz-scale, 0.7) at every width; container queries change the layout.
 *
 * NavBar (wordmark, nav, accent Download CTA) · hero band in the DialogBand look (black band,
 * 4 px edge lines, drifting graffiti, EventTitle, Download / Trailer buttons, full-body agent art)
 * · WebTabs filtering a NewsCard grid (Inter-Knot namecards / agent busts, CategoryTag, NEW!) + Pagination · featured agents
 * (horizontal ScrollArea roster + detail) · newsletter form in a Panel (TextField, Checkbox, Button) → Toast ·
 * Accordion FAQ · SiteFooter, over HatchBackground in a .zzz-scrollbar scroller.
 */
import { useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  Accordion,
  AccordionItem,
  Button,
  CheckIcon,
  Checkbox,
  EventTitle,
  GraffitiLayer,
  HatchBackground,
  InlineError,
  NavBar,
  NewBadge,
  NewsCard,
  Pagination,
  Panel,
  ScrollArea,
  SiteFooter,
  TextField,
  ToastProvider,
  WebTabs,
  ZzzTheme,
  getTabId,
  useToast,
  type WebSkin,
} from '@angel1254mc/zone-ui'
import { AgentImage, NamecardImage, useGameArt } from '../../art'
import {
  DispatchLogo,
  DownloadGlyph,
  ElementGlyph,
  SpecialtyGlyph,
  MailGlyph,
  PlayGlyph,
  SocialChat,
  SocialFeed,
  SocialPhoto,
  SocialVideo,
} from './Art'
import {
  CATEGORY_LABEL,
  FAQ,
  FEATURED_AGENTS,
  HERO_AGENT_ID,
  NEWS_TABS,
  PAGE_SIZE,
  filterPosts,
  isValidEmail,
  type NewsPost,
  type NewsTab,
} from './data'
import './InterKnotDispatch.css'

export interface InterKnotDispatchPageProps {
  /** News tab shown first. Default `all`. */
  initialTab?: NewsTab
  /** News page shown first (1-based). Default 1. */
  initialPage?: number
  /** Skin of the web components (NavBar, WebTabs, Pagination, CategoryTag). Default `game` (live accent). */
  skin?: WebSkin
  /**
   * Height of the page's own scroller (`.zzz-scrollbar`). Default `100dvh`; `auto` lets the
   * document scroll instead (e.g. full-page captures).
   */
  height?: CSSProperties['height']
  onDownload?: () => void
  onTrailer?: () => void
  /** Called with the email after a valid newsletter submission. */
  onSubscribe?: (email: string) => void
  className?: string
  style?: CSSProperties
}

const NAV_ITEMS = [
  { value: 'home', label: 'Home', href: '#ikd-top' },
  { value: 'news', label: 'News', href: '#ikd-news' },
  { value: 'agents', label: 'Agents', href: '#ikd-agents' },
  { value: 'newsletter', label: 'Newsletter', href: '#ikd-newsletter' },
  { value: 'faq', label: 'FAQ', href: '#ikd-faq' },
]

const SOCIAL = [
  { label: 'Video channel', href: '#video', icon: <SocialVideo /> },
  { label: 'Community chat', href: '#chat', icon: <SocialChat /> },
  { label: 'Photo feed', href: '#photos', icon: <SocialPhoto /> },
  { label: 'RSS feed', href: '#rss', icon: <SocialFeed /> },
]

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Use', href: '#terms' },
  { label: 'Contact', href: '#contact' },
  { label: 'Press Kit', href: '#press' },
]

/** Section heading: accent index, italic title and a condensed watermark word behind it. */
function SectionHeading({ id, index, watermark, children }: { id: string; index: string; watermark: string; children: ReactNode }) {
  return (
    <div className="ikd-heading">
      <span className="ikd-heading__mark" aria-hidden="true">
        {watermark}
      </span>
      <span className="ikd-heading__index" aria-hidden="true">
        {index}
      </span>
      <h2 id={id} className="ikd-heading__title">
        <span className="zzz-italic">{children}</span>
      </h2>
    </div>
  )
}

/** News banner: real art only (a neutral skeleton while loading, an empty frame when missing). */
function PostArt({ post }: { post: NewsPost }) {
  return post.art.kind === 'agent' ? (
    <AgentImage crop="crop" id={post.art.agentId} alt="" fit="cover" position="50% 28%" />
  ) : (
    <NamecardImage id={post.art.id} alt="" fit="cover" position={post.art.position} />
  )
}

function Hero({ onDownload, onTrailer }: Pick<InterKnotDispatchPageProps, 'onDownload' | 'onTrailer'>) {
  return (
    <section className="ikd-hero" aria-labelledby="ikd-hero-title" id="ikd-top">
      <div className="ikd-hero__band">
        <GraffitiLayer variant="dialog" drift className="ikd-hero__graffiti" />
        <div className="ikd-hero__inner">
          <div className="ikd-hero__copy">
            <p className="ikd-hero__kicker">
              <span className="ikd-hero__kicker-chip zzz-italic">Fan dispatch</span>
              <span className="ikd-hero__kicker-text">News from New Eridu, one knot at a time</span>
            </p>
            <EventTitle id="ikd-hero-title" as="h1" align="start" className="ikd-hero__title">
              <span className="ikd-nowrap">Inter-Knot</span> Dispatch
            </EventTitle>
            <p className="ikd-hero__lede">
              Patch notes, event schedules and street-level gossip for Proxies — collected, fact-checked and filed before
              the next Hollow shifts.
            </p>
            <div className="ikd-hero__actions">
              <Button
                href="#download"
                className="ikd-btn-accent"
                size="lg"
                width={300}
                onClick={(e) => {
                  if (onDownload) {
                    e.preventDefault()
                    onDownload()
                  }
                }}
              >
                <span className="ikd-btn-accent__inner">
                  <DownloadGlyph className="ikd-btn-accent__glyph" />
                  Download
                </span>
              </Button>
              <Button icon={<PlayGlyph className="ikd-play" />} iconTone="plain" size="lg" width={300} onClick={onTrailer}>
                Trailer
              </Button>
            </div>
          </div>
          <div className="ikd-hero__art" aria-hidden="true">
            <HeroFigure />
          </div>
        </div>
      </div>
    </section>
  )
}

/** The hero's full-body agent art: a transparent cut-out standing on the band (above the fold, so eager). */
function HeroFigure() {
  return <AgentImage crop="full" id={HERO_AGENT_ID} alt="" fit="contain" priority className="ikd-hero__agent" />
}

function NewsSection({ initialTab, initialPage, skin }: { initialTab: NewsTab; initialPage: number; skin: WebSkin }) {
  const [tab, setTab] = useState<NewsTab>(initialTab)
  const [page, setPage] = useState(initialPage)
  const posts = filterPosts(tab)
  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pageCount)
  const visible = posts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  // One shared panel (the tabs FILTER one list rather than swap content): every tab's
  // aria-controls points at it, and it is labelled by whichever tab is selected.
  const tabsId = `ikd-news-tabs-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`
  const panelId = `${tabsId}-panel`
  const tabItems = NEWS_TABS.map((item) => ({ ...item, panelId }))

  return (
    <section className="ikd-section ikd-news" aria-labelledby="ikd-news-title" id="ikd-news">
      <SectionHeading id="ikd-news-title" index="01" watermark="News">
        Latest Dispatches
      </SectionHeading>
      <div className="ikd-news__tabs">
        <WebTabs
          aria-label="News categories"
          id={tabsId}
          skin={skin}
          items={tabItems}
          value={tab}
          onValueChange={(v) => {
            setTab(v as NewsTab)
            setPage(1)
          }}
          className="ikd-news__tablist"
        />
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={getTabId(tabsId, tab)} className="ikd-news__panel">
        <ul role="list" aria-label="Articles" className="ikd-news__grid">
          {visible.map((post) => (
            <li key={post.id} className="ikd-news__item">
              <NewsCard
                href={`#article-${post.id}`}
                art={<PostArt post={post} />}
                date={post.date}
                category={CATEGORY_LABEL[post.category]}
                title={post.title}
                description={post.description}
                skin={skin}
                className="ikd-news__card"
              />
              {post.isNew ? <NewBadge placement="top-left" offset={[10, 12]} className="ikd-news__new" /> : null}
            </li>
          ))}
        </ul>
        <Pagination
          aria-label="News pages"
          skin={skin}
          count={pageCount}
          page={current}
          onPageChange={setPage}
          className="ikd-news__pager"
        />
      </div>
    </section>
  )
}

function AgentsSection() {
  const manifest = useGameArt()
  const [selected, setSelected] = useState(FEATURED_AGENTS[0].id)
  const agent = FEATURED_AGENTS.find((a) => a.id === selected) ?? FEATURED_AGENTS[0]
  const meta = manifest?.agents.find((a) => a.id === agent.id)
  const name = meta?.name ?? agent.name

  return (
    <section className="ikd-section ikd-agents" aria-labelledby="ikd-agents-title" id="ikd-agents">
      <SectionHeading id="ikd-agents-title" index="02" watermark="Agents">
        Agents
      </SectionHeading>
      <div className="ikd-agents__layout">
        <div className="ikd-agents__feature">
          <div className="ikd-agents__portrait" aria-hidden="true">
            <AgentImage crop="crop" id={agent.id} alt="" />
          </div>
          <div className="ikd-agents__info" aria-live="polite">
            <p className="ikd-agents__faction">{agent.faction}</p>
            <h3 className="ikd-agents__name">
              <span className="zzz-italic">{name}</span>
            </h3>
            <ul role="list" className="ikd-agents__chips" aria-label="Attributes">
              <li className="ikd-agents__chip">
                <span className="ikd-agents__chip-icon" aria-hidden="true">
                  <ElementGlyph name={meta?.element ?? agent.element} />
                </span>
                {meta?.element ?? agent.element}
              </li>
              <li className="ikd-agents__chip">
                <span className="ikd-agents__chip-icon" aria-hidden="true">
                  <SpecialtyGlyph name={meta?.specialty ?? agent.specialty} />
                </span>
                {meta?.specialty ?? agent.specialty}
              </li>
              {meta?.rank ? (
                <li className="ikd-agents__chip ikd-agents__chip--rank">
                  Rank <span className="ikd-agents__rank-letter">{meta.rank}</span>
                </li>
              ) : null}
            </ul>
            <p className="ikd-agents__blurb">{agent.blurb}</p>
          </div>
        </div>
        {/* Roster: a row of agent tiles in a horizontal ScrollArea (desktop / tablet); on phones the
            same list wraps into a 3-column grid (CSS) and nothing overflows, so the bar stays hidden. */}
        <ScrollArea
          orientation="horizontal"
          side="bottom"
          alwaysShow={false}
          viewportTabIndex={-1}
          className="ikd-agents__rail"
        >
          <ul role="list" aria-label="Choose an agent" className="ikd-agents__roster">
            {FEATURED_AGENTS.map((a) => {
              const label = manifest?.agents.find((m) => m.id === a.id)?.name ?? a.name
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    className="ikd-agents__roster-btn zzz-focusable"
                    aria-pressed={a.id === selected}
                    onClick={() => setSelected(a.id)}
                  >
                    <span className="ikd-agents__roster-face" aria-hidden="true">
                      <AgentImage crop="crop" id={a.id} alt="" />
                    </span>
                    <span className="ikd-agents__roster-name">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </div>
    </section>
  )
}

function NewsletterForm({ onSubscribe }: Pick<InterKnotDispatchPageProps, 'onSubscribe'>) {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const consentErrId = useId()

  const emailError = !submitted
    ? undefined
    : email.trim() === ''
      ? 'Enter your email, Proxy.'
      : !isValidEmail(email)
        ? 'That doesn’t look like an email address.'
        : undefined
  const consentError = submitted && !consent ? 'Tick the box so we can send you the digest.' : undefined

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ok = isValidEmail(email) && consent
    if (!ok) {
      setSubmitted(true)
      // Focus the first invalid field so its error (aria-describedby) is read out.
      if (!isValidEmail(email)) emailRef.current?.focus()
      else consentRef.current?.focus()
      return
    }
    const value = email.trim()
    onSubscribe?.(value)
    toast({ message: `Subscribed! The next dispatch goes to ${value}.`, variant: 'success' })
    setEmail('')
    setConsent(false)
    setSubmitted(false)
  }

  return (
    <section className="ikd-section ikd-newsletter" aria-labelledby="ikd-newsletter-title" id="ikd-newsletter">
      <SectionHeading id="ikd-newsletter-title" index="03" watermark="Mail">
        Newsletter
      </SectionHeading>
      <Panel variant="tool" headerLabel="Weekly Digest" className="ikd-newsletter__panel">
        <form aria-label="Newsletter" noValidate onSubmit={onSubmit} className="ikd-newsletter__form">
          <p className="ikd-newsletter__copy">
            One email a week: the biggest dispatches, event reminders and the occasional Bangboo meme. No spam, ever.
          </p>
          <TextField
            ref={emailRef}
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="proxy@inter-knot.ne"
            icon={<MailGlyph className="ikd-newsletter__mail" />}
            value={email}
            onValueChange={setEmail}
            error={emailError}
          />
          <div className="ikd-newsletter__consent">
            <Checkbox
              ref={consentRef}
              checked={consent}
              onCheckedChange={setConsent}
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? consentErrId : undefined}
            >
              Send me the weekly digest
            </Checkbox>
            {consentError ? (
              <InlineError id={consentErrId} alert className="ikd-newsletter__error">
                {consentError}
              </InlineError>
            ) : null}
          </div>
          <Button type="submit" icon={<CheckIcon />} iconTone="confirm" width="default" className="ikd-newsletter__submit">
            Subscribe
          </Button>
        </form>
      </Panel>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="ikd-section ikd-faq" aria-labelledby="ikd-faq-title" id="ikd-faq">
      <SectionHeading id="ikd-faq-title" index="04" watermark="FAQ">
        FAQ
      </SectionHeading>
      <Accordion defaultValue={[FAQ[0].value]} className="ikd-faq__list">
        {FAQ.map((item) => (
          <AccordionItem key={item.value} value={item.value} title={item.question}>
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export function InterKnotDispatchPage({
  initialTab = 'all',
  initialPage = 1,
  skin = 'game',
  height = '100dvh',
  onDownload,
  onTrailer,
  onSubscribe,
  className,
  style,
}: InterKnotDispatchPageProps) {
  const [nav, setNav] = useState('home')
  return (
    <div className={['ikd', 'zzz-scrollbar', className].filter(Boolean).join(' ')} style={{ height, ...style }}>
      <ZzzTheme className="ikd__theme">
        <ToastProvider>
          <HatchBackground className="ikd__hatch" />
          <NavBar
            className="ikd__nav"
            skin={skin}
            logo={
              <a href="#ikd-top" className="ikd__logo-link zzz-focusable" aria-label="Inter-Knot Dispatch home">
                <DispatchLogo />
              </a>
            }
            items={NAV_ITEMS}
            value={nav}
            onValueChange={setNav}
            cta={{
              label: 'Download',
              href: '#download',
              onClick: (e) => {
                if (onDownload) {
                  e.preventDefault()
                  onDownload()
                }
              },
            }}
          />
          <main className="ikd__main">
            <Hero onDownload={onDownload} onTrailer={onTrailer} />
            <div className="ikd__content">
              <NewsSection initialTab={initialTab} initialPage={initialPage} skin={skin} />
              <AgentsSection />
              <div className="ikd__split">
                <NewsletterForm onSubscribe={onSubscribe} />
                <FaqSection />
              </div>
            </div>
          </main>
          <SiteFooter
            className="ikd__footer"
            social={SOCIAL}
            logo={<DispatchLogo />}
            links={FOOTER_LINKS}
            legal="Inter-Knot Dispatch is a fan-made demo built with zone-ui. Not affiliated with or endorsed by the game's publisher. Game art is loaded from static.nanoka.cc and Enka.Network; Zenless Zone Zero © HoYoverse."
          />
        </ToastProvider>
      </ZzzTheme>
    </div>
  )
}
