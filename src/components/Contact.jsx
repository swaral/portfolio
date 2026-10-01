import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data.js'

const heading = "let's connect"
const year = new Date().getFullYear()

export default function Contact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="section contact" id="contact">
      <motion.h2
        className="contact-heading"
        aria-label={heading}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {[...heading].map((ch, i) => (
          <span key={i} className="clip" aria-hidden="true">
            <motion.span
              className="letter"
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          </span>
        ))}
      </motion.h2>

      <motion.div
        className="email-row"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <a className="email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <button type="button" className="btn btn-ghost" onClick={copyEmail}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </motion.div>

      <ul className="link-rows">
        {profile.links.map((l, i) => (
          <motion.li
            key={l.label}
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={l.href} target="_blank" rel="noreferrer">
              <span className="link-label">{l.label}</span>
              <span className="link-handle">{l.handle}</span>
              <span className="link-arrow">↗</span>
            </a>
          </motion.li>
        ))}
      </ul>

      <p className="muted location">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Based in {profile.location}
      </p>

      <footer className="footer">
        <span>© {year} Swaral Gaur</span>
        <a href="#top">Back to the lamp ↑</a>
      </footer>
    </section>
  )
}
