import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { format, isAfter, isBefore } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { EventRegistrationButton } from "@/components/event-registration-button"
import { EventParticipantList } from "@/components/event-participant-list"
import { EventShareButtons } from "@/components/event-share-buttons"
import { EventFeedbackForm } from "@/components/event-feedback-form"

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  const user = session?.user ?? null
  const { slug } = await params

  // Fetch event
  const event = await prisma.event.findFirst({
    where: { slug, published: true },
    include: {
      organizer: {
        select: { id: true, displayName: true, avatarUrl: true, level: true, points: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
  })

  if (!event) {
    notFound()
  }

  // Katilimcilari cek
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: event.id },
    include: {
      user: {
        select: { id: true, displayName: true, fullName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  // Check if user is registered
  let isRegistered = false
  let userRegistration = null
  if (user) {
    const data = registrations.find((r) => r.userId === user.id)
    if (data) {
      isRegistered = true
      userRegistration = data
    }
  }

  // Geri bildirim kontrolu
  let existingFeedback = null
  if (user) {
    existingFeedback = await prisma.eventFeedback.findUnique({
      where: {
        eventId_userId: { eventId: event.id, userId: user.id },
      },
      select: { rating: true, comment: true },
    })
  }

  const now = new Date()
  const isPast = isBefore(new Date(event.eventDate), now)
  const registrationCount = event._count.registrations
  const isFull = event.maxParticipants && registrationCount >= event.maxParticipants
  const registrationClosed = event.registrationDeadline && isAfter(now, new Date(event.registrationDeadline))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {isPast ? (
                <Badge variant="secondary">Tamamlandı</Badge>
              ) : (
                <>
                  <Badge>Yaklaşan</Badge>
                  {isFull && <Badge variant="destructive">Kontenjan Doldu</Badge>}
                  {registrationClosed && <Badge variant="secondary">Kayıt Kapandı</Badge>}
                </>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">{event.title}</h1>
            <EventShareButtons title={event.title} slug={slug} />
          </div>

          {/* Organizer Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={event.organizer?.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback>{event.organizer?.displayName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Organizatör: {event.organizer?.displayName}</p>
                <div className="text-sm text-muted-foreground">
                  Seviye {event.organizer?.level} • {event.organizer?.points} puan
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {event.coverImage && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={event.coverImage || "/placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="grid gap-4 mb-8 md:grid-cols-2">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tarih ve Saat</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(event.eventDate), "d MMMM yyyy, HH:mm", { locale: tr })}
                </p>
                {event.endDate && (
                  <p className="text-sm text-muted-foreground">
                    Bitiş: {format(new Date(event.endDate), "d MMMM yyyy, HH:mm", { locale: tr })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Konum</p>
                <p className="font-semibold text-foreground">{event.location}</p>
              </div>
            </div>
            {event.maxParticipants && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Katılımcı</p>
                  <p className="font-semibold text-foreground">
                    {registrationCount}/{event.maxParticipants}
                  </p>
                </div>
              </div>
            )}
            {event.registrationDeadline && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Kayıt Son Tarihi</p>
                  <p className="font-semibold text-foreground">
                    {format(new Date(event.registrationDeadline), "d MMMM yyyy, HH:mm", { locale: tr })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="mb-8" />

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Açıklama</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Registration Button */}
          {user && !isPast && (
            <div className="mt-8">
              <EventRegistrationButton
                eventId={event.id}
                userId={user.id}
                isRegistered={isRegistered}
                registrationStatus={userRegistration?.status}
                isFull={isFull}
                registrationClosed={registrationClosed}
              />
            </div>
          )}

          {!user && !isPast && (
            <div className="mt-8 text-center p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">Etkinliğe kayıt olmak için giriş yapmalısınız.</p>
              <a href="/giris" className="text-primary hover:underline">
                Giriş Yap
              </a>
            </div>
          )}

          {/* Katilimci Listesi */}
          <div className="mt-8">
            <EventParticipantList participants={registrations} />
          </div>

          {/* Etkinlik Ozeti - tamamlanmis etkinlikler icin */}
          {isPast && event.summary && (
            <div className="mt-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-3">Etkinlik Ozeti</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{event.summary}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Geri Bildirim Formu - gecmis etkinlikler + kayitli kullanicilar icin */}
          {isPast && user && isRegistered && (
            <div className="mt-8">
              <EventFeedbackForm eventId={event.id} existingFeedback={existingFeedback} />
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
