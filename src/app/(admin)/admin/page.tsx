'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, User, Clock, CheckCircle, Activity,
  TrendingUp, Eye, Shield, ArrowRight
} from 'lucide-react';
import { adminAPI } from '@/lib/api';

interface DashboardData {
  users: {
    total: number;
    pending: number;
    approved: number;
    suspended: number;
    verifiedBureaus: number;
  };
  profiles: {
    total: number;
    active: number;
    male: number;
    female: number;
  };
  contactReveals: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  recentRegistrations: {
    id: string;
    businessName: string;
    email: string;
    city?: string;
    createdAt: string;
    accountStatus: string;
  }[];
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href?: string;
}

function StatCard({ label, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div className={`stat-card border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="page-title mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-6 h-24 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Marriage Bureau Network Pakistan — Control Panel</p>
        </div>
        {data.users.pending > 0 && (
          <Link href="/admin/users?status=PENDING" className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
            <Clock className="w-4 h-4" />
            {data.users.pending} Pending Approval
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* User Stats */}
      <div className="mb-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Users</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Bureaus" value={data.users.total} icon={Users} color="border-blue-400" href="/admin/users" />
          <StatCard label="Pending Approval" value={data.users.pending} icon={Clock} color="border-amber-400" href="/admin/users?status=PENDING" />
          <StatCard label="Active Bureaus" value={data.users.approved} icon={CheckCircle} color="border-green-400" href="/admin/users?status=APPROVED" />
          <StatCard label="Verified Bureaus" value={data.users.verifiedBureaus} icon={Shield} color="border-purple-400" />
        </div>
      </div>

      {/* Profile Stats */}
      <div className="mb-2 mt-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Profiles</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Profiles" value={data.profiles.total} icon={User} color="border-indigo-400" href="/admin/profiles" />
          <StatCard label="Active Profiles" value={data.profiles.active} icon={Activity} color="border-green-400" />
          <StatCard label="Male Profiles" value={data.profiles.male} icon={User} color="border-blue-400" />
          <StatCard label="Female Profiles" value={data.profiles.female} icon={User} color="border-pink-400" />
        </div>
      </div>

      {/* Contact Reveals */}
      <div className="mb-6 mt-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact Reveals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Today" value={data.contactReveals.today} icon={Eye} color="border-cyan-400" />
          <StatCard label="This Week" value={data.contactReveals.thisWeek} icon={Eye} color="border-teal-400" />
          <StatCard label="This Month" value={data.contactReveals.thisMonth} icon={TrendingUp} color="border-emerald-400" />
          <StatCard label="Total Reveals" value={data.contactReveals.total} icon={Eye} color="border-green-400" />
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-heading font-semibold text-slate-800">Recent Registrations</h2>
          <Link href="/admin/users" className="text-sm text-green-700 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {data.recentRegistrations.slice(0, 8).map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-900 text-sm">{user.businessName}</p>
                <p className="text-xs text-slate-400">{user.email} · {user.city}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString('en-PK')}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                  user.accountStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  user.accountStatus === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {user.accountStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
