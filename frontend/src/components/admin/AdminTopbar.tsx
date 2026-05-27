'use client';
import Image from 'next/image';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { getInitials } from '@/lib/utils';

interface AdminTopbarProps {
  user: { name: string; email: string; image?: string; role: string };
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="h-16 border-b bg-card/50 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
