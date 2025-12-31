"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function EditInspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    water_point_id: "1",
    ph_level: "7.2",
    turbidity: "3.5",
    odor: "Normal",
    notes: "Kondisi air jernih"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update data:", formData);
    toast.success("Data inspeksi berhasil dikoreksi!");
    router.push(`/inspections/${id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Koreksi Data Inspeksi</h1>
          <p className="text-muted-foreground">Perbaiki kesalahan input data</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Parameter</CardTitle>
            <CardDescription>Koreksi data yang salah input</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="water_point">Titik Air *</Label>
              <Select 
                value={formData.water_point_id} 
                onValueChange={(value) => setFormData({ ...formData, water_point_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sumur Bor Cibaduyut</SelectItem>
                  <SelectItem value="2">PDAM Dago Pakar</SelectItem>
                  <SelectItem value="3">Sumur Gali Bojongsoang</SelectItem>
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
                  value={formData.ph_level}
                  onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turbidity">Kekeruhan (NTU) *</Label>
                <Input
                  id="turbidity"
                  type="number"
                  step="0.1"
                  value={formData.turbidity}
                  onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="odor">Karakteristik Bau *</Label>
              <Select 
                value={formData.odor} 
                onValueChange={(value) => setFormData({ ...formData, odor: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal (tidak berbau)</SelectItem>
                  <SelectItem value="Sedikit">Sedikit berbau</SelectItem>
                  <SelectItem value="Menyengat">Menyengat</SelectItem>
                  <SelectItem value="Busuk">Busuk / Bangkai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Koreksi
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
