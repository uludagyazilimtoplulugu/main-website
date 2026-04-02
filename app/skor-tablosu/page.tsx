import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

export default async function LeaderboardPage() {
  const session = await auth()
  const user = session?.user ?? null

  // Fetch top users by points
  const topUsers = await prisma.user.findMany({
    select: { id: true, displayName: true, fullName: true, avatarUrl: true, points: true, level: true },
    orderBy: { points: "desc" },
    take: 50,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Skor Tablosu</h1>
            <p className="text-lg text-muted-foreground">En aktif topluluk üyelerimiz</p>
          </div>

          {topUsers && topUsers.length > 0 ? (
            <div className="space-y-4">
              {topUsers.map((profile, index) => {
                const isTop3 = index < 3
                const Icon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Award : null

                return (
                  <Card key={profile.id} className={isTop3 ? "border-2 border-primary/50 bg-primary/5" : ""}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 text-center">
                          {Icon ? (
                            <Icon
                              className={`h-8 w-8 ${
                                index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                              }`}
                            />
                          ) : (
                            <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                          )}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback>{profile.displayName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{profile.displayName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">Seviye {profile.level}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{profile.points}</p>
                          <p className="text-xs text-muted-foreground">puan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Henüz puan toplanmamış.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
