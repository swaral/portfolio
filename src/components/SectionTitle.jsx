import { motion } from 'framer-motion'

export default function SectionTitle({ index, kicker, title }) {
  return (
    <div className="sec-title">
      <motion.span
        className="kicker"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="kicker-num">({index})</span>
        <span className="kicker-line" aria-hidden="true" />
        {kicker}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.h2>
      <motion.span
        className="rule"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
