"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  imageUrl: string
  caption: string | null
  eventId: string | null
  event?: { title: string; slug: string } | null
}

interface EventOption {
  id: string
  title: string
}

export default function AdminGalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ imageUrl: "", caption: "", eventId: "" })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !(session?.user as any)?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => {
    Promise.all([
      fetch("/api/gallery").then((r) => r.json()),
      fetch("/api/events/list").then((r) => r.json()),
    ])
      .then(([imagesData, eventsData]) => {
        setImages(imagesData)
        setEvents(eventsData)
      })
      .catch(() => toast.error("Yuklenemedi"))
      .finally(() => setLoading(false))
  }, [])

  async function addImage() {
    if (!form.imageUrl) { toast.error("Gorsel URL zorunlu"); return }
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: form.imageUrl,
        caption: form.caption || null,
        eventId: form.eventId || null,
      }),
    })
    if (res.ok) {
      toast.success("Fotograf eklendi")
      setShowForm(false)
      setForm({ imageUrl: "", caption: "", eventId: "" })
      const data = await fetch("/api/gallery").then((r) => r.json())
      setImages(data)
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Silmek istediginize emin misiniz?")) return
    await fetch(`/api/gallery/${id}`, { method: "DELETE" })
    toast.success("Silindi")
    setImages(images.filter((i) => i.id !== id))
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
                <h1 className="text-4xl font-bold">Galeri Yonetimi</h1>
                <p className="text-muted-foreground">{images.length} fotograf</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" /> Fotograf Ekle
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader><CardTitle>Fotograf Ekle</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><Label>Gorsel URL *</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
                  <div><Label>Aciklama</Label><Input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></div>
                  <div>
                    <Label>Etkinlik (opsiyonel)</Label>
                    <Select value={form.eventId} onValueChange={(v) => setForm({ ...form, eventId: v })}>
                      <SelectTrigger><SelectValue placeholder="Etkinlik sec..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Yok</SelectItem>
                        {events.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={addImage}>Ekle</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Iptal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {images.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Henuz fotograf yok.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square overflow-hidden rounded-lg border">
                  <img src={img.imageUrl} alt={img.caption || ""} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {img.caption && <p className="text-white text-sm text-center px-2">{img.caption}</p>}
                    {img.event && <p className="text-white/70 text-xs">{img.event.title}</p>}
                    <Button variant="destructive" size="sm" onClick={() => deleteImage(img.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
