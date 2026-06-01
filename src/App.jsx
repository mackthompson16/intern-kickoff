import { useEffect, useMemo, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaInstagram, FaSoundcloud } from 'react-icons/fa'
import { MorphingText } from './components/MorphingText'
import { ShimmerButton } from './components/ShimmerButton'
import VariableProximity from './components/VariableProximity'
import './App.css'

const companyLogos = [
  { name: 'HP', icon: 'hp' },
  { name: 'NVIDIA', icon: 'nvidia' },
  { name: 'Google', icon: 'google' },
  { name: 'Meta', icon: 'meta' },
  { name: 'Apple', icon: 'apple' },
  { name: 'Stripe', icon: 'stripe' },
  { name: 'Databricks', icon: 'databricks' },
  { name: 'Cisco', icon: 'cisco' },
]

const RESERVE_SPOT_URL = 'https://www.eventbrite.com/e/REPLACE_WITH_EVENT_ID'
const SOUNDCLOUD_SET_URL = 'https://soundcloud.com/mack-thompson-951646633/sets/intern-kickoff?si=dbb96087d5ee4e90a386f88a1db5fd96&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
const DJ_SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/djtokenz',
    Icon: FaInstagram,
  },
  {
    label: 'SoundCloud',
    href: SOUNDCLOUD_SET_URL,
    Icon: FaSoundcloud,
  },
]

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  if (hash === 'info' || hash === 'faq') return 'info'
  if (hash === 'setlist' || hash === 'soundcloud') return 'setlist'
  return 'home'
}

function App() {
  const overlayRef = useRef(null)
  const [route, setRoute] = useState(getRouteFromHash)
  const [isInitialReady, setIsInitialReady] = useState(false)

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const heroBackgroundUrl = `${import.meta.env.BASE_URL}background.png`
  const logoIconUrls = useMemo(
    () => companyLogos.map((company) => `https://cdn.simpleicons.org/${company.icon}/183224`),
    [],
  )
  const soundcloudEmbedUrl = useMemo(
    () => `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_SET_URL)}&color=%2313220f&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&show_artwork=true&visual=false`,
    [],
  )

  useEffect(() => {
    let isCancelled = false

    const revealWhenReady = async () => {
      const tasks = [preloadImage(heroBackgroundUrl), ...logoIconUrls.map(preloadImage)]

      if (document.fonts?.ready) {
        tasks.push(document.fonts.ready.catch(() => undefined))
      }

      const maxWait = new Promise((resolve) => {
        setTimeout(resolve, 2600)
      })

      await Promise.race([Promise.allSettled(tasks), maxWait])
      await nextFrame()
      await nextFrame()

      if (!isCancelled) {
        setIsInitialReady(true)
      }
    }

    revealWhenReady()

    return () => {
      isCancelled = true
    }
  }, [heroBackgroundUrl, logoIconUrls])

  const essentials = [
    'DJ TOKENZ',
    'HOTDOGS + EATS',
    'DATE TBD; 1:00 - 5:00 PM ',
    'DT MOUNTAINVIEW',
    'SF AFTER PARTY',
  ]

  const isInfo = route === 'info'
  const isSetlist = route === 'setlist'
  const isHome = route === 'home'

  const siteNav = (
    <nav className="hero-nav" aria-label="Primary">
      <a href="#/" aria-current={isHome ? 'page' : undefined}>Home</a>
   
      <a href="#/info" aria-current={isInfo ? 'page' : undefined}>INFO</a>
      
      <a href="#/setlist" aria-current={isSetlist ? 'page' : undefined}>SETLIST</a>
    </nav>
  )

  return (
    <div className="site-shell">
      {!isInitialReady && (
        <div className="app-loader" role="status" aria-live="polite" aria-label="Loading event page">
          <div className="app-loader-inner">
            <span className="app-loader-mark"></span>
          </div>
        </div>
      )}

      <div className={`site-shell-content ${isInitialReady ? 'is-ready' : 'is-loading'}`}>
      <div className="top-nav-band">
        <Container>
          {siteNav}
        </Container>
      </div>

      {!isInfo && !isSetlist && (
      <header className="hero-section" style={{ '--hero-bg-image': `url(${heroBackgroundUrl})` }}>
        <div className="hero-grid">
          <div className="hero-zone hero-zone-top">
            <Container className="hero-top">
              <MorphingText
                className="hero-morph"
                texts={['INTERN KICKOFF DARTY', 'NETWORKING OPPORTUNITY', 'LIMITED AVAILABILITY', 'DJ TOKENZ LIVE']}
              />
            </Container>

            <div className="logo-ticker" aria-label="Companies attending">
              <div className="logo-track">
                {companyLogos.concat(companyLogos).map((company, index) => (
                  <span key={`${company.name}-${index}`} className="logo-chip">
                    <img
                      className="logo-img"
                      src={`https://cdn.simpleicons.org/${company.icon}/183224`}
                      alt={`${company.name} logo`}
                      loading="lazy"
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="reserve-center">
              <ShimmerButton
                className="reserve-button"
                shimmerColor="#ffd7a0"
                shimmerDuration="2.7s"
                onClick={() => window.open(RESERVE_SPOT_URL, '_blank', 'noopener,noreferrer')}
              >
                GET FREE SPOT
              </ShimmerButton>
            </div>
          </div>

          <div className="hero-zone hero-zone-middle" aria-hidden="true" />

          <div className="hero-zone hero-zone-bottom">
            <Container className="hero-bottom">
              <Row className="align-items-end g-4">
                <Col lg={12}>
                  <div className="overlay-shell" aria-label="Event metadata" ref={overlayRef}>
                    <ul className="minimal-list" aria-label="Event essentials">
                      {essentials.map((item, index) => (
                        <li key={item} className="minimal-item">
                          <span className="minimal-index">0{index + 1}</span>
                          <VariableProximity
                            className="minimal-text"
                            label={item}
                            fromFontVariationSettings="'wght' 420, 'opsz' 9"
                            toFontVariationSettings="'wght' 980, 'opsz' 40"
                            containerRef={overlayRef}
                            radius={95}
                            falloff="linear"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>

        

      
      </header>
      )}

      {isInfo && (
        <main className="subpage-shell">
          <Container className="subpage-content">
            <ul className="faq-list" aria-label="Kickoff metadata">
              <li className="faq-item">
                <p>Date TBD from 1:00 PM to 5:00 PM.</p>
              </li>
              <li className="faq-item">
                <p>Exact address is shared after RSVP.</p>
              </li>
              <li className="faq-item">
                <p>The first N people to reserve are added to the Slack channel and get an Eventbrite ticket.</p>
              </li>
              <li className="faq-item">
                <p>Girls do not need a ticket.</p>
              </li>
              <li className="faq-item">
                <p> BYOB but food provided</p>
              </li>
              <li className="faq-item">
                <p>After Party: Caltrain to Downtown SF, hit a club/rave, then split Ubers back to Mountain View late night.</p>
              </li>
            
            </ul>

        
          </Container>
        </main>
      )}

      {isSetlist && (
        <main className="setlist-shell" aria-label="Setlist">
          <iframe
            className="setlist-iframe"
            title="Intern Kickoff SoundCloud Set"
            src={soundcloudEmbedUrl}
            allow="autoplay"
            loading="lazy"
          />
        </main>
      )}
      </div>
    </div>
  )
}

export default App
