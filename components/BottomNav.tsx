'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Calendar, Users, User } from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
                isActive ? 'text-amber' : 'text-text-muted'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
