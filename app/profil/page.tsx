import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, Trophy, Star, Edit, BookOpen, CalendarCheck } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user ?? null

  if (!user) {
    redirect("/giris")
  }

  // Fetch user profile
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  })

  const isAdmin = user.isAdmin === true

  // Fetch user badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: {
      badge: {
        select: { id: true, name: true, icon: true, color: true },
      },
    },
    orderBy: { earnedAt: "desc" },
  })

  // Fetch user activities
  const activities = await prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  // Fetch user's blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: { authorId: user.id },
    select: { id: true, title: true, slug: true, createdAt: true, views: true, published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  // Fetch user's event registrations
  const eventRegistrations = await prisma.eventRegistration.findMany({
    where: { userId: user.id },
    include: {
      event: {
        select: { id: true, title: true, slug: true, eventDate: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profile?.displayName?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{profile?.displayName}</h1>
                    <Badge variant="outline" className="text-base">
                      Seviye {profile?.level}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{profile?.fullName}</p>
                  {profile?.bio && <p className="text-foreground mb-4">{profile.bio}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{profile?.points || 0} puan</span>
                    </div>
                    {profile?.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Katılım: {format(new Date(profile.createdAt), "MM yyyy", { locale: tr })}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/profil/duzenle">
                    <Edit className="mr-2 h-4 w-4" />
                    Profili Düzenle
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Blog Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Blog Yazılarım
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blogPosts && blogPosts.length > 0 ? (
                    <div className="space-y-3">
                      {blogPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{post.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })} • {post.views}{" "}
                                görüntülenme
                              </p>
                            </div>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Yayında" : "Taslak"}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                      {isAdmin && (
                        <div className="pt-3">
                          <Button variant="outline" asChild className="w-full bg-transparent">
                            <Link href="/blog/yeni">Yeni Blog Yazısı Oluştur</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        {isAdmin ? "Henüz blog yazısı yazmadınız." : "Henüz yazılmış blog yazısı yok."}
                      </p>
                      {isAdmin && (
                        <Button asChild>
                          <Link href="/blog/yeni">İlk Yazını Oluştur</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Etkinlik Kayıtlarım
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventRegistrations && eventRegistrations.length > 0 ? (
                    <div className="space-y-3">
                      {eventRegistrations.map((registration: any, idx: number) => (
                        <Link key={idx} href={`/etkinlikler/${registration.event?.slug}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{registration.event?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(registration.event?.eventDate), "d MMMM yyyy, HH:mm", { locale: tr })}
                              </p>
                            </div>
                            <Badge
                              variant={
                                registration.status === "attended"
                                  ? "default"
                                  : registration.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {registration.status === "attended"
                                ? "Katıldı"
                                : registration.status === "cancelled"
                                  ? "İptal"
                                  : "Kayıtlı"}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Henüz etkinlik kaydınız yok.</p>
                      <Button asChild>
                        <Link href="/etkinlikler">Etkinliklere Göz At</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activities && activities.length > 0 ? (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">+{activity.points}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.createdAt), "d MMMM yyyy, HH:mm", { locale: tr })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">Henüz aktivite yok.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Rozetlerim</CardTitle>
                  <CardDescription>{userBadges?.length || 0} rozet kazandınız</CardDescription>
                </CardHeader>
                <CardContent>
                  {userBadges && userBadges.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {userBadges.map((ub: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30"
                          title={ub.badge?.name}
                        >
                          <div className="text-3xl">{ub.badge?.icon}</div>
                          <p className="text-xs text-center text-muted-foreground truncate w-full">{ub.badge?.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground text-sm">Henüz rozet kazanmadınız.</p>
                  )}
                  <div className="mt-4">
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href="/rozetler">Tüm Rozetleri Gör</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>İstatistikler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Toplam Puan</span>
                    <span className="text-xl font-bold text-primary">{profile?.points}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Seviye</span>
                    <span className="text-xl font-bold text-foreground">{profile?.level}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Blog Yazısı</span>
                    <span className="text-xl font-bold text-foreground">{blogPosts?.length || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Etkinlik Katılımı</span>
                    <span className="text-xl font-bold text-foreground">{eventRegistrations?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
