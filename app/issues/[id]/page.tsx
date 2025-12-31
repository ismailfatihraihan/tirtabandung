"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Clock, User, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "@/lib/types/database";

const mockIssue: Issue = {
  _id: "1",
  reporter_id: "user1",
  water_point_id: "wp1",
  severity_level: "Critical",
  title: "Pipa Bocor Besar",
  description: "Terdapat kebocoran pipa utama di Jl. Cibaduyut. Air menyembur cukup tinggi dan menggenangi jalan. Perlu tindakan segera.",
  status: "Perlu Disurvei",
  created_at: "2024-12-29T08:00:00"
};

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [issue, setIssue] = useState(mockIssue);
  const [updateNote, setUpdateNote] = useState("");
  const [newStatus, setNewStatus] = useState(issue.status);

  const getSeverityBadge = (severity: Issue['severity_level']) => {
    const colors = {
      'Critical': 'bg-red-600',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-blue-500'
    };
    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  const getStatusBadge = (status: Issue['status']) => {
    const colors = {
      'Perlu Disurvei': 'bg-red-500',
      'Sedang Diperbaiki': 'bg-yellow-500',
      'Selesai': 'bg-green-500',
      'Invalid': 'bg-gray-500'
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const handleUpdateStatus = () => {
    // TODO: API call
    console.log("Update status:", newStatus, "Note:", updateNote);
    setIssue({ ...issue, status: newStatus as Issue['status'] });
    toast.success("Status berhasil diperbarui!");
    setUpdateNote("");
  };

  const handleInvalidate = () => {
    // TODO: API call
    console.log("Marking as invalid");
    setIssue({ ...issue, status: 'Invalid' });
    toast.success("Laporan ditandai sebagai invalid");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
            <p className="text-muted-foreground">Detail laporan masalah</p>
          </div>
        </div>
        <div className="flex gap-2">
          {issue.status !== 'Invalid' && (
            <Button variant="destructive" onClick={handleInvalidate}>
              Tandai Invalid
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Masalah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div className="flex gap-2">
                {getStatusBadge(issue.status)}
                {getSeverityBadge(issue.severity_level)}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
              <p className="text-sm">{issue.description}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lokasi
              </p>
              <p className="font-medium">Sumur Bor Cibaduyut</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Pelapor
              </p>
              <p className="font-medium">User {issue.reporter_id}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Waktu Laporan
              </p>
              <p className="font-medium">
                {new Date(issue.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Progres</CardTitle>
            <CardDescription>Perbarui status penanganan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Baru</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Issue['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perlu Disurvei">Perlu Disurvei</SelectItem>
                  <SelectItem value="Sedang Diperbaiki">Sedang Diperbaiki</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan Tindakan</label>
              <Textarea
                placeholder="Contoh: Filter air sudah diganti, pompa sudah diperbaiki..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                rows={4}
              />
            </div>

            <Button className="w-full" onClick={handleUpdateStatus}>
              Simpan Update
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Tindakan</CardTitle>
          <CardDescription>Riwayat penanganan masalah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-0.5 h-full bg-border" />
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium">Laporan Dibuat</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(issue.created_at).toLocaleString('id-ID')}
                </p>
                <p className="text-sm mt-1">{issue.description}</p>
              </div>
            </div>
            <div className="text-center text-muted-foreground text-sm py-4">
              Belum ada update tindakan
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
