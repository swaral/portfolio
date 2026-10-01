import { motion } from 'framer-motion'
import { profile } from '../data.js'

function Letters({ text, start, className }) {
  return (
    <span className={className} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="letter"
          initial={{ opacity: 0, y: -70, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: start + i * 0.06 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ revealed }) {
  return (
    <section className="hero" id="top">
      <motion.div
        className="hero-content"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {revealed && (
          <>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, letterSpacing: '0.9em' }}
              animate={{ opacity: 1, letterSpacing: '0.34em' }}
              transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.eyebrow}
            </motion.p>

            <h1 className="hero-name" aria-label={`${profile.firstName} ${profile.lastName}`}>
              <Letters text={profile.firstName} start={0.45} className="first" />
              <Letters text={profile.lastName} start={0.45 + profile.firstName.length * 0.06} className="last" />
            </h1>

            <motion.p
              className="tagline"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.3 }}
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.55 }}
            >
              <a className="btn btn-solid" href="#projects">See my work</a>
              <a className="btn btn-ghost" href="#contact">Get in touch</a>
            </motion.div>

            <motion.a
              href="#about"
              className="scroll-cue"
              aria-label="Scroll to about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              <span />
            </motion.a>
          </>
        )}
      </motion.div>
    </section>
  )
}
