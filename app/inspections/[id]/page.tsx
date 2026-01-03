"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, Droplet, AlertCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import type { Inspection } from "@/lib/types/database";

interface ApiInspection extends Inspection {
  water_point_name?: string;
  inspector_name?: string;
}

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [inspection, setInspection] = useState<ApiInspection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspection();
  }, [id]);

  const fetchInspection = async () => {
    try {
      const response = await fetch(`/api/inspections/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInspection(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Inspection['status']) => {
    const variants: Record<Inspection['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
      'Aman': { variant: 'default', className: 'bg-green-500' },
      'Perlu Perhatian': { variant: 'secondary', className: 'bg-yellow-500' },
      'Berbahaya': { variant: 'destructive', className: 'bg-red-500' }
    };
    return <Badge variant={variants[status].variant} className={variants[status].className}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p>Inspeksi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detail Inspeksi - {inspection ? (inspection.water_point_name || `Titik ${inspection.water_point_id}`) : `ID ${id}`}
            </h1>
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
                {new Date(inspection.date).toLocaleString('id-ID', {
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
              <p className="font-medium">{inspection.water_point_name || `Titik ${inspection.water_point_id}`}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inspektur</p>
              <p className="font-medium">{inspection.inspector_name || `User ${inspection.inspector_id}`}</p>
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
                {inspection.parameters.ph}
              </p>
              <p className="text-xs text-muted-foreground">Normal: 6.5 - 8.5</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">TDS</p>
              <p className="text-2xl font-bold">{inspection.parameters.tds} ppm</p>
              <p className="text-xs text-muted-foreground">Aman: {'<'} 500 ppm</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kekeruhan</p>
              <p className="text-2xl font-bold">{inspection.parameters.turbidity} NTU</p>
              <p className="text-xs text-muted-foreground">Aman: {'<'} 5 NTU</p>
            </div>
            {inspection.parameters.temperature && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Suhu</p>
                  <p className="font-medium">{inspection.parameters.temperature}°C</p>
                </div>
              </>
            )}
            {inspection.parameters.ecoli && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">E. coli</p>
                  <p className="font-medium">{inspection.parameters.ecoli} MPN/100ml</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bukti & Catatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inspection.photos && inspection.photos.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foto Sampel Air</p>
              <div className="grid gap-2">
                {inspection.photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{photo}</p>
                      <p className="text-sm text-muted-foreground">Klik untuk melihat</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foto Sampel Air</p>
              <p className="text-sm text-muted-foreground">Tidak ada foto</p>
            </div>
          )}
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Catatan Inspektur</p>
            <p className="text-sm">{inspection.notes || 'Tidak ada catatan'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
