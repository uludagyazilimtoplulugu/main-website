"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Loader2, MessageSquare, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Comment = {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    display_name: string
    avatar_url: string
  }
}

type User = {
  id: string
  email: string
} | null

export function BlogComments({ postId, user }: { postId: string; user: User }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadComments()
  }, [postId])

  async function loadComments() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("blog_comments")
      .select(
        `
        id,
        content,
        created_at,
        author:profiles(id, display_name, avatar_url)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error loading comments:", error)
      toast({
        title: "Hata",
        description: "Yorumlar yüklenemedi",
        variant: "destructive",
      })
    } else {
      setComments(data || [])
    }
    setIsLoading(false)
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase.from("blog_comments").insert({
      post_id: postId,
      author_id: user.id,
      content: newComment.trim(),
    })

    if (error) {
      console.error("[v0] Error submitting comment:", error)
      toast({
        title: "Hata",
        description: "Yorum gönderilemedi",
        variant: "destructive",
      })
    } else {
      setNewComment("")
      loadComments()
      toast({
        title: "Başarılı",
        description: "Yorumunuz gönderildi",
      })
    }
    setIsSubmitting(false)
  }

  async function handleDeleteComment(commentId: string) {
    const { error } = await supabase.from("blog_comments").delete().eq("id", commentId)

    if (error) {
      console.error("[v0] Error deleting comment:", error)
      toast({
        title: "Hata",
        description: "Yorum silinemedi",
        variant: "destructive",
      })
    } else {
      loadComments()
      toast({
        title: "Başarılı",
        description: "Yorum silindi",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Yorumlar ({comments.length})
        </h2>

        {/* Comment Form */}
        {user ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  placeholder="Yorumunuzu yazın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4"
                  rows={4}
                />
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yorum Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Yorum yapmak için giriş yapmalısınız.</p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{comment.author?.display_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{comment.author?.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                          </p>
                        </div>
                        {user?.id === comment.author?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
