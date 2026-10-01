import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import Backdrop from './Backdrop.jsx'
import Lamp3D from './Lamp3D.jsx'
import Floaters from './Floaters.jsx'
import { CAM_Z, FOV, WORLD_H, ease, light, now, stepLight } from './light.js'

// Drives the light level, and moves the camera with the page scroll so
// the 3D world scrolls in step with the HTML on top of it.
function Director({ onReady }) {
  const key = useRef()
  const fill = useRef()

  useEffect(() => {
    onReady()
  }, [onReady])

  useFrame((state, dt) => {
    stepLight(Math.min(dt, 0.1))
    const e = ease(light.level)
    const cam = state.camera
    cam.position.y = -(window.scrollY / window.innerHeight) * WORLD_H
    cam.position.x += (state.pointer.x * 0.25 - cam.position.x) * Math.min(1, dt * 3)
    cam.lookAt(cam.position.x * 0.5, cam.position.y, 0)
    state.scene.environmentIntensity = 0.35 + 0.65 * e
    key.current.intensity = 0.4 + 1.4 * e
    fill.current.intensity = 0.15 + 0.35 * e
  })

  return (
    <>
      <directionalLight ref={key} position={[3, 5, 5]} color="#ffe2c4" />
      <ambientLight ref={fill} color="#d8e2ff" />
    </>
  )
}

export default function Scene({ on, pulls, onToggle, onReady }) {
  // keep the shared light state in sync with React state
  useEffect(() => {
    if (on !== light.on) {
      light.on = on
      if (on) light.onSince = now()
    }
  }, [on])

  useEffect(() => {
    if (pulls > 0) light.pullSince = now()
  }, [pulls])

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAM_Z], fov: FOV }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <Director onReady={onReady} />
        <Backdrop />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffd6a3" position={[0, 4, -6]} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={2} color="#6f8cff" position={[-6, 0, -2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer form="rect" intensity={2} color="#4fb3c8" position={[6, 0, -2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer form="ring" intensity={3} color="#ffc27a" position={[0, -5, 4]} scale={3} />
        </Environment>

        <Lamp3D on={on} onToggle={onToggle} />
        <Floaters />
        <Sparkles count={260} scale={[16, 70, 6]} position={[0, -32, -2]} size={3} speed={0.25} color="#ffd9a0" opacity={0.55} />

        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={1.1} />
          <Vignette offset={0.3} darkness={0.35} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
