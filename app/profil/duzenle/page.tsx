import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditProfileForm } from "@/components/edit-profile-form"

export default async function EditProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/giris")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Profili Düzenle</h1>
          <EditProfileForm profile={profile} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
