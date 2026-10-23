import { useEffect, useRef, useState } from 'react'
import { gsap, goTo } from '../lib/motion'
import { profile } from '../data'

const links = [
  ['About', '#about'],
  ['Selected Work', '#work'],
  ['Journey', '#journey'],
  ['Disciplines', '#skills'],
  ['Credentials', '#milestones'],
]

export default function Nav({ ready, onOpenShowreel }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ready) gsap.from(ref.current, { y: -80, opacity: 0, duration: 1.1, delay: 0.3 })
  }, [ready])

  const go = (e, h) => {
    e.preventDefault()
    setOpen(false)
    goTo(h)
  }

  return (
    <header className={`nav ${open ? 'is-open' : ''}`} ref={ref}>
      <a href="#top" className="nav-brand" onClick={(e) => go(e, '#top')} aria-label="Vanishree Kulkarni — Home">
        <img src={profile.avatar} alt="Vanishree Kulkarni" />
        <span>{profile.name.toLowerCase()}<em>.</em></span>
      </a>
      <nav className="nav-links" aria-label="Primary Navigation">
        {links.map(([l, h]) => (
          <a key={h} href={h} onClick={(e) => go(e, h)}>
            {l}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        {onOpenShowreel && (
          <button className="nav-showreel-btn" onClick={onOpenShowreel} aria-label="Watch Showreel">
            Showreel <span>▶</span>
          </button>
        )}
        <a href="#contact" className="btn btn-coral nav-cta" onClick={(e) => go(e, '#contact')}>
          Bookings <span>✦</span>
        </a>
      </div>
      <button
        className="nav-burger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
      >
        <i />
        <i />
      </button>
      <div className="nav-sheet">
        {links.concat([['Contact & Casting', '#contact']]).map(([l, h]) => (
          <a key={h} href={h} onClick={(e) => go(e, h)}>
            {l}
          </a>
        ))}
      </div>
    </header>
  )
}
