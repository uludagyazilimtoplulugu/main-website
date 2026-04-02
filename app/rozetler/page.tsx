import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function BadgesPage() {
  const session = await auth()
  const user = session?.user ?? null

  // Fetch all badges
  const badges = await prisma.badge.findMany({
    orderBy: { pointsRequired: "asc" },
  })

  // Fetch user badges if logged in
  let userBadges: string[] = []
  if (user) {
    const data = await prisma.userBadge.findMany({
      where: { userId: user.id },
      select: { badgeId: true },
    })
    userBadges = data.map((ub) => ub.badgeId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Rozetler</h1>
            <p className="text-lg text-muted-foreground">Topluluğa katkıda bulunarak rozetler kazan</p>
          </div>

          {badges && badges.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => {
                const earned = userBadges.includes(badge.id)
                return (
                  <Card key={badge.id} className={earned ? "border-2 border-primary" : "opacity-60"}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-4xl" style={{ filter: earned ? "none" : "grayscale(100%)" }}>
                          {badge.icon}
                        </div>
                        {earned && <Badge variant="default">Kazanıldı</Badge>}
                      </div>
                      <CardTitle>{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {badge.pointsRequired > 0 && (
                        <div className="text-sm text-muted-foreground">Gereken puan: {badge.pointsRequired}</div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Henüz rozet bulunmamaktadır.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
