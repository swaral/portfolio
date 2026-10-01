import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { ease, light, now, WORLD_H } from './light.js'
import { knobGeometry, makeRattanTexture, petalGeometry } from './rattan.js'

const BEADS = 16
const SPACING = 0.042
const CHAIN_TOP = -0.62
const BULB_Y = -0.44

// Soft volumetric-looking beam: brightest at the bulb, fading down and at the edges.
const coneVS = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const coneFS = /* glsl */ `
  uniform float uI;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float facing = clamp(abs(dot(normalize(vNormal), normalize(vView))), 0.0001, 1.0);
    float edge = pow(facing, 2.2);
    float fade = pow(clamp(vUv.y, 0.0001, 1.0), 1.9);
    gl_FragColor = vec4(vec3(1.0, 0.62, 0.3), clamp(edge * fade * uI, 0.0, 1.0));
  }
`

export default function Lamp3D({ on, onToggle }) {
  const size = useThree((s) => s.size)
  const worldW = (WORLD_H * size.width) / size.height
  const scale = Math.min(1.1, worldW / 4.4)
  // hang the cap just below the navigation bar (about 110px from the top)
  const top = WORLD_H / 2 - (110 / size.height) * WORLD_H - 0.25 * scale

  const tex = useMemo(() => makeRattanTexture(), [])
  const topGeo = useMemo(() => petalGeometry({ length: 1.4, width: 1.05, droop: 0.34, cup: 0.14 }), [])
  const lowGeo = useMemo(() => petalGeometry({ length: 0.9, width: 0.85, droop: 0.2, cup: 0.18 }), [])
  const knobGeo = useMemo(() => knobGeometry(), [])
  const rattan = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tex,
        bumpMap: tex,
        bumpScale: 4,
        color: '#f3d8ad',
        roughness: 0.85,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#ff8a2a'),
        emissiveMap: tex,
        emissiveIntensity: 0,
      }),
    [tex],
  )
  const bulbMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#fff4dd', emissive: new THREE.Color('#ffc978'), emissiveIntensity: 0, roughness: 0.2 }),
    [],
  )
  const coneUniforms = useMemo(() => ({ uI: { value: 0 } }), [])

  const rig = useRef()
  const shade = useRef()
  const bulbLight = useRef()
  const beads = useRef([])
  const knob = useRef()
  const coneMat = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const e = ease(light.level)
    const b = light.bulb

    rattan.emissiveIntensity = 0.12 * b
    bulbMat.emissiveIntensity = 0.05 + 7 * b
    bulbLight.current.intensity = 3.2 * b
    coneMat.current.uniforms.uI.value = 0.45 * b * (0.6 + 0.4 * e)

    // gentle idle sway, plus a swing after each pull
    const pt = now() - light.pullSince
    const swing = pt < 4 ? 0.012 * Math.sin(pt * 3) * Math.exp(-pt * 1.1) : 0
    rig.current.rotation.z = Math.sin(t * 0.6) * 0.004 + swing

    // the shade turns slowly and leans toward the pointer
    shade.current.rotation.y = t * 0.12
    shade.current.rotation.x = THREE.MathUtils.lerp(shade.current.rotation.x, -state.pointer.y * 0.06, 0.05)

    // chain stretches down and springs back on a pull
    const tug = pt < 0.8 ? Math.sin((Math.PI * pt) / 0.8) * 0.28 : 0
    const k = 1 + tug / (BEADS * SPACING)
    beads.current.forEach((m, i) => {
      if (m) m.position.y = CHAIN_TOP - i * SPACING * k
    })
    knob.current.position.y = CHAIN_TOP - BEADS * SPACING * k
  })

  const setCursor = (c) => () => (document.body.style.cursor = c)

  return (
    <group ref={rig} position={[0, top + 6, 0]}>
      <group position={[0, -6, 0]} scale={scale}>
        {/* cord and cap */}
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 6.4, 6]} />
          <meshStandardMaterial color="#141214" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a171b" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
          <meshStandardMaterial color="#c89b55" metalness={1} roughness={0.3} />
        </mesh>

        {/* two tiers of woven petals */}
        <group ref={shade}>
          {Array.from({ length: 5 }, (_, i) => (
            <group key={`t${i}`} rotation-y={(i * Math.PI * 2) / 5}>
              <mesh geometry={topGeo} material={rattan} position={[0, 0, 0.06]} rotation-x={0.14} />
            </group>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <group key={`l${i}`} rotation-y={(i * Math.PI * 2) / 5 + Math.PI / 5}>
              <mesh geometry={lowGeo} material={rattan} position={[0, -0.12, 0.05]} rotation-x={0.62} />
            </group>
          ))}
        </group>

        {/* socket, bulb and its light */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.14, 16]} />
          <meshStandardMaterial color="#2a2426" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, BULB_Y, 0]} material={bulbMat}>
          <sphereGeometry args={[0.12, 32, 16]} />
        </mesh>
        <pointLight ref={bulbLight} position={[0, BULB_Y, 0]} color="#ffb366" intensity={0} distance={8} decay={2} />

        {/* beam of light pouring down */}
        <mesh position={[0, BULB_Y - 3.2, 0]} renderOrder={5}>
          <cylinderGeometry args={[0.1, 3.4, 6.4, 64, 1, true]} />
          <shaderMaterial
            ref={coneMat}
            uniforms={coneUniforms}
            vertexShader={coneVS}
            fragmentShader={coneFS}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        {on && <Sparkles count={60} scale={[2.6, 3.4, 2]} position={[0, -2.4, 0]} size={2.4} speed={0.35} color="#ffe2b0" opacity={0.9} />}

        {/* bead chain and wooden pull knob */}
        {Array.from({ length: BEADS }, (_, i) => (
          <mesh key={i} ref={(m) => (beads.current[i] = m)} position={[0, CHAIN_TOP - i * SPACING, 0]}>
            <sphereGeometry args={[0.016, 10, 8]} />
            <meshStandardMaterial color="#dcbc7c" metalness={1} roughness={0.3} />
          </mesh>
        ))}
        <group ref={knob} position={[0, CHAIN_TOP - BEADS * SPACING, 0]}>
          <mesh geometry={knobGeo}>
            <meshPhysicalMaterial color="#c68c50" roughness={0.4} clearcoat={0.7} clearcoatRoughness={0.3} />
          </mesh>
          <mesh
            position={[0, -0.1, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            onPointerOver={setCursor('pointer')}
            onPointerOut={setCursor('')}
          >
            <sphereGeometry args={[0.24, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
