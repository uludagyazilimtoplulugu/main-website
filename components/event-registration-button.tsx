"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, X } from "lucide-react"

type RegistrationButtonProps = {
  eventId: string
  userId: string
  isRegistered: boolean
  registrationStatus?: string
  isFull: boolean
  registrationClosed: boolean
}

export function EventRegistrationButton({
  eventId,
  userId,
  isRegistered,
  registrationStatus,
  isFull,
  registrationClosed,
}: RegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [registered, setRegistered] = useState(isRegistered)
  const [status, setStatus] = useState(registrationStatus)
  const router = useRouter()
  const { toast } = useToast()

  async function handleRegister() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Kayıt oluşturulamadı")
      }

      setRegistered(true)
      setStatus("registered")
      toast({
        title: "Başarılı",
        description: "Etkinliğe başarıyla kayıt oldunuz",
      })
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error registering for event:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Kayıt oluşturulamadı",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  async function handleCancel() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Kayıt iptal edilemedi")
      }

      setRegistered(false)
      setStatus(undefined)
      toast({
        title: "Başarılı",
        description: "Kaydınız iptal edildi",
      })
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error canceling registration:", error)
      toast({
        title: "Hata",
        description: "Kayıt iptal edilemedi",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  if (registered) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Check className="h-5 w-5" />
          <span className="font-semibold">
            {status === "attended" ? "Katıldınız" : status === "cancelled" ? "İptal Edildi" : "Kayıt Oldunuz"}
          </span>
        </div>
        {status === "registered" && (
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kaydı İptal Et
          </Button>
        )}
      </div>
    )
  }

  if (isFull || registrationClosed) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <X className="h-5 w-5" />
        <span>{isFull ? "Kontenjan doldu" : "Kayıt süresi doldu"}</span>
      </div>
    )
  }

  return (
    <Button onClick={handleRegister} disabled={isLoading} size="lg">
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Etkinliğe Kayıt Ol
    </Button>
  )
}
