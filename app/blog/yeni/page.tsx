import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewBlogPostForm } from "@/components/new-blog-post-form"

export default async function NewBlogPostPage() {
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

  const { data: categories } = await supabase.from("blog_categories").select("*").order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Yeni Blog Yazısı</h1>
          <NewBlogPostForm categories={categories || []} userId={user.id} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
