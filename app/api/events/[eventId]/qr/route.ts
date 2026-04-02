import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

// QR token olustur veya mevcut aktif tokeni getir
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { eventId } = await params

  // Mevcut aktif token var mi?
  const existing = await prisma.eventQrToken.findFirst({
    where: { eventId, isActive: true },
  })

  if (existing) {
    return NextResponse.json(existing)
  }

  // Yeni token olustur
  const token = await prisma.eventQrToken.create({
    data: {
      eventId,
      token: randomUUID(),
    },
  })

  return NextResponse.json(token)
}

// Aktif tokeni getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const { eventId } = await params

  const token = await prisma.eventQrToken.findFirst({
    where: { eventId, isActive: true },
  })

  return NextResponse.json(token)
}
