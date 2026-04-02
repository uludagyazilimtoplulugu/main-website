import { auth } from "@/lib/auth"
import { awardPoints } from "@/lib/points"
import { NextRequest, NextResponse } from "next/server"

// Admin manuel puan verme
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 })
  }

  const body = await request.json()
  const { userId, activityType, description } = body

  if (!userId || !activityType || !description) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 })
  }

  const result = await awardPoints(userId, activityType, description)

  if (!result) {
    return NextResponse.json({ error: "Puan kurali bulunamadi veya aktif degil" }, { status: 404 })
  }

  return NextResponse.json(result)
}
