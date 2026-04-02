"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EventFeedbackFormProps {
  eventId: string
  existingFeedback?: { rating: number; comment: string | null } | null
}

export function EventFeedbackForm({ eventId, existingFeedback }: EventFeedbackFormProps) {
  const [rating, setRating] = useState(existingFeedback?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState(existingFeedback?.comment || "")
  const [submitted, setSubmitted] = useState(!!existingFeedback)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Lutfen bir puan verin")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment || null }),
      })

      if (res.ok) {
        toast.success("Geri bildiriminiz kaydedildi!")
        setSubmitted(true)
      } else {
        const err = await res.json()
        toast.error(err.error || "Hata olustu")
      }
    } catch {
      toast.error("Bir hata olustu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Geri Bildirim
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-4">
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn("h-6 w-6", i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
              ))}
            </div>
            <p className="text-muted-foreground">Geri bildiriminiz icin tesekkurler!</p>
            {comment && <p className="mt-2 text-sm italic">"{comment}"</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Etkinligi puanlayin:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    className="p-1"
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        i <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Yorumunuz (opsiyonel)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Gonderiliyor..." : "Geri Bildirim Gonder"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
