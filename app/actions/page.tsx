"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import type { ActionTracking } from "@/lib/types/database";

// Mock data
const mockActions: ActionTracking[] = [
  {
    _id: "1",
    issue_id: "1",
    assigned_team: "Tim Teknisi A",
    action_taken: "Pembersihan filter dan penggantian pipa rusak",
    completion_date: "2024-12-31T15:00:00",
    status: "In Progress",
    created_at: "2024-12-30T09:00:00"
  },
  {
    _id: "2",
    issue_id: "2",
    assigned_team: "Tim Plumbing B",
    action_taken: "Survei lokasi kebocoran dan estimasi material",
    status: "Pending",
    created_at: "2024-12-29T15:00:00"
  },
  {
    _id: "3",
    issue_id: "3",
    assigned_team: "Tim Listrik C",
    action_taken: "Perbaikan motor pompa dan penggantian komponen",
    completion_date: "2024-12-29T17:00:00",
    status: "Completed",
    created_at: "2024-12-28T17:00:00"
  }
];

export default function ActionsPage() {
  const router = useRouter();

  const getStatusBadge = (status: ActionTracking['status']) => {
    const variants: Record<ActionTracking['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
      'Pending': { variant: 'secondary', className: 'bg-orange-500' },
      'In Progress': { variant: 'default', className: 'bg-blue-500' },
      'Completed': { variant: 'default', className: 'bg-green-500' }
    };
    return <Badge variant={variants[status].variant} className={variants[status].className}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tindakan & Progres</h1>
          <p className="text-muted-foreground">Tracking penanganan masalah</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockActions.filter(a => a.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockActions.filter(a => a.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockActions.filter(a => a.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tindakan</CardTitle>
          <CardDescription>Riwayat penanganan semua laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Tindakan</TableHead>
                <TableHead>Tim Assigned</TableHead>
                <TableHead>Tindakan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target Selesai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActions.map((action) => (
                <TableRow key={action._id}>
                  <TableCell className="font-medium">#{action._id}</TableCell>
                  <TableCell>{action.assigned_team}</TableCell>
                  <TableCell className="max-w-xs truncate">{action.action_taken}</TableCell>
                  <TableCell>{getStatusBadge(action.status)}</TableCell>
                  <TableCell>
                    {action.completion_date 
                      ? new Date(action.completion_date).toLocaleDateString('id-ID')
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/issues/${action.issue_id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
