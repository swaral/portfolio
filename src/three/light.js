// Shared, mutable light state read every frame by the 3D scene.
export const light = {
  on: false,
  level: 0, // 0 = dull, 1 = fully bright (ramps over 2s)
  bulb: 0, // bulb brightness including the warm-up flicker
  onSince: -10,
  pullSince: -10,
}

export const now = () => performance.now() / 1000

// smoothstep easing so the brightening starts and ends softly
export const ease = (x) => x * x * (3 - 2 * x)

const FLICKER = [
  [0, 0],
  [0.09, 0.9],
  [0.21, 0.1],
  [0.37, 0.75],
  [0.51, 0.25],
  [0.75, 1],
]

// Old filament bulb warming up: a few flickers, then steady.
export function flicker(t) {
  if (t >= 0.75) return 1
  for (let i = 1; i < FLICKER.length; i++) {
    const [t1, v1] = FLICKER[i]
    const [t0, v0] = FLICKER[i - 1]
    if (t <= t1) return v0 + ((t - t0) / (t1 - t0)) * (v1 - v0)
  }
  return 1
}

export function stepLight(dt) {
  if (light.on) {
    light.level = Math.min(1, light.level + dt / 2) // 2 seconds to full brightness
    light.bulb = flicker(now() - light.onSince)
  } else {
    light.level = Math.max(0, light.level - dt / 0.5)
    light.bulb = 0
  }
}

// Camera setup shared by everything that needs world-space layout.
export const CAM_Z = 10
export const FOV = 35
export const WORLD_H = 2 * Math.tan(((FOV / 2) * Math.PI) / 180) * CAM_Z
