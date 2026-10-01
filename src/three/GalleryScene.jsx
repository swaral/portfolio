import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'
import { makePanelTexture, PANEL_ASPECT } from './panelTexture.js'

const RADIUS = 3
const PANEL_W = 2.3
const PANEL_H = PANEL_W / PANEL_ASPECT
const CAM = [0, 0.8, 7.8]
const FOV = 32

function Panel({ item, index, angle, ringRot, onPick, drag }) {
  const tex = useMemo(() => makePanelTexture(item, index), [item, index])
  const holder = useRef()
  const face = useRef()

  useFrame((state, dt) => {
    // 1 when this panel faces the camera, lower as it turns away
    const front = Math.max(0, Math.cos(angle + ringRot.current))
    const s = 0.84 + 0.16 * front
    holder.current.scale.setScalar(THREE.MathUtils.damp(holder.current.scale.x, s, 6, dt))
    holder.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + index * 1.7) * 0.05
    face.current.opacity = THREE.MathUtils.damp(face.current.opacity, 0.3 + 0.7 * front, 6, dt)
  })

  return (
    <group rotation-y={angle}>
      <group ref={holder} position={[0, 0, RADIUS]}>
        <RoundedBox args={[PANEL_W + 0.08, PANEL_H + 0.08, 0.07]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial
            color="#eef3ff"
            transparent
            opacity={0.22}
            roughness={0.08}
            clearcoat={1}
            iridescence={0.7}
            iridescenceIOR={1.3}
            envMapIntensity={1.6}
          />
        </RoundedBox>
        <mesh
          position={[0, 0, 0.04]}
          onClick={(e) => {
            e.stopPropagation()
            if (!drag.current.moved) onPick(index)
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <planeGeometry args={[PANEL_W, PANEL_H]} />
          <meshBasicMaterial ref={face} map={tex} transparent opacity={0.3} toneMapped={false} />
        </mesh>
        <mesh position={[0, -PANEL_H / 2 - 0.16, 0]}>
          <boxGeometry args={[0.7, 0.018, 0.018]} />
          <meshBasicMaterial color="#f2c47e" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Ring({ items, active, onSelect, drag }) {
  const group = useRef()
  const rot = useRef(0)
  const target = useRef(0)
  const step = (Math.PI * 2) / items.length
  const size = useThree((s) => s.size)

  // shrink the ring on narrow screens so the front panel always fits
  const dist = CAM[2] - RADIUS
  const visibleW = 2 * dist * Math.tan(((FOV / 2) * Math.PI) / 180) * (size.width / size.height)
  const fit = Math.min(1, (visibleW * 0.82) / PANEL_W)

  useEffect(() => {
    drag.current.getRot = () => rot.current
  }, [drag])

  // turn the shortest way round to the selected panel
  useEffect(() => {
    const base = -active * step
    const turns = Math.round((rot.current - base) / (Math.PI * 2))
    target.current = base + turns * Math.PI * 2
  }, [active, step])

  useFrame((state, dt) => {
    const d = drag.current
    if (d.dragging) {
      rot.current = d.startRot + d.dx * 0.006
      target.current = rot.current
    } else {
      if (d.released) {
        d.released = false
        // use the full drag distance, even if no frame ran during a quick flick
        const idx = Math.round(-(d.startRot + d.dx * 0.006) / step)
        target.current = -idx * step
        onSelect(((idx % items.length) + items.length) % items.length)
      }
      rot.current = THREE.MathUtils.damp(rot.current, target.current, 4.5, dt)
    }
    group.current.rotation.y = rot.current + Math.sin(state.clock.elapsedTime * 0.35) * 0.015
  })

  return (
    <group ref={group} scale={fit}>
      {items.map((item, i) => (
        <Panel key={item.title} item={item} index={i} angle={i * step} ringRot={rot} onPick={onSelect} drag={drag} />
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, -PANEL_H / 2 - 0.3, 0]}>
        <ringGeometry args={[RADIUS + 0.35, RADIUS + 0.38, 160]} />
        <meshBasicMaterial color="#ffc27a" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function GalleryScene({ items, active, onSelect, drag }) {
  const [fontsReady, setFontsReady] = useState(false)

  // the panels are drawn on canvases, so wait for the web fonts first
  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.load('600 64px Fraunces'),
      document.fonts.load('italic 400 56px Fraunces'),
      document.fonts.load('400 28px "Space Grotesk"'),
      document.fonts.load('500 22px "Space Grotesk"'),
    ])
      .catch(() => {})
      .finally(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: CAM, fov: FOV }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, -0.15, 1.6)}
    >
      <ambientLight intensity={0.5} color="#dfe8ff" />
      <spotLight position={[0, 6, 6]} angle={0.55} penumbra={1} intensity={80} color="#ffd9a8" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffd6a3" position={[0, 4, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#6f8cff" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#4fb3c8" position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>

      {fontsReady && <Ring items={items} active={active} onSelect={onSelect} drag={drag} />}

      <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={12} blur={2.8} far={3} color="#02040c" />
      <Sparkles count={40} scale={[9, 3, 7]} size={2} speed={0.3} color="#ffe2b0" opacity={0.6} />
    </Canvas>
  )
}
