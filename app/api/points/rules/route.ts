import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Puan kurallarini getir
export async function GET() {
  const rules = await prisma.pointRule.findMany({
    orderBy: { activityType: "asc" },
  })
  return NextResponse.json(rules)
}

// Puan kuralini guncelle
export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { id, points, isActive } = body

  if (!id) {
    return NextResponse.json({ error: "ID gerekli" }, { status: 400 })
  }

  const rule = await prisma.pointRule.update({
    where: { id },
    data: {
      ...(points !== undefined && { points: Number(points) }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(rule)
}

// Yeni puan kurali olustur
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { activityType, points, description } = body

  if (!activityType || points === undefined || !description) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 })
  }

  const rule = await prisma.pointRule.create({
    data: {
      activityType,
      points: Number(points),
      description,
    },
  })

  return NextResponse.json(rule)
}
