import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CounterAnimation } from "@/components/counter-animation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BookOpen, Calendar, Trophy, Users, Code2, Rocket, Star } from "lucide-react"
import { SponsorGrid } from "@/components/sponsor-grid"

export default async function HomePage() {
  const session = await auth()
  const user = session?.user ?? null

  const recentPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      author: {
        select: { displayName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const now = new Date()

  const upcomingEvents = await prisma.event.findMany({
    where: {
      published: true,
      eventDate: { gte: now },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      eventDate: true,
      location: true,
    },
    orderBy: { eventDate: "asc" },
    take: 3,
  })

  const pastEvents = await prisma.event.findMany({
    where: {
      published: true,
      eventDate: { lt: now },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      eventDate: true,
      location: true,
    },
    orderBy: { eventDate: "desc" },
    take: 3,
  })

  const activeSponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 lg:py-32 overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-gradient opacity-50" />

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 animate-grid"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                color: "rgb(var(--color-primary))",
              }}
            />
          </div>

          {/* Floating geometric shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div
              className="absolute top-40 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float-slow"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-32 left-1/4 w-36 h-36 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute bottom-20 right-1/3 w-28 h-28 bg-primary/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "3s" }}
            />

            {/* Geometric shapes */}
            <div
              className="absolute top-1/4 right-10 w-20 h-20 border-2 border-primary/30 rotate-45 animate-float-slow"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute bottom-1/3 left-20 w-16 h-16 border-2 border-secondary/30 animate-pulse-slow"
              style={{ animationDelay: "1.5s" }}
            />
            <div
              className="absolute top-1/3 left-1/3 w-12 h-12 bg-accent/10 rotate-12 animate-float"
              style={{ animationDelay: "2.5s" }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance animate-fade-in-up">
                Uludağ Yazılım Topluluğu
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in-up stagger-1">
                Bursa Uludağ Üniversitesi öğrencilerinin yazılım ve teknoloji alanında birlikte öğrenip geliştiği,
                projeler ürettiği ve etkinlikler düzenlediği topluluk platformu.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up stagger-2">
                {user ? (
                  <Button size="lg" asChild className="hover:scale-105 transition-transform">
                    <Link href="/blog">Blog&apos;u Keşfet</Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="hover:scale-105 transition-transform">
                      <Link href="/kayit">Hemen Katıl</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="hover:scale-105 transition-transform bg-transparent"
                    >
                      <Link href="/hakkimizda">Daha Fazla Bilgi</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Neler Sunuyoruz?</h2>
              <p className="mt-4 text-lg text-muted-foreground">Topluluğumuzda seni bekleyen fırsatlar</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/blog" className="block">
                <Card className="animate-scale-in stagger-1 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <BookOpen className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>Blog ve İçerikler</CardTitle>
                    <CardDescription>
                      Teknoloji, yazılım ve kişisel gelişim konularında kaliteli içerikler
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/etkinlikler" className="block">
                <Card className="animate-scale-in stagger-2 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <Calendar className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>Etkinlikler</CardTitle>
                    <CardDescription>Workshop, hackathon, seminer ve sosyal etkinlikler</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/kayit" className="block">
                <Card className="animate-scale-in stagger-3 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <Trophy className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>Gamification</CardTitle>
                    <CardDescription>Puan topla, rozet kazan, sıralamada yüksel</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link
                href="https://chat.whatsapp.com/CabOeexI4yvEqC7XPyf8Rb?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="animate-scale-in stagger-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <Users className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>Topluluk</CardTitle>
                    <CardDescription>Benzer ilgi alanlarına sahip kişilerle tanış ve network kur</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link
                href="https://github.com/uludagyazilimtoplulugu"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="animate-scale-in stagger-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <Code2 className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>Projeler</CardTitle>
                    <CardDescription>Birlikte proje geliştir, deneyim kazan</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Card className="animate-scale-in stagger-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardHeader>
                  <Rocket className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Kariyer</CardTitle>
                  <CardDescription>İş fırsatları, staj olanakları ve kariyer rehberliği</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div
              className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#44657a10_1px,transparent_1px),linear-gradient(to_bottom,#44657a10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Etkinlikler</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Topluluğumuzun düzenlediği workshop, hackathon, seminer ve sosyal etkinlikler
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    Yaklaşan Etkinlikler
                  </h3>
                  <p className="text-muted-foreground mt-1">Kaçırma, hemen kaydol!</p>
                </div>
              </div>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-3 mb-6">
                    {upcomingEvents.map((event, index) => (
                      <Card
                        key={event.id}
                        className={`animate-fade-in-up stagger-${index + 1} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-primary/20`}
                      >
                        <CardHeader>
                          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                            <Link href={`/etkinlikler/${event.slug}`}>{event.title}</Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.eventDate).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Code2 className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <Button asChild size="sm" className="w-full mt-4">
                            <Link href={`/etkinlikler/${event.slug}`}>Detayları Gör</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center animate-fade-in stagger-4">
                    <Button variant="outline" asChild className="hover:scale-105 transition-transform bg-transparent">
                      <Link href="/etkinlikler">
                        Tüm Etkinlikleri Gör
                        <Calendar className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground">Yaklaşan etkinlik bulunmuyor</p>
                </div>
              )}
            </div>

            {/* Past Events */}
            {pastEvents && pastEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      <Star className="h-6 w-6 text-muted-foreground" />
                      Geçmiş Etkinlikler
                    </h3>
                    <p className="text-muted-foreground mt-1">Daha önce gerçekleştirdiğimiz etkinlikler</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {pastEvents.map((event, index) => (
                    <Card
                      key={event.id}
                      className={`animate-fade-in-up stagger-${index + 1} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-90`}
                    >
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Link href={`/etkinlikler/${event.slug}`}>{event.title}</Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.eventDate).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Code2 className="h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* About Section - Biz Kimiz */}
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Biz Kimiz?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Bursa Uludağ Üniversitesi bünyesinde kurulmuş, yazılım ve teknoloji alanında öğrencilerin bir araya
                geldiği dinamik bir topluluk
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="animate-slide-in-left stagger-1 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-center">Kuruluş</CardTitle>
                  <CardDescription className="text-center text-2xl font-bold text-primary mt-2">2020</CardDescription>
                  <CardDescription className="text-center">Aktif 4 yıldır</CardDescription>
                </CardHeader>
              </Card>
              <Card className="animate-scale-in stagger-2 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-center">Üye Sayısı</CardTitle>
                  <CardDescription className="text-center text-2xl font-bold text-primary mt-2">
                    <CounterAnimation end={500} suffix="+" />
                  </CardDescription>
                  <CardDescription className="text-center">Aktif topluluk üyesi</CardDescription>
                </CardHeader>
              </Card>
              <Card className="animate-slide-in-right stagger-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-center">Etkinlik</CardTitle>
                  <CardDescription className="text-center text-2xl font-bold text-primary mt-2">
                    <CounterAnimation end={50} suffix="+" />
                  </CardDescription>
                  <CardDescription className="text-center">Düzenlenen etkinlik</CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="text-center animate-fade-in stagger-4">
              <Button size="lg" asChild className="hover:scale-105 transition-transform">
                <Link href="/hakkimizda">Daha Fazla Bilgi</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact mini section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background animate-scale-in hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="py-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">İletişime Geçin</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Aklınıza takılan sorular mı var? Bize ulaşmak için iletişim formunu doldurun, en kısa sürede size
                      geri dönelim.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Topluluk aktiviteleri hakkında bilgi</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Code2 className="h-5 w-5 text-primary" />
                        <span>Sponsorluk ve iş birliği fırsatları</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>Etkinlik talepleri ve öneriler</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button size="lg" asChild className="hover:scale-110 transition-transform animate-bounce-subtle">
                      <Link href="/iletisim">İletişim Formu</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary/5 py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 animate-fade-in-up">
                Rakamlarla Biz
              </h2>
              <p className="text-lg text-muted-foreground mb-12 animate-fade-in-up stagger-1">
                Topluluğumuzun büyüklüğünü ve etkisini gösteren istatistikler
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center animate-scale-in stagger-1">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={500} suffix="+" />
                </div>
                <div className="text-lg font-medium text-foreground">Aktif Üye</div>
                <div className="text-sm text-muted-foreground mt-1">Yazılım tutkunu öğrenci</div>
              </div>
              <div className="flex flex-col items-center animate-scale-in stagger-2">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={50} suffix="+" />
                </div>
                <div className="text-lg font-medium text-foreground">Düzenlenen Etkinlik</div>
                <div className="text-sm text-muted-foreground mt-1">Workshop, seminer ve hackathon</div>
              </div>
              <div className="flex flex-col items-center animate-scale-in stagger-3">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={10} suffix="+" />
                </div>
                <div className="text-lg font-medium text-foreground">Blog Yazısı</div>
                <div className="text-sm text-muted-foreground mt-1">Kaliteli teknik içerik</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor Bandi */}
        {activeSponsors.length > 0 && (
          <section className="py-16 bg-background">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Sponsorlarımız</h2>
                <p className="text-muted-foreground">Topluluğumuzun değerli destekçileri</p>
              </div>
              <SponsorGrid sponsors={activeSponsors} />
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!user && (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <Card className="bg-primary text-primary-foreground animate-scale-in hover:shadow-2xl transition-all duration-300">
                <CardContent className="py-12 text-center">
                  <Star className="h-12 w-12 mx-auto mb-6 animate-bounce-subtle" />
                  <h2 className="text-3xl font-bold mb-4">Topluluğa Katıl</h2>
                  <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                    Hemen kaydol, etkinliklere katıl, blog yaz, puan kazan ve rozetleri topla!
                  </p>
                  <Button size="lg" variant="secondary" asChild className="hover:scale-110 transition-transform">
                    <Link href="/kayit">Ücretsiz Kayıt Ol</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
