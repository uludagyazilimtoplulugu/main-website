import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code2, Mail } from "lucide-react"

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
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Kayıt Başarılı!</CardTitle>
            <CardDescription>E-posta adresinizi kontrol edin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Hesabınızı doğrulamak için e-posta adresinize bir onay linki gönderdik. Lütfen e-postanızı kontrol edin ve
              hesabınızı aktifleştirin.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Anasayfaya Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
