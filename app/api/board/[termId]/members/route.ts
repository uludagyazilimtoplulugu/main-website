import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Add a member to a term
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ termId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { termId } = await params
  const body = await request.json()
  const { fullName, position, positionOrder, bio, photoUrl, linkedinUrl, githubUrl } = body

  if (!fullName || !position) {
    return NextResponse.json({ error: "Ad ve pozisyon zorunlu" }, { status: 400 })
  }

  const member = await prisma.boardMember.create({
    data: {
      termId,
      fullName,
      position,
      positionOrder: Number(positionOrder) || 0,
      bio: bio || null,
      photoUrl: photoUrl || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
    },
  })

  return NextResponse.json(member)
}
