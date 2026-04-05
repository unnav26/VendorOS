import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import {
  Truck,
  FileText,
  BarChart3,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  XCircle,
} from "lucide-react"

/* ─── layout primitives ─────────────────────────────────────── */

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => (
  <div className={cn("relative overflow-hidden p-6 sm:p-8", className)}>
    {children}
  </div>
)

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-left text-lg font-semibold tracking-tight text-white md:text-xl">
    {children}
  </p>
)

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => (
  <p className="mt-1.5 mb-6 max-w-sm text-left text-sm text-zinc-500 leading-relaxed">
    {children}
  </p>
)

/* ─── SkeletonOne — ShipmentX ────────────────────────────────── */

const shipments = [
  { id: "SHP-4421", po: "PO-7834", vendor: "StandardAero", status: "In Transit", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "SHP-4398", po: "PO-7801", vendor: "Chromalloy", status: "Delivered", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "SHP-4352", po: "PO-7756", vendor: "Heico", status: "Delivered", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "SHP-4301", po: "PO-7700", vendor: "MTU Aero", status: "In Transit", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
]

const SkeletonOne = () => (
  <div className="relative h-full w-full">
    <div className="flex flex-col gap-2">
      {shipments.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
        >
          <div className={`p-1.5 rounded-md ${s.bg}`}>
            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">{s.id}</p>
            <p className="text-[11px] text-zinc-500 truncate">{s.vendor} · {s.po}</p>
          </div>
          <span className={`text-[11px] font-medium ${s.color}`}>{s.status}</span>
        </div>
      ))}
    </div>
    {/* fade out bottom */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent" />
  </div>
)

/* ─── SkeletonTwo — QuotationX ───────────────────────────────── */

const quotes = [
  { vendor: "StandardAero", amount: "$127,500", part: "CFM56-7B MRO", status: "pending" },
  { vendor: "Chromalloy", amount: "$94,200", part: "LPT Blade Repair", status: "approved" },
  { vendor: "Heico", amount: "$89,000", part: "FADEC Overhaul", status: "rejected" },
]

const cardVariants = {
  whileHover: { scale: 1.04, rotate: 0, zIndex: 50 },
}

