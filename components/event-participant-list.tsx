import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Participant {
  user: {
    id: string
    displayName: string | null
    fullName: string
    avatarUrl: string | null
  }
  status: string
}

export function EventParticipantList({ participants }: { participants: Participant[] }) {
  if (participants.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Katilimcilar ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {participants.map((p) => {
            const name = p.user.displayName || p.user.fullName
            const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            return (
              <div key={p.user.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={p.user.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{name}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
