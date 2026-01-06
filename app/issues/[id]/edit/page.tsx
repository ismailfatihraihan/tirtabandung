"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

interface IssueData {
  title: string;
  description: string;
  category: 'Kerusakan Fisik' | 'Kualitas Air' | 'Operasional' | 'Lainnya';
  severity: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  status: 'Perlu Disurvei' | 'Sedang Diperbaiki' | 'Selesai' | 'Invalid';
}

export default function EditIssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<IssueData>({
    title: '',
    description: '',
    category: 'Kerusakan Fisik',
    severity: 'Rendah',
    status: 'Perlu Disurvei'
  });
  const [waterPointName, setWaterPointName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIssue = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/issues/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Laporan tidak ditemukan' : 'Gagal memuat data');
        }
        const data = await res.json();
        setFormData({
          title: data.data.title,
          description: data.data.description,
          category: data.data.category,
          severity: data.data.severity,
          status: data.data.status
        });
        setWaterPointName(data.data.water_point_name || '');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Judul dan deskripsi tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal memperbarui laporan');
      }

      toast.success("Laporan berhasil diperbarui!");
      router.push(`/issues/${id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan');
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Laporan Masalah</h1>
          <p className="text-muted-foreground">Perbarui informasi masalah</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.push('/issues')} className="mt-4">Kembali ke daftar</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Memuat data...</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Masalah</CardTitle>
              <CardDescription>Perbarui detail permasalahan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="water_point">Titik Air</Label>
                <Input
                  id="water_point"
                  value={waterPointName}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
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
                    onValueChange={(value) => setFormData({ ...formData, severity: value as any })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rendah">Rendah</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Tinggi">Tinggi</SelectItem>
                      <SelectItem value="Kritis">Kritis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perlu Disurvei">Perlu Disurvei</SelectItem>
                    <SelectItem value="Sedang Diperbaiki">Sedang Diperbaiki</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Invalid">Invalid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
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
