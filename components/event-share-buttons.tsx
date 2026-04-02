"use client"

import { Button } from "@/components/ui/button"
import { Share2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface EventShareButtonsProps {
  title: string
  slug: string
}

export function EventShareButtons({ title, slug }: EventShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== "undefined" ? `${window.location.origin}/etkinlikler/${slug}` : ""
  const text = `${title} - Uludag Yazilim Toplulugu`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url })
      } catch {
        // User cancelled
      }
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link kopyalandi")
    setTimeout(() => setCopied(false), 2000)
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
  }

  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank")
  }

  return (
    <div className="flex flex-wrap gap-2">
      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Paylas
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={shareTwitter}>X/Twitter</Button>
      <Button variant="outline" size="sm" onClick={shareLinkedIn}>LinkedIn</Button>
      <Button variant="outline" size="sm" onClick={shareWhatsApp}>WhatsApp</Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
        Kopyala
      </Button>
    </div>
  )
}
