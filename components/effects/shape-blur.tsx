'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform vec3 u_color;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

#ifndef VAR
#define VAR 0
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    float aspect = u_resolution.x / u_resolution.y;
    vec2 shapeHalf;
    if (aspect >= 1.0) {
        shapeHalf = vec2(2.1 * aspect, 2.1);
    } else {
        shapeHalf = vec2(2.1, 2.1 / aspect);
    }
    shapeHalf *= size;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        sdf = sdRoundRect(st, shapeHalf, roundness);
        sdf = strokeAA(sdf, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = u_color;
    float alpha = sdf;
    gl_FragColor = vec4(color.rgb, alpha);
}
`

const SHAPE_EDGE_UNIT = 2.1

function hexToColorVector(hex: string): THREE.Vector3 {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  return new THREE.Vector3(r, g, b)
}

/** Map CSS border-radius (px) to the shader roundness uniform. */
function getShaderRoundnessFromContainer(
  container: HTMLElement,
  width: number,
  height: number,
): number {
  const style = getComputedStyle(container)
  const radiusPx = parseFloat(style.borderTopLeftRadius) || 0
  const minDimension = Math.min(width, height)

  if (minDimension <= 0 || radiusPx <= 0) return 0.5

  return (radiusPx / minDimension) * (SHAPE_EDGE_UNIT * 2)
}

export interface ShapeBlurProps {
  className?: string
  variation?: number
  pixelRatioProp?: number
  shapeSize?: number
  roundness?: number
  borderSize?: number
  circleSize?: number
  circleEdge?: number
  borderColor?: string
  trackingContainerRef?: RefObject<HTMLElement | null>
  syncBorderRadius?: boolean
}

export function ShapeBlur({
  className = '',
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1,
  roundness = 0.5,
  borderSize = 0.05,
  circleSize = 0.25,
  circleEdge = 1,
  borderColor = '#fffaf0',
  trackingContainerRef,
  syncBorderRadius = true,
}: ShapeBlurProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let active = true
    let animationFrameId = 0
    let time = 0
    let lastTime = 0

    const vMouse = new THREE.Vector2()
    const vMouseDamp = new THREE.Vector2()
    const vResolution = new THREE.Vector2()

    let w = 1
    let h = 1

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera()
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.pointerEvents = 'none'
    mount.appendChild(renderer.domElement)

    const geo = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: pixelRatioProp },
        u_shapeSize: { value: shapeSize },
        u_roundness: { value: roundness },
        u_borderSize: { value: borderSize },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_color: { value: hexToColorVector(borderColor) },
      },
      defines: { VAR: variation },
      transparent: true,
    })
    materialRef.current = material

    const quad = new THREE.Mesh(geo, material)
    scene.add(quad)

    const onPointerMove = (event: PointerEvent | MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      vMouse.set(event.clientX - rect.left, event.clientY - rect.top)
    }

    const onPointerLeave = () => {
      vMouse.set(w / 2, h / 2)
    }

    const trackingTarget = trackingContainerRef?.current ?? mount

    trackingTarget.addEventListener('pointermove', onPointerMove)
    trackingTarget.addEventListener('pointerleave', onPointerLeave)

    const resize = () => {
      if (!active) return

      w = mount.clientWidth
      h = mount.clientHeight
      const dpr = Math.min(window.devicePixelRatio, pixelRatioProp)

      renderer.setSize(w, h)
      renderer.setPixelRatio(dpr)

      camera.left = -w / 2
      camera.right = w / 2
      camera.top = h / 2
      camera.bottom = -h / 2
      camera.updateProjectionMatrix()

      quad.scale.set(w, h, 1)
      vResolution.set(w, h).multiplyScalar(dpr)
      material.uniforms.u_pixelRatio.value = dpr

      const radiusSource =
        syncBorderRadius && trackingContainerRef?.current
          ? trackingContainerRef.current
          : null

      if (radiusSource) {
        material.uniforms.u_roundness.value = getShaderRoundnessFromContainer(
          radiusSource,
          w,
          h,
        )
      } else {
        material.uniforms.u_roundness.value = roundness
      }

      if (vMouse.x === 0 && vMouse.y === 0) {
        vMouse.set(w / 2, h / 2)
        vMouseDamp.set(w / 2, h / 2)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const resizeObserver = new ResizeObserver(() => {
      if (!active) return
      resize()
    })
    resizeObserver.observe(mount)

    if (trackingContainerRef?.current) {
      resizeObserver.observe(trackingContainerRef.current)
    }

    const update = () => {
      if (!active) return

      time = performance.now() * 0.001
      const dt = time - lastTime
      lastTime = time

      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt)
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(update)
    }
    update()

    return () => {
      active = false

      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      resizeObserver.disconnect()
      trackingTarget.removeEventListener('pointermove', onPointerMove)
      trackingTarget.removeEventListener('pointerleave', onPointerLeave)

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }

      geo.dispose()
      material.dispose()
      materialRef.current = null
      renderer.dispose()
      renderer.forceContextLoss()
    }
  }, [
    variation,
    pixelRatioProp,
    shapeSize,
    roundness,
    borderSize,
    circleSize,
    circleEdge,
    borderColor,
    trackingContainerRef,
    syncBorderRadius,
  ])

  return <div className={`h-full w-full ${className}`} ref={mountRef} />
}
