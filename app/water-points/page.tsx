"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Eye, Edit, Archive } from "lucide-react";
import { toast } from "sonner";
import type { WaterPoint } from "@/lib/types/database";
import { type StatusFilter } from "@/components/water-points/map-panel";

const WaterPointsMapPanel = dynamic(() => import("@/components/water-points/map-panel").then(mod => mod.WaterPointsMapPanel), { ssr: false });

export default function WaterPointsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [allPoints, setAllPoints] = useState<WaterPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/water-points?includeInactive=true');
        if (!res.ok) {
          throw new Error('Gagal memuat data titik air');
        }
        const json = await res.json();
        const mapped: WaterPoint[] = (json.data || []).map((item: any) => ({
          _id: item.id || item._id,
          name: item.name,
          type: item.type,
          depth: item.depth ?? undefined,
          location: {
            lat: item.location.lat,
            long: item.location.long,
            address: item.location.address,
            sub_district: item.location.sub_district
          },
          status: item.status,
          last_maintained: item.last_maintained
        }));
        setAllPoints(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredPoints = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allPoints.filter((point) => {
      const matchesSearch =
        point.name.toLowerCase().includes(query) ||
        point.location.sub_district.toLowerCase().includes(query) ||
        point.location.address.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && point.status === "Active") ||
        (statusFilter === "maintenance" && point.status === "Under Maintenance") ||
        (statusFilter === "inactive" && point.status === "Inactive");

      return matchesSearch && matchesStatus;
    });
  }, [allPoints, searchQuery, statusFilter]);

  useEffect(() => {
    if (selectedId && !filteredPoints.find((p) => p._id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredPoints, selectedId]);

  const totals = useMemo(() => ({
    all: allPoints.length,
    active: allPoints.filter((p) => p.status === "Active").length,
    maintenance: allPoints.filter((p) => p.status === "Under Maintenance").length,
    inactive: allPoints.filter((p) => p.status === "Inactive").length
  }), [allPoints]);

  const getStatusBadge = (status: WaterPoint['status']) => {
    const variants: Record<WaterPoint['status'], 'default' | 'secondary' | 'destructive'> = {
      'Active': 'default',
      'Under Maintenance': 'secondary',
      'Inactive': 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleDelete = async (point: WaterPoint) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${point.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/water-points/${point._id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Gagal menghapus');
      }

      toast.success("Titik air berhasil dihapus!");
      setAllPoints(prev => prev.filter(p => p._id !== point._id));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Terjadi kesalahan saat menghapus');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Titik Sumber Air</h1>
          <p className="text-muted-foreground">Kelola data sumur, sungai, dan toren air</p>
        </div>
        <Button onClick={() => router.push('/water-points/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Titik Baru
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titik Air</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totals.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totals.maintenance}
            </div>
          </CardContent>
        </Card>
      </div>

      <WaterPointsMapPanel
        points={filteredPoints}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        selectedId={selectedId}
        onSelect={setSelectedId}
        totals={totals}
      />

      <Card>
        <CardHeader>
          <CardTitle>Daftar Titik (sinkron dengan filter)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Titik</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terakhir Maintenance</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredPoints.map((point) => (
                  <TableRow key={point._id} className={selectedId === point._id ? "bg-blue-50" : undefined}>
                    <TableCell className="font-medium">{point.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{point.location.sub_district}</span>
                        <span className="text-xs text-muted-foreground">{point.location.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>{point.type || '-'}</TableCell>
                    <TableCell>{getStatusBadge(point.status)}</TableCell>
                    <TableCell>
                      {point.last_maintained ? new Date(point.last_maintained).toLocaleDateString('id-ID') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/water-points/${point._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/water-points/${point._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(point)}
                          title="Hapus titik air"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
