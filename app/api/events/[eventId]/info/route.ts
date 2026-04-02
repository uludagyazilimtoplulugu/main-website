import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { slug: true, title: true },
  })

  if (!event) {
    return NextResponse.json({ error: "Bulunamadi" }, { status: 404 })
  }

  return NextResponse.json(event)
}
