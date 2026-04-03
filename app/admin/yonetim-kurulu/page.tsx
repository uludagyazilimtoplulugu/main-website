"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BoardMember {
  id: string
  fullName: string
  position: string
  positionOrder: number
  bio: string | null
  photoUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
}

interface BoardTerm {
  id: string
  name: string
  startYear: number
  endYear: number
  isCurrent: boolean
  sortOrder: number
  members: BoardMember[]
}

export default function AdminBoardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [terms, setTerms] = useState<BoardTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  // Term form
  const [showTermForm, setShowTermForm] = useState(false)
  const [termForm, setTermForm] = useState({ name: "", startYear: "", endYear: "", isCurrent: false, sortOrder: "0" })

  // Member form
  const [showMemberForm, setShowMemberForm] = useState<string | null>(null)
  const [memberForm, setMemberForm] = useState({
    fullName: "", position: "", positionOrder: "0", bio: "", photoUrl: "", linkedinUrl: "", githubUrl: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !session?.user?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => {
    fetchTerms()
  }, [])

  async function fetchTerms() {
    try {
      const res = await fetch("/api/board/list")
      if (res.ok) {
        const data = await res.json()
        setTerms(data)
      }
    } catch {
      toast.error("Veriler yuklenemedi")
    } finally {
      setLoading(false)
    }
  }

  async function createTerm() {
    const res = await fetch("/api/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(termForm),
    })
    if (res.ok) {
      toast.success("Donem eklendi")
      setShowTermForm(false)
      setTermForm({ name: "", startYear: "", endYear: "", isCurrent: false, sortOrder: "0" })
      fetchTerms()
    } else {
      toast.error("Hata olustu")
    }
  }

  async function deleteTerm(termId: string) {
    if (!confirm("Bu donemi ve tum uyelerini silmek istediginize emin misiniz?")) return
    const res = await fetch(`/api/board/${termId}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Donem silindi")
      fetchTerms()
    }
  }

  async function addMember(termId: string) {
    const res = await fetch(`/api/board/${termId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberForm),
    })
    if (res.ok) {
      toast.success("Uye eklendi")
      setShowMemberForm(null)
      setMemberForm({ fullName: "", position: "", positionOrder: "0", bio: "", photoUrl: "", linkedinUrl: "", githubUrl: "" })
      fetchTerms()
    } else {
      toast.error("Hata olustu")
    }
  }

  async function deleteMember(memberId: string) {
    if (!confirm("Bu uyeyi silmek istediginize emin misiniz?")) return
    const res = await fetch(`/api/board/members/${memberId}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Uye silindi")
      fetchTerms()
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Yonetim Kurulu Yonetimi</h1>
              <p className="text-muted-foreground">Donemleri ve uyeleri yonetin</p>
            </div>
            <Button onClick={() => setShowTermForm(!showTermForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Donem
            </Button>
          </div>

          {showTermForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Yeni Donem Ekle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Donem Adi</Label>
                    <Input
                      value={termForm.name}
                      onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                      placeholder="ornek: 4. Donem"
                    />
                  </div>
                  <div>
                    <Label>Siralama</Label>
                    <Input
                      type="number"
                      value={termForm.sortOrder}
                      onChange={(e) => setTermForm({ ...termForm, sortOrder: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Baslangic Yili</Label>
                    <Input
                      type="number"
                      value={termForm.startYear}
                      onChange={(e) => setTermForm({ ...termForm, startYear: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <Label>Bitis Yili</Label>
                    <Input
                      type="number"
                      value={termForm.endYear}
                      onChange={(e) => setTermForm({ ...termForm, endYear: e.target.value })}
                      placeholder="2025"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={termForm.isCurrent}
                      onCheckedChange={(checked) => setTermForm({ ...termForm, isCurrent: checked })}
                    />
                    <Label>Guncel Donem</Label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createTerm}>Kaydet</Button>
                  <Button variant="outline" onClick={() => setShowTermForm(false)}>Iptal</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {terms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Henuz donem eklenmemis.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {terms.map((term) => (
                <Card key={term.id}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle>{term.name} ({term.startYear}-{term.endYear})</CardTitle>
                        {term.isCurrent && <Badge>Guncel</Badge>}
                        <span className="text-sm text-muted-foreground">{term.members.length} uye</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); deleteTerm(term.id) }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {expandedTerm === term.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedTerm === term.id && (
                    <CardContent>
                      <div className="space-y-4">
                        {term.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{member.fullName}</p>
                              <p className="text-sm text-muted-foreground">{member.position} (Sira: {member.positionOrder})</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        {showMemberForm === term.id ? (
                          <Card className="bg-muted/50">
                            <CardContent className="pt-4">
                              <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                  <Label>Ad Soyad</Label>
                                  <Input
                                    value={memberForm.fullName}
                                    onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Pozisyon</Label>
                                  <Input
                                    value={memberForm.position}
                                    onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                                    placeholder="ornek: Baskan"
                                  />
                                </div>
                                <div>
                                  <Label>Pozisyon Sirasi</Label>
                                  <Input
                                    type="number"
                                    value={memberForm.positionOrder}
                                    onChange={(e) => setMemberForm({ ...memberForm, positionOrder: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Fotograf</Label>
                                  <ImageUpload
                                    value={memberForm.photoUrl}
                                    onChange={(url) => setMemberForm({ ...memberForm, photoUrl: url })}
                                    placeholder="Fotograf yukle veya URL gir"
                                  />
                                </div>
                                <div>
                                  <Label>LinkedIn URL</Label>
                                  <Input
                                    value={memberForm.linkedinUrl}
                                    onChange={(e) => setMemberForm({ ...memberForm, linkedinUrl: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>GitHub URL</Label>
                                  <Input
                                    value={memberForm.githubUrl}
                                    onChange={(e) => setMemberForm({ ...memberForm, githubUrl: e.target.value })}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Biyografi</Label>
                                  <Textarea
                                    value={memberForm.bio}
                                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" onClick={() => addMember(term.id)}>Ekle</Button>
                                <Button size="sm" variant="outline" onClick={() => setShowMemberForm(null)}>Iptal</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMemberForm(term.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Uye Ekle
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
