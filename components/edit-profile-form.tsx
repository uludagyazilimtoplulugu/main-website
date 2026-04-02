"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type Profile = {
  id: string
  fullName: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
}

export function EditProfileForm({ profile }: { profile: Profile | null }) {
  const [fullName, setFullName] = useState(profile?.fullName || "")
  const [displayName, setDisplayName] = useState(profile?.displayName || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, displayName, bio: bio || null, avatarUrl: avatarUrl || null }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Profil güncellenemedi")
      }

      toast({
        title: "Başarılı",
        description: "Profil güncellendi",
      })
      router.push("/profil")
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error updating profile:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Profil güncellenemedi",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ahmet Yılmaz"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Kullanıcı Adı *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="ahmety"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biyografi</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendiniz hakkında kısa bir bilgi"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Profil Fotoğrafı URL</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              type="url"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kaydet
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
