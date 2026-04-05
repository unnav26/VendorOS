import React, { useRef, useEffect, useId } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "../../lib/utils"

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  opacityDelta: number
}

interface SparklesCoreProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  particleColor?: string
  speed?: number
}

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = "#FFFFFF",
  speed = 1,
}: SparklesCoreProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const rafRef = useRef<number>()
  const controls = useAnimation()
  const generatedId = useId()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      spawnParticles()
    }

    const spawnParticles = () => {
      if (!canvas.width || !canvas.height) return
      const count = Math.max(
        1,
        Math.floor((canvas.width * canvas.height * particleDensity) / 240000)
      )
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random(),
        vx: (Math.random() - 0.5) * 0.3 * speed,
        vy: (Math.random() - 0.5) * 0.3 * speed,
        opacityDelta: (Math.random() * 0.008 + 0.003) * speed,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (background !== "transparent") {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.opacity += p.opacityDelta
        if (p.opacity >= 1) { p.opacity = 1; p.opacityDelta *= -1 }
        if (p.opacity <= 0) { p.opacity = 0; p.opacityDelta *= -1 }
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()
    controls.start({ opacity: 1, transition: { duration: 1 } })

    return () => {
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [background, minSize, maxSize, particleDensity, particleColor, speed, controls])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn("h-full w-full", className)}
    >
      <canvas
        ref={canvasRef}
        id={id ?? generatedId}
        className="h-full w-full"
      />
    </motion.div>
  )
}
