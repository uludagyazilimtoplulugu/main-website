import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: "E-posta ve doğrulama kodu zorunludur" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "E-posta zaten doğrulanmış" },
        { status: 200 }
      )
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Doğrulama kodu hatalı" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
      },
    })

    return NextResponse.json(
      { message: "E-posta başarıyla doğrulandı!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Doğrulama hatası:", error)
    return NextResponse.json(
      { error: "Doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
