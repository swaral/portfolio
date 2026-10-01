import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import SectionTitle from './SectionTitle.jsx'
import { projects, profile } from '../data.js'

const GalleryScene = lazy(() => import('../three/GalleryScene.jsx'))

const items = [
  ...projects,
  {
    title: 'More on GitHub',
    flow: 'github.com/swaral',
    year: '',
    summary: 'Coursework, experiments and smaller side projects live in my GitHub repositories.',
    points: [],
    stack: ['Python', 'JavaScript', 'React'],
    code: profile.links.find((l) => l.label === 'GitHub')?.href,
  },
]

export default function Projects() {
  const [active, setActive] = useState(0)
  const stage = useRef(null)
  const near = useInView(stage, { margin: '300px 0px' })
  const drag = useRef({ dragging: false, moved: false, released: false, dx: 0, startX: 0, startRot: 0 })
  const item = items[active]
  const paused = useRef(false)
  const visible = useInView(stage, { amount: 0.3 })

  // Advance to the next project every second while the gallery is on screen.
  // Hovering, touching, dragging or keyboard focus pauses it so visitors can read.
  useEffect(() => {
    if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!paused.current && !drag.current.dragging) {
        setActive((a) => (a + 1) % items.length)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [visible])

  const go = (d) => setActive((a) => (a + d + items.length) % items.length)

  // drag sideways on the stage to spin the ring
  useEffect(() => {
    const move = (e) => {
      const d = drag.current
      if (!d.dragging) return
      d.dx = e.clientX - d.startX
      if (Math.abs(d.dx) > 6) d.moved = true
    }
    const up = () => {
      const d = drag.current
      if (!d.dragging) return
      d.dragging = false
      if (d.moved) d.released = true
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  function onPointerDown(e) {
    if (e.pointerType !== 'mouse') {
      // on touch screens, pause for a few seconds after the visitor interacts
      paused.current = true
      clearTimeout(drag.current.resume)
      drag.current.resume = setTimeout(() => (paused.current = false), 4000)
    }
    const d = drag.current
    d.dragging = true
    d.moved = false
    d.dx = 0
    d.startX = e.clientX
    d.startRot = d.getRot ? d.getRot() : 0
  }

  return (
    <section className="section" id="projects">
      <SectionTitle index="03" kicker="projects" title={<>Things I&apos;ve <em>built</em></>} />

      <motion.div
        className="gallery"
        onPointerEnter={(e) => e.pointerType === 'mouse' && (paused.current = true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          ref={stage}
          className="gallery-stage"
          onPointerDown={onPointerDown}
          tabIndex={0}
          role="group"
          aria-roledescription="3D carousel"
          aria-label={`Projects, showing ${active + 1} of ${items.length}: ${item.title}`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
          }}
        >
          {near && (
            <Suspense fallback={null}>
              <GalleryScene items={items} active={active} onSelect={setActive} drag={drag} />
            </Suspense>
          )}
          <span className="gallery-hint" aria-hidden="true">
            Drag to explore
          </span>
        </div>

        <div className="gallery-controls">
          <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous project">
            ←
          </button>
          <div className="gallery-dots">
            {items.map((it, i) => (
              <button
                key={it.title}
                type="button"
                className={`dot${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={it.title}
                aria-current={i === active}
              />
            ))}
          </div>
          <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Next project">
            →
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={item.title}
            className="glass gallery-detail"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="detail-head">
              <span className="proj-num">{String(active + 1).padStart(2, '0')}</span>
              <span className="proj-flow">{item.flow}</span>
              {item.year && <span className="muted small">{item.year}</span>}
            </div>
            <h3>{item.title}</h3>
            <p className="proj-summary">{item.summary}</p>
            {item.points.length > 0 && (
              <ul className="proj-points">
                {item.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            )}
            <div className="tags">
              {item.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
            <div className="proj-links">
              {item.live && (
                <a className="btn btn-solid" href={item.live} target="_blank" rel="noreferrer">
                  Live demo ↗
                </a>
              )}
              {item.code && (
                <a className="btn btn-ghost" href={item.code} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
