import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewEventForm } from "@/components/new-event-form"

export default async function NewEventPage() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Yeni Etkinlik Oluştur</h1>
          <NewEventForm userId={user.id} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
