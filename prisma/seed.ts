import { PrismaClient } from "../lib/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  // Blog kategorileri
  const categories = [
    { name: "Teknoloji", slug: "teknoloji", description: "Yazılım ve teknoloji haberleri", color: "#44657A" },
    { name: "Eğitim", slug: "egitim", description: "Eğitim içerikleri ve dersler", color: "#334252" },
    { name: "Etkinlik", slug: "etkinlik", description: "Topluluk etkinlikleri", color: "#5A7C99" },
    { name: "Proje", slug: "proje", description: "Topluluk projeleri", color: "#6B8BA8" },
  ]

  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Rozetler
  const badges = [
    { name: "Yeni Üye", description: "Topluluğa hoş geldin!", icon: "🎉", color: "#44657A", pointsRequired: 0 },
    { name: "İlk Blog Yazısı", description: "İlk blog yazını yazdın", icon: "✍️", color: "#5A7C99", pointsRequired: 0 },
    { name: "Yorum Yapan", description: "10 yorum yaptın", icon: "💬", color: "#6B8BA8", pointsRequired: 50 },
    { name: "Etkinlik Katılımcısı", description: "İlk etkinliğe katıldın", icon: "🎪", color: "#7A9DB4", pointsRequired: 0 },
    { name: "Aktif Üye", description: "200 puan topladın", icon: "⭐", color: "#8BAEC0", pointsRequired: 200 },
    { name: "Veteran", description: "500 puan topladın", icon: "🏆", color: "#9CBFCC", pointsRequired: 500 },
    { name: "Efsane", description: "1000 puan topladın", icon: "👑", color: "#ADD0D8", pointsRequired: 1000 },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    })
  }

  // Puan kurallari
  const pointRules = [
    { activityType: "blog_post", points: 100, description: "Blog yazısı yayınlama" },
    { activityType: "comment", points: 10, description: "Blog yorumu yapma" },
    { activityType: "event_attendance", points: 50, description: "Etkinliğe katılım" },
    { activityType: "event_organization", points: 100, description: "Etkinlik düzenleme" },
    { activityType: "profile_update", points: 5, description: "Profil güncelleme" },
  ]

  for (const rule of pointRules) {
    await prisma.pointRule.upsert({
      where: { activityType: rule.activityType },
      update: {},
      create: rule,
    })
  }

  console.log("Seed verileri basariyla yuklendi!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
