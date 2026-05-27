import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-black">D</div>
              {SITE_CONFIG.name}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{SITE_CONFIG.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">All Posts</Link></li>
              <li><Link href="/search" className="hover:text-foreground transition-colors">Search</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
