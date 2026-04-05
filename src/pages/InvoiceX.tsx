import { useState } from "react"
import { ChatPanel } from "../components/ChatPanel"
import {
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  CreditCard,
} from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet"
import { ScrollArea } from "../components/ui/scroll-area"

type MatchStatus = "Matched" | "Mismatch" | "Under Review"

interface LineItem {
  description: string
  partNo?: string
  qty: number
  unitPrice: number
  total: number
}

interface Invoice {
  id: string
  invoiceNo: string
  po: string
  quoteRef: string
  vendor: string
  invoiceAmount: number
  quoteAmount: number
  variance: number
  invoiceDate: string
  dueDate: string
  status: MatchStatus
  mismatchNote?: string
  lineItems: LineItem[]
  paymentTerms: string
}

const invoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNo: "INV-2024-0892",
    po: "PO-7699",
    quoteRef: "QT-0035",
    vendor: "Lufthansa Technik",
    invoiceAmount: 215000,
    quoteAmount: 215000,
    variance: 0,
    invoiceDate: "28 Mar 2026",
    dueDate: "28 Apr 2026",
    status: "Matched",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Full Engine Overhaul — CFM56-5C", qty: 1, unitPrice: 180000, total: 180000 },
      { description: "LLP Replacement (Disk Set, 3 pcs)", partNo: "CFM-LLP-5C-003", qty: 3, unitPrice: 10000, total: 30000 },
      { description: "Test Cell Certification Run", qty: 1, unitPrice: 5000, total: 5000 },
    ],
  },
  {
    id: "inv2",
    invoiceNo: "INV-2024-0887",
    po: "PO-7801",
    quoteRef: "QT-0041",
    vendor: "StandardAero",
    invoiceAmount: 139900,
    quoteAmount: 127500,
    variance: 12400,
    invoiceDate: "27 Mar 2026",
    dueDate: "27 Apr 2026",
    status: "Mismatch",
    mismatchNote: "Invoice total exceeds approved quote by $12,400 — additional HPCT stage 2 blades not in original scope",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "CFM56-7B Fan Blade Repair (28 blades)", qty: 28, unitPrice: 3500, total: 98000 },
      { description: "HPCT Stage 1 Blade Set", partNo: "CFM-HPCT-S1", qty: 1, unitPrice: 22000, total: 22000 },
      { description: "HPCT Stage 2 Blade Set (additional — not in quote)", partNo: "CFM-HPCT-S2", qty: 1, unitPrice: 12400, total: 12400 },
      { description: "NDT Inspection", qty: 1, unitPrice: 3500, total: 3500 },
      { description: "Final Documentation Package", qty: 1, unitPrice: 4000, total: 4000 },
    ],
  },
  {
    id: "inv3",
    invoiceNo: "INV-2024-0881",
    po: "PO-7755",
    quoteRef: "QT-0039",
    vendor: "Chromalloy",
    invoiceAmount: 89000,
    quoteAmount: 89000,
    variance: 0,
    invoiceDate: "25 Mar 2026",
    dueDate: "25 Apr 2026",
    status: "Matched",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "V2500-A5 HPT Blade Set Replacement (28 blades)", partNo: "V2500-HPT-28", qty: 28, unitPrice: 3000, total: 84000 },
      { description: "Dimensional Inspection Report", qty: 1, unitPrice: 2500, total: 2500 },
      { description: "EASA/FAA Dual Release Documentation", qty: 1, unitPrice: 2500, total: 2500 },
    ],
  },
  {
    id: "inv4",
    invoiceNo: "INV-2024-0874",
    po: "PO-7720",
    quoteRef: "QT-0037",
    vendor: "Heico Aerospace",
    invoiceAmount: 44250,
    quoteAmount: 44250,
    variance: 0,
    invoiceDate: "20 Mar 2026",
    dueDate: "20 Apr 2026",
    status: "Matched",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "CFM56-5B Accessory Gearbox Overhaul", qty: 1, unitPrice: 38000, total: 38000 },
      { description: "Seal Kit — Full AGB", partNo: "AGB-SK-5B", qty: 1, unitPrice: 4250, total: 4250 },
      { description: "Flow Test & Documentation", qty: 1, unitPrice: 2000, total: 2000 },
    ],
  },
  {
    id: "inv5",
    invoiceNo: "INV-2024-0865",
    po: "PO-7640",
    quoteRef: "QT-0030",
    vendor: "Air France Industries KLM E&M",
    invoiceAmount: 58000,
    quoteAmount: 52000,
    variance: 6000,
    invoiceDate: "15 Mar 2026",
    dueDate: "15 Apr 2026",
    status: "Mismatch",
    mismatchNote: "Additional labor charges of $6,000 — extended APU disassembly time not covered in approved quote",
    paymentTerms: "Net 45",
    lineItems: [
      { description: "APU Overhaul — Honeywell 131-9A", qty: 1, unitPrice: 44000, total: 44000 },
      { description: "Starter/Generator Unit Replacement", partNo: "APU-SG-131", qty: 1, unitPrice: 8000, total: 8000 },
      { description: "Extended Labor — APU Disassembly (not in quote)", qty: 30, unitPrice: 200, total: 6000 },
    ],
  },
  {
    id: "inv6",
    invoiceNo: "INV-2024-0859",
    po: "PO-7588",
    quoteRef: "QT-0027",
    vendor: "Pratt & Whitney MRO",
    invoiceAmount: 310000,
    quoteAmount: 310000,
    variance: 0,
    invoiceDate: "10 Mar 2026",
    dueDate: "10 Apr 2026",
    status: "Under Review",
    paymentTerms: "Net 45",
    lineItems: [
      { description: "PW4077D HPC Module Overhaul", qty: 1, unitPrice: 270000, total: 270000 },
      { description: "Borescope Inspection (4 stages)", qty: 4, unitPrice: 7500, total: 30000 },
      { description: "Engine Run — Certification Test Cell", qty: 1, unitPrice: 10000, total: 10000 },
    ],
  },
  {
    id: "inv7",
    invoiceNo: "INV-2024-0851",
    po: "PO-7635",
    quoteRef: "QT-0027",
    vendor: "StandardAero",
    invoiceAmount: 380000,
    quoteAmount: 380000,
    variance: 0,
    invoiceDate: "05 Mar 2026",
    dueDate: "05 Apr 2026",
    status: "Matched",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "GE90-115B Fan Blade Set — Full Replacement (24 blades)", partNo: "GE90-FAN-24", qty: 24, unitPrice: 14000, total: 336000 },
      { description: "Fan Blade Balance & Track", qty: 1, unitPrice: 28000, total: 28000 },
      { description: "Documentation, Release Cert & Test Report", qty: 1, unitPrice: 16000, total: 16000 },
    ],
  },
]

