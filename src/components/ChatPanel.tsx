import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ChevronDown, Bot } from "lucide-react"
import { cn } from "../lib/utils"

type Agent = "ShipmentX" | "QuotationX" | "StatusX" | "InvoiceX"

const AGENTS: Agent[] = ["ShipmentX", "QuotationX", "StatusX", "InvoiceX"]

const AGENT_COLORS: Record<Agent, string> = {
  ShipmentX: "bg-blue-500",
  QuotationX: "bg-amber-500",
  StatusX: "bg-emerald-500",
  InvoiceX: "bg-red-500",
}

const AGENT_TEXT: Record<Agent, string> = {
  ShipmentX: "text-blue-400",
  QuotationX: "text-amber-400",
  StatusX: "text-emerald-400",
  InvoiceX: "text-red-400",
}

const AGENT_BORDER: Record<Agent, string> = {
  ShipmentX: "border-blue-500/30",
  QuotationX: "border-amber-500/30",
  StatusX: "border-emerald-500/30",
  InvoiceX: "border-red-500/30",
}

function getResponse(agent: Agent, input: string): string {
  const q = input.toLowerCase()

  if (agent === "ShipmentX") {
    if (q.includes("status") || q.includes("where") || q.includes("track"))
      return "Checking DHL API… SHP-4421 is in transit at Frankfurt hub. ETA: Apr 7. SHP-4398 was delivered Apr 3 — POD available."
    if (q.includes("pod") || q.includes("proof") || q.includes("delivery"))
      return "POD for PO-7834 was received 1 hour ago via DHL. Linked to the PO record — downloadable from the shipment detail view."
    if (q.includes("delay") || q.includes("late"))
      return "No critical delays right now. SHP-4421 has a 6-hour buffer before the delivery window closes."
    return "I track inbound and outbound shipments via DHL and capture proof of delivery automatically. Ask me about any shipment or PO."
  }

  if (agent === "QuotationX") {
    if (q.includes("pending") || q.includes("review"))
      return "3 quotes pending review:\n• StandardAero — $127,500 (CFM56-7B MRO)\n• MTU Aero — $98,200 (LPT repair)\n• Heico — $89,000 (FADEC overhaul)"
    if (q.includes("approve") || q.includes("accept"))
      return "To approve, click Approve on the quote row. I'll raise a PO automatically and notify the vendor."
    if (q.includes("reject"))
      return "Rejecting logs the reason and notifies the vendor. Budget violations are flagged before they reach you."
    return "I parse vendor quotes from email and surface them for one-click review. What would you like to know?"
  }

  if (agent === "StatusX") {
    if (q.includes("eng-0034") || q.includes("cfm56"))
      return "CFM56-7B ENG-0034 is at Lufthansa Technik — Phase 4 (Repair). Phases 1–3 complete. Expected in Test Cell by Apr 14."
    if (q.includes("phase") || q.includes("progress") || q.includes("stage"))
      return "Stages: Induction → Disassembly → Inspection → Repair → Assembly → Test Cell → Delivery. Most engines are between Phase 3–5."
    if (q.includes("engine") || q.includes("eng"))
      return "12 engines tracked across 3 vendors. 3 in Repair, 4 in Assembly, 2 in Test Cell, 3 delivered."
    if (q.includes("report") || q.includes("excel"))
      return "Latest report from Lufthansa Technik was imported 6 hours ago. All 5 engines updated. Want a stage-change summary?"
    return "I parse weekly vendor Excel reports and track every engine through 7 repair stages. Ask me anything."
  }

  if (agent === "InvoiceX") {
    if (q.includes("mismatch") || q.includes("flag") || q.includes("discrepancy"))
      return "1 active mismatch: INV-2024-0887 from MTU Aero — $131,700 vs PO-8845 at $127,500. Delta +$4,200. Needs resolution before payment."
    if (q.includes("match") || q.includes("ok") || q.includes("cleared"))
      return "INV-2024-0892 and INV-2024-0881 are matched and cleared. Three-way match (invoice × PO × quote) passed for both."
    if (q.includes("pay") || q.includes("payment"))
      return "2 invoices cleared for payment. 1 on hold (INV-2024-0887) pending mismatch resolution with MTU Aero."
    return "I validate invoices against POs and quotes, flag mismatches, and clear compliant invoices for payment. What do you need?"
  }

  return "How can I help?"
}

interface Message {
  role: "user" | "agent"
  text: string
  agent?: Agent
  ts: string
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function ChatPanel({ defaultAgent }: { defaultAgent: Agent }) {
  const [agent, setAgent] = useState<Agent>(defaultAgent)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: getResponse(defaultAgent, ""), agent: defaultAgent, ts: now() },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { role: "user", text: trimmed, ts: now() }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        { role: "agent", text: getResponse(agent, trimmed), agent, ts: now() },
      ])
    }, 800 + Math.random() * 400)
  }

  const switchAgent = (a: Agent) => {
    setAgent(a)
    setDropdownOpen(false)
    setMessages([{ role: "agent", text: getResponse(a, ""), agent: a, ts: now() }])
  }

  return (
    <div className="w-72 shrink-0 sticky top-0 h-screen flex flex-col border-l border-zinc-800 bg-[#13232e]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">AI Assistant</span>
        </div>

        {/* Agent selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#2E2E38] border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full shrink-0", AGENT_COLORS[agent])} />
              <span className="text-sm font-semibold text-white">{agent}</span>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform shrink-0", dropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#2E2E38] border border-zinc-700 rounded-xl shadow-xl py-1 z-20"
              >
                {AGENTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => switchAgent(a)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                      a === agent
                        ? "text-white bg-zinc-700/50"
                        : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full shrink-0", AGENT_COLORS[a])} />
                    {a}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex flex-col gap-0.5", msg.role === "user" ? "items-end" : "items-start")}
          >
            {msg.role === "agent" && msg.agent && (
              <div className="flex items-center gap-1.5 mb-0.5 px-1">
                <span className={cn("w-1.5 h-1.5 rounded-full", AGENT_COLORS[msg.agent])} />
                <span className={cn("text-[10px] font-semibold tracking-wide", AGENT_TEXT[msg.agent])}>
                  {msg.agent}
                </span>
              </div>
            )}
            <div
              className={cn(
                "px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[90%] whitespace-pre-line",
                msg.role === "user"
                  ? "bg-[#2E2E38] text-white rounded-br-sm"
                  : "bg-[#2E2E38] border border-zinc-800 text-zinc-200 rounded-bl-sm"
              )}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-zinc-600 px-1">{msg.ts}</span>
          </div>
        ))}

        {typing && (
          <div className="flex items-start">
            <div className="bg-[#2E2E38] border border-zinc-800 px-3 py-2.5 rounded-xl rounded-bl-sm flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2 bg-[#2E2E38] border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-600 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Ask ${agent}…`}
            className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className={cn(
              "p-1 rounded-lg transition-colors shrink-0",
              input.trim() ? `${AGENT_TEXT[agent]} hover:bg-zinc-800` : "text-zinc-700"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 mt-2 text-center">Switch agents via the dropdown above</p>
      </div>
    </div>
  )
}
