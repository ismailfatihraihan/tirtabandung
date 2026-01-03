"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import type { WaterPoint } from "@/lib/types/database";

type FormState = {
  name: string;
  type: string;
  address: string;
  sub_district: string;
  lat: string;
  long: string;
  depth: string;
  status: string;
};

export default function EditWaterPointPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/water-points/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Data tidak ditemukan' : 'Gagal memuat data');
        }
        const json = await res.json();
        const data = json.data;
        const wp = { ...data, _id: data.id || data._id } as WaterPoint;
        setFormData({
          name: wp.name,
          type: wp.type || '',
          address: wp.location.address,
          sub_district: wp.location.sub_district,
          lat: String(wp.location.lat),
          long: String(wp.location.long),
          depth: wp.depth ? String(wp.depth) : '',
          status: wp.status
        });
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || isSaving) return;

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

      const res = await fetch(`/api/water-points/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ? 'Gagal memperbarui: ' + JSON.stringify(err.error) : 'Gagal memperbarui');
      }

      toast.success("Data titik air berhasil diperbarui!");
      router.push(`/water-points/${id}`);
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Titik Air</h1>
          <p className="text-muted-foreground">Perbarui informasi sumber air</p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Memuat data...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Harap tunggu</p>
          </CardContent>
        </Card>
      ) : !formData ? (
        <Card>
          <CardHeader>
            <CardTitle>Data tidak tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Tidak dapat memuat data titik air.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/water-points')}>Kembali ke daftar</Button>
          </CardFooter>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Update detail lokasi sumber air</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Titik Air *</Label>
                <Input
                  id="name"
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_district">Kecamatan *</Label>
                <Input
                  id="sub_district"
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
                  value={formData.depth}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
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
