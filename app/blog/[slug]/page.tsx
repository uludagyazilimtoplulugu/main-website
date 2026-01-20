import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Eye, Calendar } from "lucide-react"
import { BlogComments } from "@/components/blog-comments"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch post
  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:profiles(id, full_name, display_name, avatar_url, level, points),
      category:blog_categories(id, name, slug, color)
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!post) {
    notFound()
  }

  // Increment views
  await supabase.rpc("increment_post_views", { p_post_id: post.id })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          {/* Post Header */}
          <div className="mb-8">
            {post.category && (
              <Badge className="mb-4" style={{ backgroundColor: post.category.color }}>
                {post.category.name}
              </Badge>
            )}
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">{post.title}</h1>
            {post.excerpt && <p className="text-xl text-muted-foreground text-pretty">{post.excerpt}</p>}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{post.author?.display_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author?.display_name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(post.created_at), "d MMMM yyyy", { locale: tr })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.views} görüntülenme</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline">
                Seviye {post.author?.level} • {post.author?.points} puan
              </Badge>
            </div>
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={post.cover_image || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Separator className="mb-8" />

          {/* Post Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>
          </div>

          <Separator className="mb-8" />

          {/* Comments Section */}
          <BlogComments postId={post.id} user={user} />
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
