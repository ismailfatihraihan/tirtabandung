"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Edit, Trash2, Loader2, RefreshCw } from "lucide-react";
import type { Inspection } from "@/lib/types/database";

interface ApiInspection extends Inspection {
  water_point_name?: string;
  inspector_name?: string;
}

export default function InspectionsPage() {
  const router = useRouter();
  const [inspections, setInspections] = useState<ApiInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const response = await fetch('/api/inspections');
      if (response.ok) {
        const data = await response.json();
        setInspections(data.data);
      } else {
        console.error('Failed to fetch inspections:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesTab = activeTab === "all" ||
                       (activeTab === "aman" && inspection.status === "Aman") ||
                       (activeTab === "perlu-perhatian" && inspection.status === "Perlu Perhatian") ||
                       (activeTab === "berbahaya" && inspection.status === "Berbahaya");
    return matchesTab;
  });

  const getStatusBadge = (status: Inspection['status']) => {
    const variants: Record<Inspection['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
      'Aman': { variant: 'default', className: 'bg-green-500' },
      'Perlu Perhatian': { variant: 'secondary', className: 'bg-yellow-500' },
      'Berbahaya': { variant: 'destructive', className: 'bg-red-500' }
    };
    return <Badge variant={variants[status].variant} className={variants[status].className}>{status}</Badge>;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus inspeksi ini?')) {
      try {
        const response = await fetch(`/api/inspections/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setInspections(inspections.filter(i => i._id !== id));
        } else {
          console.error('Failed to delete inspection:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to delete inspection:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspeksi Kualitas Air</h1>
          <p className="text-muted-foreground">Data berkala hasil pengecekan laboratorium</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setLoading(true); fetchInspections(); }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => router.push('/inspections/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Input Hasil Lab
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspeksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspections.length}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inspections.filter(i => i.status === 'Aman').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inspections.filter(i => i.status === 'Perlu Perhatian').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berbahaya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inspections.filter(i => i.status === 'Berbahaya').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Inspeksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="aman">Aman</TabsTrigger>
              <TabsTrigger value="perlu-perhatian">Perlu Perhatian</TabsTrigger>
              <TabsTrigger value="berbahaya">Berbahaya</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Titik Air</TableHead>
                      <TableHead>pH</TableHead>
                      <TableHead>TDS</TableHead>
                      <TableHead>Kekeruhan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Inspektur</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Tidak ada data ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInspections.map((inspection) => (
                        <TableRow key={inspection._id}>
                          <TableCell>
                            {new Date(inspection.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="font-medium">{inspection.water_point_name || `Titik ${inspection.water_point_id}`}</TableCell>
                          <TableCell>{inspection.parameters.ph}</TableCell>
                          <TableCell>{inspection.parameters.tds} ppm</TableCell>
                          <TableCell>{inspection.parameters.turbidity} NTU</TableCell>
                          <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                          <TableCell>{inspection.inspector_name || `User ${inspection.inspector_id}`}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/inspections/${inspection._id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/inspections/${inspection._id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(inspection._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
