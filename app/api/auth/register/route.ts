import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, password, fullName, displayName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "E-posta, şifre ve ad soyad zorunludur" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        displayName: displayName || fullName,
      },
    })

    // Yeni Üye rozeti ver
    const newMemberBadge = await prisma.badge.findUnique({
      where: { name: "Yeni Üye" },
    })

    if (newMemberBadge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: newMemberBadge.id,
        },
      })
    }

    return NextResponse.json(
      { message: "Hesap başarıyla oluşturuldu" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json(
      { error: "Hesap oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}
