import * as THREE from 'three'

// Procedural woven-rattan texture drawn on a canvas.
export function makeRattanTexture() {
  const size = 256
  const cells = 16
  const cell = size / cells
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  g.fillStyle = '#6e4a28'
  g.fillRect(0, 0, size, size)

  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const horizontal = (i + j) % 2 === 0
      const x = i * cell
      const y = j * cell
      const grd = horizontal ? g.createLinearGradient(0, y, 0, y + cell) : g.createLinearGradient(x, 0, x + cell, 0)
      grd.addColorStop(0, '#9c7244')
      grd.addColorStop(0.5, '#ecd09f')
      grd.addColorStop(1, '#9c7244')
      g.fillStyle = grd
      g.beginPath()
      g.roundRect(x + 1, y + 1, cell - 2, cell - 2, 4)
      g.fill()
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3.5, 3.5)
  tex.center.set(0.5, 0.5)
  tex.rotation = Math.PI / 4
  tex.anisotropy = 8
  return tex
}

// A leaf-shaped petal that curves downward and cups at the edges.
// It grows along +z from the origin; u runs along the petal, v across it.
export function petalGeometry({ length = 1.2, width = 0.7, droop = 0.45, cup = 0.16, segU = 32, segV = 16 } = {}) {
  const pos = []
  const uv = []
  const idx = []
  for (let i = 0; i <= segU; i++) {
    const u = i / segU
    const half = width * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.95 + 0.05)), 0.7) * (1 - 0.2 * u)
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1
      const x = v * half
      const z = u * length
      const y = -droop * u * u + cup * v * v * Math.sin(Math.PI * u) + 0.1 * Math.pow(u, 6)
      pos.push(x, y, z)
      uv.push(j / segV, u)
    }
  }
  const row = segV + 1
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * row + j
      const b = a + row
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

// Teardrop shape for the wooden pull knob.
export function knobGeometry() {
  const pts = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const r = 0.055 * Math.sin(Math.PI * t) * (0.35 + 0.65 * t)
    pts.push(new THREE.Vector2(Math.max(r, 0.001), -t * 0.2))
  }
  return new THREE.LatheGeometry(pts, 24)
}
