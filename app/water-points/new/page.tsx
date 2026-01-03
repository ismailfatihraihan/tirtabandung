"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function NewWaterPointPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Active",
    address: "",
    sub_district: "",
    lat: "",
    long: "",
    depth: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const payload = {
        name: formData.name.trim(),
        type: formData.type as any,
        status: formData.status as any,
        depth: formData.depth ? Number(formData.depth) : undefined,
        location: {
          lat: Number(formData.lat),
          long: Number(formData.long),
          address: formData.address.trim(),
          sub_district: formData.sub_district.trim()
        }
      };

      const res = await fetch('/api/water-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ? 'Gagal menyimpan data: ' + JSON.stringify(err.error) : 'Gagal menyimpan data');
      }

      toast.success("Titik air berhasil didaftarkan!");
      router.push('/water-points');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan');
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
          <h1 className="text-3xl font-bold tracking-tight">Registrasi Titik Baru</h1>
          <p className="text-muted-foreground">Daftarkan lokasi sumber air baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>Masukkan detail lokasi sumber air</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Titik Air *</Label>
              <Input
                id="name"
                placeholder="Contoh: Sumur Bor Cibaduyut"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Sumber Air *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Pilih jenis..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sumur Bor">Sumur Bor</SelectItem>
                  <SelectItem value="Sumur Gali">Sumur Gali</SelectItem>
                  <SelectItem value="PDAM">PDAM</SelectItem>
                  <SelectItem value="Sungai">Sungai</SelectItem>
                  <SelectItem value="Toren">Toren</SelectItem>
                  <SelectItem value="Reservoir">Reservoir</SelectItem>
                  <SelectItem value="Instalasi">Instalasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Operasional *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                placeholder="Jl. Cibaduyut Raya No.123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub_district">Kecamatan *</Label>
              <Input
                id="sub_district"
                placeholder="Contoh: Cibaduyut"
                value={formData.sub_district}
                onChange={(e) => setFormData({ ...formData, sub_district: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude *</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="-6.9596"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long">Longitude *</Label>
                <Input
                  id="long"
                  type="number"
                  step="any"
                  placeholder="107.6276"
                  value={formData.long}
                  onChange={(e) => setFormData({ ...formData, long: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Kedalaman (meter)</Label>
              <Input
                id="depth"
                type="number"
                placeholder="45"
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Opsional, untuk sumur bor/gali</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
