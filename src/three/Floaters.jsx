import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { WORLD_H } from './light.js'

// Glass and gold objects that drift beside the content as you scroll down.
const ITEMS = [
  { shape: 'knot', side: 1, z: -1.5, s: 0.5, mat: 'glass' },
  { shape: 'ring', side: -1, z: -1, s: 0.75, mat: 'gold' },
  { shape: 'ico', side: 1, z: -2, s: 0.75, mat: 'glass' },
  { shape: 'sphere', side: -1, z: -1.5, s: 0.5, mat: 'gold' },
  { shape: 'octa', side: 1, z: -1.2, s: 0.65, mat: 'glass' },
  { shape: 'torus', side: -1, z: -2, s: 0.7, mat: 'glass' },
  { shape: 'knot', side: 1, z: -1.5, s: 0.42, mat: 'gold' },
  { shape: 'ico', side: -1, z: -1.2, s: 0.6, mat: 'glass' },
]

function Shape({ shape }) {
  switch (shape) {
    case 'knot':
      return <torusKnotGeometry args={[0.7, 0.24, 160, 24]} />
    case 'ring':
      return <torusGeometry args={[0.8, 0.07, 24, 96]} />
    case 'ico':
      return <icosahedronGeometry args={[0.9, 0]} />
    case 'sphere':
      return <sphereGeometry args={[0.8, 48, 32]} />
    case 'octa':
      return <octahedronGeometry args={[0.9, 0]} />
    default:
      return <torusGeometry args={[0.7, 0.28, 32, 96]} />
  }
}

function Material({ mat }) {
  if (mat === 'gold') return <meshStandardMaterial color="#e7b56c" metalness={1} roughness={0.22} />
  return (
    <meshPhysicalMaterial
      transmission={1}
      roughness={0.08}
      thickness={1.2}
      ior={1.45}
      iridescence={0.8}
      iridescenceIOR={1.3}
      color="#eef3ff"
    />
  )
}

export default function Floaters() {
  const refs = useRef([])
  const size = useThree((s) => s.size)
  const worldW = (WORLD_H * size.width) / size.height
  const narrow = size.width < 700

  // Spread the objects over the full page length, which changes as content loads.
  useFrame(() => {
    const pages = document.documentElement.scrollHeight / window.innerHeight
    const span = Math.max(3, pages - 1) * WORLD_H
    refs.current.forEach((g, i) => {
      if (g) g.position.y = -((i + 0.9) / ITEMS.length) * span
    })
  })

  return ITEMS.map((it, i) => (
    <group
      key={i}
      ref={(g) => (refs.current[i] = g)}
      position={[it.side * worldW * (narrow ? 0.42 : 0.38), -(i + 1) * WORLD_H, it.z]}
    >
      <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh scale={it.s * (narrow ? 0.7 : 1)}>
          <Shape shape={it.shape} />
          <Material mat={it.mat} />
        </mesh>
      </Float>
    </group>
  ))
}
