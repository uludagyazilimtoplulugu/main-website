"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function NewProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    coverImage: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
  }, [status, router])

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  async function handleSubmit() {
    if (!form.title || !form.description) {
      toast.error("Baslik ve aciklama zorunlu")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: generateSlug(form.title),
          techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success("Proje eklendi! Admin onayi sonrasi yayinlanacak.")
        router.push("/projeler")
      } else {
        const err = await res.json()
        toast.error(err.error || "Hata olustu")
      }
    } catch {
      toast.error("Bir hata olustu")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center"><p>Yukleniyor...</p></div>
  }

  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user ? { id: user.id!, email: user.email!, name: user.name!, isAdmin: (user as any).isAdmin, displayName: (user as any).displayName } : null} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Proje Ekle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Proje Adi *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Aciklama *</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
              </div>
              <div>
                <Label>Teknolojiler (virgullerle ayirin)</Label>
                <Input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div>
                <Label>GitHub URL</Label>
                <Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
              </div>
              <div>
                <Label>Demo URL</Label>
                <Input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
              </div>
              <div>
                <Label>Kapak Gorseli URL</Label>
                <Input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <p className="text-sm text-muted-foreground">* Proje admin onayi sonrasi yayinlanacaktir.</p>
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "Gonderiliyor..." : "Proje Ekle"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
