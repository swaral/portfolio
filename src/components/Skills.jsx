import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle.jsx'
import { skills } from '../data.js'

const all = skills.filter((g) => g.group !== 'Core subjects').flatMap((g) => g.items)

export default function Skills() {
  return (
    <section className="section" id="skills">
      <SectionTitle index="04" kicker="skills" title={<>My <em>toolkit</em></>} />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...all, ...all].map((s, i) => (
            <span key={i}>
              {s} <em>✦</em>
            </span>
          ))}
        </div>
      </div>

      <div className="skill-grid">
        {skills.map((g, gi) => (
          <motion.div
            key={g.group}
            className="glass skill-group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (gi % 3) * 0.1 }}
          >
            <h3 className="mini-heading">{g.group}</h3>
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
            >
              {g.items.map((s, k) => (
                <motion.li
                  key={s}
                  className="chip"
                  variants={{
                    hidden: { opacity: 0, scale: 0, rotate: k % 2 ? 14 : -14 },
                    show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 320, damping: 14 } },
                  }}
                  whileHover={{ y: -4, scale: 1.07 }}
                >
                  {s}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
