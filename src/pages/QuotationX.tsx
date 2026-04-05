import { useState } from "react"
import { ChatPanel } from "../components/ChatPanel"
import {
  FileText,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table"

type QuoteStatus = "Pending" | "Approved" | "Rejected"

interface Quote {
  id: string
  po: string
  vendor: string
  description: string
  amount: number
  dateReceived: string
  status: QuoteStatus
}

const initialQuotes: Quote[] = [
  {
    id: "QT-0041",
    po: "PO-7834",
    vendor: "StandardAero",
    description: "CFM56-7B Fan Blade Repair — 28 blades",
    amount: 127500,
    dateReceived: "04 Apr 2026",
    status: "Pending",
  },
  {
    id: "QT-0039",
    po: "PO-7755",
    vendor: "Chromalloy",
    description: "V2500-A5 HPT Module Overhaul",
    amount: 89000,
    dateReceived: "04 Apr 2026",
    status: "Pending",
  },
  {
    id: "QT-0037",
    po: "PO-7720",
    vendor: "Heico Aerospace",
    description: "CFM56-5B Accessory Gearbox Overhaul + Seal Kit",
    amount: 44250,
    dateReceived: "03 Apr 2026",
    status: "Pending",
  },
  {
    id: "QT-0035",
    po: "PO-7699",
    vendor: "Lufthansa Technik",
    description: "CFM56-5C Full Engine Overhaul + LLP Replacement",
    amount: 215000,
    dateReceived: "31 Mar 2026",
    status: "Approved",
  },
  {
    id: "QT-0033",
    po: "PO-7680",
    vendor: "MTU Aero Engines",
    description: "PW4077D HPC Module Overhaul",
    amount: 310000,
    dateReceived: "29 Mar 2026",
    status: "Rejected",
  },
  {
    id: "QT-0031",
    po: "PO-7665",
    vendor: "SIA Engineering",
    description: "CFM56-7B27 Borescope Inspection + Minor On-Wing Repair",
    amount: 45000,
    dateReceived: "28 Mar 2026",
    status: "Approved",
  },
  {
    id: "QT-0029",
    po: "PO-7650",
    vendor: "Pratt & Whitney MRO",
    description: "V2500-A5 LPT Module Overhaul — Full Teardown & Rebuild",
    amount: 178000,
    dateReceived: "27 Mar 2026",
    status: "Pending",
  },
  {
    id: "QT-0027",
    po: "PO-7635",
    vendor: "StandardAero",
    description: "GE90-115B Fan Blade Set Replacement — Complete Set",
    amount: 380000,
    dateReceived: "26 Mar 2026",
    status: "Approved",
  },
]

const statusVariant: Record<
  QuoteStatus,
  "secondary" | "success" | "destructive"
> = {
  Pending: "secondary",
  Approved: "success",
  Rejected: "destructive",
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export default function QuotationX() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [activeTab, setActiveTab] = useState("all")

  const approve = (id: string) =>
    setQuotes((q) =>
      q.map((x) => (x.id === id ? { ...x, status: "Approved" as const } : x))
    )
  const reject = (id: string) =>
    setQuotes((q) =>
      q.map((x) => (x.id === id ? { ...x, status: "Rejected" as const } : x))
    )

  const filtered =
    activeTab === "all"
      ? quotes
      : quotes.filter((q) => q.status.toLowerCase() === activeTab)

  const counts = {
    all: quotes.length,
    pending: quotes.filter((q) => q.status === "Pending").length,
    approved: quotes.filter((q) => q.status === "Approved").length,
    rejected: quotes.filter((q) => q.status === "Rejected").length,
  }

  const last24hCount = quotes.filter((q) =>
    ["04 Apr 2026", "03 Apr 2026"].includes(q.dateReceived)
  ).length

  return (
    <div className="flex min-h-screen">
    <div className="flex-1 min-w-0 overflow-hidden px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <FileText className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            QuotationX
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            AI-parsed vendor quotations from email — one-click approve or reject
          </p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-800 col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Last 24 Hours
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">{last24hCount}</p>
              <p className="text-sm text-zinc-400">new quotations received</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5 col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-xs text-amber-500 font-medium uppercase tracking-wider">
                Awaiting Review
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-amber-300">
                {counts.pending}
              </p>
              <p className="text-sm text-amber-500">quotes pending action</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({counts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className="border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="min-w-[280px]">
                  Part / Work Description
                </TableHead>
                <TableHead>Quoted Amount</TableHead>
                <TableHead>Date Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-xs text-zinc-200">
                    {q.po}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-200 font-medium">
                        {q.vendor}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 max-w-[320px]">
                    {q.description}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-100 tabular-nums">
                    {fmt(q.amount)}
                  </TableCell>
                  <TableCell className="text-zinc-400">{q.dateReceived}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[q.status]}>{q.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {q.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => approve(q.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => reject(q.id)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-zinc-600 py-10"
                  >
                    No quotations in this category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    <ChatPanel defaultAgent="QuotationX" />
    </div>
  )
}
