'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type DashboardLayoutProps = {
  children: ReactNode;
};

type BureauInfo = {
  business_name: string | null;
  full_name: string | null;
  status: string | null;
};

const baseNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My Profiles',
    href: '/profiles',
    icon: Users,
  },
  {
    label: 'Add Profile',
    href: '/profiles/new',
    icon: UserPlus,
  },
  {
    label: 'Search Profiles',
    href: '/search',
    icon: Search,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const adminNavItem = {
  label: 'Super Admin',
  href: '/super-admin',
  icon: ClipboardList,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bureauInfo, setBureauInfo] = useState<BureauInfo | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !user.email) {
          localStorage.removeItem('mbn-auth');
          router.push('/login');
          return;
        }

        setUserEmail(user.email);

        const { data } = await supabase
          .from('bureau_applications')
          .select('business_name, full_name, status')
          .eq('email', user.email)
          .maybeSingle();

        setBureauInfo(data || null);

        const { data: adminData } = await supabase
          .from('site_admins')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        setIsAdmin(Boolean(adminData));
      } catch {
        localStorage.removeItem('mbn-auth');
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('mbn-auth');
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    if (href === '/profiles') {
      return pathname === '/profiles';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const status = bureauInfo?.status || 'pending';

  const statusBadge =
    status === 'approved'
      ? 'bg-green-100 text-green-700'
      : status === 'rejected'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700';

  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="w-14 h-14 object-contain"
          />

          <div>
            <p className="font-heading font-bold text-slate-900 leading-tight">
              MBN Pakistan
            </p>
            <p className="text-xs text-slate-500">Marriage Bureau Network</p>
          </div>
        </Link>
      </div>

      <div className="px-6 py-5 border-b border-slate-200">
        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
          Logged in as
        </p>

        <p className="font-semibold text-slate-900 truncate">
          {bureauInfo?.business_name || 'Marriage Bureau'}
        </p>

        <p className="text-xs text-slate-500 truncate mt-1">
          {bureauInfo?.full_name || userEmail}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge}`}
          >
            <ShieldCheck className="w-3 h-3" />
            {status}
          </span>

          {isAdmin && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white">
              Super Admin
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                active
                  ? 'bg-green-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:bg-white lg:border-r lg:border-slate-200 lg:block">
        {SidebarContent}
      </aside>

      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="w-10 h-10 object-contain"
          />

          <div>
            <p className="font-heading font-bold text-slate-900 text-sm">
              MBN Pakistan
            </p>
            <p className="text-[11px] text-slate-500">Dashboard</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center z-10"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {SidebarContent}
          </aside>
        </div>
      )}

      <main className="lg:pl-72">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
