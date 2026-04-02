"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Star, Plus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UserWithPoints {
  id: string
  fullName: string
  email: string
  points: number
  level: number
}

interface PointRule {
  id: string
  activityType: string
  points: number
  description: string
  isActive: boolean
}

export default function AdminPointsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserWithPoints[]>([])
  const [rules, setRules] = useState<PointRule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedActivity, setSelectedActivity] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !(session?.user as any)?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users-points").then((r) => r.json()),
      fetch("/api/points/rules").then((r) => r.json()),
    ])
      .then(([usersData, rulesData]) => {
        setUsers(usersData)
        setRules(rulesData)
      })
      .catch(() => toast.error("Veriler yuklenemedi"))
      .finally(() => setLoading(false))
  }, [])

  async function awardPoints() {
    if (!selectedUserId || !selectedActivity || !description) {
      toast.error("Tum alanlari doldurun")
      return
    }

    const res = await fetch("/api/points/award", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUserId,
        activityType: selectedActivity,
        description,
      }),
    })

    if (res.ok) {
      toast.success("Puan verildi")
      setSelectedUserId("")
      setSelectedActivity("")
      setDescription("")
      // Refresh users
      const usersData = await fetch("/api/admin/users-points").then((r) => r.json())
      setUsers(usersData)
    } else {
      const err = await res.json()
      toast.error(err.error || "Hata olustu")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Yukleniyor...</p>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user ? { id: user.id!, email: user.email!, name: user.name!, isAdmin: (user as any).isAdmin, displayName: (user as any).displayName } : null} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Puan Yonetimi</h1>
              <p className="text-muted-foreground">Kullanici puanlarini yonet ve kural ayarla</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Manuel Puan Verme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Manuel Puan Ver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Kullanici</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kullanici sec..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.fullName} ({u.points} puan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Aktivite Tipi</Label>
                  <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aktivite sec..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rules.filter((r) => r.isActive).map((r) => (
                        <SelectItem key={r.id} value={r.activityType}>
                          {r.description} ({r.points} puan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Aciklama</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Puan verme nedeni..."
                  />
                </div>
                <Button onClick={awardPoints} className="w-full">Puan Ver</Button>
              </CardContent>
            </Card>

            {/* Kural Yonetimi Linki */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Puan Kurallari
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{rule.description}</p>
                        <p className="text-sm text-muted-foreground">{rule.activityType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{rule.points} puan</p>
                        <p className="text-xs text-muted-foreground">{rule.isActive ? "Aktif" : "Pasif"}</p>
                      </div>
                    </div>
                  ))}
                  {rules.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Henuz kural eklenmemis.</p>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/puanlar/kurallar">Kurallari Duzenle</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Kullanici Puan Listesi */}
          <Card>
            <CardHeader>
              <CardTitle>Kullanici Puanlari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((u, i) => (
                  <div key={u.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-8">#{i + 1}</span>
                      <div>
                        <p className="font-medium">{u.fullName}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{u.points} puan</p>
                      <p className="text-xs text-muted-foreground">Seviye {u.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
