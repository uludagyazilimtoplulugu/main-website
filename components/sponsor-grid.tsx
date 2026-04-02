import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  websiteUrl: string | null
  tier: string
}

const tierConfig: Record<string, { label: string; order: number; size: string }> = {
  platinum: { label: "Platin", order: 1, size: "h-24" },
  gold: { label: "Altin", order: 2, size: "h-20" },
  silver: { label: "Gumus", order: 3, size: "h-16" },
  bronze: { label: "Bronz", order: 4, size: "h-12" },
}

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  // Tier'lara gore grupla
  const grouped = sponsors.reduce<Record<string, Sponsor[]>>((acc, s) => {
    const tier = s.tier || "silver"
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(s)
    return acc
  }, {})

  const sortedTiers = Object.keys(grouped).sort(
    (a, b) => (tierConfig[a]?.order || 99) - (tierConfig[b]?.order || 99)
  )

  if (sponsors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Henuz sponsor eklenmemis.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {sortedTiers.map((tier) => {
        const config = tierConfig[tier] || { label: tier, order: 99, size: "h-16" }
        return (
          <div key={tier}>
            <h3 className="text-xl font-bold text-center mb-6">{config.label} Sponsorlar</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {grouped[tier].map((sponsor) => {
                const logo = (
                  <div className="flex items-center justify-center p-4">
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className={`${config.size} w-auto object-contain`}
                    />
                  </div>
                )

                return (
                  <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4 pb-2 text-center">
                      {sponsor.websiteUrl ? (
                        <Link href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
                          {logo}
                        </Link>
                      ) : (
                        logo
                      )}
                      <p className="text-sm font-medium text-muted-foreground">{sponsor.name}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
