import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Linkedin, Github } from "lucide-react"
import Link from "next/link"

interface BoardMemberCardProps {
  fullName: string
  position: string
  bio?: string | null
  photoUrl?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
}

export function BoardMemberCard({
  fullName,
  position,
  bio,
  photoUrl,
  linkedinUrl,
  githubUrl,
}: BoardMemberCardProps) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={photoUrl ?? undefined} alt={fullName} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg">{fullName}</h3>
          <p className="text-sm text-primary font-medium mb-2">{position}</p>
          {bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{bio}</p>
          )}
          {(linkedinUrl || githubUrl) && (
            <div className="flex gap-2">
              {linkedinUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {githubUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
