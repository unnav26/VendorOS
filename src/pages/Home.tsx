import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Truck,
  FileText,
  BarChart3,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home as HomeIcon,
} from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { ContainerScroll } from "../components/ui/container-scroll-animation"
import { FeaturesSection } from "../components/ui/features-section"
import { Carousel, AppleCard } from "../components/ui/apple-cards-carousel"
import type { CardData } from "../components/ui/apple-cards-carousel"
import { FloatingDock } from "../components/ui/floating-dock"
import { SparklesCore } from "../components/ui/sparkles"
import { FlipWords } from "../components/ui/flip-words"

const AgentCardContent = ({
  icon: Icon,
  accentColor,
  points,
}: {
  icon: React.ComponentType<{ className?: string }>
  accentColor: string
  points: string[]
}) => (
  <div className="flex flex-col gap-4">
    {points.map((pt, i) => (
      <div key={i} className="flex items-start gap-3 bg-zinc-800/60 rounded-xl p-4">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${accentColor}`} />
        <p className="text-sm text-zinc-300 leading-relaxed">{pt}</p>
      </div>
    ))}
  </div>
)

const carouselCards: CardData[] = [
  {
    category: "Logistics",
    title: "Real-time DHL shipment tracking & proof of delivery.",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    content: (
      <AgentCardContent
        icon={Truck}
        accentColor="text-blue-400"
        points={[
          "Connects directly to the DHL API to pull live shipment status for every active PO — no manual tracking needed.",
          "Proof of delivery documents are automatically captured and stored against the relevant purchase order.",
          "Status auto-refreshes every 24 hours. Alerts raised immediately when a shipment is delayed or stuck in customs.",
          "Supports both inbound (parts from MRO shops) and outbound (aircraft components to stations) shipment flows.",
        ]}
      />
    ),
  },
  {
    category: "Procurement",
    title: "AI-parsed vendor quotations. One-click approve or reject.",
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2022&auto=format&fit=crop",
    content: (
      <AgentCardContent
        icon={FileText}
        accentColor="text-amber-400"
        points={[
          "Vendor quotes arriving by email are parsed automatically — line items, totals, validity dates, and part numbers extracted without human input.",
          "Quotes are surfaced in a structured review table. One click approves and triggers a purchase order; one click rejects with a reason log.",
          "Approval history and audit trail maintained for every quote decision, keeping procurement compliant and traceable.",
          "Budget threshold rules flag any quote that exceeds the authorised limit before it reaches an approver.",
        ]}
      />
    ),
  },
  {
    category: "Operations",
    title: "Weekly engine work status, parsed from vendor reports.",
    src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2070&auto=format&fit=crop",
    content: (
      <AgentCardContent
        icon={BarChart3}
        accentColor="text-emerald-400"
        points={[
          "MRO vendors submit weekly Excel status reports — StatusX parses them automatically, no manual data entry required.",
          "Every engine in the fleet is tracked across 7 repair stages: Induction → Disassembly → Inspection → Repair → Assembly → Test Cell → Delivery.",
          "Switch between vendors (StandardAero, Lufthansa Technik, MTU) to see their respective engine portfolios and progress.",
          "Stage transitions are timestamped, making it easy to spot delays and hold vendors accountable to agreed turnaround times.",
        ]}
      />
    ),
  },
  {
    category: "Finance",
    title: "Invoice validation and PO matching, fully automated.",
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
    content: (
      <AgentCardContent
        icon={Receipt}
        accentColor="text-red-400"
        points={[
          "Invoices received by email are automatically matched against the corresponding purchase order and approved quotation.",
          "Any discrepancy — amount mismatch, missing line item, duplicate invoice — is flagged instantly with the delta amount highlighted.",
          "Three-way matching (invoice × PO × quote) ensures finance teams only approve invoices that align with what was procured.",
          "Matched invoices are marked ready for payment; mismatches are escalated with full context so disputes can be resolved quickly.",
        ]}
      />
    ),
  },
]

const activityEntries = [
  {
    agent: "ShipmentX",
    icon: Truck,
    color: "bg-blue-500",
    text: "POD received for PO-7834 via DHL",
    time: "1 hour ago",
    type: "success",
  },
  {
    agent: "QuotationX",
    icon: FileText,
    color: "bg-amber-500",
    text: "New quote from StandardAero for $127,500",
    time: "3 hours ago",
    type: "info",
  },
  {
    agent: "StatusX",
    icon: BarChart3,
    color: "bg-emerald-500",
    text: "Weekly report imported for Lufthansa Technik",
    time: "6 hours ago",
    type: "info",
  },
  {
    agent: "InvoiceX",
    icon: Receipt,
    color: "bg-purple-500",
    text: "Invoice INV-2024-0892 matched successfully",
    time: "8 hours ago",
    type: "success",
  },
  {
    agent: "ShipmentX",
    icon: Truck,
    color: "bg-blue-500",
    text: "Shipment SHP-4421 departed Frankfurt hub",
    time: "11 hours ago",
    type: "info",
  },
  {
    agent: "QuotationX",
    icon: FileText,
    color: "bg-amber-500",
    text: "Quote from Chromalloy approved — PO-9021 raised",
    time: "14 hours ago",
    type: "success",
  },
  {
    agent: "InvoiceX",
    icon: Receipt,
    color: "bg-red-500",
    text: "Invoice INV-2024-0887 mismatch — amount exceeds PO by $4,200",
    time: "18 hours ago",
    type: "warning",
  },
  {
    agent: "StatusX",
    icon: BarChart3,
    color: "bg-emerald-500",
    text: "CFM56-5B engine ENG-0034 status updated to Phase 3",
    time: "22 hours ago",
    type: "info",
  },
  {
    agent: "QuotationX",
    icon: FileText,
    color: "bg-amber-500",
    text: "Quote from Heico for $89,000 rejected — outside budget",
    time: "1 day ago",
    type: "warning",
  },
  {
    agent: "ShipmentX",
    icon: Truck,
    color: "bg-blue-500",
    text: "POD confirmed for PO-7801 — 3 LRU components delivered",
    time: "1 day ago",
    type: "success",
  },
]

function ActivityIcon({ type }: { type: string }) {
  if (type === "success") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
  if (type === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
  return <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* ── Hero — full-bleed, full-screen ── */}
      <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-surface">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:text-7xl text-5xl lg:text-9xl font-bold text-center text-white relative z-20 tracking-tight"
        >
          VendorOS
        </motion.h1>

        {/* Sparkles + gradient lines */}
        <div className="w-[40rem] h-40 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 w-full h-full bg-surface [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-zinc-400 text-center max-w-xl text-sm leading-relaxed px-8 mt-2 relative z-20"
        >
          Single command centre for AI-driven shipment tracking, quotation approvals, work status, and invoice reconciliation
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center gap-3 mt-6 relative z-20"
        >
          <button
            onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            Explore Dashboard
          </button>
          <button
            onClick={() => document.getElementById("agents")?.scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Learn More
          </button>
        </motion.div>
      </div>

      {/* ── Remaining content — constrained ── */}
      <div className="px-8 py-10 max-w-6xl mx-auto">
        {/* Dashboard Scroll Preview */}
        <div id="dashboard">
        <ContainerScroll
          titleComponent={
            <div>
              <p className="text-sm font-medium text-blue-400 mb-3 tracking-widest uppercase">
                One Platform. Four Agents.
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Everything your outsourcing team needs,
                <br />
                <span className="text-zinc-400 font-normal">automated and in one place.</span>
              </h2>
            </div>
          }
        >
          {/* VendorOS dashboard mockup */}
          <div className="h-full w-full bg-surface p-4 md:p-6 flex flex-col gap-4">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-white tracking-wide">VendorOS</span>
                <span className="text-xs text-zinc-600 ml-2">Command Centre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-8 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-6 h-6 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Shipments Active", value: "2", color: "text-blue-400", bar: "bg-blue-500", fill: "w-2/5" },
                { label: "Quotes Pending", value: "3", color: "text-amber-400", bar: "bg-amber-500", fill: "w-3/5" },
                { label: "Engines Tracked", value: "12", color: "text-emerald-400", bar: "bg-emerald-500", fill: "w-4/5" },
                { label: "Invoice Alerts", value: "1", color: "text-red-400", bar: "bg-red-500", fill: "w-1/5" },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 rounded-xl p-3.5 border border-zinc-800/60">
                  <p className="text-xs text-zinc-500 mb-1.5">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <div className="mt-2.5 h-1 w-full rounded-full bg-zinc-800">
                    <div className={`h-1 rounded-full ${s.bar} ${s.fill}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Main content: agent cards + activity */}
            <div className="flex gap-3 flex-1 min-h-0">
              {/* Agent grid */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {[
                  { name: "ShipmentX", dot: "bg-blue-500", badge: "2 in transit", badgeColor: "text-blue-400 bg-blue-500/10" },
                  { name: "QuotationX", dot: "bg-amber-500", badge: "3 pending", badgeColor: "text-amber-400 bg-amber-500/10" },
                  { name: "StatusX",  dot: "bg-emerald-500", badge: "12 tracked", badgeColor: "text-emerald-400 bg-emerald-500/10" },
                  { name: "InvoiceX", dot: "bg-red-500", badge: "1 flagged", badgeColor: "text-red-400 bg-red-500/10" },
                ].map((a) => (
                  <div key={a.name} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800/60 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${a.dot}`} />
                      <span className="text-sm font-semibold text-white">{a.name}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{a.sub}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${a.badgeColor}`}>
                      {a.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div className="w-56 bg-zinc-900 rounded-xl border border-zinc-800/60 p-3 flex flex-col gap-2.5 overflow-hidden">
                <p className="text-xs font-semibold text-zinc-400 mb-1">Recent Activity</p>
                {[
                  { dot: "bg-blue-500", text: "POD received — PO-7834", time: "1h" },
                  { dot: "bg-amber-500", text: "Quote from StandardAero", time: "3h" },
                  { dot: "bg-emerald-500", text: "Lufthansa report imported", time: "6h" },
                  { dot: "bg-purple-500", text: "INV-0892 matched OK", time: "8h" },
                  { dot: "bg-red-500", text: "INV-0887 mismatch +$4.2k", time: "18h" },
                  { dot: "bg-blue-500", text: "SHP-4421 departed FRA", time: "11h" },
                ].map((e, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${e.dot} shrink-0 mt-1`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-400 leading-snug truncate">{e.text}</p>
                    </div>
                    <span className="text-[10px] text-zinc-600 shrink-0">{e.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContainerScroll>
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Agent Cards — Apple Carousel */}
        <div id="agents" className="mb-6 -mt-4">
          <div className="px-0 mb-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-2">Explore the agents</p>
            <h2 className="text-2xl font-bold text-white">Four agents. Zero manual work.</h2>
          </div>
          <Carousel
            items={carouselCards.map((card, i) => (
              <AppleCard key={card.title} card={card} index={i} />
            ))}
          />
        </div>

        {/* Recent Activity */}
        <div id="activity">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <span className="text-xs text-zinc-600">Last 24 hours</span>
          </div>

          <Card className="border-zinc-800">
            <CardContent className="p-0">
              <ul className="divide-y divide-zinc-800/60">
                {activityEntries.map((entry, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-zinc-900/50 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${entry.color} shrink-0 mt-2`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <ActivityIcon type={entry.type} />
                        <p className="text-sm text-zinc-300 leading-snug">
                          <span className="font-medium text-zinc-100">{entry.agent}</span>{" "}
                          — {entry.text}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0 mt-0.5 whitespace-nowrap">
                      {entry.time}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Closing footer */}
      <div className="mt-10 mb-8 border-t border-zinc-800/60 pt-10 pb-24 px-8 text-center">
        <div className="flex items-baseline justify-center flex-wrap gap-x-3 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span className="text-zinc-600 whitespace-nowrap">Building a</span>
          <FlipWords
            words={["better", "smarter", "stronger", "fairer"]}
            duration={2800}
            className="text-white font-bold px-0"
          />
          <span className="text-zinc-600 whitespace-nowrap">working world</span>
        </div>
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150]">
        <FloatingDock
          items={[
            { title: "Home", icon: <HomeIcon className="w-full h-full" />, href: "/" },
            { title: "ShipmentX", icon: <Truck className="w-full h-full" />, href: "/shipmentx" },
            { title: "QuotationX", icon: <FileText className="w-full h-full" />, href: "/quotationx" },
            { title: "StatusX", icon: <BarChart3 className="w-full h-full" />, href: "/statusx" },
            { title: "InvoiceX", icon: <Receipt className="w-full h-full" />, href: "/invoicex" },
          ]}
        />
      </div>
    </div>
  )
}
