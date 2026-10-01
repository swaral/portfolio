import { Fragment } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle.jsx'
import { about, education } from '../data.js'

// Words brighten one after another, like light spreading across the text.
function RevealText({ text }) {
  return (
    <motion.p
      className="about-text"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ show: { transition: { staggerChildren: 0.025 } } }}
    >
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="word"
            variants={{
              hidden: { opacity: 0.12, y: 10, filter: 'blur(5px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
            }}
          >
            {word}
          </motion.span>{' '}
        </Fragment>
      ))}
    </motion.p>
  )
}

export default function About() {
  return (
    <section className="section" id="about">
      <SectionTitle index="01" kicker="about" title={<>Hello, I&apos;m <em>Swaral</em>.</>} />
      <div className="about-grid">
        <div>
          {about.map((t, i) => (
            <RevealText key={i} text={t} />
          ))}
        </div>
        <div className="edu-list">
          <motion.h3
            className="mini-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Education
          </motion.h3>
          {education.map((e, i) => (
            <motion.article
              key={e.degree}
              className="glass edu-card"
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="edu-top">
                <span className="chip-soft">{e.period}</span>
                <span className="muted small">{e.score}</span>
              </div>
              <h4>{e.degree}</h4>
              <p className="muted">{e.school}</p>
              <p className="muted small">{e.place}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
