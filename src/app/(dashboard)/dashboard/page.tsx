// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { bureauAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  Users, Eye, EyeOff, FileText, TrendingUp,
  CheckCircle2, Shield, Star, AlertCircle, Clock
} from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, subtext }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['bureau', 'dashboard'],
    queryFn: () => bureauAPI.getDashboard().then(r => r.data.data),
    refetchInterval: 60 * 1000,
  });

  const isExpiringSoon = data?.subscription?.daysRemaining <= 7 && data?.subscription?.daysRemaining > 0;
  const isExpired = data?.subscription?.status === 'EXPIRED';
  const canReveal = data?.stats?.activeProfiles >= 10;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.fullName?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">{user?.businessName}</p>
      </div>

      {/* Alert Banners */}
      {isExpired && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Subscription Expired</p>
            <p className="text-sm text-red-600 mt-0.5">
              Your subscription has expired. You can view your dashboard but cannot upload profiles,
              search, or reveal contacts.
            </p>
            <Link href="/account/subscription"
              className="text-sm font-medium text-red-700 hover:text-red-900 underline mt-1 inline-block">
              Renew Subscription →
            </Link>
          </div>
        </div>
      )}

      {isExpiringSoon && !isExpired && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">
              Subscription Expiring in {data.subscription.daysRemaining} Days
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Renew before it expires to avoid interruption to your service.
            </p>
          </div>
        </div>
      )}

      {!canReveal && !isExpired && data && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">
              Upload {10 - (data?.stats?.activeProfiles || 0)} more profiles to unlock contact reveal
            </p>
            <p className="text-sm text-blue-600 mt-0.5">
              You need at least 10 active profiles to view contact details from other bureaus.
              Currently: {data?.stats?.activeProfiles || 0}/10
            </p>
            <Link href="/profiles/new"
              className="text-sm font-medium text-blue-700 hover:text-blue-900 underline mt-1 inline-block">
              Upload Profile →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Profiles"
          value={data?.stats?.totalProfiles}
          icon={FileText}
          color="bg-green-50 text-green-700"
          subtext={`${data?.stats?.activeProfiles || 0} active`}
        />
        <StatCard
          label="Contact Views Received"
          value={data?.stats?.contactViewsReceivedThisMonth}
          icon={Eye}
          color="bg-blue-50 text-blue-700"
          subtext="This month"
        />
        <StatCard
          label="Contact Views Made"
          value={data?.stats?.contactViewsMadeThisMonth}
          icon={EyeOff}
          color="bg-purple-50 text-purple-700"
          subtext="This month"
        />
        <StatCard
          label="Network Profiles"
          value="100,000+"
          icon={TrendingUp}
          color="bg-gold-50 text-gold-600"
          subtext="Available to search"
        />
      </div>

      {/* Status + Badges */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Subscription Status */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Subscription Status</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${
              data?.subscription?.status === 'ACTIVE' ? 'bg-green-500' :
              data?.subscription?.status === 'FREE' ? 'bg-blue-500' :
              'bg-red-500'
            }`} />
            <span className="font-medium text-slate-900 capitalize">
              {data?.subscription?.status || 'Free'}
            </span>
          </div>
          {data?.subscription?.expiresAt && (
            <p className="text-sm text-slate-500">
              Expires: {new Date(data.subscription.expiresAt).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Verification Badges</h3>
          {user?.badges?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.badges.map(badge => {
                const config: any = {
                  VERIFIED: { icon: CheckCircle2, label: 'Verified Bureau', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                  TRUSTED: { icon: Shield, label: 'Trusted Bureau', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  PREMIUM: { icon: Star, label: 'Premium Bureau', color: 'text-green-700 bg-green-50 border-green-200' },
                }[badge];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <span key={badge}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No badges assigned yet. Contact admin to get verified.
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/profiles/new"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition-all group">
            <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
              <span className="text-green-700 font-bold text-lg leading-none">+</span>
            </div>
            <span className="text-sm font-medium text-slate-700">Upload Profile</span>
          </Link>
          <Link href="/search"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-slate-700">Search Profiles</span>
          </Link>
          <Link href="/profiles"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-700" />
            </div>
            <span className="text-sm font-medium text-slate-700">My Profiles</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
