import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminProjectActions } from "./actions"

export default async function AdminProjectsPage() {
  const session = await auth()
  const user = session?.user ?? null

  if (!user?.isAdmin) redirect("/")

  const projects = await prisma.project.findMany({
    include: {
      author: { select: { displayName: true, fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Proje Yonetimi</h1>
              <p className="text-muted-foreground">Toplam {projects.length} proje</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tum Projeler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{project.title}</span>
                        <Badge variant={project.published ? "default" : "secondary"}>
                          {project.published ? "Yayinda" : "Onay Bekliyor"}
                        </Badge>
                        {project.featured && <Badge variant="outline">One Cikan</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.author.displayName || project.author.fullName} •{" "}
                        {project.techStack.join(", ")}
                      </p>
                    </div>
                    <AdminProjectActions projectId={project.id} published={project.published} featured={project.featured} />
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Henuz proje yok.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
