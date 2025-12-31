"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewInspectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    water_point_id: "",
    ph_level: "",
    turbidity: "",
    odor: "",
    notes: "",
    photo: null as File | null
  });

  const [showWarning, setShowWarning] = useState(false);

  const checkSafety = () => {
    const ph = parseFloat(formData.ph_level);
    const turbidity = parseFloat(formData.turbidity);
    
    if (ph < 6.5 || ph > 8.5 || turbidity > 5 || formData.odor !== "Normal") {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to save data
    console.log("Form data:", formData);
    
    if (showWarning) {
      toast.error("⚠️ Air tidak aman! Notifikasi bahaya telah dikirim ke tim.");
    } else {
      toast.success("Hasil inspeksi berhasil disimpan!");
    }
    
    router.push('/inspections');
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
                  <SelectItem value="wp1">Sumur Bor Cibaduyut</SelectItem>
                  <SelectItem value="wp2">PDAM Dago Pakar</SelectItem>
                  <SelectItem value="wp3">Sumur Gali Bojongsoang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ph_level">pH Level *</Label>
                <Input
                  id="ph_level"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="7.0"
                  value={formData.ph_level}
                  onChange={(e) => {
                    setFormData({ ...formData, ph_level: e.target.value });
                    setTimeout(checkSafety, 100);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Normal: 6.5 - 8.5</p>
              </div>

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
            </div>

            <div className="space-y-2">
              <Label htmlFor="odor">Kondisi Bau *</Label>
              <Select 
                value={formData.odor} 
                onValueChange={(value) => {
                  setFormData({ ...formData, odor: value });
                  setTimeout(checkSafety, 100);
                }}
              >
                <SelectTrigger id="odor">
                  <SelectValue placeholder="Pilih kondisi..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal (Tidak Berbau)</SelectItem>
                  <SelectItem value="Sedikit berbau">Sedikit Berbau</SelectItem>
                  <SelectItem value="Berbau keras">Berbau Keras</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="photo">Foto Bukti</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, photo: e.target.files[0] });
                      toast.success("Foto berhasil dipilih");
                    }
                  }}
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <p className="text-sm text-muted-foreground">
                    {formData.photo ? formData.photo.name : "Klik untuk unggah foto air"}
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
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Inspeksi
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
