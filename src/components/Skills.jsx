import { useEffect, useRef } from 'react'
import { gsap, useGSAP, Draggable } from '../lib/motion'
import { skills } from '../data'
import { Squiggle } from './Bits'
import Wave from './Wave'

const tones = ['coral', 'white', 'peach', 'ink', 'white', 'peach']

/** A sticker sheet of disciplines & capabilities: drag them around, or hit shuffle. */
export default function Skills() {
  const root = useRef(null)
  const board = useRef(null)

  const layout = (animate) => {
    const els = gsap.utils.toArray('.skill', board.current)
    const flow = innerWidth < 700
    board.current.classList.toggle('flow', flow)
    if (flow) {
      board.current.style.height = ''
      if (animate) {
        const parent = board.current
        els.sort(() => Math.random() - 0.5).forEach((el) => parent.appendChild(el))
      }
      els.forEach((el, k) =>
        gsap.to(el, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          rotate: animate ? gsap.utils.random(-8, 8) : ((k * 29) % 13) - 6,
          duration: animate ? 0.8 : 0,
          ease: 'elastic.out(1, 0.6)',
        })
      )
      return
    }
    const cols = innerWidth < 700 ? 3 : innerWidth < 1100 ? 4 : 5
    const rows = Math.ceil(els.length / cols)
    const rowH = innerWidth < 700 ? 66 : 92
    board.current.style.height = `${rows * rowH + 60}px`
    const order = els.map((_, i) => i)
    if (animate) order.sort(() => Math.random() - 0.5)
    els.forEach((el, k) => {
      const idx = order[k]
      const c = idx % cols
      const r = Math.floor(idx / cols)
      const jx = animate ? gsap.utils.random(-1.5, 1.5) : (((k * 37) % 7) - 3) * 0.5
      const jy = animate ? gsap.utils.random(-12, 12) : ((k * 53) % 21) - 10
      gsap.to(el, {
        left: `${8 + ((c + 0.5) / cols) * 84 + jx}%`,
        top: `${30 + (r + 0.5) * rowH + jy * 0.6}px`,
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        rotate: animate ? gsap.utils.random(-14, 14) : ((k * 29) % 19) - 9,
        duration: animate ? 1.1 : 0,
        ease: 'elastic.out(1, 0.6)',
        delay: animate ? k * 0.015 : 0,
      })
    })
  }

  useEffect(() => {
    layout(false)
    const on = () => layout(false)
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])

  useGSAP(() => {
    gsap.to('.sk-title .squiggle path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.sk-title', start: 'top 80%' },
    })
    gsap.from('.skill', {
      scale: 0,
      stagger: { each: 0.03, from: 'random' },
      duration: 0.7,
      ease: 'back.out(2.6)',
      scrollTrigger: { trigger: board.current, start: 'top 80%' },
    })
    Draggable.create('.skill', {
      bounds: board.current,
      onPress() {
        gsap.to(this.target, { scale: 1.15, rotate: 0, zIndex: 5, duration: 0.2 })
      },
      onRelease() {
        gsap.to(this.target, {
          scale: 1,
          rotate: gsap.utils.random(-12, 12),
          zIndex: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        })
      },
    })
  }, { scope: root })

  return (
    <section className="skills section tint" id="skills" ref={root}>
      <Wave flip />
      <div className="wrap">
        <div className="sec-head sk-head">
          <div>
            <span className="pill">Artistic Capabilities</span>
            <h2 className="h2 sk-title">
              Disciplines &amp; <span className="hl">craft<Squiggle /></span>
            </h2>
          </div>
          <div className="sk-side">
            <p className="hand sec-note">psst, these stickers are draggable</p>
            <button className="btn btn-line" onClick={() => layout(true)}>
              Shuffle ✦
            </button>
          </div>
        </div>
        <div className="sk-board" ref={board}>
          {skills.map((s, i) => (
            <span key={s} className={`skill tone-${tones[i % tones.length]}`}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
