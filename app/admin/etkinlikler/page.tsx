import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ArrowLeft, Users } from "lucide-react"

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/giris")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: events } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles(display_name),
      registrations:event_registrations(count)
    `,
    )
    .order("event_date", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Etkinlik Yönetimi</h1>
              <p className="text-muted-foreground">Toplam {events?.length || 0} etkinlik</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tüm Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events?.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/etkinlikler/${event.slug}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {event.title}
                        </Link>
                        <Badge variant={event.published ? "default" : "secondary"}>
                          {event.published ? "Yayında" : "Taslak"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{event.organizer?.display_name}</span>
                        <span>•</span>
                        <span>{format(new Date(event.event_date), "d MMM yyyy, HH:mm", { locale: tr })}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{event.registrations?.[0]?.count || 0} katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
