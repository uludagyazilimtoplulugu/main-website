import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ArrowLeft, Eye } from "lucide-react"

export default async function AdminBlogPage() {
  const session = await auth()
  const user = session?.user ?? null

  if (!user) {
    redirect("/giris")
  }

  if (!user.isAdmin) {
    redirect("/")
  }

  const posts = await prisma.blogPost.findMany({
    include: {
      author: {
        select: { displayName: true },
      },
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

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
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Blog Yönetimi</h1>
              <p className="text-muted-foreground">Toplam {posts?.length || 0} yazı</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tüm Blog Yazıları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.map((post: any) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/blog/${post.slug}`} className="font-semibold text-foreground hover:text-primary">
                          {post.title}
                        </Link>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Yayında" : "Taslak"}
                        </Badge>
                        {post.category && <Badge variant="outline">{post.category.name}</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{post.author?.displayName}</span>
                        <span>•</span>
                        <span>{format(new Date(post.createdAt), "d MMM yyyy", { locale: tr })}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
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
