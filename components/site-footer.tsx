import Link from "next/link"
import { Github, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/uludagdev_logo.jpeg"
                alt="Uludağ Yazılım Topluluğu"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-semibold text-lg text-foreground">UYT</span>
            </div>
            <p className="text-sm text-muted-foreground">Bursa Uludağ Üniversitesi Yazılım ve Teknoloji Topluluğu</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Hızlı Bağlantılar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-muted-foreground hover:text-primary transition-colors">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Topluluk</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/kayit" className="text-muted-foreground hover:text-primary transition-colors">
                  Üye Ol
                </Link>
              </li>
              <li>
                <Link href="/skor-tablosu" className="text-muted-foreground hover:text-primary transition-colors">
                  Skor Tablosu
                </Link>
              </li>
              <li>
                <Link href="/rozetler" className="text-muted-foreground hover:text-primary transition-colors">
                  Rozetler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Sosyal Medya</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/uludagyazilimtoplulugu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/company/uludagdev/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/uludagdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Uludağ Yazılım Topluluğu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
