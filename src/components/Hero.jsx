import { useEffect, useRef } from 'react'
import { gsap, useGSAP, goTo } from '../lib/motion'
import { profile, heroCounts } from '../data'
import { Squiggle, Arrow, Spark } from './Bits'

export default function Hero({ ready, onOpenShowreel }) {
  const root = useRef(null)
  const portraitRef = useRef(null)

  useGSAP(() => {
    if (!ready) return
    const tl = gsap.timeline()
    tl.from('.hr-hello', { y: 20, opacity: 0, duration: 0.8 })
      .from('.hr-name .ch', { yPercent: 110, rotate: 8, stagger: 0.05, duration: 1.1 }, 0.1)
      .to('.hr-name .squiggle path', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.6)
      .from('.hr-sub, .hr-counts, .hr-ctas', { y: 30, opacity: 0, stagger: 0.1, duration: 1 }, 0.4)
      .from('.hr-blob', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.7)' }, 0.1)
      .from('.hr-person-cutout', { yPercent: 30, opacity: 0, duration: 1.2, ease: 'back.out(1.4)' }, 0.3)

  }, { scope: root, dependencies: [ready] })

  useGSAP(() => {
    gsap.to('.hr-visual', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: root })

  // Gentle interactive parallax tracking cursor
  useEffect(() => {
    const onMove = (e) => {
      if (!portraitRef.current || window.innerWidth < 820) return
      const cx = window.innerWidth * 0.72
      const cy = window.innerHeight * 0.5
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5)
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5)
      gsap.to(portraitRef.current, {
        x: Math.max(-14, Math.min(14, dx * 14)),
        y: Math.max(-10, Math.min(10, dy * 10)),
        rotate: Math.max(-1.5, Math.min(1.5, dx * 1.5)),
        duration: 0.6,
        ease: 'power2.out',
      })
    }
    const onLeave = () => {
      if (!portraitRef.current) return
      gsap.to(portraitRef.current, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: 'power2.out' })
    }
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hr-grid">
        <div className="hr-copy">
          <p className="hr-hello hand">Namaskara, I’m <span aria-hidden="true">🙏</span></p>
          <h1 className="hr-name">
            <span className="hr-name-text">
              {profile.name.split('').map((c, i) => (
                <span className="ch-mask" key={i}>
                  <span className="ch">{c}</span>
                </span>
              ))}
            </span>
            <Squiggle />
          </h1>
          <p className="hr-sub">
            <b>{profile.role}</b> <Spark /> {profile.intro}
          </p>
          <ul className="hr-counts" aria-label="Career Highlights">
            {heroCounts.map((c) => (
              <li key={c.label}>
                <b>{c.value}</b>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
          <div className="hr-ctas">
            {profile.showreelId && (
              <button className="btn btn-coral" onClick={onOpenShowreel}>
                Watch Showreel <span style={{ fontSize: '0.85em', marginLeft: 4 }}>▶</span>
              </button>
            )}
            <button className="btn btn-line" onClick={() => goTo('#work')}>
              Selected Work <span>→</span>
            </button>
            <button className="btn btn-line" onClick={() => goTo('#contact')}>
              Casting & Enquiries
            </button>
          </div>
        </div>

        <div className="hr-visual">
          <div className="hr-blob" />
          <img
            ref={portraitRef}
            src={profile.heroPortrait}
            alt="Vanishree Kulkarni — Actress and Multilingual Voice Artist"
            className="hr-person hr-person-cutout"
            loading="eager"
            fetchPriority="high"
          />

        </div>
      </div>
    </section>
  )
}
