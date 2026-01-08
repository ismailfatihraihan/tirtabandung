"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";

export default function EditSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error('Gagal memuat profil');
        const data = await res.json();
        const user = data.user || {};
        setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
        if (user.avatar) setAvatarPreview(user.avatar);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat data user');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatarBase64: string | undefined;
      if (avatarFile) {
        const dataUrl = avatarPreview as string;
        avatarBase64 = dataUrl;
      }

      const res = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, avatarBase64 })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui profil');
      }

      // Persist updated user to localStorage so other pages show new avatar
      try {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // notify other components/hooks that the user changed
          try { window.dispatchEvent(new Event('user:updated')) } catch (e) {}
        }
      } catch (e) {
        console.error('Failed to update localStorage user', e);
      }

      toast.success('Profil berhasil diperbarui');
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profil</h1>
          <p className="text-muted-foreground">Perbarui informasi akun Anda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex-shrink-0 relative">
                <label htmlFor="avatar" className="block w-full h-full cursor-pointer">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"> 
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path><path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"></path></svg>
                    </div>
                  )}

                  {/* camera overlay */}
                  <div className="absolute right-2 bottom-2 bg-white rounded-full p-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path d="M4 7h3l2-2h6l2 2h3v11H4z" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="13" r="2" fill="white" stroke="black" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <input id="avatar" type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </label>
              </div>
            </div>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Perbarui nama, kontak, dan foto profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>Batal</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Menyimpan...' : (<><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>)}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
