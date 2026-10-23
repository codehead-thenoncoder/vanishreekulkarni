import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { scoreboard, certifications } from '../data'
import { Squiggle } from './Bits'
import Wave from './Wave'
import Brand from './Brand'
import Odometer from './Odometer'

/** Artist credentials and recognition wall, followed by verified career statistics in numbers. */
export default function Milestones() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.utils.toArray('.squiggle path', root.current).forEach((p) =>
      gsap.to(p, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: p, start: 'top 85%' },
      })
    )
    gsap.from('.cert-frame', {
      y: 50,
      rotate: (i) => (i % 2 ? 8 : -8),
      opacity: 0,
      stagger: 0.06,
      duration: 0.9,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.ms-wall', start: 'top 85%' },
    })

    // Verified statistics roll into place
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.nums', start: 'top 82%' } })
    tl.from('.num-cell', { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' })
    gsap.utils.toArray('.nums .odo-col', root.current).forEach((col, i) => {
      tl.fromTo(
        col,
        { yPercent: 0 },
        { yPercent: -((10 + +col.dataset.d) / 20) * 100, duration: 2.2, ease: 'power4.out' },
        0.15 + i * 0.05
      )
    })
    tl.from('.num-line', { scaleX: 0, stagger: 0.12, duration: 1.2, ease: 'expo.inOut' }, 0.4)
      .from('.num-meta, .num-note', { y: 12, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.9)
  }, { scope: root })

  return (
    <section className="milestones section" id="milestones" ref={root}>
      <Wave flip />
      <div className="wrap">
        <div className="sec-head center">
          <span className="pill">Credentials &amp; Recognition</span>
          <h2 className="h2">
            Craft &amp; <span className="hl">recognition<Squiggle /></span>
          </h2>
        </div>
        <div className="ms-wall">
          {certifications.map(([t, by, brand], i) => (
            <figure
              className="cert-frame"
              key={t}
              style={{ '--r': `${[-2, 1.5, -1, 2][i % 4]}deg` }}
            >
              <span className="cert-border">
                <span className="cert-logo">
                  <Brand name={brand} size={30} />
                </span>
                <b>{t}</b>
                <span className="cert-by">{by}</span>
                <span className="cert-seal">✓</span>
              </span>
            </figure>
          ))}
        </div>

        <div className="sec-head center ms-nums-head">
          <h2 className="h2">
            By the <span className="hl">numbers<Squiggle /></span>
          </h2>
        </div>
        <div className="nums">
          {scoreboard.map((s) => (
            <div className="num-cell" key={s.label}>
              <div className="num-val">
                <Odometer value={s.value} />
                <small>{s.suffix}</small>
              </div>
              <i className="num-line" />
              <div className="num-meta">
                <Brand name={s.brand} size={20} />
                <b>{s.label}</b>
              </div>
              <span className="num-note">{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
