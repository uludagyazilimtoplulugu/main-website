import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function ProjectsPage() {
  const session = await auth()
  const user = session?.user ?? null

  const projects = await prisma.project.findMany({
    where: { published: true },
    include: {
      author: {
        select: { displayName: true, fullName: true },
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Projeler</h1>
              <p className="text-lg text-muted-foreground">
                Topluluk uyelerimizin gelistirdigi projeler
              </p>
            </div>
            {user && (
              <Button asChild>
                <Link href="/projeler/yeni">
                  <Plus className="h-4 w-4 mr-2" />
                  Proje Ekle
                </Link>
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Henuz proje eklenmemis.</p>
              {user && (
                <Button asChild>
                  <Link href="/projeler/yeni">Ilk Projeyi Ekle</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  slug={project.slug}
                  description={project.description}
                  techStack={project.techStack}
                  githubUrl={project.githubUrl}
                  demoUrl={project.demoUrl}
                  coverImage={project.coverImage}
                  authorName={project.author.displayName || project.author.fullName}
                  featured={project.featured}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
