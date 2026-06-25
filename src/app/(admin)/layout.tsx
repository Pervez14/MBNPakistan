'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, User, CreditCard,
  BarChart2, Settings, Shield, LogOut, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/profiles', label: 'Profiles', icon: User },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">MBN Admin</p>
              <p className="text-slate-400 text-xs">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-700 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Bureau Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <div className="px-3 pt-2">
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            <p className="text-xs text-amber-400 font-medium">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
