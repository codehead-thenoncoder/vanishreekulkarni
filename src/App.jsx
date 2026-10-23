import { useEffect, useState } from 'react'
import { startScroll, lenis, ScrollTrigger } from './lib/motion'
import { profile } from './data'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Journey from './components/Journey'
import Skills from './components/Skills'
import Milestones from './components/Milestones'
import Contact from './components/Contact'
import ShowreelModal from './components/ShowreelModal'

const BASE = import.meta.env.BASE_URL
const load = (src) =>
  new Promise((r) => {
    const i = new Image()
    i.onload = i.onerror = r
    i.src = src
  })

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [showreelOpen, setShowreelOpen] = useState(false)

  useEffect(() => {
    startScroll()
    const t0 = performance.now()
    Promise.all([
      document.fonts?.ready,
      load(BASE + profile.avatar),
      load(BASE + profile.heroPortrait),
    ]).then(() =>
      setTimeout(() => setLoaded(true), Math.max(0, 1500 - (performance.now() - t0)))
    )
  }, [])

  const finish = () => {
    setReady(true)
    lenis?.start()
    ScrollTrigger.refresh()
  }

  return (
    <>
      <Loader done={loaded} onFinish={finish} />
      <Nav ready={ready} onOpenShowreel={() => setShowreelOpen(true)} />
      <main>
        <Hero ready={ready} onOpenShowreel={() => setShowreelOpen(true)} />
        <About />
        <Work />
        <Journey />
        <Skills />
        <Milestones />
        <Contact />
      </main>
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        videoId={profile.showreelId}
      />
    </>
  )
}
