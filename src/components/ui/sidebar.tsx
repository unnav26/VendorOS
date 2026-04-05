import React, { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider")
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
)

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div>
) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </>
)

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        "h-full flex-col hidden md:flex shrink-0 overflow-hidden",
        className
      )}
      animate={{ width: animate ? (open ? "240px" : "64px") : "240px" }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className="flex md:hidden items-center justify-between w-full h-12 px-4 bg-background border-b border-zinc-800"
      {...props}
    >
      <div className="flex justify-end w-full">
        <Menu
          className="text-zinc-400 cursor-pointer w-5 h-5"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 h-full w-full bg-background p-8 z-[100] flex flex-col",
              className
            )}
          >
            <div
              className="absolute right-6 top-6 text-zinc-400 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
