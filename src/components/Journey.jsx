import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '../lib/motion'
import { journey, profile } from '../data'
import { Squiggle } from './Bits'

/**
 * A scrapbook map: a winding road links each chapter, it draws itself as you
 * scroll, and a little avatar travels along it.
 */
export default function Journey() {
  const root = useRef(null)
  const list = useRef(null)
  const road = useRef(null)
  const trail = useRef(null)
  const walker = useRef(null)
  const [d, setD] = useState('')
  const [box, setBox] = useState({ w: 0, h: 0 })

  // build the curve through every dot
  useEffect(() => {
    const build = () => {
      const L = list.current
      if (!L) return
      const r = L.getBoundingClientRect()
      const pts = [...L.querySelectorAll('.jr-dot')].map((el) => {
        const b = el.getBoundingClientRect()
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2]
      })
      if (!pts.length) return
      const mobile = innerWidth < 760
      const amp = mobile ? 22 : Math.min(260, r.width * 0.2)
      const start = [pts[0][0], 0]
      let path = `M ${start[0]} ${start[1]} `
      let prev = start
      pts.concat([[pts[pts.length - 1][0], r.height]]).forEach((p, i) => {
        const dir = i % 2 ? 1 : -1
        const dy = (p[1] - prev[1]) / 2
        path += `C ${prev[0] + amp * dir} ${prev[1] + dy}, ${p[0] + amp * dir} ${p[1] - dy}, ${p[0]} ${p[1]} `
        prev = p
      })
      setBox({ w: r.width, h: r.height })
      setD(path)
    }
    build()
    const ro = new ResizeObserver(build)
    ro.observe(list.current)
    addEventListener('load', build)
    return () => {
      ro.disconnect()
      removeEventListener('load', build)
    }
  }, [])

  // draw the road + move the avatar with scroll
  useEffect(() => {
    if (!d) return
    const path = trail.current
    if (!path) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    const st = ScrollTrigger.create({
      trigger: list.current,
      start: 'top 65%',
      end: 'bottom 65%',
      scrub: 0.4,
      onUpdate: (s) => {
        path.style.strokeDashoffset = `${len * (1 - s.progress)}`
        const pt = path.getPointAtLength(len * s.progress)
        if (walker.current) {
          walker.current.style.transform = `translate(${pt.x}px, ${pt.y}px)`
        }
      },
    })
    path.style.strokeDashoffset = `${len}`
    const p0 = path.getPointAtLength(0)
    if (walker.current) {
      walker.current.style.transform = `translate(${p0.x}px, ${p0.y}px)`
    }
    ScrollTrigger.refresh()
    return () => st.kill()
  }, [d])

  useGSAP(() => {
    gsap.to('.jr-title .squiggle path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.jr-title', start: 'top 80%' },
    })
    gsap.utils.toArray('.jr-item', root.current).forEach((it, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: it, start: 'top 78%' } })
      tl.from(it.querySelector('.polaroid'), {
        y: 60,
        rotate: i % 2 ? 14 : -14,
        scale: 0.8,
        opacity: 0,
        duration: 1.1,
        ease: 'back.out(1.6)',
      })
        .from(it.querySelector('.jr-card'), { x: i % 2 ? -50 : 50, opacity: 0, duration: 1 }, 0.15)
        .from(it.querySelector('.jr-dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0.1)
    })
  }, { scope: root })

  return (
    <section className="journey section" id="journey" ref={root}>
      <div className="wrap">
        <div className="sec-head center">
          <span className="pill">Artistic Journey</span>
          <h2 className="h2 jr-title">
            The story <span className="hl">so far<Squiggle /></span>
          </h2>
          <p className="hand sec-note">follow the path ↓</p>
        </div>
        <ol className="jr-list" ref={list}>
          <svg
            className="jr-map"
            width={box.w}
            height={box.h}
            viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
            aria-hidden="true"
          >
            <path ref={road} d={d} className="jr-road" />
            <path ref={trail} d={d} className="jr-trail" />
          </svg>
          <span className="jr-walker" ref={walker} aria-hidden="true">
            <img src={profile.avatar} alt="Vanishree Kulkarni" />
          </span>
          {journey.map((j, i) => (
            <li className={`jr-item ${i % 2 ? 'flip' : ''}`} key={j.title}>
              <figure className="polaroid" style={{ '--r': `${i % 2 ? 4 : -4}deg` }}>
                <span className="tape" />
                <img src={j.photo} alt={j.title} loading="lazy" />
                <figcaption className="hand">{j.note}</figcaption>
              </figure>
              <span className="jr-dot" />
              <div className="jr-card">
                <span className="jr-year hand">{j.year}</span>
                <h3>{j.title}</h3>
                <span className="jr-org">{j.org}</span>
                <p>{j.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
