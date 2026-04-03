"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Code2, Mail, CheckCircle } from "lucide-react"

function VerifyForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu")
      }
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">E-posta Doğrulandı!</CardTitle>
          <CardDescription>Hesabınız aktifleştirildi</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/giris">Giriş Yap</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Doğrulama Kodu</CardTitle>
        <CardDescription>
          <strong>{email}</strong> adresine 6 haneli bir doğrulama kodu gönderdik
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Doğrulama Kodu</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest"
            />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Doğrulanıyor..." : "Doğrula"}
          </Button>
          <div className="text-center">
            <Link href="/giris" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
              Doğrulamayı atla, giriş yap
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-10 w-10 text-primary" />
            <span className="text-xl font-semibold text-foreground">UYT</span>
          </Link>
        </div>
        <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
          <VerifyForm />
        </Suspense>
      </div>
    </div>
  )
}
