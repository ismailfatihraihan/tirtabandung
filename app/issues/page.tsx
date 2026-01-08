"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "@/lib/types/database";

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const data = await response.json();
      setIssues(data.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Gagal memuat data masalah');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = searchTerm
      ? `${issue.title} ${issue.description}`.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesSeverity = severityFilter === "all" ? true : issue.severity === severityFilter;
    const matchesStatus = statusFilter === "all" ? true : issue.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleStatusChange = async (issueId: string, status: Issue['status']) => {
    setStatusUpdatingId(issueId);
    try {
      const res = await fetch('/api/issues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_id: issueId, status })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update status');
      }

      const updated = await res.json();
      setIssues((prev) => prev.map((item) => (item._id === issueId ? { ...item, ...updated.data } : item)));
      toast.success('Status berhasil diperbarui');
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const getSeverityBadge = (severity: Issue['severity']) => {
    const colors = {
      'Kritis': 'bg-red-600',
      'Tinggi': 'bg-orange-500',
      'Sedang': 'bg-yellow-500',
      'Rendah': 'bg-emerald-500'
    };
    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  const IssueCard = ({ issue }: { issue: Issue }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="cursor-pointer" onClick={() => router.push(`/issues/${issue._id}`)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg">{issue.title}</CardTitle>
              {getSeverityBadge(issue.severity)}
            </div>
            <CardDescription className="line-clamp-2">{issue.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="space-y-1">
            <div><span className="font-medium text-foreground">Titik:</span> {issue.water_point_name || issue.water_point_id}</div>
            <div><span className="font-medium text-foreground">Kategori:</span> {issue.category}</div>
            <div><span className="font-medium text-foreground">Pelapor:</span> {issue.reporter_name || issue.reported_by}</div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[180px]">
            <Select
              value={issue.status}
              onValueChange={(value) => handleStatusChange(issue._id, value as Issue['status'])}
            >
              <SelectTrigger className="w-44" disabled={statusUpdatingId === issue._id}>
                <SelectValue placeholder="Ubah status" />
              </SelectTrigger>
              <SelectContent align="end" onClick={(e) => e.stopPropagation()}>
                <SelectItem value="Perlu Disurvei">Perlu Disurvei</SelectItem>
                <SelectItem value="Sedang Diperbaiki">Sedang Diperbaiki</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Invalid">Invalid</SelectItem>
              </SelectContent>
            </Select>
            <span>{new Date(issue.created_at).toLocaleDateString('id-ID')}</span>
          </div>
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
        <Button onClick={() => router.push('/issues/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Laporan Masalah
        </Button>
      </div>

      {/* Filters */}
      <Card suppressHydrationWarning>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Cari judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Perlu Disurvei">Perlu Disurvei</SelectItem>
                <SelectItem value="Sedang Diperbaiki">Sedang Diperbaiki</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Invalid">Invalid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter keparahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Keparahan</SelectItem>
                <SelectItem value="Kritis">Kritis</SelectItem>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Sedang">Sedang</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSeverityFilter("all");
              }}
            >
              Reset Filter
            </Button>
            <Button variant="outline" onClick={fetchIssues} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Muat Ulang'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daftar Isu sederhana */}
      <Card suppressHydrationWarning>
        <CardHeader>
          <CardTitle>Daftar Laporan</CardTitle>
          <CardDescription>Ringkas: judul, lokasi, status, severity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memuat data...</span>
            </div>
          ) : sortedIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Tidak ada laporan</p>
          ) : (
            sortedIssues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
