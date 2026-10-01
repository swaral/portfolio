import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import SectionTitle from './SectionTitle.jsx'
import { achievements } from '../data.js'

const icons = {
  chess: (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <circle cx="24" cy="11" r="5" fill="none" stroke="url(#goldLine)" strokeWidth="1.8" />
      <path d="M18 19h12M20 19c0 7-2 12-6 17h20c-4-5-6-10-6-17" fill="none" stroke="url(#goldLine)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 41h24" fill="none" stroke="url(#goldLine)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path d="M16 4l6 14M32 4l-6 14" fill="none" stroke="url(#goldLine)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="30" r="12" fill="none" stroke="url(#goldLine)" strokeWidth="1.8" />
      <path d="M24 23l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="none" stroke="url(#goldLine)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
}

function CountUp({ to, prefix, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd58f" />
            <stop offset="1" stopColor="#ff7a6b" />
          </linearGradient>
        </defs>
      </svg>
      <SectionTitle index="05" kicker="achievements" title={<>Beyond the <em>code</em></>} />
      <div className="ach-grid">
        {achievements.map((a, i) => (
          <motion.div
            key={a.label}
            className="glass ach-card"
            initial={{ opacity: 0, scale: 0.6, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <span className="ach-value">{a.icon ? icons[a.icon] : <CountUp to={a.value} prefix={a.prefix} suffix={a.suffix} />}</span>
            <span className="ach-label">{a.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
