import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { awardPoints } from "@/lib/points"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const session = await auth()
  const user = session?.user ?? null
  const { slug } = await params
  const { token } = await searchParams

  // Giris yapmamis kullanici
  if (!user) {
    redirect(`/giris?callbackUrl=/etkinlikler/${slug}/katilim?token=${token}`)
  }

  // Token yok
  if (!token) {
    return renderResult(user, slug, "error", "Gecersiz link. QR kodu tekrar okutun.")
  }

  // Etkinligi bul
  const event = await prisma.event.findUnique({
    where: { slug },
  })

  if (!event) {
    return renderResult(user, slug, "error", "Etkinlik bulunamadi.")
  }

  // Token dogrula
  const qrToken = await prisma.eventQrToken.findFirst({
    where: { token, eventId: event.id, isActive: true },
  })

  if (!qrToken) {
    return renderResult(user, slug, "error", "QR kodu gecersiz veya suresi dolmus.")
  }

  // Daha once katilim kaydedilmis mi?
  const existingLog = await prisma.eventAttendanceLog.findUnique({
    where: {
      eventId_userId: { eventId: event.id, userId: user.id },
    },
  })

  if (existingLog) {
    return renderResult(user, slug, "already", "Katiliminiz zaten kayitli! Daha once puan kazandiniz.")
  }

  // Katilim kaydet ve puan ver
  const pointsToAward = event.attendancePoints

  await prisma.eventAttendanceLog.create({
    data: {
      eventId: event.id,
      userId: user.id,
      pointsAwarded: pointsToAward,
    },
  })

  await awardPoints(user.id, "event_attendance", `Etkinlik katilimi: ${event.title}`, event.id).catch(() => {
    // Kural yoksa dogrudan puan ekle
    prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: pointsToAward } },
    }).catch(() => {})
  })

  return renderResult(user, slug, "success", `Katiliminiz kaydedildi! ${pointsToAward} puan kazandiniz.`)
}

function renderResult(
  user: any,
  slug: string,
  status: "success" | "error" | "already",
  message: string
) {
  const icons = {
    success: <CheckCircle className="h-16 w-16 text-green-500" />,
    error: <XCircle className="h-16 w-16 text-destructive" />,
    already: <AlertCircle className="h-16 w-16 text-yellow-500" />,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">{icons[status]}</div>
            <h1 className="text-2xl font-bold mb-2">
              {status === "success" ? "Basarili!" : status === "already" ? "Zaten Kayitli" : "Hata"}
            </h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button asChild>
              <Link href={`/etkinlikler/${slug}`}>Etkinlige Don</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
