import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Create a new board term
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { name, startYear, endYear, isCurrent, sortOrder } = body

  if (!name || !startYear || !endYear) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 })
  }

  // If this term is current, unset others
  if (isCurrent) {
    await prisma.boardTerm.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    })
  }

  const term = await prisma.boardTerm.create({
    data: {
      name,
      startYear: Number(startYear),
      endYear: Number(endYear),
      isCurrent: !!isCurrent,
      sortOrder: Number(sortOrder) || 0,
    },
  })

  return NextResponse.json(term)
}
