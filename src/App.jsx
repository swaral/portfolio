import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Achievements from './components/Achievements.jsx'
import Contact from './components/Contact.jsx'
import Cursor from './components/Cursor.jsx'
import { clickSound } from './sound.js'

const Scene = lazy(() => import('./three/Scene.jsx'))

export default function App() {
  const [on, setOn] = useState(false)
  const [pulls, setPulls] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)
  const onRef = useRef(false)

  // The page stays locked while dull, until the lamp switches itself on.
  useEffect(() => {
    document.body.style.overflow = revealed ? '' : 'hidden'
  }, [revealed])

  // Pull the chain: the chain tugs first, then the switch clicks.
  const toggle = useCallback(() => {
    setPulls((p) => p + 1)
    setTimeout(() => {
      onRef.current = !onRef.current
      clickSound(onRef.current)
      setOn(onRef.current)
      setRevealed(true)
    }, 320)
  }, [])

  const handleReady = useCallback(() => setReady(true), [])

  // Once the 3D scene is ready, pull the chain automatically.
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => {
      if (!onRef.current) toggle()
    }, 900)
    return () => clearTimeout(t)
  }, [ready, toggle])

  // Fallback if WebGL is unavailable: still show the site.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!onRef.current) {
        onRef.current = true
        setOn(true)
        setRevealed(true)
      }
    }, 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>
        <Scene on={on} pulls={pulls} onToggle={toggle} onReady={handleReady} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <Nav show={revealed} on={on} onToggle={toggle} />

      <main>
        <Hero revealed={revealed} />
        {revealed && (
          <>
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Achievements />
            <Contact />
          </>
        )}
      </main>
    </MotionConfig>
  )
}
