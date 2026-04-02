import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Update a board member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { memberId } = await params
  const body = await request.json()

  const member = await prisma.boardMember.update({
    where: { id: memberId },
    data: {
      ...(body.fullName && { fullName: body.fullName }),
      ...(body.position && { position: body.position }),
      ...(body.positionOrder !== undefined && { positionOrder: Number(body.positionOrder) }),
      ...(body.bio !== undefined && { bio: body.bio || null }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl || null }),
      ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl || null }),
      ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl || null }),
    },
  })

  return NextResponse.json(member)
}

// Delete a board member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { memberId } = await params
  await prisma.boardMember.delete({ where: { id: memberId } })
  return NextResponse.json({ success: true })
}
