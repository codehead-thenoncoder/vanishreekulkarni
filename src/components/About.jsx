import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { about } from '../data'
import { Squiggle } from './Bits'
import Wave from './Wave'

/** A fanned stack of photos. Click (or tap) to send the top photo to the back. */
function PhotoStack() {
  const [order, setOrder] = useState(about.photos.map((_, i) => i))
  const stack = useRef(null)

  const next = () => {
    const top = stack.current.querySelector(`[data-i="${order[0]}"]`)
    gsap.timeline()
      .to(top, { x: 260, y: -40, rotate: 18, duration: 0.35, ease: 'power2.in' })
      .add(() => setOrder((o) => [...o.slice(1), o[0]]))
      .to(top, { x: 0, y: 0, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' })
  }

  return (
    <div
      className="stack"
      ref={stack}
      onClick={next}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && next()}
      aria-label="Shuffle portrait photos"
    >
      {about.photos.map((src, i) => {
        const pos = order.indexOf(i)
        return (
          <figure
            key={src}
            data-i={i}
            className={`stack-card ${pos === 0 ? 'is-top' : ''}`}
            style={{ zIndex: 10 - pos, '--pos': pos }}
          >
            <img src={src} alt={`Vanishree Kulkarni, ${about.roles[i]}`} loading="lazy" />
            <figcaption>
              <span className="role-kicker hand">I’m a</span>
              <span className="role-name">{about.roles[i]}</span>
            </figcaption>
          </figure>
        )
      })}
      <span className="stack-hint hand">click to see my other roles ↻</span>
    </div>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.from('.stack-card', {
      y: 80,
      rotate: 0,
      opacity: 0,
      stagger: 0.12,
      duration: 1.1,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: root.current, start: 'top 72%' },
    })
    gsap.from('.ab-copy > *', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1.1,
      scrollTrigger: { trigger: '.ab-copy', start: 'top 80%' },
    })
    gsap.to('.ab-title .squiggle path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.ab-title', start: 'top 80%' },
    })
    gsap.from('.ab-stat', {
      y: 40,
      opacity: 0,
      scale: 0.9,
      stagger: 0.08,
      duration: 0.9,
      ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '.ab-stats', start: 'top 88%' },
    })
  }, { scope: root })

  return (
    <section className="about section tint" id="about" ref={root}>
      <Wave />
      <div className="wrap ab-grid">
        <PhotoStack />
        <div className="ab-copy">
          <span className="pill">About me</span>
          <h2 className="h2 ab-title">
            An artist across <span className="hl">many voices<Squiggle /></span>
          </h2>
          {about.paragraphs.map((p) => (
            <p className="lead" key={p}>{p}</p>
          ))}
          <div className="ab-stats">
            {about.stats.map((s) => (
              <div className="ab-stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
