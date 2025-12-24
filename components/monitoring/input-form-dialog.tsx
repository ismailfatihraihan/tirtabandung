"use client"

import { useState } from "react"
import { AlertTriangle, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InputFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function InputFormDialog({ open, onOpenChange, onSubmit }: InputFormDialogProps) {
  const [formData, setFormData] = useState({
    inspectorName: "Kader Budi",
    locationId: "WP-001",
    pH: "",
    turbidity: "",
    riskAssessment: "SAFE",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // In a real app, this would save to database
    console.log("Form submitted:", formData)
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Input Laporan Baru</DialogTitle>
          <DialogDescription>Submit a new water quality inspection report</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Inspector Name (Auto-filled) */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Nama Inspektur (Auto-filled)</label>
            <input
              type="text"
              value={formData.inspectorName}
              disabled
              className="w-full px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
            />
          </div>

          {/* Location ID */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Lokasi</label>
            <select
              value={formData.locationId}
              onChange={(e) => handleChange("locationId", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="WP-001">Sumur Bor Komunal - Cibaduyut</option>
              <option value="WP-002">Mata Air Ciburial - Dago</option>
              <option value="WP-003">Pipa PDAM - Bojongsoang</option>
              <option value="WP-004">Sumur Warga RT 05 - Sekeloa</option>
              <option value="WP-005">Pompa Komunal - Kiara Condong</option>
            </select>
          </div>

          {/* pH Level */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">pH Level</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="7.0"
              value={formData.pH}
              onChange={(e) => handleChange("pH", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Turbidity */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Kekeruhan/Turbidity</label>
            <select
              value={formData.turbidity}
              onChange={(e) => handleChange("turbidity", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select turbidity level</option>
              <option value="Jernih">Jernih (Clear)</option>
              <option value="Keruh">Keruh (Turbid)</option>
              <option value="Sangat Keruh">Sangat Keruh (Very Turbid)</option>
            </select>
          </div>

          {/* Risk Assessment */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Penilaian Risiko</label>
            <div className="flex gap-2">
              {["SAFE", "WARNING", "UNSAFE"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleChange("riskAssessment", option)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    formData.riskAssessment === option
                      ? option === "SAFE"
                        ? "bg-green-500 text-white"
                        : option === "WARNING"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Warning Alert for UNSAFE */}
          {formData.riskAssessment === "UNSAFE" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                System akan secara otomatis membuat Action Ticket untuk Unit Reaksi Cepat.
              </AlertDescription>
            </Alert>
          )}

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-2">Unggah Foto</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-sky-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Klik untuk unggah foto</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-sky-500 hover:bg-sky-600">
              Submit Laporan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
