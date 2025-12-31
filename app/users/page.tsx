"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Edit, UserX, Users, Shield } from "lucide-react"
import type { User } from "@/lib/types/database"

// Mock data
const mockUsers: User[] = [
  {
    _id: "1",
    name: "Dr. Ahmad Hidayat",
    assigned_district: "Cibaduyut",
    role: "Admin Pusat",
    email: "ahmad@tirtabandung.id",
    phone: "081234567890",
    status: "Active",
    created_at: "2024-01-10"
  },
  {
    _id: "2",
    name: "Siti Nurhaliza",
    assigned_district: "Dago",
    role: "Petugas Lab",
    email: "siti@tirtabandung.id",
    phone: "081234567891",
    status: "Active",
    created_at: "2024-02-15"
  },
  {
    _id: "3",
    name: "Budi Santoso",
    assigned_district: "Bojongsoang",
    role: "Surveyor",
    email: "budi@tirtabandung.id",
    phone: "081234567892",
    status: "Active",
    created_at: "2024-03-20"
  },
  {
    _id: "4",
    name: "Dewi Kartika",
    assigned_district: "Coblong",
    role: "Kader RT",
    email: "dewi@tirtabandung.id",
    phone: "081234567893",
    status: "Inactive",
    created_at: "2024-04-05"
  }
]

export default function UsersPage() {
  const router = useRouter()
  const { isAdmin, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [isLoading, isAdmin, router])

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!isAdmin) {
    return null
  }

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.assigned_district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: User['status']) => {
    return (
      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    )
  }

  const getRoleBadge = (role: User['role']) => {
    const colors: Record<User['role'], string> = {
      'Admin Pusat': 'bg-purple-500',
      'Admin': 'bg-blue-500',
      'Surveyor': 'bg-green-500',
      'Petugas Lab': 'bg-cyan-500',
      'Kader RT': 'bg-orange-500',
      'Teknisi': 'bg-pink-500'
    }
    return <Badge className={colors[role]}>{role}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Admin Only Badge */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-purple-600" />
        <div>
          <p className="font-semibold text-purple-900">Halaman Khusus Admin</p>
          <p className="text-sm text-purple-700">Hanya Admin Pusat yang dapat mengelola user</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola akses petugas dan kader</p>
        </div>
        <Button onClick={() => router.push('/users/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Petugas Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Petugas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockUsers.filter(u => u.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {mockUsers.filter(u => u.status === 'Inactive').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wilayah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockUsers.map(u => u.assigned_district)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, wilayah, atau role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Wilayah Tugas</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.assigned_district}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/users/${user._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/users/${user._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {/* Handle deactivate */}}
                        >
                          <UserX className="h-4 w-4" />
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
