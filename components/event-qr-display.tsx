"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"

interface EventQrDisplayProps {
  eventId: string
  eventSlug: string
}

export function EventQrDisplay({ eventId, eventSlug }: EventQrDisplayProps) {
  const [token, setToken] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generateQr() {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/qr`, { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        setToken(data.token)
        const url = `${window.location.origin}/etkinlikler/${eventSlug}/katilim?token=${data.token}`
        const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 })
        setQrDataUrl(dataUrl)
      } else {
        toast.error("QR kodu olusturulamadi")
      }
    } catch {
      toast.error("Bir hata olustu")
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!token) return
    const url = `${window.location.origin}/etkinlikler/${eventSlug}/katilim?token=${token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link kopyalandi")
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Mevcut aktif token var mi kontrol et
    fetch(`/api/events/${eventId}/qr`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data?.token) {
          setToken(data.token)
          const url = `${window.location.origin}/etkinlikler/${eventSlug}/katilim?token=${data.token}`
          const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 })
          setQrDataUrl(dataUrl)
        }
      })
      .catch(() => {})
  }, [eventId, eventSlug])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Katilim QR Kodu
        </CardTitle>
      </CardHeader>
      <CardContent>
        {qrDataUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img src={qrDataUrl} alt="QR Kod" className="rounded-lg border" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Linki Kopyala
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Katilimcilarin QR okutarak puan kazanmasi icin QR kodu olusturun.
            </p>
            <Button onClick={generateQr} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <QrCode className="h-4 w-4 mr-2" />}
              QR Kodu Olustur
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
