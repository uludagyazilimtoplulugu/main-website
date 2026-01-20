"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
  full_name: string
  display_name: string
  bio: string | null
  avatar_url: string | null
}

export function EditProfileForm({ profile }: { profile: Profile | null }) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        display_name: displayName,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      })
      .eq("id", profile?.id)

    if (error) {
      console.error("[v0] Error updating profile:", error)
      toast({
        title: "Hata",
        description: error.message || "Profil güncellenemedi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Başarılı",
        description: "Profil güncellendi",
      })
      router.push("/profil")
      router.refresh()
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
