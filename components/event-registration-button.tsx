"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

  async function handleRegister() {
    setIsLoading(true)
    const { error } = await supabase.from("event_registrations").insert({
      event_id: eventId,
      user_id: userId,
      status: "registered",
    })

    if (error) {
      console.error("[v0] Error registering for event:", error)
      toast({
        title: "Hata",
        description: error.message || "Kayıt oluşturulamadı",
        variant: "destructive",
      })
    } else {
      setRegistered(true)
      setStatus("registered")
      toast({
        title: "Başarılı",
        description: "Etkinliğe başarıyla kayıt oldunuz",
      })
      router.refresh()
    }
    setIsLoading(false)
  }

  async function handleCancel() {
    setIsLoading(true)
    const { error } = await supabase.from("event_registrations").delete().eq("event_id", eventId).eq("user_id", userId)

    if (error) {
      console.error("[v0] Error canceling registration:", error)
      toast({
        title: "Hata",
        description: "Kayıt iptal edilemedi",
        variant: "destructive",
      })
    } else {
      setRegistered(false)
      setStatus(undefined)
      toast({
        title: "Başarılı",
        description: "Kaydınız iptal edildi",
      })
      router.refresh()
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
