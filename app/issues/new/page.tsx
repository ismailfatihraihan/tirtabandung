"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";

export default function NewIssuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    water_point_id: "",
    severity_level: "",
    title: "",
    description: "",
    photo: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to save data
    console.log("Form data:", formData);
    
    toast.success("Laporan masalah berhasil dibuat!");
    router.push('/issues');
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

            <div className="space-y-2">
              <Label htmlFor="severity">Tingkat Keparahan *</Label>
              <Select 
                value={formData.severity_level} 
                onValueChange={(value) => setFormData({ ...formData, severity_level: value })}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Pilih tingkat..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - Masalah minor</SelectItem>
                  <SelectItem value="Medium">Medium - Perlu perhatian</SelectItem>
                  <SelectItem value="High">High - Perlu tindakan segera</SelectItem>
                  <SelectItem value="Critical">Critical - Darurat!</SelectItem>
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
