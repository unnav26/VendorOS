import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import ShipmentX from "./pages/ShipmentX"
import QuotationX from "./pages/QuotationX"
import StatusX from "./pages/StatusX"
import InvoiceX from "./pages/InvoiceX"

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shipmentx" element={<ShipmentX />} />
            <Route path="/quotationx" element={<QuotationX />} />
            <Route path="/statusx" element={<StatusX />} />
            <Route path="/invoicex" element={<InvoiceX />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
