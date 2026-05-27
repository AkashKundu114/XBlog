'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, FolderOpen, Tag, Image, LogOut, ExternalLink } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/tags', label: 'Tags', icon: Tag },
  { href: '/admin/media', label: 'Media', icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-black">D</div>
          {SITE_CONFIG.name}
        </Link>
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}>
              {isActive && (
                <motion.div layoutId="admin-pill"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              <item.icon className={cn('w-4 h-4 relative z-10', isActive && 'text-primary')} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-1">
        <Link href="/blog" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ExternalLink className="w-4 h-4" /> View Blog
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
