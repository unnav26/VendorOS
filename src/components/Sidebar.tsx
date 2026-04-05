import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Home,
  Truck,
  FileText,
  BarChart3,
  Receipt,
} from "lucide-react"
import { cn } from "../lib/utils"
import { Sidebar, SidebarBody, useSidebar } from "./ui/sidebar"
import eyLogo from "../../ey-white-logo.png"

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shipmentx", label: "ShipmentX", icon: Truck },
  { to: "/quotationx", label: "QuotationX", icon: FileText },
  { to: "/statusx", label: "StatusX", icon: BarChart3 },
  { to: "/invoicex", label: "InvoiceX", icon: Receipt },
]

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const { open, animate } = useSidebar()
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors overflow-hidden",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        )
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="whitespace-pre"
      >
        {label}
      </motion.span>
    </NavLink>
  )
}

function SidebarLogo() {
  const { open, animate } = useSidebar()
  return (
    <div className="flex items-center gap-3 px-2 py-3 mb-1">
      <img src={eyLogo} alt="EY" className="h-6 w-auto shrink-0" />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="text-white font-bold text-base whitespace-pre tracking-tight"
      >
        VendorOS
      </motion.span>
    </div>
  )
}

function SidebarFooter() {
  const { open, animate } = useSidebar()
  return (
    <div className="px-2 py-4 border-t border-zinc-800">
      <motion.div
        animate={{
          display: animate ? (open ? "block" : "none") : "block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-xs text-zinc-600">MRO Outsourcing Platform</p>
        <p className="text-xs text-zinc-700 mt-0.5">v1.0 · Pilot MVP</p>
      </motion.div>
    </div>
  )
}

function SidebarContents() {
  return (
    <div className="flex flex-col h-full bg-background border-r border-zinc-800">
      <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto px-3 py-4">
        <SidebarLogo />
        <div className="mt-4 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </div>
      <SidebarFooter />
    </div>
  )
}

export default function AppSidebar() {
  return (
    <Sidebar animate={true}>
      <SidebarBody className="p-0">
        <SidebarContents />
      </SidebarBody>
    </Sidebar>
  )
}
