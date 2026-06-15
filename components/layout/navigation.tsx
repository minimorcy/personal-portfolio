'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/shared/theme-toggle'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const { nav } = t()

  const links = [
    { href: '/', label: nav.home },
    { href: '/blog', label: nav.blog },
    { href: '/proyectos', label: nav.projects },
    { href: '/cv', label: nav.cv },
    { href: '/stats', label: nav.stats },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-600 dark:text-brand-400">
          JM
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Button key={link.href} variant={pathname === link.href ? 'default' : 'ghost'} size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-2 mt-8">
                {links.map((link) => (
                  <Button
                    key={link.href}
                    variant={pathname === link.href ? 'default' : 'ghost'}
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
