import React, { useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (!node) return null
  const style = window.getComputedStyle(node)
  if (style.overflowY === "auto" || style.overflowY === "scroll") return node
  return getScrollParent(node.parentElement)
}

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(0)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scrollParent = getScrollParent(el.parentElement)
    const target: HTMLElement | (Window & typeof globalThis) = scrollParent ?? window

    const update = () => {
      const rect = el.getBoundingClientRect()
      const viewportHeight =
        target instanceof Window ? window.innerHeight : (target as HTMLElement).clientHeight

      // 0 when card bottom is at viewport bottom, 1 when card top reaches viewport top
      const raw = 1 - rect.bottom / viewportHeight
      scrollProgress.set(Math.max(0, Math.min(1, raw)))
    }

    target.addEventListener("scroll", update)
    update()
    return () => target.removeEventListener("scroll", update)
  }, [scrollProgress])

  const rotate = useTransform(scrollProgress, [0, 0.65], [isMobile ? 12 : 18, 0])
  const scale = useTransform(scrollProgress, [0, 0.65], [isMobile ? 0.85 : 1.04, 1])
  const translateY = useTransform(scrollProgress, [0, 0.65], [0, -60])

  return (
    <div ref={containerRef} className="h-[48rem] md:h-[56rem] flex items-start justify-center relative">
      <div className="w-full relative py-10 md:py-16" style={{ perspective: "1000px" }}>
        {/* Title */}
        <motion.div style={{ translateY }} className="max-w-5xl mx-auto text-center mb-10">
          {titleComponent}
        </motion.div>

        {/* Card */}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
          }}
          className="max-w-5xl mx-auto w-full border-2 border-zinc-700/60 p-1.5 md:p-3 bg-zinc-900 rounded-[24px] shadow-2xl origin-top"
        >
          <div className="h-full w-full overflow-hidden rounded-[18px] bg-surface">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
