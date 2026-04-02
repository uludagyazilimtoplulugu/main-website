import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  const user = session?.user ?? null
  const { slug } = await params

  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      author: {
        select: { id: true, displayName: true, fullName: true, avatarUrl: true },
      },
    },
  })

  if (!project) notFound()

  const authorName = project.author.displayName || project.author.fullName
  const initials = authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/projeler">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Tum Projeler
            </Link>
          </Button>

          {project.coverImage && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{project.title}</h1>
            {project.featured && <Badge>One Cikan</Badge>}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Avatar>
              <AvatarImage src={project.author.avatarUrl ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{authorName}</span>
          </div>

          <div className="flex gap-3 mb-8">
            {project.githubUrl && (
              <Button asChild>
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            )}
            {project.demoUrl && (
              <Button variant="outline" asChild>
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Canli Demo
                </Link>
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
