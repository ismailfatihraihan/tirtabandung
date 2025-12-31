"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import type { Issue } from "@/lib/types/database";

// Mock data
const mockIssues: Issue[] = [
  {
    _id: "1",
    reporter_id: "user1",
    water_point_id: "wp1",
    severity_level: "Critical",
    title: "Pipa Bocor Besar",
    description: "Terdapat kebocoran pipa utama di Jl. Cibaduyut",
    status: "Perlu Disurvei",
    created_at: "2024-12-29T08:00:00"
  },
  {
    _id: "2",
    reporter_id: "user2",
    water_point_id: "wp2",
    severity_level: "High",
    title: "Air Berbau Tidak Sedap",
    description: "Warga melaporkan air PDAM berbau aneh",
    status: "Sedang Diperbaiki",
    created_at: "2024-12-28T10:30:00"
  },
  {
    _id: "3",
    reporter_id: "user3",
    water_point_id: "wp3",
    severity_level: "Medium",
    title: "Sumur Tersumbat",
    description: "Sumur tidak bisa menyedot air dengan baik",
    status: "Selesai",
    created_at: "2024-12-27T14:20:00",
    updated_at: "2024-12-28T16:00:00"
  }
];

export default function IssuesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("perlu-disurvei");

  const getIssuesByStatus = (status: Issue['status']) => {
    return mockIssues.filter(issue => issue.status === status);
  };

  const getSeverityBadge = (severity: Issue['severity_level']) => {
    const colors = {
      'Critical': 'bg-red-600',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-blue-500'
    };
    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  const IssueCard = ({ issue }: { issue: Issue }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/issues/${issue._id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{issue.title}</CardTitle>
            <CardDescription>{issue.description}</CardDescription>
          </div>
          {getSeverityBadge(issue.severity_level)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Titik: {issue.water_point_id}</span>
          <span>{new Date(issue.created_at).toLocaleDateString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pelaporan & Tindakan</h1>
          <p className="text-muted-foreground">Sistem tiket penanganan masalah</p>
        </div>
        <Button onClick={() => router.push('/issues/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Laporan Masalah
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Masalah</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIssues.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Survei</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {getIssuesByStatus('Perlu Disurvei').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Perbaikan</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getIssuesByStatus('Sedang Diperbaiki').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getIssuesByStatus('Selesai').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board Penanganan</CardTitle>
          <CardDescription>Kelola progres penanganan masalah</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="perlu-disurvei">
                Perlu Disurvei ({getIssuesByStatus('Perlu Disurvei').length})
              </TabsTrigger>
              <TabsTrigger value="sedang-diperbaiki">
                Sedang Diperbaiki ({getIssuesByStatus('Sedang Diperbaiki').length})
              </TabsTrigger>
              <TabsTrigger value="selesai">
                Selesai ({getIssuesByStatus('Selesai').length})
              </TabsTrigger>
              <TabsTrigger value="invalid">
                Invalid ({getIssuesByStatus('Invalid').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perlu-disurvei" className="space-y-4 mt-4">
              {getIssuesByStatus('Perlu Disurvei').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Tidak ada masalah</p>
              ) : (
                getIssuesByStatus('Perlu Disurvei').map(issue => (
                  <IssueCard key={issue._id} issue={issue} />
                ))
              )}
            </TabsContent>

            <TabsContent value="sedang-diperbaiki" className="space-y-4 mt-4">
              {getIssuesByStatus('Sedang Diperbaiki').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Tidak ada masalah</p>
              ) : (
                getIssuesByStatus('Sedang Diperbaiki').map(issue => (
                  <IssueCard key={issue._id} issue={issue} />
                ))
              )}
            </TabsContent>

            <TabsContent value="selesai" className="space-y-4 mt-4">
              {getIssuesByStatus('Selesai').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Tidak ada masalah</p>
              ) : (
                getIssuesByStatus('Selesai').map(issue => (
                  <IssueCard key={issue._id} issue={issue} />
                ))
              )}
            </TabsContent>

            <TabsContent value="invalid" className="space-y-4 mt-4">
              <p className="text-center text-muted-foreground py-8">Tidak ada masalah</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
