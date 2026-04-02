import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })
  return NextResponse.json(sponsors)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { name, logoUrl, websiteUrl, tier, sortOrder } = body

  if (!name || !logoUrl) {
    return NextResponse.json({ error: "Ad ve logo zorunlu" }, { status: 400 })
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name,
      logoUrl,
      websiteUrl: websiteUrl || null,
      tier: tier || "silver",
      sortOrder: Number(sortOrder) || 0,
    },
  })

  return NextResponse.json(sponsor, { status: 201 })
}
