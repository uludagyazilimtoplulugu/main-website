import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Update a board term
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ termId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { termId } = await params
  const body = await request.json()
  const { name, startYear, endYear, isCurrent, sortOrder } = body

  if (isCurrent) {
    await prisma.boardTerm.updateMany({
      where: { isCurrent: true, id: { not: termId } },
      data: { isCurrent: false },
    })
  }

  const term = await prisma.boardTerm.update({
    where: { id: termId },
    data: {
      ...(name && { name }),
      ...(startYear && { startYear: Number(startYear) }),
      ...(endYear && { endYear: Number(endYear) }),
      ...(isCurrent !== undefined && { isCurrent }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    },
  })

  return NextResponse.json(term)
}

// Delete a board term
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ termId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { termId } = await params
  await prisma.boardTerm.delete({ where: { id: termId } })
  return NextResponse.json({ success: true })
}
