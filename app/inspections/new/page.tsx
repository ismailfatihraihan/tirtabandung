"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WaterPoint {
  id: string;
  name: string;
}

export default function NewInspectionPage() {
  const router = useRouter();
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    water_point_id: "",
    ph: "",
    tds: "",
    turbidity: "",
    temperature: "",
    ecoli: "",
    notes: "",
    photos: [] as string[]
  });

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchWaterPoints();
  }, []);

  const fetchWaterPoints = async () => {
    try {
      const response = await fetch('/api/water-points');
      if (response.ok) {
        const data = await response.json();
        setWaterPoints(data.data.map((wp: any) => ({ id: wp.id, name: wp.name })));
      }
    } catch (error) {
      console.error('Failed to fetch water points:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const status = showWarning ? 'Berbahaya' : 'Aman';

      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          water_point_id: formData.water_point_id,
          date: new Date().toISOString(),
          parameters: {
            ph: parseFloat(formData.ph),
            tds: parseFloat(formData.tds),
            turbidity: parseFloat(formData.turbidity),
            temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
            ecoli: formData.ecoli ? parseFloat(formData.ecoli) : undefined
          },
          photos: formData.photos,
          notes: formData.notes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const status = data.data.status;
        if (status === 'Berbahaya') {
          toast.error("⚠️ Air tidak aman! Notifikasi bahaya telah dikirim ke tim.");
        } else {
          toast.success("Hasil inspeksi berhasil disimpan!");
        }
        router.push('/inspections');
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menyimpan inspeksi");
      }
    } catch (error) {
      console.error('Failed to save inspection:', error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Input Hasil Inspeksi</h1>
          <p className="text-muted-foreground">Masukkan data parameter kualitas air</p>
        </div>
      </div>

      {showWarning && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Parameter air berada di luar batas aman! Status akan otomatis ditandai sebagai "Unsafe".
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Data Inspeksi</CardTitle>
            <CardDescription>Lengkapi hasil pengujian laboratorium</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="water_point">Titik Air *</Label>
              <Select
                value={formData.water_point_id}
                onValueChange={(value) => setFormData({ ...formData, water_point_id: value })}
              >
                <SelectTrigger id="water_point">
                  <SelectValue placeholder="Pilih lokasi..." />
                </SelectTrigger>
                <SelectContent>
                  {waterPoints.map((wp) => (
                    <SelectItem key={wp.id} value={wp.id}>{wp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ph">pH Level *</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="7.0"
                  value={formData.ph}
                  onChange={(e) => {
                    setFormData({ ...formData, ph: e.target.value });
                    setTimeout(checkSafety, 100);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Normal: 6.5 - 8.5</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tds">TDS (ppm) *</Label>
                <Input
                  id="tds"
                  type="number"
                  min="0"
                  placeholder="150"
                  value={formData.tds}
                  onChange={(e) => {
                    setFormData({ ...formData, tds: e.target.value });
                    setTimeout(checkSafety, 100);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Normal: {'<'} 500 ppm</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turbidity">Kekeruhan (NTU) *</Label>
                <Input
                  id="turbidity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="3.5"
                  value={formData.turbidity}
                  onChange={(e) => {
                    setFormData({ ...formData, turbidity: e.target.value });
                    setTimeout(checkSafety, 100);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Normal: {'<'} 5 NTU</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Suhu (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="25.0"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ecoli">E. coli (MPN/100ml)</Label>
              <Input
                id="ecoli"
                type="number"
                min="0"
                placeholder="0"
                value={formData.ecoli}
                onChange={(e) => {
                  setFormData({ ...formData, ecoli: e.target.value });
                  setTimeout(checkSafety, 100);
                }}
              />
              <p className="text-xs text-muted-foreground">Normal: 0</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Deskripsi kondisi air, warna, dll..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Foto Bukti</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      // For now, just store filenames as strings
                      const photoUrls = files.map(file => `/uploads/${file.name}`);
                      setFormData({ ...formData, photos: photoUrls });
                      toast.success(`${files.length} foto berhasil dipilih`);
                    }
                  }}
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    {formData.photos.length > 0 ? `${formData.photos.length} foto dipilih` : "Klik untuk unggah foto air"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Inspeksi
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
