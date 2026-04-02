"use client"

import { Button } from "@/components/ui/button"
import { Check, Star, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AdminProjectActionsProps {
  projectId: string
  published: boolean
  featured: boolean
}

export function AdminProjectActions({ projectId, published, featured }: AdminProjectActionsProps) {
  const router = useRouter()

  async function togglePublish() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    })
    if (res.ok) {
      toast.success(published ? "Yayindan kaldirildi" : "Yayinlandi")
      router.refresh()
    }
  }

  async function toggleFeatured() {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    })
    if (res.ok) {
      toast.success(featured ? "One cikarmadan kaldirildi" : "One cikarildi")
      router.refresh()
    }
  }

  async function deleteProject() {
    if (!confirm("Projeyi silmek istediginize emin misiniz?")) return
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Proje silindi")
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={togglePublish}>
        <Check className="h-4 w-4 mr-1" />
        {published ? "Kaldir" : "Onayla"}
      </Button>
      <Button variant="outline" size="sm" onClick={toggleFeatured}>
        <Star className="h-4 w-4 mr-1" />
        {featured ? "Cikar" : "One Cikar"}
      </Button>
      <Button variant="ghost" size="sm" onClick={deleteProject}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
