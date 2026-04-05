import React, { useEffect, useRef, useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

/* ─── types ─────────────────────────────────────────────────── */

export interface CardData {
  src: string
  title: string
  category: string
  content: React.ReactNode
}

/* ─── context ───────────────────────────────────────────────── */

const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({ onCardClose: () => {}, currentIndex: 0 })

/* ─── useOutsideClick ───────────────────────────────────────── */

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      callback()
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [ref, callback])
}

/* ─── Carousel ──────────────────────────────────────────────── */

export const Carousel = ({ items }: { items: React.ReactNode[] }) => {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (!railRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    el.addEventListener("scroll", checkScrollability)
    checkScrollability()
    return () => el.removeEventListener("scroll", checkScrollability)
  }, [])

  const scroll = (dir: "left" | "right") => {
    railRef.current?.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" })
  }

  const handleCardClose = (index: number) => {
    if (!railRef.current) return
    const cardW = window.innerWidth < 768 ? 230 : 384
    railRef.current.scrollTo({ left: (cardW + 16) * index, behavior: "smooth" })
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex: 0 }}>
      <div className="relative w-full">
        {/* scrollable rail — breaks out of the padded container */}
        <div
          ref={railRef}
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-8"
        >
          <div className="flex flex-row gap-4 pl-4 pr-[10%]">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* nav buttons */}
        <div className="flex justify-end gap-2 pr-4 pb-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-300" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

/* ─── AppleCard ─────────────────────────────────────────────── */

export const AppleCard = ({
  card,
  index,
}: {
  card: CardData
  index: number
}) => {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const { onCardClose } = useContext(CarouselContext)

  // lock body scroll when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  useOutsideClick(overlayRef, () => { if (open) handleClose() })

  const handleClose = () => {
    setOpen(false)
    onCardClose(index)
  }

  return (
    <>
      {/* ── expanded overlay ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center pt-10 pb-20 px-4">
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* panel */}
            <motion.div
              ref={overlayRef}
              layoutId={`apple-card-${index}`}
              className="relative z-10 w-full max-w-3xl bg-surface rounded-3xl overflow-hidden"
            >
              {/* hero image */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                    {card.category}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-white leading-tight max-w-lg">
                    {card.title}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 h-8 w-8 bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-300" />
                </button>
              </div>

              {/* body */}
              <div className="p-6 md:p-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── card thumbnail ── */}
      <motion.button
        layoutId={`apple-card-${index}`}
        onClick={() => setOpen(true)}
        className="relative h-80 w-56 md:h-[28rem] md:w-80 rounded-3xl overflow-hidden flex flex-col items-start justify-end cursor-pointer shrink-0 group"
      >
        {/* image */}
        <img
          src={card.src}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* text */}
        <div className="relative z-10 p-6">
          <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-2">
            {card.category}
          </p>
          <p className="text-white text-lg md:text-xl font-bold leading-snug text-left max-w-[220px]">
            {card.title}
          </p>
        </div>
      </motion.button>
    </>
  )
}
