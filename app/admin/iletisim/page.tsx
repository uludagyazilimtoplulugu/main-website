import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ArrowLeft, Mail } from "lucide-react"

export default async function AdminContactPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/giris")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">İletişim Mesajları</h1>
              <p className="text-muted-foreground">Toplam {submissions?.length || 0} mesaj</p>
            </div>
          </div>

          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className={submission.status === "new" ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-lg">{submission.subject}</CardTitle>
                          <Badge variant={submission.status === "new" ? "default" : "secondary"}>
                            {submission.status === "new"
                              ? "Yeni"
                              : submission.status === "read"
                                ? "Okundu"
                                : "Yanıtlandı"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            {submission.name} - {submission.email}
                          </p>
                          <p>{format(new Date(submission.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">{submission.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Henüz mesaj bulunmamaktadır.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
