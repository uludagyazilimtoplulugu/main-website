import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const events = await prisma.event.findMany({
    select: { id: true, title: true },
    orderBy: { eventDate: "desc" },
  })
  return NextResponse.json(events)
}
