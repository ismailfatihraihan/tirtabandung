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

const mockWaterPoint = {
  _id: "1",
  name: "Sumur Bor Cibaduyut",
  type: "Sumur Bor",
  address: "Jl. Cibaduyut Raya No.123",
  sub_district: "Cibaduyut",
  lat: "-6.9596",
  long: "107.6276",
  depth: "45",
  status: "Active"
};

export default function EditWaterPointPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // TODO: Fetch from API
  const [formData, setFormData] = useState(mockWaterPoint);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to update data
    console.log("Updated data:", formData);
    
    toast.success("Data titik air berhasil diperbarui!");
    router.push(`/water-points/${id}`);
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sumur Bor">Sumur Bor</SelectItem>
                  <SelectItem value="Sumur Gali">Sumur Gali</SelectItem>
                  <SelectItem value="PDAM">PDAM</SelectItem>
                  <SelectItem value="Sungai">Sungai</SelectItem>
                  <SelectItem value="Toren">Toren</SelectItem>
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
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
