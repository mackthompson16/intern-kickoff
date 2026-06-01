import { useEffect, useMemo, useState } from 'react'
import { Col, Container, Row, Stack } from 'react-bootstrap'
import AOS from 'aos'
import { useRef } from 'react'
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

const GOOGLE_FORM_URL = 'https://forms.gle/REPLACE_WITH_FORM_ID'
const SOUNDCLOUD_SET_URL = 'https://soundcloud.com/your-account/sets/intern-kickoff-set'

function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  if (hash === 'faq') return 'faq'
  if (hash === 'soundcloud') return 'soundcloud'
  return 'home'
}

function App() {
  const overlayRef = useRef(null)
  const [route, setRoute] = useState(getRouteFromHash)

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' })
  }, [])

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const heroBackgroundUrl = `${import.meta.env.BASE_URL}background.png`
  const soundcloudEmbedUrl = useMemo(
    () => `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_SET_URL)}&color=%2313220f&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true`,
    [],
  )

  const essentials = [
    'DJ TOKENZ',
    'HOTDOGS + EATS',
    '6-27-26, 1:00 - 5:00 PM, ',
    'DT MOUNTAINVIEW BACKYARD',
    "SF AFTER PARTY"
  ]

  const isFaq = route === 'faq'
  const isSoundcloud = route === 'soundcloud'
  const isHome = route === 'home'

  const siteNav = (
    <nav className="hero-nav" aria-label="Primary">
      <a href="#/" aria-current={isHome ? 'page' : undefined}>Home</a>
      <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer">Join US</a>
      <a href="#/faq" aria-current={isFaq ? 'page' : undefined}>FAQ</a>
      <a href="#/soundcloud" aria-current={isSoundcloud ? 'page' : undefined}>Playlist
    </a>
    </nav>
  )

  return (
    <div className="site-shell">
      <div className="top-nav-band">
        <Container>
          {siteNav}
        </Container>
      </div>

      {!isFaq && !isSoundcloud && (
      <header className="hero-section" style={{ '--hero-bg-image': `url(${heroBackgroundUrl})` }}>
        <Container className="hero-top" data-aos="fade-up">
          <MorphingText
            className="hero-morph"
            texts={['INTERN KICKOFF DARTY', 'DJ TOKENZ', '6-27-26', 'SF AFTER PARTY']}
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
            onClick={() => window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')}
          >
            Reserve Free Spot
          </ShimmerButton>
        </div>

        <div className="hero-center-clear" aria-hidden="true" />

        <Container className="hero-bottom">
          <Row className="align-items-end g-4">
            <Col lg={12}>
              <div className="overlay-shell" aria-label="Event metadata" ref={overlayRef}>
                <ul className="minimal-list" data-aos="fade-right" aria-label="Event essentials">
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

        

      
      </header>
      )}

      {isFaq && (
        <main className="subpage-shell">
          <Container className="subpage-content" data-aos="fade-up">
            <h1 className="subpage-title">FAQ</h1>
            <p className="subpage-lead">Quick details for the kickoff. More updates coming soon.</p>
            <ul className="faq-list">
              <li className="faq-item">
                <h2>Who can attend?</h2>
                <p>Bay Area interns and new grads are welcome. Bring a friend in tech.</p>
              </li>
              <li className="faq-item">
                <h2>Do I need a ticket?</h2>
                <p>Yes. Use Join US or Reserve Free Spot to submit the Google Form.</p>
              </li>
              <li className="faq-item">
                <h2>What should I wear?</h2>
                <p>Casual summer fit. You will be standing and dancing, so wear comfortable shoes.</p>
              </li>
              <li className="faq-item">
                <h2>Is this free?</h2>
                <p>Yes, entry is free with approved RSVP.</p>
              </li>
            </ul>
          </Container>
        </main>
      )}

      {isSoundcloud && (
        <main className="subpage-shell">
          <Container className="subpage-content" data-aos="fade-up">
            <h1 className="subpage-title">SoundCloud</h1>
            <p className="subpage-lead">Set playlist and requests for the party.</p>
            <div className="soundcloud-frame-wrap">
              <iframe
                title="Intern Kickoff SoundCloud Set"
                src={soundcloudEmbedUrl}
                allow="autoplay"
                loading="lazy"
              />
            </div>
            <div className="soundcloud-actions">
              <a className="soundcloud-link" href={SOUNDCLOUD_SET_URL} target="_blank" rel="noreferrer">Open Playlist on SoundCloud</a>
              <a className="soundcloud-link request-link" href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer">Request a Song</a>
            </div>
          </Container>
        </main>
      )}
    </div>
  )
}

export default App
