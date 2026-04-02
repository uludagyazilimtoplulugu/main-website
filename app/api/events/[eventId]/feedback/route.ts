import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giris yapin" }, { status: 401 })
  }

  const { eventId } = await params
  const { rating, comment } = await request.json()

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Gecersiz puan (1-5)" }, { status: 400 })
  }

  // Etkinlige kayitli mi?
  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: { eventId, userId: session.user.id },
    },
  })

  if (!registration) {
    return NextResponse.json({ error: "Bu etkinlige kayitli degilsiniz" }, { status: 403 })
  }

  // Zaten geri bildirim verdiyse guncelle
  const feedback = await prisma.eventFeedback.upsert({
    where: {
      eventId_userId: { eventId, userId: session.user.id },
    },
    create: {
      eventId,
      userId: session.user.id,
      rating,
      comment: comment || null,
    },
    update: {
      rating,
      comment: comment || null,
    },
  })

  return NextResponse.json(feedback)
}
