import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BoardMemberCard } from "@/components/board-member-card"
import { Badge } from "@/components/ui/badge"

export default async function BoardPage() {
  const session = await auth()
  const user = session?.user ?? null

  const terms = await prisma.boardTerm.findMany({
    orderBy: { sortOrder: "desc" },
    include: {
      members: {
        orderBy: { positionOrder: "asc" },
      },
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Yönetim Kurulu
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Topluluğumuzun yönetim kadrosu ve geçmiş dönem yöneticileri
            </p>
          </div>

          {terms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Henüz yönetim kurulu bilgisi eklenmemiş.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {terms.map((term) => (
                <section key={term.id}>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-bold">
                      {term.name} ({term.startYear}-{term.endYear})
                    </h2>
                    {term.isCurrent && (
                      <Badge variant="default">Güncel Dönem</Badge>
                    )}
                  </div>
                  {term.members.length === 0 ? (
                    <p className="text-muted-foreground">
                      Bu dönem için henüz üye eklenmemiş.
                    </p>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {term.members.map((member) => (
                        <BoardMemberCard
                          key={member.id}
                          fullName={member.fullName}
                          position={member.position}
                          bio={member.bio}
                          photoUrl={member.photoUrl}
                          linkedinUrl={member.linkedinUrl}
                          githubUrl={member.githubUrl}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
