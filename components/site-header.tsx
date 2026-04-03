"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Etkinlikler", href: "/etkinlikler" },
]

const communityLinks = [
  { name: "Yönetim Kurulu", href: "/yonetim-kurulu" },
  { name: "Skor Tablosu", href: "/skor-tablosu" },
  { name: "Rozetler", href: "/rozetler" },
  { name: "Projeler", href: "/projeler" },
  { name: "Sponsorlar", href: "/sponsorlar" },
  { name: "Galeri", href: "/galeri" },
]

const extraNav = [
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "İletişim", href: "/iletisim" },
]

export function SiteHeader({
  user,
}: {
  user?: { id: string; email: string; name: string; isAdmin: boolean; displayName: string | null } | null
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Image
              src="/images/uludagdev_logo.jpeg"
              alt="Uludağ Yazılım Topluluğu"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold text-lg text-foreground">UYT</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menüyü aç</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setCommunityOpen(true)}
            onMouseLeave={() => setCommunityOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                communityLinks.some((l) => pathname === l.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              Topluluk
              <ChevronDown className="h-3 w-3" />
            </button>
            {communityOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md z-50">
                {communityLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent",
                      pathname === item.href ? "text-primary font-medium" : "text-popover-foreground",
                    )}
                    onClick={() => setCommunityOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {extraNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {user ? (
            <>
              {user.isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/profil">Profilim</Link>
              </Button>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Çıkış Yap</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/giris">Giriş Yap</Link>
              </Button>
              <Button asChild>
                <Link href="/kayit">Kayıt Ol</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileCommunityOpen(!mobileCommunityOpen)}
            >
              Topluluk
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileCommunityOpen && "rotate-180")} />
            </button>
            {mobileCommunityOpen && (
              <div className="ml-4 space-y-1">
                {communityLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            {extraNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              {user ? (
                <>
                  {user.isAdmin && (
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/profil">Profilim</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => signOut({ callbackUrl: "/" })}>Çıkış Yap</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/giris">Giriş Yap</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/kayit">Kayıt Ol</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
