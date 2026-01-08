"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface InspectionData {
  ph: string;
  tds: string;
  turbidity: string;
  temperature: string;
  ecoli: string;
  notes: string;
}

export default function EditInspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<InspectionData>({
    ph: '',
    tds: '',
    turbidity: '',
    temperature: '',
    ecoli: '',
    notes: ''
  });
  const [waterPointName, setWaterPointName] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const loadInspection = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/inspections/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Inspeksi tidak ditemukan' : 'Gagal memuat data');
        }
        const data = await res.json();
        setFormData({
          ph: data.data.parameters?.ph?.toString() || '',
          tds: data.data.parameters?.tds?.toString() || '',
          turbidity: data.data.parameters?.turbidity?.toString() || '',
          temperature: data.data.parameters?.temperature?.toString() || '',
          ecoli: data.data.parameters?.ecoli?.toString() || '',
          notes: data.data.notes || ''
        });
        setWaterPointName(data.data.water_point_name || '');
        setInspectionDate(data.data.date ? new Date(data.data.date).toLocaleDateString('id-ID') : '');
        
        // Check safety
        const ph = parseFloat(data.data.parameters?.ph) || 0;
        const turbidity = parseFloat(data.data.parameters?.turbidity) || 0;
        const tds = parseFloat(data.data.parameters?.tds) || 0;
        const ecoli = parseFloat(data.data.parameters?.ecoli) || 0;
        
        if (ph < 6.5 || ph > 8.5 || turbidity > 5 || tds > 500 || ecoli > 0) {
          setShowWarning(true);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInspection();
  }, [id]);

  const checkSafety = () => {
    const ph = parseFloat(formData.ph) || 0;
    const turbidity = parseFloat(formData.turbidity) || 0;
    const tds = parseFloat(formData.tds) || 0;
    const ecoli = parseFloat(formData.ecoli) || 0;

    if (ph < 6.5 || ph > 8.5 || turbidity > 5 || tds > 500 || ecoli > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleChange = (field: keyof InspectionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    checkSafety();
  }, [formData.ph, formData.turbidity, formData.tds, formData.ecoli]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ph || !formData.tds || !formData.turbidity || !formData.temperature) {
      toast.error('Parameter fisik-kimia harus diisi');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/inspections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameters: {
            ph: parseFloat(formData.ph),
            tds: parseFloat(formData.tds),
            turbidity: parseFloat(formData.turbidity),
            temperature: parseFloat(formData.temperature),
            ecoli: parseFloat(formData.ecoli) || 0
          },
          notes: formData.notes
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal memperbarui inspeksi');
      }

      toast.success("Inspeksi berhasil diperbarui!");
      router.push(`/inspections/${id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Inspeksi</h1>
          <p className="text-muted-foreground">Perbarui hasil pengujian air</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.push('/inspections')} className="mt-4">Kembali ke daftar</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Memuat data...</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Hasil Inspeksi</CardTitle>
              <CardDescription>Perbarui data pengujian kualitas air</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="water_point">Titik Air</Label>
                <Input
                  id="water_point"
                  value={waterPointName}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Inspeksi</Label>
                <Input
                  id="date"
                  value={inspectionDate}
                  disabled
                  className="bg-muted"
                />
              </div>

              {showWarning && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    Air tidak memenuhi standar kesehatan! Ada parameter yang melampaui batas aman.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ph">pH (6.5 - 8.5) *</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => handleChange('ph', e.target.value)}
                    placeholder="7.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatur (°C) *</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                    placeholder="25"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tds">TDS (mg/L, max 500) *</Label>
                  <Input
                    id="tds"
                    type="number"
                    step="0.1"
                    value={formData.tds}
                    onChange={(e) => handleChange('tds', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turbidity">Kekeruhan (NTU, max 5) *</Label>
                  <Input
                    id="turbidity"
                    type="number"
                    step="0.1"
                    value={formData.turbidity}
                    onChange={(e) => handleChange('turbidity', e.target.value)}
                    placeholder="1.0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ecoli">E. Coli (CFU/100mL, max 0)</Label>
                  <Input
                    id="ecoli"
                    type="number"
                    step="1"
                    value={formData.ecoli}
                    onChange={(e) => handleChange('ecoli', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Catatan tambahan tentang kondisi air..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Batal
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