const statusVariant: Record<
  MatchStatus,
  "success" | "destructive" | "warning"
> = {
  Matched: "success",
  Mismatch: "destructive",
  "Under Review": "warning",
}

const statusIcon = (s: MatchStatus) => {
  if (s === "Matched") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  if (s === "Mismatch") return <XCircle className="w-3.5 h-3.5 text-red-400" />
  return <Clock className="w-3.5 h-3.5 text-amber-400" />
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export default function InvoiceX() {
  const [sheetInvoice, setSheetInvoice] = useState<Invoice | null>(null)

  const matched = invoices.filter((i) => i.status === "Matched").length
  const mismatched = invoices.filter((i) => i.status === "Mismatch").length
  const underReview = invoices.filter((i) => i.status === "Under Review").length
  const totalValue = invoices.reduce((s, i) => s + i.invoiceAmount, 0)

  return (
    <div className="flex min-h-screen">
    <div className="flex-1 min-w-0 overflow-hidden px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Receipt className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            InvoiceX
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Invoice validation and PO/quote matching from vendor emails
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Total Invoices This Month</p>
            <p className="text-3xl font-bold text-white">{invoices.length}</p>
            <p className="text-xs text-zinc-600 mt-0.5">{fmt(totalValue)} total value</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <p className="text-xs text-zinc-500">Matched</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{matched}</p>
            <p className="text-xs text-zinc-600 mt-0.5">zero variance</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <p className="text-xs text-red-500">Mismatched</p>
            </div>
            <p className="text-3xl font-bold text-red-400">{mismatched}</p>
            <p className="text-xs text-red-600 mt-0.5">requires resolution</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <p className="text-xs text-zinc-500">Pending Review</p>
            </div>
            <p className="text-3xl font-bold text-amber-400">{underReview}</p>
            <p className="text-xs text-zinc-600 mt-0.5">awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Mismatch alert */}
      {mismatched > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-sm font-semibold text-red-400">
              {mismatched} Invoice{mismatched > 1 ? "s Require" : " Requires"} Attention
            </span>
          </div>
          <ul className="space-y-1 ml-6">
            {invoices
              .filter((i) => i.status === "Mismatch")
              .map((i) => (
                <li key={i.id} className="text-xs text-zinc-400">
                  <span className="text-red-300 font-medium">{i.invoiceNo}</span>{" "}
                  ({i.vendor}) — {i.mismatchNote}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Table */}
      <Card className="border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>Invoice No.</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice Amount</TableHead>
                <TableHead>Approved Quote</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Match Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow
                  key={inv.id}
                  className={
                    inv.status === "Mismatch"
                      ? "border-red-500/10"
                      : undefined
                  }
                >
                  <TableCell className="font-mono text-xs text-zinc-200 whitespace-nowrap">
                    {inv.invoiceNo}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {inv.po}
                  </TableCell>
                  <TableCell className="text-zinc-200 whitespace-nowrap">
                    {inv.vendor}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-100 tabular-nums whitespace-nowrap">
                    {fmt(inv.invoiceAmount)}
                  </TableCell>
                  <TableCell className="text-zinc-400 tabular-nums whitespace-nowrap">
                    {fmt(inv.quoteAmount)}
                  </TableCell>
                  <TableCell className="tabular-nums whitespace-nowrap">
                    {inv.variance === 0 ? (
                      <span className="text-zinc-600">—</span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        +{fmt(inv.variance)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400 whitespace-nowrap text-xs">
                    {inv.invoiceDate}
                  </TableCell>
                  <TableCell className="text-zinc-400 whitespace-nowrap text-xs">
                    {inv.dueDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(inv.status)}
                      <Badge variant={statusVariant[inv.status]}>
                        {inv.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSheetInvoice(inv)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Sheet */}
      <Sheet
        open={sheetInvoice !== null}
        onOpenChange={(open) => !open && setSheetInvoice(null)}
      >
        <SheetContent side="right">
          {sheetInvoice && (
            <ScrollArea className="h-full">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  {sheetInvoice.invoiceNo}
                </SheetTitle>
                <SheetDescription>
                  {sheetInvoice.vendor} · {sheetInvoice.po} ·{" "}
                  {sheetInvoice.quoteRef}
                </SheetDescription>
              </SheetHeader>

              <div className="px-6 py-5 space-y-6">
                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Invoice Date", sheetInvoice.invoiceDate],
                    ["Due Date", sheetInvoice.dueDate],
                    ["PO Reference", sheetInvoice.po],
                    ["Quote Reference", sheetInvoice.quoteRef],
                    ["Payment Terms", sheetInvoice.paymentTerms],
                    [
                      "Match Status",
                      <Badge
                        key="ms"
                        variant={statusVariant[sheetInvoice.status]}
                      >
                        {sheetInvoice.status}
                      </Badge>,
                    ],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
                      <div className="text-zinc-300">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Mismatch note */}
                {sheetInvoice.mismatchNote && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-300">{sheetInvoice.mismatchNote}</p>
                  </div>
                )}

                {/* Line items */}
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Line Items
                  </p>
                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900/60">
                          <th className="text-left px-3 py-2 text-zinc-500 font-medium">
                            Description
                          </th>
                          <th className="text-right px-3 py-2 text-zinc-500 font-medium">
                            Qty
                          </th>
                          <th className="text-right px-3 py-2 text-zinc-500 font-medium">
                            Unit
                          </th>
                          <th className="text-right px-3 py-2 text-zinc-500 font-medium">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheetInvoice.lineItems.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b border-zinc-800/60 last:border-0"
                          >
                            <td className="px-3 py-2.5">
                              <p className="text-zinc-300">{item.description}</p>
                              {item.partNo && (
                                <p className="text-zinc-600 font-mono mt-0.5">
                                  {item.partNo}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums">
                              {item.qty}
                            </td>
                            <td className="px-3 py-2.5 text-right text-zinc-400 tabular-nums whitespace-nowrap">
                              {fmt(item.unitPrice)}
                            </td>
                            <td className="px-3 py-2.5 text-right text-zinc-200 font-medium tabular-nums whitespace-nowrap">
                              {fmt(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      {fmt(sheetInvoice.invoiceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-xs">
                    <span>Tax (0% — International MRO Services)</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold border-t border-zinc-700 pt-2.5 text-base">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {fmt(sheetInvoice.invoiceAmount)}
                    </span>
                  </div>
                  {sheetInvoice.variance > 0 && (
                    <div className="flex justify-between text-red-400 text-xs pt-1 border-t border-zinc-800">
                      <span>Variance vs Approved Quote</span>
                      <span className="font-semibold tabular-nums">
                        +{fmt(sheetInvoice.variance)}
                      </span>
                    </div>
                  )}
                </div>

                {/* References */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    References
                  </p>
                  <div className="flex items-center gap-2 text-xs p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-500">Matched PO:</span>
                    <span className="font-mono text-zinc-200 font-medium">
                      {sheetInvoice.po}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-500">Matched Quote:</span>
                    <span className="font-mono text-zinc-200 font-medium">
                      {sheetInvoice.quoteRef}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
    <ChatPanel defaultAgent="InvoiceX" />
    </div>
  )
}
