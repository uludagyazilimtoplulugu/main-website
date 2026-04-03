"use client"

import type React from "react"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // If user needs verification, verify first
      if (needsVerification) {
        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) {
          setError(verifyData.error || "Doğrulama kodu hatalı")
          setIsLoading(false)
          return
        }
      }

      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        // Check if user needs email verification
        const checkRes = await fetch("/api/auth/check-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const checkData = await checkRes.json()

        if (checkData.needsVerification) {
          setNeedsVerification(true)
          setError("E-posta doğrulanmamış. Mailinize gönderilen 6 haneli kodu girin.")
        } else {
          setError("E-posta veya şifre hatalı")
        }
        setIsLoading(false)
      } else {
        window.location.href = "/"
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-10 w-10 text-primary" />
            <span className="text-xl font-semibold text-foreground">UYT</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Giriş Yap</CardTitle>
            <CardDescription>Hesabınıza giriş yapmak için bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@ogr.uludag.edu.tr"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {needsVerification && (
                  <div className="grid gap-2">
                    <Label htmlFor="verificationCode">Doğrulama Kodu</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center text-xl tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground">Kayıt olurken mailinize gönderilen 6 haneli kodu girin</p>
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Giriş yapılıyor..." : needsVerification ? "Doğrula ve Giriş Yap" : "Giriş Yap"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Hesabınız yok mu?{" "}
                <Link href="/kayit" className="underline underline-offset-4 text-primary hover:text-primary/80">
                  Kayıt Ol
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
