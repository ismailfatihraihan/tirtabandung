"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Inspection } from "@/lib/types/database";

interface WaterPoint {
  id: string;
  name: string;
}

export default function EditInspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchInspection();
    fetchWaterPoints();
  }, [id]);

  const fetchInspection = async () => {
    try {
      const response = await fetch(`/api/inspections/${id}`);
      if (response.ok) {
        const data = await response.json();
        const insp = data.data;
        setInspection(insp);
        setFormData({
          water_point_id: insp.water_point_id,
          ph: insp.parameters.ph.toString(),
          tds: insp.parameters.tds.toString(),
          turbidity: insp.parameters.turbidity.toString(),
          temperature: insp.parameters.temperature?.toString() || "",
          ecoli: insp.parameters.ecoli?.toString() || "",
          notes: insp.notes || "",
          photos: insp.photos || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch inspection:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        water_point_id: formData.water_point_id,
        parameters: {
          ph: parseFloat(formData.ph),
          tds: parseFloat(formData.tds),
          turbidity: parseFloat(formData.turbidity),
        },
        notes: formData.notes,
        photos: formData.photos
      };

      if (formData.temperature) {
        updateData.parameters.temperature = parseFloat(formData.temperature);
      }

      if (formData.ecoli) {
        updateData.parameters.ecoli = parseFloat(formData.ecoli);
      }

      const response = await fetch(`/api/inspections/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Data inspeksi berhasil dikoreksi!");
        router.push(`/inspections/${id}`);
      } else {
        toast.error("Gagal memperbarui inspeksi");
      }
    } catch (error) {
      console.error('Failed to update inspection:', error);
      toast.error("Terjadi kesalahan saat memperbarui");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p>Inspeksi tidak ditemukan</p>
      </div>
    );
  }

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
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tds">TDS (ppm) *</Label>
                <Input
                  id="tds"
                  type="number"
                  min="0"
                  value={formData.tds}
                  onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
                  required
                />
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
                  value={formData.turbidity}
                  onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Suhu (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
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
                value={formData.ecoli}
                onChange={(e) => setFormData({ ...formData, ecoli: e.target.value })}
              />
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
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Koreksi
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
