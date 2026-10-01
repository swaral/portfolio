import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ease, light } from './light.js'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

// Animated sunset gradient: soft colour blobs drifting over a plum base.
// uLevel fades it from dull (grey-ish, dim) to full colour.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uLevel;
  uniform float uScroll;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float blob(vec2 p, vec2 c, float r) { vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    float a = uAspect;
    float t = uTime * 0.06;
    float s = uScroll;

    // midnight navy palette with a warm gold glow
    vec3 plum    = vec3(0.03, 0.05, 0.11);  // ink
    vec3 wine    = vec3(0.06, 0.10, 0.22);  // navy
    vec3 magenta = vec3(0.10, 0.17, 0.35);  // deep blue
    vec3 coral   = vec3(0.14, 0.24, 0.46);  // steel blue
    vec3 amber   = vec3(0.72, 0.55, 0.30);  // muted gold
    vec3 violet  = vec3(0.20, 0.18, 0.44);  // dusk violet
    vec3 indigo  = vec3(0.05, 0.26, 0.32);  // deep teal

    // diagonal base: deep plum top-left to warm amber bottom-right
    float d = clamp(vUv.x * 0.35 + (1.0 - vUv.y) * 0.8 - s * 0.15, 0.0, 1.0);
    vec3 col = mix(plum, wine, smoothstep(0.0, 0.3, d));
    col = mix(col, magenta, smoothstep(0.25, 0.6, d));
    col = mix(col, coral, smoothstep(0.55, 0.85, d));
    col = mix(col, amber, smoothstep(0.85, 1.05, d) * 0.35);

    col = mix(col, magenta, blob(p, vec2(a * (0.15 + 0.08 * sin(t * 2.1)), 0.82 + 0.08 * cos(t * 1.7) - s * 0.3), 0.55) * 0.75);
    col = mix(col, coral,   blob(p, vec2(a * (0.88 + 0.07 * cos(t * 1.3)), 0.30 + 0.10 * sin(t * 1.9) + s * 0.25), 0.60) * 0.70);
    col = mix(col, amber,   blob(p, vec2(a * (0.28 + 0.10 * sin(t * 1.1 + s * 3.0)), 0.0 + 0.06 * cos(t * 2.3)), 0.45) * 0.4);
    col = mix(col, violet,  blob(p, vec2(a * (0.95 + 0.05 * sin(t * 1.5)), 0.88 - s * 0.4), 0.50) * 0.75);
    col = mix(col, indigo,  blob(p, vec2(a * (0.55 + 0.15 * sin(t * 0.9 + s * 4.0)), 1.1), 0.40) * 0.55);

    float grey = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(grey), col, 0.45 + 0.55 * uLevel) * (0.70 + 0.30 * uLevel) * 0.97;
    col += (hash(vUv * vec2(1733.0, 977.0) + fract(uTime)) - 0.5) * 0.02;

    gl_FragColor = vec4(pow(max(col, 0.0), vec3(2.2)), 1.0);
  }
`

export default function Backdrop() {
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uLevel: { value: 0 }, uScroll: { value: 0 }, uAspect: { value: 1 } }),
    [],
  )

  const mat = useRef()

  useFrame((state) => {
    // r3f copies the uniforms object, so update the material's own copy
    const u = mat.current.uniforms
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    u.uTime.value = state.clock.elapsedTime
    u.uLevel.value = ease(light.level)
    u.uScroll.value = window.scrollY / max
    u.uAspect.value = state.size.width / state.size.height
  })

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
