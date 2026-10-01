import { motion, useScroll, useSpring } from 'framer-motion'
import { profile } from '../data.js'

const links = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
]

export default function Nav({ show, on, onToggle }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  return (
    <motion.header
      className="nav"
      initial={false}
      animate={{ y: show ? 0 : -90, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8, delay: show ? 1.6 : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="progress" style={{ scaleX: progress }} />
      <a href="#top" className="brand">
        sg<span>.</span>
      </a>
      <nav>
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          type="button"
          className={`bulb-btn${on ? ' is-on' : ''}`}
          onClick={onToggle}
          aria-pressed={on}
          aria-label={on ? 'Turn the lamp off' : 'Turn the lamp on'}
          title={on ? 'Turn the lamp off' : 'Turn the lamp on'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <a className="btn btn-ghost btn-sm" href={profile.resume} target="_blank" rel="noreferrer">
          Resume ↗
        </a>
      </div>
    </motion.header>
  )
}
