import * as THREE from 'three'

const W = 1024
const H = 640

function wrap(g, text, maxWidth, maxLines) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (g.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = w
      if (lines.length === maxLines) break
    } else {
      line = next
    }
  }
  if (lines.length < maxLines && line) lines.push(line)
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'
  }
  return lines
}

// Draws one project card (title, flow, summary, stack) onto a canvas texture.
export function makePanelTexture(item, index) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')

  // card body with a fine gold hairline
  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, 'rgba(18, 28, 58, 0.93)')
  bg.addColorStop(1, 'rgba(7, 11, 26, 0.93)')
  g.fillStyle = bg
  g.beginPath()
  g.roundRect(4, 4, W - 8, H - 8, 34)
  g.fill()
  const rim = g.createLinearGradient(0, 0, W, H)
  rim.addColorStop(0, 'rgba(255, 213, 143, 0.85)')
  rim.addColorStop(0.5, 'rgba(217, 160, 102, 0.3)')
  rim.addColorStop(1, 'rgba(255, 213, 143, 0.7)')
  g.strokeStyle = rim
  g.lineWidth = 3
  g.stroke()

  // soft light in the top-left corner
  const glow = g.createRadialGradient(160, 80, 0, 160, 80, 520)
  glow.addColorStop(0, 'rgba(255, 190, 120, 0.16)')
  glow.addColorStop(1, 'rgba(255, 190, 120, 0)')
  g.fillStyle = glow
  g.fillRect(0, 0, W, H)

  const pad = 64
  g.textBaseline = 'alphabetic'

  g.fillStyle = '#ffb85c'
  g.font = 'italic 400 56px Fraunces, Georgia, serif'
  g.fillText(String(index + 1).padStart(2, '0'), pad, 104)

  g.fillStyle = 'rgba(255, 238, 222, 0.62)'
  g.font = '500 24px "Space Grotesk", system-ui, sans-serif'
  g.textAlign = 'right'
  g.fillText(item.year ?? '', W - pad, 98)
  g.textAlign = 'left'
  g.font = '400 24px ui-monospace, Consolas, monospace'
  g.fillText(item.flow ?? '', pad + 92, 98)

  g.fillStyle = '#fff4e6'
  g.font = '600 64px Fraunces, Georgia, serif'
  const titleLines = wrap(g, item.title, W - pad * 2, 2)
  titleLines.forEach((l, i) => g.fillText(l, pad, 200 + i * 72))

  const y0 = 200 + titleLines.length * 72 + 8
  g.fillStyle = 'rgba(255, 238, 222, 0.78)'
  g.font = '400 28px "Space Grotesk", system-ui, sans-serif'
  wrap(g, item.summary, W - pad * 2, 3).forEach((l, i) => g.fillText(l, pad, y0 + i * 40))

  // stack chips along the bottom
  let x = pad
  const y = H - pad - 10
  g.font = '500 22px "Space Grotesk", system-ui, sans-serif'
  for (const s of item.stack ?? []) {
    const w = g.measureText(s).width + 32
    if (x + w > W - pad) break
    g.fillStyle = 'rgba(255, 240, 225, 0.08)'
    g.strokeStyle = 'rgba(255, 213, 143, 0.35)'
    g.lineWidth = 1.5
    g.beginPath()
    g.roundRect(x, y - 30, w, 44, 22)
    g.fill()
    g.stroke()
    g.fillStyle = 'rgba(255, 238, 222, 0.85)'
    g.fillText(s, x + 16, y)
    x += w + 12
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export const PANEL_ASPECT = W / H
