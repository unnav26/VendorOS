import React, { useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

interface PixelatedCanvasProps {
  src: string
  width?: number
  height?: number
  cellSize?: number
  dotScale?: number
  shape?: "square" | "circle"
  backgroundColor?: string
  dropoutStrength?: number
  interactive?: boolean
  distortionStrength?: number
  distortionRadius?: number
  distortionMode?: "swirl" | "push" | "pull"
  followSpeed?: number
  jitterStrength?: number
  jitterSpeed?: number
  sampleAverage?: boolean
  tintColor?: string
  tintStrength?: number
  className?: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function PixelatedCanvas({
  src,
  width = 400,
  height = 500,
  cellSize = 4,
  dotScale = 0.8,
  shape = "circle",
  backgroundColor = "#000000",
  dropoutStrength = 0,
  interactive = false,
  distortionStrength = 5,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.15,
  jitterStrength = 0,
  jitterSpeed = 2,
  sampleAverage = false,
  tintColor = "#ffffff",
  tintStrength = 0,
  className,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -10000, y: -10000 })
  const targetRef = useRef({ x: -10000, y: -10000 })
  const pixelDataRef = useRef<ImageData | null>(null)
  const dropoutRef = useRef<Uint8Array>(new Uint8Array(0))
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cols = Math.ceil(width / cellSize)
    const rows = Math.ceil(height / cellSize)
    const totalCells = cols * rows

    // Pre-compute dropout mask
    const dropout = new Uint8Array(totalCells)
    for (let i = 0; i < totalCells; i++) {
      dropout[i] = Math.random() < dropoutStrength ? 1 : 0
    }
    dropoutRef.current = dropout

    const [tr, tg, tb] = hexToRgb(tintColor)

    const img = new Image()
    img.onload = () => {
      const off = document.createElement("canvas")
      off.width = width
      off.height = height
      const offCtx = off.getContext("2d")!
      offCtx.drawImage(img, 0, 0, width, height)
      pixelDataRef.current = offCtx.getImageData(0, 0, width, height)

      const draw = (timestamp: number) => {
        // Smooth mouse follow (lerp, ~60fps-normalised)
        if (interactive) {
          const spd = followSpeed
          mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * spd
          mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * spd
        }

        ctx.clearRect(0, 0, width, height)
        if (backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, width, height)
        }

        const data = pixelDataRef.current!.data
        const mx = mouseRef.current.x
        const my = mouseRef.current.y

        let cellIdx = 0
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++, cellIdx++) {
            if (dropout[cellIdx]) continue

            const cx = col * cellSize + cellSize / 2
            const cy = row * cellSize + cellSize / 2

            let sx = cx
            let sy = cy

            // Distortion
            if (interactive) {
              const ddx = cx - mx
              const ddy = cy - my
              const dist = Math.sqrt(ddx * ddx + ddy * ddy)
              if (dist < distortionRadius && dist > 0.01) {
                const t = 1 - dist / distortionRadius
                if (distortionMode === "swirl") {
                  const angle = t * distortionStrength * 0.15
                  const cos = Math.cos(angle)
                  const sin = Math.sin(angle)
                  sx = mx + cos * ddx - sin * ddy
                  sy = my + sin * ddx + cos * ddy
                } else if (distortionMode === "push") {
                  sx = cx + (ddx / dist) * t * distortionStrength
                  sy = cy + (ddy / dist) * t * distortionStrength
                } else if (distortionMode === "pull") {
                  sx = cx - (ddx / dist) * t * distortionStrength
                  sy = cy - (ddy / dist) * t * distortionStrength
                }
              }
            }

            // Jitter
            if (jitterStrength > 0) {
              const t = timestamp * 0.001 * jitterSpeed
              sx += Math.sin(t + col * 1.3 + row * 0.7) * jitterStrength
              sy += Math.cos(t + row * 1.3 + col * 0.7) * jitterStrength
            }

            const sxi = Math.max(0, Math.min(width - 1, Math.round(sx)))
            const syi = Math.max(0, Math.min(height - 1, Math.round(sy)))

            let r: number, g: number, b: number, a: number

            if (sampleAverage) {
              let rs = 0, gs = 0, bs = 0, as = 0, n = 0
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const px = Math.max(0, Math.min(width - 1, sxi + dx))
                  const py = Math.max(0, Math.min(height - 1, syi + dy))
                  const i4 = (py * width + px) * 4
                  rs += data[i4]; gs += data[i4 + 1]; bs += data[i4 + 2]; as += data[i4 + 3]
                  n++
                }
              }
              r = rs / n; g = gs / n; b = bs / n; a = as / n
            } else {
              const i4 = (syi * width + sxi) * 4
              r = data[i4]; g = data[i4 + 1]; b = data[i4 + 2]; a = data[i4 + 3]
            }

            if (a < 8) continue

            if (tintStrength > 0) {
              r = r + (tr - r) * tintStrength
              g = g + (tg - g) * tintStrength
              b = b + (tb - b) * tintStrength
            }

            ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`
            const dotR = (cellSize * dotScale) / 2
            if (shape === "circle") {
              ctx.beginPath()
              ctx.arc(cx, cy, dotR, 0, Math.PI * 2)
              ctx.fill()
            } else {
              const ds = cellSize * dotScale
              ctx.fillRect(cx - ds / 2, cy - ds / 2, ds, ds)
            }
          }
        }

        rafRef.current = requestAnimationFrame(draw)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    img.src = src

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [src, width, height, cellSize, dotScale, shape, backgroundColor, dropoutStrength,
      interactive, distortionStrength, distortionRadius, distortionMode,
      followSpeed, jitterStrength, jitterSpeed, sampleAverage, tintColor, tintStrength])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return
    const rect = canvasRef.current!.getBoundingClientRect()
    targetRef.current = {
      x: (e.clientX - rect.left) * (width / rect.width),
      y: (e.clientY - rect.top) * (height / rect.height),
    }
  }

  const handleMouseLeave = () => {
    targetRef.current = { x: -10000, y: -10000 }
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("cursor-crosshair", className)}
      style={{ width, height }}
    />
  )
}
