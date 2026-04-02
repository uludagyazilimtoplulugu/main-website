import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SponsorGrid } from "@/components/sponsor-grid"

export default async function SponsorsPage() {
  const session = await auth()
  const user = session?.user ?? null

  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Sponsorlarimiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Toplulugumuzun faaliyetlerini destekleyen degerli sponsorlarimiz
            </p>
          </div>
          <SponsorGrid sponsors={sponsors} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
