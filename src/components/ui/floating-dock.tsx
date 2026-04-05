import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { LayoutGrid } from "lucide-react"
import { cn } from "../../lib/utils"

export interface DockItem {
  title: string
  icon: React.ReactNode
  href: string
}

export const FloatingDock = ({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
}) => (
  <>
    <FloatingDockDesktop items={items} className={className} />
    <FloatingDockMobile items={items} />
  </>
)

/* ─── Mobile ─────────────────────────────────────────────────── */

const FloatingDockMobile = ({ items }: { items: DockItem[] }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative block md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (items.length - 1 - idx) * 0.05 } }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
              >
                <Link
                  to={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800"
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700"
      >
        <LayoutGrid className="h-4 w-4 text-zinc-400" />
      </button>
    </div>
  )
}

/* ─── Desktop ────────────────────────────────────────────────── */

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
}) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-14 items-end gap-3 rounded-2xl bg-surface/90 border border-zinc-800 backdrop-blur-md px-4 pb-2.5 md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  title: string
  icon: React.ReactNode
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const size = useSpring(
    useTransform(distance, [-120, 0, 120], [36, 58, 36]),
    { mass: 0.1, stiffness: 160, damping: 12 }
  )
  const iconSize = useSpring(
    useTransform(distance, [-120, 0, 120], [16, 28, 16]),
    { mass: 0.1, stiffness: 160, damping: 12 }
  )

  return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              className="absolute -top-8 left-1/2 whitespace-nowrap rounded-md bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-200"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center text-zinc-300"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  )
}
