"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { WaterPoint } from "@/lib/types/database";
import { useNotifications } from "@/components/notifications/NotificationsProvider";

export default function NewIssuePage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    water_point_id: "",
    category: "",
    severity: "",
    title: "",
    description: "",
    photo: null as File | null
  });
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [loadingWaterPoints, setLoadingWaterPoints] = useState(true);

  useEffect(() => {
    fetchWaterPoints();
  }, []);

  const fetchWaterPoints = async () => {
    try {
      const response = await fetch('/api/water-points');
      if (!response.ok) {
        throw new Error('Failed to fetch water points');
      }
      const data = await response.json();
      setWaterPoints(data.data);
    } catch (error) {
      console.error('Error fetching water points:', error);
      toast.error('Gagal memuat data titik air');
    } finally {
      setLoadingWaterPoints(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        water_point_id: formData.water_point_id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        photos: formData.photo ? [formData.photo.name] : []
      };

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create issue');
      }

      toast.success("Laporan masalah berhasil dibuat!");
      addNotification({ title: 'Laporan masalah baru', description: formData.title || 'Ada laporan masalah baru' });
      router.push('/issues');
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal membuat laporan masalah');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Laporan Masalah</h1>
          <p className="text-muted-foreground">Laporkan kerusakan atau kondisi darurat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Masalah</CardTitle>
            <CardDescription>Lengkapi detail permasalahan yang ditemukan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="water_point">Lokasi Titik Air *</Label>
              <Select
                value={formData.water_point_id}
                onValueChange={(value) => setFormData({ ...formData, water_point_id: value })}
                disabled={loadingWaterPoints}
              >
                <SelectTrigger id="water_point">
                  <SelectValue placeholder={loadingWaterPoints ? "Memuat titik air..." : "Pilih lokasi..."} />
                </SelectTrigger>
                <SelectContent>
                  {loadingWaterPoints ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Memuat...</span>
                    </div>
                  ) : waterPoints.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Tidak ada titik air tersedia
                    </div>
                  ) : (
                    waterPoints.map((wp) => (
                      <SelectItem key={wp._id || (wp as any).id} value={wp._id || (wp as any).id}>
                        {wp.name} - {wp.location?.sub_district}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori Masalah *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kerusakan Fisik">Kerusakan Fisik</SelectItem>
                  <SelectItem value="Kualitas Air">Kualitas Air</SelectItem>
                  <SelectItem value="Operasional">Operasional</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Tingkat Keparahan *</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Pilih tingkat..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rendah">Rendah - Masalah minor</SelectItem>
                  <SelectItem value="Sedang">Sedang - Perlu perhatian</SelectItem>
                  <SelectItem value="Tinggi">Tinggi - Perlu tindakan segera</SelectItem>
                  <SelectItem value="Kritis">Kritis - Darurat!</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Masalah *</Label>
              <Input
                id="title"
                placeholder="Contoh: Pipa Bocor Besar"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Detail *</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan kondisi masalah secara detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
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
                    {formData.photo ? formData.photo.name : "Klik untuk unggah foto kondisi"}
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
              Kirim Laporan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
