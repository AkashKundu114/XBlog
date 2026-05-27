'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useUIStore } from '@/stores/useUIStore';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { useSession } from 'next-auth/react';

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/search', label: 'Search' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full transition-all duration-300',
      scrolled ? 'glass shadow-sm' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/blog" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-black">
              D
            </div>
            <span className="hidden sm:block">{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}>
                  {isActive && (
                    <motion.div layoutId="nav-pill"
                      className="absolute inset-0 bg-muted rounded-xl"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/search" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors md:hidden">
              <Search className="w-4 h-4" />
            </Link>
            {session ? (
              <Link href="/admin/dashboard"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
            ) : (
              <Link href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-muted transition-colors">
                Sign In
              </Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t glass"
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pathname.startsWith(link.href) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'
                )}>
                {link.label}
              </Link>
            ))}
            {session
              ? <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground mt-2">
                  Dashboard
                </Link>
              : <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium border mt-2 text-center">
                  Sign In
                </Link>
            }
          </nav>
        </motion.div>
      )}
    </header>
  );
}
