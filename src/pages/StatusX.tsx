import { useState } from "react"
import { ChatPanel } from "../components/ChatPanel"
import { BarChart3, FileSpreadsheet, CalendarDays } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table"

type Stage =
  | "Induction"
  | "Teardown"
  | "Inspection"
  | "Repair"
  | "Assembly"
  | "Test"
  | "Ready to Ship"

const STAGES: Stage[] = [
  "Induction",
  "Teardown",
  "Inspection",
  "Repair",
  "Assembly",
  "Test",
  "Ready to Ship",
]

const stageIndex: Record<Stage, number> = {
  Induction: 0,
  Teardown: 1,
  Inspection: 2,
  Repair: 3,
  Assembly: 4,
  Test: 5,
  "Ready to Ship": 6,
}

interface EngineRow {
  po: string
  esn: string
  engineType: string
  workScope: string
  stage: Stage
  lastUpdated: string
  remarks: string
}

const vendors = ["StandardAero", "Lufthansa Technik", "MTU Aero Engines"] as const
type Vendor = (typeof vendors)[number]

const statusData: Record<Vendor, EngineRow[]> = {
  StandardAero: [
    {
      po: "PO-7834",
      esn: "876-455",
      engineType: "CFM56-5B",
      workScope: "Full Shop Visit — HPCT + Fan Module",
      stage: "Assembly",
      lastUpdated: "02 Apr 2026",
      remarks: "HPT blade replacement completed",
    },
    {
      po: "PO-7801",
      esn: "780-221",
      engineType: "CFM56-7B27",
      workScope: "Performance Restoration",
      stage: "Test",
      lastUpdated: "03 Apr 2026",
      remarks: "Test cell run #2 scheduled for 05 Apr",
    },
    {
      po: "PO-7765",
      esn: "664-118",
      engineType: "V2500-A5",
      workScope: "HPT Module Overhaul",
      stage: "Repair",
      lastUpdated: "01 Apr 2026",
      remarks: "Awaiting customer-furnished material",
    },
    {
      po: "PO-7720",
      esn: "502-007",
      engineType: "PW4077D",
      workScope: "HPC Module Overhaul",
      stage: "Inspection",
      lastUpdated: "31 Mar 2026",
      remarks: "Borescope inspection passed. Dimensional check in progress.",
    },
    {
      po: "PO-7688",
      esn: "231-445",
      engineType: "CFM56-7B",
      workScope: "LPT Blade Set Replacement",
      stage: "Ready to Ship",
      lastUpdated: "04 Apr 2026",
      remarks: "FAA 8130 paperwork issued, awaiting pickup",
    },
    {
      po: "PO-7655",
      esn: "345-990",
      engineType: "CFM56-5C",
      workScope: "Full Engine Overhaul",
      stage: "Teardown",
      lastUpdated: "03 Apr 2026",
      remarks: "Initial workscope assessment in progress",
    },
  ],
  "Lufthansa Technik": [
    {
      po: "PO-7841",
      esn: "112-334",
      engineType: "GE90-115B",
      workScope: "HPT & LPT Overhaul",
      stage: "Inspection",
      lastUpdated: "04 Apr 2026",
      remarks: "Dimensional inspection ongoing",
    },
    {
      po: "PO-7815",
      esn: "445-667",
      engineType: "CFM56-5B",
      workScope: "Performance Restoration",
      stage: "Assembly",
      lastUpdated: "03 Apr 2026",
      remarks: "Module build 80% complete",
    },
    {
      po: "PO-7790",
      esn: "778-990",
      engineType: "V2500-A5",
      workScope: "LLP Replacement + Minor Repair",
      stage: "Repair",
      lastUpdated: "02 Apr 2026",
      remarks: "3 of 6 LLPs replaced",
    },
    {
      po: "PO-7762",
      esn: "223-445",
      engineType: "CFM56-7B27",
      workScope: "HPC Blade Replacement",
      stage: "Test",
      lastUpdated: "04 Apr 2026",
      remarks: "Thrust test passed. Leak check pending.",
    },
    {
      po: "PO-7740",
      esn: "556-778",
      engineType: "PW4000-112",
      workScope: "Fan Case Repair + LPT Overhaul",
      stage: "Induction",
      lastUpdated: "04 Apr 2026",
      remarks: "Engine received, initial survey in progress",
    },
    {
      po: "PO-7710",
      esn: "889-001",
      engineType: "GE90-115B",
      workScope: "Core Module Overhaul",
      stage: "Teardown",
      lastUpdated: "01 Apr 2026",
      remarks: "Fan blade removal complete",
    },
  ],
  "MTU Aero Engines": [
    {
      po: "PO-7699",
      esn: "334-556",
      engineType: "CFM56-5B",
      workScope: "HPT Module Replacement",
      stage: "Ready to Ship",
      lastUpdated: "04 Apr 2026",
      remarks: "EASA Form 1 issued",
    },
    {
      po: "PO-7680",
      esn: "667-889",
      engineType: "V2500-A5",
      workScope: "Full Performance Restoration",
      stage: "Assembly",
      lastUpdated: "03 Apr 2026",
      remarks: "Combustor section installed",
    },
    {
      po: "PO-7655",
      esn: "990-112",
      engineType: "PW4077D",
      workScope: "LPT Overhaul",
      stage: "Repair",
      lastUpdated: "02 Apr 2026",
      remarks: "7 LPT blades replaced, 14 pending",
    },
    {
      po: "PO-7630",
      esn: "123-345",
      engineType: "CFM56-7B27",
      workScope: "Core Performance Restoration",
      stage: "Test",
      lastUpdated: "04 Apr 2026",
      remarks: "Sea-level test run completed",
    },
    {
      po: "PO-7605",
      esn: "456-678",
      engineType: "GE90-115B",
      workScope: "Fan Blade + HPC Overhaul",
      stage: "Inspection",
      lastUpdated: "31 Mar 2026",
      remarks: "HPC rotor dimensional check in progress",
    },
    {
      po: "PO-7580",
      esn: "789-901",
      engineType: "V2500-D5",
      workScope: "Compressor Module Overhaul",
      stage: "Teardown",
      lastUpdated: "03 Apr 2026",
      remarks: "Bleed valve module disassembly complete",
    },
    {
      po: "PO-7555",
      esn: "012-234",
      engineType: "CFM56-5B",
      workScope: "Borescope + Compressor Wash",
      stage: "Induction",
      lastUpdated: "04 Apr 2026",
      remarks: "Awaiting induction paperwork from customer",
    },
  ],
}

