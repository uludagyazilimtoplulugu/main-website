"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    })

    if (error) {
      console.error("[v0] Error submitting contact form:", error)
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Başarılı",
        description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      })
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmet Yılmaz" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Konu *</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Mesajınızın konusu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesaj *</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı buraya yazın..."
          rows={6}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Gönder
      </Button>
    </form>
  )
}
