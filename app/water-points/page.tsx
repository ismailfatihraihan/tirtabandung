"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Search, Eye, Edit, Archive, Filter } from "lucide-react";
import type { WaterPoint } from "@/lib/types/database";

// Mock data - Replace with API call
const mockWaterPoints: WaterPoint[] = [
  {
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
    status: "Active"
  },
  {
    _id: "2",
    name: "PDAM Dago Pakar",
    location: {
      lat: -6.8569,
      long: 107.6152,
      address: "Jl. Dago Atas No.45",
      sub_district: "Dago"
    },
    last_maintained: "2024-11-20",
    type: "PDAM",
    status: "Active"
  },
  {
    _id: "3",
    name: "Sumur Gali Bojongsoang",
    location: {
      lat: -6.9774,
      long: 107.6361,
      address: "Desa Bojongsoang",
      sub_district: "Bojongsoang"
    },
    last_maintained: "2024-10-05",
    type: "Sumur Gali",
    depth: 12,
    status: "Under Maintenance"
  }
];

export default function WaterPointsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPoints = mockWaterPoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.location.sub_district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && point.status === "Active") ||
                      (activeTab === "maintenance" && point.status === "Under Maintenance") ||
                      (activeTab === "inactive" && point.status === "Inactive");
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: WaterPoint['status']) => {
    const variants: Record<WaterPoint['status'], 'default' | 'secondary' | 'destructive'> = {
      'Active': 'default',
      'Under Maintenance': 'secondary',
      'Inactive': 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Titik Sumber Air</h1>
          <p className="text-muted-foreground">Kelola data sumur, sungai, dan toren air</p>
        </div>
        <Button onClick={() => router.push('/water-points/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Titik Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Titik Air</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWaterPoints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockWaterPoints.filter(p => p.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockWaterPoints.filter(p => p.status === 'Under Maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="inactive">Tidak Aktif</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
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
                      <TableRow key={point._id}>
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
                          {new Date(point.last_maintained).toLocaleDateString('id-ID')}
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
                              onClick={() => {/* Handle archive */}}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
