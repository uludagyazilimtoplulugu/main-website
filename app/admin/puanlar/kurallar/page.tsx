"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Save } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface PointRule {
  id: string
  activityType: string
  points: number
  description: string
  isActive: boolean
}

export default function AdminPointRulesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rules, setRules] = useState<PointRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newRule, setNewRule] = useState({ activityType: "", points: "", description: "" })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !(session?.user as any)?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    try {
      const data = await fetch("/api/points/rules").then((r) => r.json())
      setRules(data)
    } catch {
      toast.error("Kurallar yuklenemedi")
    } finally {
      setLoading(false)
    }
  }

  async function updateRule(id: string, updates: Partial<PointRule>) {
    const res = await fetch("/api/points/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    })
    if (res.ok) {
      toast.success("Kural guncellendi")
      fetchRules()
    }
  }

  async function createRule() {
    if (!newRule.activityType || !newRule.points || !newRule.description) {
      toast.error("Tum alanlari doldurun")
      return
    }
    const res = await fetch("/api/points/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRule, points: Number(newRule.points) }),
    })
    if (res.ok) {
      toast.success("Kural eklendi")
      setShowNewForm(false)
      setNewRule({ activityType: "", points: "", description: "" })
      fetchRules()
    } else {
      toast.error("Hata olustu")
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
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin/puanlar">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Puan Kurallari</h1>
                <p className="text-muted-foreground">Aktivite basi puan degerlerini ayarlayin</p>
              </div>
            </div>
            <Button onClick={() => setShowNewForm(!showNewForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kural
            </Button>
          </div>

          {showNewForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Yeni Puan Kurali</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Aktivite Tipi</Label>
                    <Input
                      value={newRule.activityType}
                      onChange={(e) => setNewRule({ ...newRule, activityType: e.target.value })}
                      placeholder="blog_post, event_attendance..."
                    />
                  </div>
                  <div>
                    <Label>Puan</Label>
                    <Input
                      type="number"
                      value={newRule.points}
                      onChange={(e) => setNewRule({ ...newRule, points: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Aciklama</Label>
                    <Input
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      placeholder="Blog yazisi yazmak"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createRule}>Olustur</Button>
                  <Button variant="outline" onClick={() => setShowNewForm(false)}>Iptal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Mevcut Kurallar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-4 p-4 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{rule.description}</p>
                      <p className="text-sm text-muted-foreground font-mono">{rule.activityType}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Puan:</Label>
                        <Input
                          type="number"
                          className="w-20"
                          defaultValue={rule.points}
                          onBlur={(e) => {
                            const newPoints = Number(e.target.value)
                            if (newPoints !== rule.points) {
                              updateRule(rule.id, { points: newPoints })
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Aktif:</Label>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => updateRule(rule.id, { isActive: checked })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {rules.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Henuz kural eklenmemis.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
