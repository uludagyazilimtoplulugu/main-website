import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Giris yapin" }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, description, techStack, githubUrl, demoUrl, coverImage } = body

  if (!title || !slug || !description) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      techStack: techStack || [],
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      coverImage: coverImage || null,
      authorId: session.user.id,
      published: false, // Admin onayi gerekli
    },
  })

  return NextResponse.json(project, { status: 201 })
}
