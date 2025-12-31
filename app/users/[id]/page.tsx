"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, UserX } from "lucide-react";
import type { User } from "@/lib/types/database";
import { toast } from "sonner";

const mockUser: User = {
  _id: "1",
  name: "Dr. Ahmad Hidayat",
  assigned_district: "Cibaduyut",
  role: "Admin Pusat",
  email: "ahmad@tirtabandung.id",
  phone: "081234567890",
  status: "Active",
  created_at: "2024-01-10"
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = mockUser;

  const getRoleBadge = (role: User['role']) => {
    const colors: Record<User['role'], string> = {
      'Admin Pusat': 'bg-purple-500',
      'Admin': 'bg-blue-500',
      'Surveyor': 'bg-green-500',
      'Petugas Lab': 'bg-cyan-500',
      'Kader RT': 'bg-orange-500',
      'Teknisi': 'bg-pink-500'
    };
    return <Badge className={colors[role]}>{role}</Badge>;
  };

  const handleDeactivate = () => {
    // TODO: API call
    toast.success("Akun berhasil dinonaktifkan");
    router.push('/users');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">Profil petugas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/users/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil
          </Button>
          {user.status === 'Active' && (
            <Button variant="destructive" onClick={handleDeactivate}>
              <UserX className="mr-2 h-4 w-4" />
              Nonaktifkan
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                {user.status}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Role / Jabatan</p>
              {getRoleBadge(user.role)}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="font-medium">{user.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                No. Telepon
              </p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penugasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Wilayah Tugas
              </p>
              <p className="font-medium text-lg">{user.assigned_district}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tanggal Bergabung
              </p>
              <p className="font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Belum ada aktivitas yang tercatat
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
