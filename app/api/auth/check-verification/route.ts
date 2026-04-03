import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ needsVerification: false })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    })

    if (!user) {
      return NextResponse.json({ needsVerification: false })
    }

    return NextResponse.json({ needsVerification: !user.emailVerified })
  } catch {
    return NextResponse.json({ needsVerification: false })
  }
}
