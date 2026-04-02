import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { format, isBefore, isAfter } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, MapPin, Users } from "lucide-react"

export default async function EventsPage() {
  const session = await auth()
  const user = session?.user ?? null
  const isAdmin = user?.isAdmin === true

  // Fetch published events
  const events = await prisma.event.findMany({
    where: { published: true },
    include: {
      organizer: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { eventDate: "asc" },
  })

  const now = new Date()
  const upcomingEvents = events.filter((event) => isAfter(new Date(event.eventDate), now))
  const pastEvents = events.filter((event) => isBefore(new Date(event.eventDate), now))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Etkinlikler</h1>
              <p className="text-lg text-muted-foreground">Workshop, hackathon, seminer ve sosyal etkinlikler</p>
            </div>
            {isAdmin && (
              <Button asChild className="hover:scale-105 transition-transform">
                <Link href="/etkinlikler/yeni">Etkinlik Oluştur</Link>
              </Button>
            )}
          </div>

          {/* Upcoming Events */}
          {upcomingEvents && upcomingEvents.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground animate-fade-in-up">Yaklaşan Etkinlikler</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event, index) => {
                  const registrationCount = event._count.registrations
                  const isFull = event.maxParticipants && registrationCount >= event.maxParticipants
                  const registrationClosed =
                    event.registrationDeadline && isAfter(now, new Date(event.registrationDeadline))

                  return (
                    <Link key={event.id} href={`/etkinlikler/${event.slug}`}>
                      <Card
                        className={`h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-scale-in stagger-${(index % 6) + 1}`}
                      >
                        {event.coverImage && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={event.coverImage || "/placeholder.svg"}
                              alt={event.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="animate-pulse">
                              Yaklaşan
                            </Badge>
                            {isFull && <Badge variant="destructive">Kontenjan Doldu</Badge>}
                            {registrationClosed && <Badge variant="secondary">Kayıt Kapandı</Badge>}
                          </div>
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(event.eventDate), "d MMMM yyyy, HH:mm", { locale: tr })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          {event.maxParticipants && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                {registrationCount}/{event.maxParticipants} katılımcı
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.organizer?.avatarUrl || "/placeholder.svg"} />
                              <AvatarFallback>
                                {event.organizer?.displayName?.charAt(0).toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{event.organizer?.displayName}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents && pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground animate-fade-in-up">Geçmiş Etkinlikler</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event, index) => (
                  <Link key={event.id} href={`/etkinlikler/${event.slug}`}>
                    <Card
                      className={`h-full opacity-75 hover:opacity-100 hover:shadow-lg transition-all duration-300 animate-fade-in stagger-${(index % 6) + 1}`}
                    >
                      {event.coverImage && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={event.coverImage || "/placeholder.svg"}
                            alt={event.title}
                            className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">
                          Tamamlandı
                        </Badge>
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: tr })}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(!events || events.length === 0) && (
            <Card className="animate-fade-in">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Henüz etkinlik bulunmamaktadır.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
