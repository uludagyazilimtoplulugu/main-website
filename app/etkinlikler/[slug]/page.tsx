import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { format, isAfter, isBefore } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { EventRegistrationButton } from "@/components/event-registration-button"

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch event
  const { data: event } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles(id, display_name, avatar_url, level, points),
      registrations:event_registrations(count)
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!event) {
    notFound()
  }

  // Check if user is registered
  let isRegistered = false
  let userRegistration = null
  if (user) {
    const { data } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", event.id)
      .eq("user_id", user.id)
      .single()
    if (data) {
      isRegistered = true
      userRegistration = data
    }
  }

  const now = new Date()
  const isPast = isBefore(new Date(event.event_date), now)
  const registrationCount = event.registrations?.[0]?.count || 0
  const isFull = event.max_participants && registrationCount >= event.max_participants
  const registrationClosed = event.registration_deadline && isAfter(now, new Date(event.registration_deadline))

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
          </div>

          {/* Organizer Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={event.organizer?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{event.organizer?.display_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Organizatör: {event.organizer?.display_name}</p>
                <div className="text-sm text-muted-foreground">
                  Seviye {event.organizer?.level} • {event.organizer?.points} puan
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {event.cover_image && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={event.cover_image || "/placeholder.svg"}
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
                  {format(new Date(event.event_date), "d MMMM yyyy, HH:mm", { locale: tr })}
                </p>
                {event.end_date && (
                  <p className="text-sm text-muted-foreground">
                    Bitiş: {format(new Date(event.end_date), "d MMMM yyyy, HH:mm", { locale: tr })}
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
            {event.max_participants && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Katılımcı</p>
                  <p className="font-semibold text-foreground">
                    {registrationCount}/{event.max_participants}
                  </p>
                </div>
              </div>
            )}
            {event.registration_deadline && (
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Kayıt Son Tarihi</p>
                  <p className="font-semibold text-foreground">
                    {format(new Date(event.registration_deadline), "d MMMM yyyy, HH:mm", { locale: tr })}
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
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
