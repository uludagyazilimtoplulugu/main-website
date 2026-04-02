"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  websiteUrl: string | null
  tier: string
  sortOrder: number
  isActive: boolean
}

export default function AdminSponsorsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", logoUrl: "", websiteUrl: "", tier: "silver", sortOrder: "0" })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !(session?.user as any)?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => { fetchSponsors() }, [])

  async function fetchSponsors() {
    try {
      const data = await fetch("/api/sponsors").then((r) => r.json())
      setSponsors(data)
    } catch { toast.error("Yuklenemedi") }
    finally { setLoading(false) }
  }

  async function createSponsor() {
    if (!form.name || !form.logoUrl) { toast.error("Ad ve logo zorunlu"); return }
    const res = await fetch("/api/sponsors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success("Sponsor eklendi")
      setShowForm(false)
      setForm({ name: "", logoUrl: "", websiteUrl: "", tier: "silver", sortOrder: "0" })
      fetchSponsors()
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/sponsors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchSponsors()
  }

  async function deleteSponsor(id: string) {
    if (!confirm("Silmek istediginize emin misiniz?")) return
    await fetch(`/api/sponsors/${id}`, { method: "DELETE" })
    toast.success("Silindi")
    fetchSponsors()
  }

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Yukleniyor...</p></div>
  }

  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user ? { id: user.id!, email: user.email!, name: user.name!, isAdmin: (user as any).isAdmin, displayName: (user as any).displayName } : null} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold">Sponsor Yonetimi</h1>
                <p className="text-muted-foreground">{sponsors.length} sponsor</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" /> Yeni Sponsor
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader><CardTitle>Yeni Sponsor Ekle</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><Label>Ad *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Logo URL *</Label><Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} /></div>
                  <div><Label>Website URL</Label><Input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} /></div>
                  <div>
                    <Label>Tier</Label>
                    <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platinum">Platin</SelectItem>
                        <SelectItem value="gold">Altin</SelectItem>
                        <SelectItem value="silver">Gumus</SelectItem>
                        <SelectItem value="bronze">Bronz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Siralama</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createSponsor}>Kaydet</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Iptal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Tum Sponsorlar</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sponsors.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <img src={s.logoUrl} alt={s.name} className="h-10 w-auto object-contain" />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{s.tier}</Badge>
                          <Badge variant={s.isActive ? "default" : "outline"}>{s.isActive ? "Aktif" : "Pasif"}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleActive(s.id, s.isActive)}>
                        {s.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteSponsor(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {sponsors.length === 0 && <p className="text-center text-muted-foreground py-8">Henuz sponsor yok.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
