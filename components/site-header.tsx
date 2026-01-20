"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Etkinlikler", href: "/etkinlikler" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "İletişim", href: "/iletisim" },
]

export function SiteHeader({
  user,
  isAdmin = false,
}: {
  user?: { id: string; email: string } | null
  isAdmin?: boolean
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        <div className="hidden lg:flex lg:gap-x-8">
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
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/profil">Profilim</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/api/auth/signout">Çıkış Yap</Link>
              </Button>
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
            <div className="mt-4 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/profil">Profilim</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/api/auth/signout">Çıkış Yap</Link>
                  </Button>
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