const SkeletonTwo = () => (
  <div className="relative flex h-full flex-col items-center justify-center gap-3 py-4 overflow-hidden">
    {quotes.map((q, i) => (
      <motion.div
        key={q.vendor}
        variants={cardVariants}
        whileHover="whileHover"
        style={{ rotate: (i - 1) * 3 }}
        className="w-full max-w-[260px] rounded-xl border border-zinc-700/60 bg-zinc-900 p-4 shadow-lg cursor-default"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-white">{q.vendor}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{q.part}</p>
          </div>
          {q.status === "approved" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {q.status === "rejected" && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
          {q.status === "pending" && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}
        </div>
        <p className="text-base font-bold text-white">{q.amount}</p>
        <span className={cn(
          "mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full",
          q.status === "approved" && "bg-emerald-500/10 text-emerald-400",
          q.status === "rejected" && "bg-red-500/10 text-red-400",
          q.status === "pending" && "bg-amber-500/10 text-amber-400",
        )}>
          {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
        </span>
      </motion.div>
    ))}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent z-10" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent z-10" />
  </div>
)

/* ─── SkeletonThree — StatusX ────────────────────────────────── */

const stages = [
  { label: "Induction", done: true },
  { label: "Disassembly", done: true },
  { label: "Inspection", done: true },
  { label: "Repair", done: false, active: true },
  { label: "Assembly", done: false },
  { label: "Test Cell", done: false },
  { label: "Delivery", done: false },
]

const SkeletonThree = () => (
  <div className="h-full w-full flex flex-col justify-center gap-5 py-4">
    <div className="flex items-center justify-between mb-1">
      <div>
        <p className="text-xs font-semibold text-white">CFM56-7B · ENG-0034</p>
        <p className="text-[11px] text-zinc-500">Lufthansa Technik · Week 14</p>
      </div>
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Phase 4</span>
    </div>

    {/* Stage pipeline */}
    <div className="flex items-center gap-1">
      {stages.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className={cn(
              "w-full h-1.5 rounded-full",
              s.done ? "bg-emerald-500" : s.active ? "bg-amber-500" : "bg-zinc-800"
            )} />
            <span className={cn(
              "text-[9px] font-medium text-center leading-tight",
              s.done ? "text-emerald-400" : s.active ? "text-amber-400" : "text-zinc-600"
            )}>
              {s.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>

    {/* Engine list */}
    <div className="flex flex-col gap-2 mt-1">
      {[
        { eng: "V2527-A5 · ENG-0029", vendor: "StandardAero", phase: "Phase 6", color: "text-emerald-400" },
        { eng: "CFM56-5B · ENG-0041", vendor: "MTU Aero", phase: "Phase 2", color: "text-blue-400" },
        { eng: "PW4077 · ENG-0018", vendor: "Chromalloy", phase: "Phase 5", color: "text-emerald-400" },
      ].map((e) => (
        <div key={e.eng} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5">
          <div>
            <p className="text-xs font-semibold text-white">{e.eng}</p>
            <p className="text-[11px] text-zinc-500">{e.vendor}</p>
          </div>
          <span className={`text-[11px] font-medium ${e.color}`}>{e.phase}</span>
        </div>
      ))}
    </div>
  </div>
)

/* ─── SkeletonFour — InvoiceX ────────────────────────────────── */

const invoices = [
  { id: "INV-2024-0892", po: "PO-9021", amount: "$94,200", match: true },
  { id: "INV-2024-0887", po: "PO-8845", amount: "$131,700", match: false, delta: "+$4,200" },
  { id: "INV-2024-0881", po: "PO-8801", amount: "$89,000", match: true },
]

const SkeletonFour = () => (
  <div className="relative h-full w-full flex flex-col gap-3 py-2">
    {invoices.map((inv) => (
      <div key={inv.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-semibold text-white">{inv.id}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{inv.po}</p>
          </div>
          {inv.match
            ? <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Matched</span>
            : <span className="flex items-center gap-1 text-[11px] font-medium text-red-400"><AlertTriangle className="w-3.5 h-3.5" />Mismatch</span>
          }
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white">{inv.amount}</p>
          {!inv.match && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
              {inv.delta} vs PO
            </span>
          )}
        </div>
      </div>
    ))}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
  </div>
)

/* ─── Main export ─────────────────────────────────────────────── */

const features = [
  {
    title: "ShipmentX",
    description:
      "Real-time shipment status via DHL API. Proof of delivery auto-captured and linked to POs — no manual follow-up needed.",
    icon: Truck,
    accentColor: "text-blue-400",
    skeleton: <SkeletonOne />,
    className: "col-span-1 lg:col-span-4 border-b lg:border-r border-zinc-800",
  },
  {
    title: "QuotationX",
    description:
      "Vendor quotes extracted from email, parsed by AI, and surfaced for one-click approval or rejection.",
    icon: FileText,
    accentColor: "text-amber-400",
    skeleton: <SkeletonTwo />,
    className: "col-span-1 lg:col-span-2 border-b border-zinc-800",
  },
  {
    title: "StatusX",
    description:
      "Weekly MRO status parsed from vendor Excel reports. Track every engine across all shops and repair phases.",
    icon: BarChart3,
    accentColor: "text-emerald-400",
    skeleton: <SkeletonThree />,
    className: "col-span-1 lg:col-span-3 lg:border-r border-zinc-800",
  },
  {
    title: "InvoiceX",
    description:
      "Invoices matched against POs and approved quotes. Mismatches flagged instantly with delta amounts highlighted.",
    icon: Receipt,
    accentColor: "text-red-400",
    skeleton: <SkeletonFour />,
    className: "col-span-1 lg:col-span-3",
  },
]

export function FeaturesSection() {
  return (
    <div className="relative mx-auto max-w-6xl pt-2 pb-10">
      {/* Header */}
      <div className="px-4 mb-12 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
          Four Agents. One Platform.
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Every part of MRO outsourcing,
          <br />
          <span className="text-zinc-500 font-normal">handled automatically.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 rounded-xl border border-zinc-800 overflow-hidden">
        {features.map((f) => (
          <FeatureCard key={f.title} className={f.className}>
            <div className="flex items-center gap-2 mb-1">
              <f.icon className={`w-4 h-4 ${f.accentColor}`} />
              <FeatureTitle>{f.title}</FeatureTitle>
            </div>
            <FeatureDescription>{f.description}</FeatureDescription>
            <div className="w-full">{f.skeleton}</div>
          </FeatureCard>
        ))}
      </div>
    </div>
  )
}
