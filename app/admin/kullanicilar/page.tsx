import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"

export default async function AdminUsersPage() {
  const session = await auth()
  const user = session?.user ?? null

  if (!user) {
    redirect("/giris")
  }

  if (!user.isAdmin) {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Kullanıcı Yönetimi</h1>
              <p className="text-muted-foreground">Toplam {users?.length || 0} kullanıcı</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tüm Kullanıcılar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((userProfile) => (
                  <div key={userProfile.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userProfile.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>{userProfile.displayName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{userProfile.displayName}</p>
                          {userProfile.isAdmin && <Badge variant="destructive">Admin</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>Seviye {userProfile.level}</span>
                          <span>•</span>
                          <span>{userProfile.points} puan</span>
                          <span>•</span>
                          <span>{format(new Date(userProfile.createdAt), "d MMM yyyy", { locale: tr })}</span>
                        </div>
                      </div>
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
