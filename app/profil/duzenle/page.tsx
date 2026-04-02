import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { EditProfileForm } from "@/components/edit-profile-form"

export default async function EditProfilePage() {
  const session = await auth()
  const user = session?.user ?? null

  if (!user) {
    redirect("/giris")
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  })

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
