import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { NewBlogPostForm } from "@/components/new-blog-post-form"

export default async function NewBlogPostPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/giris")
  }

  if (!session.user.isAdmin) {
    redirect("/")
  }

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={session.user} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">Yeni Blog Yazisi</h1>
          <NewBlogPostForm categories={categories || []} userId={session.user.id!} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
