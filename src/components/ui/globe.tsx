import { useEffect, useRef } from "react"
import * as THREE from "three"

/* ─── types ─────────────────────────────────────────────────── */

export interface ArcData {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export interface GlobeConfig {
  globeColor: string
  showAtmosphere: boolean
  atmosphereColor: string
  atmosphereAltitude: number
  ambientLight: string
  directionalLeftLight: string
  directionalTopLight: string
  arcTime: number
  arcLength: number
  autoRotate: boolean
  autoRotateSpeed: number
  initialPosition: { lat: number; lng: number }
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
}

/* ─── helpers ───────────────────────────────────────────────── */

function toVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

/* ─── World ─────────────────────────────────────────────────── */

interface WorldProps {
  data: ArcData[]
  globeConfig: GlobeConfig
}

export function World({ data, globeConfig }: WorldProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    /* scene */
    const scene = new THREE.Scene()

    /* camera — positioned based on initialPosition */
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    const camPos = toVec3(
      globeConfig.initialPosition.lat,
      globeConfig.initialPosition.lng,
      2.8
    )
    camera.position.copy(camPos)
    camera.lookAt(0, 0, 0)

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    /* root group — everything rotates together */
    const root = new THREE.Group()
    scene.add(root)

    /* globe sphere */
    const globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: globeConfig.globeColor,
        emissive: globeConfig.emissive ?? globeConfig.globeColor,
        emissiveIntensity: globeConfig.emissiveIntensity ?? 0.1,
        shininess: (globeConfig.shininess ?? 0.9) * 100,
      })
    )
    root.add(globeMesh)

    /* atmosphere */
    if (globeConfig.showAtmosphere) {
      root.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1 + globeConfig.atmosphereAltitude * 1.5, 64, 64),
          new THREE.MeshPhongMaterial({
            color: globeConfig.atmosphereColor,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
          })
        )
      )
    }

    /* lights */
    scene.add(new THREE.AmbientLight(globeConfig.ambientLight, 0.8))
    const dLeft = new THREE.DirectionalLight(globeConfig.directionalLeftLight, 1)
    dLeft.position.set(-5, 3, 5)
    scene.add(dLeft)
    const dTop = new THREE.DirectionalLight(globeConfig.directionalTopLight, 0.6)
    dTop.position.set(0, 10, 0)
    scene.add(dTop)

    /* arcs — animated via dash offset */
    const arcObjects: { line: THREE.Line; mat: THREE.LineDashedMaterial; progress: number; speed: number }[] = []

    data.forEach((arc) => {
      const start = toVec3(arc.startLat, arc.startLng, 1)
      const end = toVec3(arc.endLat, arc.endLng, 1)
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .normalize()
        .multiplyScalar(1 + arc.arcAlt * 1.5)

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const pts = curve.getPoints(60)
      const geo = new THREE.BufferGeometry().setFromPoints(pts)

      const mat = new THREE.LineDashedMaterial({
        color: arc.color,
        transparent: true,
        opacity: 0.85,
        dashSize: 0.12,
        gapSize: 0.06,
      })

      const line = new THREE.Line(geo, mat)
      line.computeLineDistances()
      root.add(line)
      arcObjects.push({ line, mat, progress: Math.random(), speed: 0.004 + Math.random() * 0.003 })
    })

    /* animation loop */
    let rafId: number
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      /* auto-rotate the root group */
      if (globeConfig.autoRotate) {
        root.rotation.y += globeConfig.autoRotateSpeed * 0.004
      }

      /* animate arc dash offset for a "travelling" effect */
      arcObjects.forEach(({ mat, progress: _p }, i) => {
        arcObjects[i].progress = (arcObjects[i].progress + arcObjects[i].speed) % 1
        mat.dashOffset = -arcObjects[i].progress * 2
      })

      renderer.render(scene, camera)
    }
    animate()

    /* resize */
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, []) // intentionally run once on mount

  return <div ref={mountRef} className="w-full h-full" />
}
