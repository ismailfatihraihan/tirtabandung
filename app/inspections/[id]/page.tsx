"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, Droplet, AlertCircle, Image as ImageIcon } from "lucide-react";
import type { Inspection } from "@/lib/types/database";

// Mock data
const mockInspection: Inspection = {
  _id: "1",
  inspector_id: "user1",
  water_point_id: "1",
  timestamp: "2024-12-30T10:30:00",
  parameters: {
    ph_level: 7.2,
    turbidity: 3.5,
    odor: "Normal"
  },
  evidence: {
    photo_url: "/uploads/photo1.jpg",
    notes: "Kondisi air jernih, tidak ada indikasi kontaminasi"
  },
  status: "Safe"
};

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const inspection = mockInspection;

  const getStatusBadge = (status: Inspection['status']) => {
    const variants: Record<Inspection['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
      'Safe': { variant: 'default', className: 'bg-green-500' },
      'Warning': { variant: 'secondary', className: 'bg-yellow-500' },
      'Unsafe': { variant: 'destructive', className: 'bg-red-500' }
    };
    return <Badge variant={variants[status].variant} className={variants[status].className}>{status}</Badge>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Inspeksi #{id}</h1>
            <p className="text-muted-foreground">Hasil pemeriksaan kualitas air</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/inspections/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Koreksi Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status & Waktu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Kualitas</p>
              {getStatusBadge(inspection.status)}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Waktu Inspeksi</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(inspection.timestamp).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Titik Air</p>
              <p className="font-medium">Sumur Bor Cibaduyut</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inspektur</p>
              <p className="font-medium">Petugas Lab - Wilayah A</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameter Air</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">pH Level</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                {inspection.parameters.ph_level}
              </p>
              <p className="text-xs text-muted-foreground">Normal: 6.5 - 8.5</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kekeruhan</p>
              <p className="text-2xl font-bold">{inspection.parameters.turbidity} NTU</p>
              <p className="text-xs text-muted-foreground">Aman: {'<'} 5 NTU</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Karakteristik Bau</p>
              <p className="font-medium">{inspection.parameters.odor}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bukti & Catatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Foto Sampel Air</p>
            <div className="border rounded-lg p-4 flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{inspection.evidence.photo_url}</p>
                <p className="text-sm text-muted-foreground">Klik untuk melihat</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Catatan Inspektur</p>
            <p className="text-sm">{inspection.evidence.notes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
