import { useState } from "react"
import { ChatPanel } from "../components/ChatPanel"
import {
  Truck,
  RefreshCw,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  FileCheck,
} from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog"

type ShipStatus =
  | "In Transit"
  | "Delivered"
  | "Out for Delivery"
  | "Label Created"
  | "Customs Hold"

interface PODData {
  signedBy: string
  timestamp: string
  location: string
  trackingNo: string
  po: string
}

interface Shipment {
  id: string
  po: string
  carrier: string
  tracking: string
  shipDate: string
  status: ShipStatus
  eta: string
  pod: PODData | null
}

const statusVariant: Record<
  ShipStatus,
  "success" | "info" | "warning" | "secondary"
> = {
  Delivered: "success",
  "In Transit": "info",
  "Out for Delivery": "warning",
  "Label Created": "secondary",
  "Customs Hold": "warning",
}

const outboundShipments: Shipment[] = [
  {
    id: "s1",
    po: "PO-7834",
    carrier: "DHL",
    tracking: "1234567890",
    shipDate: "01 Apr 2026",
    status: "In Transit",
    eta: "07 Apr 2026",
    pod: null,
  },
  {
    id: "s2",
    po: "PO-7801",
    carrier: "DHL",
    tracking: "9876543210",
    shipDate: "28 Mar 2026",
    status: "Delivered",
    eta: "03 Apr 2026",
    pod: {
      signedBy: "Mohammed Al-Rashidi",
      timestamp: "03 Apr 2026, 10:14 SGT",
      location: "DHL Hub — Dubai, UAE",
      trackingNo: "9876543210",
      po: "PO-7801",
    },
  },
  {
    id: "s3",
    po: "PO-7755",
    carrier: "DHL",
    tracking: "1122334455",
    shipDate: "25 Mar 2026",
    status: "Customs Hold",
    eta: "TBD",
    pod: null,
  },
  {
    id: "s4",
    po: "PO-7720",
    carrier: "DHL",
    tracking: "6677889900",
    shipDate: "30 Mar 2026",
    status: "Out for Delivery",
    eta: "04 Apr 2026",
    pod: null,
  },
  {
    id: "s5",
    po: "PO-7699",
    carrier: "DHL",
    tracking: "5544332211",
    shipDate: "20 Mar 2026",
    status: "Delivered",
    eta: "29 Mar 2026",
    pod: {
      signedBy: "Thomas Weber",
      timestamp: "29 Mar 2026, 14:32 SGT",
      location: "Lufthansa Technik — Hamburg, DE",
      trackingNo: "5544332211",
      po: "PO-7699",
    },
  },
  {
    id: "s6",
    po: "PO-7680",
    carrier: "DHL",
    tracking: "9988776655",
    shipDate: "18 Mar 2026",
    status: "Label Created",
    eta: "14 Apr 2026",
    pod: null,
  },
]

const inboundShipments: Shipment[] = [
  {
    id: "i1",
    po: "PO-7841",
    carrier: "DHL",
    tracking: "2233445566",
    shipDate: "02 Apr 2026",
    status: "In Transit",
    eta: "09 Apr 2026",
    pod: null,
  },
  {
    id: "i2",
    po: "PO-7815",
    carrier: "DHL",
    tracking: "7788990011",
    shipDate: "29 Mar 2026",
    status: "Delivered",
    eta: "04 Apr 2026",
    pod: {
      signedBy: "Priya Nair",
      timestamp: "04 Apr 2026, 09:05 SGT",
      location: "SIA Engineering — Singapore Changi",
      trackingNo: "7788990011",
      po: "PO-7815",
    },
  },
  {
    id: "i3",
    po: "PO-7790",
    carrier: "DHL",
    tracking: "3344556677",
    shipDate: "26 Mar 2026",
    status: "Out for Delivery",
    eta: "04 Apr 2026",
    pod: null,
  },
  {
    id: "i4",
    po: "PO-7762",
    carrier: "DHL",
    tracking: "8899001122",
    shipDate: "22 Mar 2026",
    status: "Delivered",
    eta: "01 Apr 2026",
    pod: {
      signedBy: "Ahmad Khalil",
      timestamp: "01 Apr 2026, 11:47 SGT",
      location: "Maintenance Base — Terminal 3",
      trackingNo: "8899001122",
      po: "PO-7762",
    },
  },
  {
    id: "i5",
    po: "PO-7740",
    carrier: "DHL",
    tracking: "4455667788",
    shipDate: "19 Mar 2026",
    status: "Delivered",
    eta: "28 Mar 2026",
    pod: {
      signedBy: "Sarah Chen",
      timestamp: "28 Mar 2026, 15:20 SGT",
      location: "Hangar B — Line Engineering",
      trackingNo: "4455667788",
      po: "PO-7740",
    },
  },
]

