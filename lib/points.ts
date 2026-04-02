import { prisma } from "@/lib/prisma"

/**
 * Kullaniciya puan ver ve seviye/rozet guncelle.
 */
export async function awardPoints(
  userId: string,
  activityType: string,
  description: string,
  referenceId?: string
) {
  // Puan kuralini bul
  const rule = await prisma.pointRule.findUnique({
    where: { activityType },
  })

  if (!rule || !rule.isActive) return null

  const points = rule.points

  // Aktivite kaydi olustur
  const activity = await prisma.activity.create({
    data: {
      userId,
      activityType,
      points,
      description,
      referenceId: referenceId ?? null,
    },
  })

  // Kullanici puanini guncelle
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
    },
  })

  // Seviye hesapla (her 100 puan = 1 seviye)
  const newLevel = Math.max(1, Math.floor(user.points / 100) + 1)
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    })
  }

  // Puan esigini gecen rozetleri kontrol et ve ata
  const eligibleBadges = await prisma.badge.findMany({
    where: {
      pointsRequired: { lte: user.points },
    },
  })

  for (const badge of eligibleBadges) {
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: { userId, badgeId: badge.id },
      },
      create: {
        userId,
        badgeId: badge.id,
      },
      update: {},
    })
  }

  return { activity, totalPoints: user.points, level: newLevel }
}