const stageBadgeVariant: Record<
  Stage,
  "secondary" | "info" | "warning" | "success" | "purple"
> = {
  Induction: "secondary",
  Teardown: "secondary",
  Inspection: "info",
  Repair: "warning",
  Assembly: "purple",
  Test: "info",
  "Ready to Ship": "success",
}

function StageProgress({ stage }: { stage: Stage }) {
  const current = stageIndex[stage]
  return (
    <div className="space-y-1.5 min-w-[140px]">
      <div className="flex gap-0.5">
        {STAGES.map((_, i) => (
          <div
            key={i}
            title={STAGES[i]}
            className={`h-1.5 flex-1 rounded-sm transition-colors ${
              i < current
                ? "bg-blue-600"
                : i === current
                ? "bg-blue-400"
                : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Step {current + 1}/7
      </p>
    </div>
  )
}

export default function StatusX() {
  const [vendor, setVendor] = useState<Vendor>("StandardAero")
  const engines = statusData[vendor]

  const readyCount = engines.filter((e) => e.stage === "Ready to Ship").length
  const inProgressCount = engines.filter(
    (e) => e.stage !== "Ready to Ship" && e.stage !== "Induction"
  ).length

  return (
    <div className="flex min-h-screen">
    <div className="flex-1 min-w-0 overflow-hidden px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              StatusX
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Weekly vendor work status parsed from Excel reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <CalendarDays className="w-3.5 h-3.5" />
          Weekly report imported: 01 Apr 2026
        </div>
      </div>

      {/* Vendor Select + Stats row */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-400 whitespace-nowrap">
            Viewing vendor:
          </label>
          <Select value={vendor} onValueChange={(v) => setVendor(v as Vendor)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-zinc-500">
              {inProgressCount} in progress
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-500">
              {readyCount} ready to ship
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-600">{engines.length} engines tracked</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead>PO Number</TableHead>
                <TableHead>ESN</TableHead>
                <TableHead>Engine Type</TableHead>
                <TableHead className="min-w-[200px]">Work Scope</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead className="min-w-[160px]">Progress</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="min-w-[240px]">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {engines.map((e) => (
                <TableRow key={e.po}>
                  <TableCell className="font-mono text-xs text-zinc-200">
                    {e.po}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {e.esn}
                  </TableCell>
                  <TableCell className="font-medium text-zinc-200 whitespace-nowrap">
                    {e.engineType}
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs">
                    {e.workScope}
                  </TableCell>
                  <TableCell>
                    <Badge variant={stageBadgeVariant[e.stage]}>
                      {e.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StageProgress stage={e.stage} />
                  </TableCell>
                  <TableCell className="text-zinc-400 whitespace-nowrap text-xs">
                    {e.lastUpdated}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {e.remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stage Legend */}
      <div className="mt-4 flex items-center gap-1 flex-wrap">
        <span className="text-xs text-zinc-600 mr-2">Stages:</span>
        {STAGES.map((s, i) => (
          <div key={s} className="flex items-center gap-1 text-xs text-zinc-600">
            <span className="font-mono">{i + 1}.</span>
            <span>{s}</span>
            {i < STAGES.length - 1 && (
              <span className="text-zinc-800 mx-1">›</span>
            )}
          </div>
        ))}
      </div>
    </div>
    <ChatPanel defaultAgent="StatusX" />
    </div>
  )
}
