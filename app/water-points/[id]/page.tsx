"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, MapPin, Calendar, Droplet } from "lucide-react";
import type { WaterPoint } from "@/lib/types/database";

// Mock data - Replace with API call
const mockWaterPoint: WaterPoint = {
  _id: "1",
  name: "Sumur Bor Cibaduyut",
  location: {
    lat: -6.9596,
    long: 107.6276,
    address: "Jl. Cibaduyut Raya No.123",
    sub_district: "Cibaduyut"
  },
  last_maintained: "2024-12-15",
  type: "Sumur Bor",
  depth: 45,
  status: "Active",
  created_at: "2024-01-10"
};

export default function WaterPointDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // TODO: Fetch data from API using id
  const waterPoint = mockWaterPoint;

  const getStatusBadge = (status: WaterPoint['status']) => {
    const variants: Record<WaterPoint['status'], 'default' | 'secondary' | 'destructive'> = {
      'Active': 'default',
      'Under Maintenance': 'secondary',
      'Inactive': 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{waterPoint.name}</h1>
            <p className="text-muted-foreground">Detail informasi titik sumber air</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/water-points/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              {getStatusBadge(waterPoint.status)}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jenis Sumber Air</p>
              <p className="font-medium">{waterPoint.type}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kedalaman</p>
              <p className="font-medium">{waterPoint.depth ? `${waterPoint.depth} meter` : '-'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Terakhir Maintenance</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(waterPoint.last_maintained).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alamat</p>
              <p className="font-medium">{waterPoint.location.address}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kecamatan</p>
              <p className="font-medium">{waterPoint.location.sub_district}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Koordinat GPS</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {waterPoint.location.lat}, {waterPoint.location.long}
              </p>
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Lihat di Peta
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Inspeksi</CardTitle>
          <CardDescription>5 inspeksi terakhir pada titik ini</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Belum ada data inspeksi
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
