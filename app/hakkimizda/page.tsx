import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Heart, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AboutPage() {
  const session = await auth()
  const user = session?.user ?? null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Hakkımızda</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Bursa Uludağ Üniversitesi bünyesinde kurulmuş, yazılım ve teknoloji alanında öğrencilerin bir araya
              geldiği dinamik bir topluluk
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Topluluk Bilgileri</h2>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">2020</div>
                  <p className="text-muted-foreground">Kuruluş Yılı</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">4</div>
                  <p className="text-muted-foreground">Yıldır Aktif</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Topluluk Üyesi</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Uludağ Yazılım Topluluğu, 2020 yılında Bursa Uludağ Üniversitesi öğrencilerinin yazılım ve teknoloji
                  alanındaki tutkularını paylaşmak, birlikte öğrenmek ve projeler geliştirmek amacıyla kurulmuştur.
                  Kuruluşumuzdan bu yana 50&apos;den fazla etkinlik düzenledik, 10&apos;dan fazla blog yazısı yayınladık ve
                  yüzlerce öğrenciye kariyer yolculuklarında rehberlik ettik.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <Card>
              <CardContent className="pt-6">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-3">Misyonumuz</h2>
                <p className="text-muted-foreground">
                  Öğrencilerin yazılım ve teknoloji alanında kendilerini geliştirmelerine, projeler üretmelerine ve
                  sektörle bağlantı kurmalarına olanak sağlamak. Birlikte öğrenmek, paylaşmak ve büyümek.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Lightbulb className="h-10 w-10 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-3">Vizyonumuz</h2>
                <p className="text-muted-foreground">
                  Türkiye&apos;nin en aktif ve etkili üniversite yazılım topluluklarından biri olmak. Mezunlarımızın
                  teknoloji sektöründe başarılı kariyerler yapmasına katkıda bulunmak.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold">Değerlerimiz</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Paylaşmak</h3>
                <p className="text-sm text-muted-foreground">Bilgiyi, deneyimi ve kaynakları özgürce paylaşmak</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">İş Birliği</h3>
                <p className="text-sm text-muted-foreground">Birlikte çalışarak daha güçlü olmak</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Sürekli Öğrenme</h3>
                <p className="text-sm text-muted-foreground">Her gün yeni şeyler öğrenmeye açık olmak</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Kapsayıcılık</h3>
                <p className="text-sm text-muted-foreground">Herkesi eşit şekilde kucaklamak</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Yenilikçilik</h3>
                <p className="text-sm text-muted-foreground">Yeni fikirlere ve teknolojilere açık olmak</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Topluluk</h3>
                <p className="text-sm text-muted-foreground">Güçlü bir topluluk ruhu oluşturmak</p>
              </div>
            </div>
          </div>

          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Yönetim Ekibi</h2>
            <p className="text-muted-foreground mb-6">
              Topluluğumuzun yönetim kadrosunu ve geçmiş dönem yöneticilerini görüntüleyin.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/yonetim-kurulu">Yönetim Kurulunu Görüntüle</Link>
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Topluluğumuza Katılın</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Yazılım ve teknolojiye ilgi duyan herkes topluluğumuza katılabilir. Etkinliklere katılın, blog yazın,
              projeler geliştirin ve birlikte büyüyün!
            </p>
            <Button size="lg" asChild>
              <Link href="/kayit">Hemen Katıl</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
