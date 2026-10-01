import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionTitle from './SectionTitle.jsx'
import { experience } from '../data.js'

// Each job card hangs from a nail and swings into place like a pendant.
function Job({ job, index }) {
  const side = index % 2 === 0 ? 'left' : 'right'
  return (
    <div className={`tl-item ${side}`}>
      <motion.span
        className="tl-dot"
        initial={{ scale: 0, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.15 }}
      />
      <motion.article
        className="glass job-card"
        style={{ transformOrigin: '50% -34px' }}
        initial={{ opacity: 0, rotate: side === 'left' ? -28 : 28, y: -50 }}
        whileInView={{ opacity: 1, rotate: 0, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ type: 'spring', stiffness: 55, damping: 5.5, opacity: { duration: 0.35 } }}
      >
        <svg className="hanger" viewBox="0 0 140 36" aria-hidden="true">
          <path d="M70 4 L8 36 M70 4 L132 36" stroke="#f6dcb4" strokeOpacity=".55" strokeWidth="1.2" fill="none" />
          <circle cx="70" cy="4" r="3.4" fill="#e9c38a" />
        </svg>

        <div className="job-head">
          <span className="chip-soft">{job.period}</span>
          <span className="muted small">{job.place}</span>
        </div>
        <h3>{job.role}</h3>
        <p className="job-company">
          {job.company}
          {job.client && (
            <>
              {' · '}
              <a href={job.clientHref} target="_blank" rel="noreferrer">
                {job.client}
              </a>
            </>
          )}
        </p>

        <motion.ul
          className="job-points"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.55 } } }}
        >
          {job.points.map((p) => (
            <motion.li
              key={p}
              variants={{
                hidden: { opacity: 0, x: side === 'left' ? -20 : 20 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
            >
              {p}
            </motion.li>
          ))}
        </motion.ul>

        <div className="tags">
          {job.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </motion.article>
    </div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section className="section" id="experience">
      <SectionTitle index="02" kicker="experience" title={<>Where I&apos;ve <em>worked</em></>} />
      <div className="timeline" ref={ref}>
        <div className="tl-track">
          <motion.div className="tl-fill" style={{ scaleY: fill }} />
        </div>
        {experience.map((job, i) => (
          <Job key={job.company} job={job} index={i} />
        ))}
      </div>
    </section>
  )
}
