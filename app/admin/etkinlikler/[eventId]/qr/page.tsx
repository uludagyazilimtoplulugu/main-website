"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventQrDisplay } from "@/components/event-qr-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminEventQrPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const eventId = params.eventId as string
  const [eventSlug, setEventSlug] = useState<string>("")
  const [eventTitle, setEventTitle] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris")
    if (status === "authenticated" && !(session?.user as any)?.isAdmin) router.push("/")
  }, [status, session, router])

  useEffect(() => {
    // Etkinlik slug'ini al
    fetch(`/api/events/${eventId}/info`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slug) setEventSlug(data.slug)
        if (data.title) setEventTitle(data.title)
      })
      .catch(() => {})
  }, [eventId])

  if (status === "loading" || !eventSlug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Yukleniyor...</p>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user ? { id: user.id!, email: user.email!, name: user.name!, isAdmin: (user as any).isAdmin, displayName: (user as any).displayName } : null} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/etkinlikler">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{eventTitle || "Etkinlik"} - QR Kodu</h1>
              <p className="text-sm text-muted-foreground">Katilimcilarin QR okutarak puan kazanmasini saglayin</p>
            </div>
          </div>
          <EventQrDisplay eventId={eventId} eventSlug={eventSlug} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
