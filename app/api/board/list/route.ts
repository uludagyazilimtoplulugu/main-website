import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const terms = await prisma.boardTerm.findMany({
    orderBy: { sortOrder: "desc" },
    include: {
      members: {
        orderBy: { positionOrder: "asc" },
      },
    },
  })

  return NextResponse.json(terms)
}