function ShipmentTable({
  data,
  onPODClick,
}: {
  data: Shipment[]
  onPODClick: (pod: PODData) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-zinc-800">
          <TableHead>PO Number</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>Tracking No.</TableHead>
          <TableHead>Ship Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expected Delivery</TableHead>
          <TableHead>Proof of Delivery</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-mono text-xs text-zinc-200">
              {s.po}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-yellow-500" />
                <span className="font-medium text-yellow-400">{s.carrier}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-zinc-400">
              {s.tracking}
            </TableCell>
            <TableCell className="text-zinc-400">{s.shipDate}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
            </TableCell>
            <TableCell className="text-zinc-400">{s.eta}</TableCell>
            <TableCell>
              {s.pod ? (
                <button
                  onClick={() => onPODClick(s.pod!)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Received ✓
                </button>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ShipmentX() {
  const [podDialog, setPodDialog] = useState<{
    open: boolean
    data: PODData | null
  }>({ open: false, data: null })

  const openPOD = (pod: PODData) => setPodDialog({ open: true, data: pod })

  const allActive = [...outboundShipments, ...inboundShipments].filter(
    (s) => s.status !== "Delivered"
  )
  const outboundInTransit = outboundShipments.filter(
    (s) => s.status === "In Transit" || s.status === "Out for Delivery"
  )
  const inboundInTransit = inboundShipments.filter(
    (s) => s.status === "In Transit" || s.status === "Out for Delivery"
  )
  const podsThisWeek = [...outboundShipments, ...inboundShipments].filter(
    (s) => s.pod !== null
  )

  return (
    <div className="flex min-h-screen">
    <div className="flex-1 min-w-0 overflow-hidden px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Truck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ShipmentX
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Shipment tracking &amp; proof of delivery via DHL API
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 justify-end">
            <RefreshCw className="w-3 h-3" />
            Last auto-refresh: 04 Apr 2026, 06:00 AM SGT
          </div>
          <p className="text-xs text-zinc-700 mt-0.5">Auto-refreshes every 24 hours</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Total Active Shipments</p>
            <p className="text-3xl font-bold text-white">{allActive.length}</p>
            <p className="text-xs text-zinc-600 mt-0.5">not yet delivered</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowUpFromLine className="w-3 h-3 text-blue-400" />
              <p className="text-xs text-zinc-500">Outbound In Transit</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {outboundInTransit.length}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">to MRO facilities</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDownToLine className="w-3 h-3 text-emerald-400" />
              <p className="text-xs text-zinc-500">Inbound In Transit</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {inboundInTransit.length}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">from MRO facilities</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <FileCheck className="w-3 h-3 text-emerald-400" />
              <p className="text-xs text-zinc-500">PODs Received This Week</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {podsThisWeek.length}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">confirmed deliveries</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="outbound">
        <TabsList>
          <TabsTrigger value="outbound">
            Outbound ({outboundShipments.length})
          </TabsTrigger>
          <TabsTrigger value="inbound">
            Inbound ({inboundShipments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outbound">
          <Card className="border-zinc-800">
            <CardContent className="p-0">
              <ShipmentTable data={outboundShipments} onPODClick={openPOD} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound">
          <Card className="border-zinc-800">
            <CardContent className="p-0">
              <ShipmentTable data={inboundShipments} onPODClick={openPOD} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* POD Dialog */}
      <Dialog
        open={podDialog.open}
        onOpenChange={(open) => setPodDialog((p) => ({ ...p, open }))}
      >
        <DialogContent>
          {podDialog.data && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Proof of Delivery
                </DialogTitle>
                <DialogDescription>
                  {podDialog.data.po} · DHL Tracking{" "}
                  {podDialog.data.trackingNo}
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Signed By</p>
                    <p className="text-sm font-medium text-zinc-100">
                      {podDialog.data.signedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">
                      Signature Timestamp
                    </p>
                    <p className="text-sm font-medium text-zinc-100">
                      {podDialog.data.timestamp}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-zinc-500 mb-1">Delivery Location</p>
                    <p className="text-sm font-medium text-zinc-100">
                      {podDialog.data.location}
                    </p>
                  </div>
                </div>

                {/* Signature placeholder */}
                <div>
                  <p className="text-xs text-zinc-500 mb-2">
                    Digital Signature
                  </p>
                  <div className="flex items-center justify-center h-28 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/60">
                    <div className="text-center">
                      <p className="text-xs text-zinc-500 font-mono">
                        [Digital Signature Image from DHL API]
                      </p>
                      <p className="text-xs text-zinc-700 mt-1">
                        Rendered via DHL eCommerce API — POD endpoint
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 font-medium">
                    Delivery confirmed and recorded in system
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    <ChatPanel defaultAgent="ShipmentX" />
    </div>
  )
}
