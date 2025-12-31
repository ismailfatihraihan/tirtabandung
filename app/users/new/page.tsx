"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    assigned_district: "",
    status: "Active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to save data
    console.log("Form data:", formData);
    
    toast.success("Petugas baru berhasil ditambahkan!");
    router.push('/users');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Petugas Baru</h1>
          <p className="text-muted-foreground">Buat akun untuk petugas atau kader baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Petugas</CardTitle>
            <CardDescription>Lengkapi data petugas yang akan ditambahkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Dr. Ahmad Hidayat"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ahmad@tirtabandung.id"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="081234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role / Jabatan *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin Pusat">Admin Pusat</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Surveyor">Surveyor</SelectItem>
                  <SelectItem value="Petugas Lab">Petugas Lab</SelectItem>
                  <SelectItem value="Kader RT">Kader RT</SelectItem>
                  <SelectItem value="Teknisi">Teknisi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Wilayah Tugas *</Label>
              <Select 
                value={formData.assigned_district} 
                onValueChange={(value) => setFormData({ ...formData, assigned_district: value })}
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder="Pilih kecamatan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cibaduyut">Cibaduyut</SelectItem>
                  <SelectItem value="Dago">Dago</SelectItem>
                  <SelectItem value="Bojongsoang">Bojongsoang</SelectItem>
                  <SelectItem value="Coblong">Coblong</SelectItem>
                  <SelectItem value="Sekeloa">Sekeloa</SelectItem>
                  <SelectItem value="Kiara Condong">Kiara Condong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Data
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
