"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Edit, Trash2, TrendingUp } from "lucide-react";
import type { Inspection } from "@/lib/types/database";

// Mock data
const mockInspections: Inspection[] = [
  {
    _id: "1",
    inspector_id: "user1",
    water_point_id: "wp1",
    timestamp: "2024-12-29T10:30:00",
    parameters: {
      ph_level: 7.2,
      turbidity: 3.5,
      odor: "Normal"
    },
    evidence: {
      photo_url: "/uploads/inspection1.jpg",
      notes: "Air jernih, tidak berbau"
    },
    status: "Safe"
  },
  {
    _id: "2",
    inspector_id: "user2",
    water_point_id: "wp1",
    timestamp: "2024-12-28T14:20:00",
    parameters: {
      ph_level: 6.8,
      turbidity: 5.2,
      odor: "Sedikit berbau"
    },
    evidence: {
      photo_url: "/uploads/inspection2.jpg",
      notes: "Perlu monitoring lebih lanjut"
    },
    status: "Warning"
  },
  {
    _id: "3",
    inspector_id: "user3",
    water_point_id: "wp2",
    timestamp: "2024-12-27T09:15:00",
    parameters: {
      ph_level: 8.5,
      turbidity: 12.0,
      odor: "Berbau keras"
    },
    evidence: {
      photo_url: "/uploads/inspection3.jpg",
      notes: "Air keruh dan berbau, tidak layak konsumsi"
    },
    status: "Unsafe"
  }
];

export default function InspectionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredInspections = mockInspections.filter(inspection => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "safe" && inspection.status === "Safe") ||
                      (activeTab === "warning" && inspection.status === "Warning") ||
                      (activeTab === "unsafe" && inspection.status === "Unsafe");
    return matchesTab;
  });

  const getStatusBadge = (status: Inspection['status']) => {
    const variants: Record<Inspection['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
      'Safe': { variant: 'default', className: 'bg-green-500' },
      'Warning': { variant: 'secondary', className: 'bg-yellow-500' },
      'Unsafe': { variant: 'destructive', className: 'bg-red-500' }
    };
    return <Badge variant={variants[status].variant} className={variants[status].className}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspeksi Kualitas Air</h1>
          <p className="text-muted-foreground">Data berkala hasil pengecekan laboratorium</p>
        </div>
        <Button onClick={() => router.push('/inspections/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Input Hasil Lab
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspeksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInspections.length}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockInspections.filter(i => i.status === 'Safe').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peringatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockInspections.filter(i => i.status === 'Warning').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berbahaya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockInspections.filter(i => i.status === 'Unsafe').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riwayat Inspeksi</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/inspections/trends')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Lihat Grafik Tren
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="safe">Aman</TabsTrigger>
              <TabsTrigger value="warning">Peringatan</TabsTrigger>
              <TabsTrigger value="unsafe">Berbahaya</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Titik Air</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Kekeruhan</TableHead>
                    <TableHead>Bau</TableHead>
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
                          {new Date(inspection.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="font-medium">Titik {inspection.water_point_id}</TableCell>
                        <TableCell>{inspection.parameters.ph_level}</TableCell>
                        <TableCell>{inspection.parameters.turbidity} NTU</TableCell>
                        <TableCell>{inspection.parameters.odor}</TableCell>
                        <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                        <TableCell>User {inspection.inspector_id}</TableCell>
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
                              onClick={() => {/* Handle delete */}}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
