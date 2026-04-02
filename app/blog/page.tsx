import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const session = await auth()
  const user = session?.user ?? null
  const isAdmin = user?.isAdmin === true
  const params = await searchParams

  // Fetch categories
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  })

  // Build where clause for posts
  const where: Record<string, unknown> = { published: true }

  if (params.kategori) {
    const category = await prisma.blogCategory.findFirst({
      where: { slug: params.kategori },
      select: { id: true },
    })
    if (category) {
      where.categoryId = category.id
    }
  }

  // Fetch posts
  const posts = await prisma.blogPost.findMany({
    where,
    include: {
      author: {
        select: { id: true, fullName: true, displayName: true, avatarUrl: true },
      },
      category: {
        select: { id: true, name: true, slug: true, color: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Blog</h1>
              <p className="text-lg text-muted-foreground">
                Yazilim, teknoloji ve kisisel gelisim konularinda icerikler
              </p>
            </div>
            {isAdmin && (
              <Button asChild className="hover:scale-105 transition-transform">
                <Link href="/blog/yeni">Blog Yazisi Olustur</Link>
              </Button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in stagger-1">
            <Link href="/blog">
              <Badge
                variant={!params.kategori ? "default" : "outline"}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                Tumu
              </Badge>
            </Link>
            {categories?.map((category) => (
              <Link key={category.id} href={`/blog?kategori=${category.slug}`}>
                <Badge
                  variant={params.kategori === category.slug ? "default" : "outline"}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  style={
                    params.kategori === category.slug
                      ? { backgroundColor: category.color ?? undefined, borderColor: category.color ?? undefined }
                      : {}
                  }
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card
                    className={`h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-scale-in stagger-${(index % 6) + 1}`}
                  >
                    {post.coverImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.coverImage || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <Badge variant="secondary" style={{ backgroundColor: post.category.color ?? undefined }}>
                            {post.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author?.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>{post.author?.displayName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium text-foreground">{post.author?.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: tr })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post._count.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="animate-fade-in">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Henuz blog yazisi bulunmamaktadir.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
