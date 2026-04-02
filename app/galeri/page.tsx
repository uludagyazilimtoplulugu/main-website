import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GalleryGrid } from "@/components/gallery-grid"

export default async function GalleryPage() {
  const session = await auth()
  const user = session?.user ?? null

  // Etkinlik bazli gruplama
  const events = await prisma.event.findMany({
    where: {
      galleryPhotos: { some: {} },
    },
    include: {
      galleryPhotos: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { eventDate: "desc" },
  })

  // Etkinlige bagli olmayan fotograflar
  const ungroupedPhotos = await prisma.galleryImage.findMany({
    where: { eventId: null },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Galeri
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Etkinliklerimizden ve topluluk faaliyetlerimizden kareler
            </p>
          </div>

          {events.length === 0 && ungroupedPhotos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Henuz fotograf eklenmemis.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {events.map((event) => (
                <section key={event.id}>
                  <h2 className="text-2xl font-bold mb-6">{event.title}</h2>
                  <GalleryGrid images={event.galleryPhotos} />
                </section>
              ))}
              {ungroupedPhotos.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Diger Fotograflar</h2>
                  <GalleryGrid images={ungroupedPhotos} />
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
