import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A small gold dot with a trailing ring; the ring grows over links and buttons.
export default function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setHover(!!e.target.closest?.('a, button, [role="group"], .chip'))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y, opacity: visible ? 1 : 0 }} aria-hidden="true" />
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
        animate={{ scale: hover ? 1.9 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        aria-hidden="true"
      />
    </>
  )
}
