import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 5MB'dan büyük olamaz" }, { status: 400 })
    }

    // Only images
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Sadece JPG, PNG, WebP ve GIF dosyaları yüklenebilir" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error("Upload hatası:", error)
    return NextResponse.json({ error: "Dosya yüklenirken hata oluştu" }, { status: 500 })
  }
}
