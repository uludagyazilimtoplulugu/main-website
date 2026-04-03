import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Github, Linkedin, Instagram } from "lucide-react"

export default async function ContactPage() {
  const session = await auth()
  const user = session?.user ?? null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground">Bizimle iletişime geçin</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mesaj Gönderin</CardTitle>
                  <CardDescription>Sorularınız veya önerileriniz için bize mesaj gönderin</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">E-posta</p>
                      <p className="text-sm text-muted-foreground">uludagyazilimtoplulugu@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Adres</p>
                      <p className="text-sm text-muted-foreground">
                        Bursa Uludağ Üniversitesi
                        <br />
                        Mühendislik Fakültesi
                        <br />
                        Görükle Kampüsü, Bursa
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://github.com/uludagyazilimtoplulugu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Github className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">GitHub</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/uludagdev/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">LinkedIn</span>
                    </a>
                    <a
                      href="https://www.instagram.com/uludagdev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Instagram</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
