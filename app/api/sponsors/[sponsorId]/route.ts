import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { sponsorId } = await params
  const body = await request.json()

  const sponsor = await prisma.sponsor.update({
    where: { id: sponsorId },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.logoUrl && { logoUrl: body.logoUrl }),
      ...(body.websiteUrl !== undefined && { websiteUrl: body.websiteUrl || null }),
      ...(body.tier && { tier: body.tier }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  })

  return NextResponse.json(sponsor)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { sponsorId } = await params
  await prisma.sponsor.delete({ where: { id: sponsorId } })
  return NextResponse.json({ success: true })
}
