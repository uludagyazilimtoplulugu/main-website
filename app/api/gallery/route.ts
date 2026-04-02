import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    include: {
      event: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(images)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { imageUrl, caption, eventId } = body

  if (!imageUrl) {
    return NextResponse.json({ error: "Gorsel URL zorunlu" }, { status: 400 })
  }

  const image = await prisma.galleryImage.create({
    data: {
      imageUrl,
      caption: caption || null,
      eventId: eventId || null,
      uploadedBy: session.user.id,
    },
  })

  return NextResponse.json(image, { status: 201 })
}
