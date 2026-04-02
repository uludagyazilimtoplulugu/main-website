import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  title: string
  slug: string
  description: string
  techStack: string[]
  githubUrl?: string | null
  demoUrl?: string | null
  coverImage?: string | null
  authorName: string
  featured?: boolean
}

export function ProjectCard({
  title,
  slug,
  description,
  techStack,
  githubUrl,
  demoUrl,
  coverImage,
  authorName,
  featured,
}: ProjectCardProps) {
  return (
    <Card className={featured ? "border-primary/50" : ""}>
      {coverImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img src={coverImage} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardContent className={coverImage ? "pt-4" : "pt-6"}>
        <div className="flex items-start justify-between mb-2">
          <Link href={`/projeler/${slug}`} className="font-bold text-lg hover:text-primary transition-colors">
            {title}
          </Link>
          {featured && <Badge variant="default">One Cikan</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-3">by {authorName}</p>
        <div className="flex gap-2">
          {githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                GitHub
              </Link>
            </Button>
          )}
          {demoUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
