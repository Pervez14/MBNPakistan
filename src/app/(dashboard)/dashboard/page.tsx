'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Eye,
  EyeOff,
  TrendingUp,
  Upload,
  Search,
  Users,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BureauApplication = {
  full_name: string | null;
  business_name: string | null;
  status: string | null;
  city: string | null;
  province: string | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [application, setApplication] = useState<BureauApplication | null>(null);

  const [totalProfiles, setTotalProfiles] = useState(0);
  const [activeProfiles, setActiveProfiles] = useState(0);
  const [networkProfiles, setNetworkProfiles] = useState(0);

  const [contactViewsReceived, setContactViewsReceived] = useState(0);
  const [contactViewsMade, setContactViewsMade] = useState(0);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view your dashboard.');
      }

      const userEmail = user.email.toLowerCase();

      const { data: applicationData, error: applicationError } = await supabase
        .from('bureau_applications')
        .select('full_name, business_name, status, city, province')
        .eq('email', user.email)
        .maybeSingle();

      if (applicationError) {
        throw applicationError;
      }

      setApplication(applicationData || null);

      const { count: totalProfilesCount, error: totalProfilesError } =
        await supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id);

      if (totalProfilesError) {
        throw totalProfilesError;
      }

      setTotalProfiles(totalProfilesCount || 0);

      const { count: activeProfilesCount, error: activeProfilesError } =
        await supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id)
          .eq('status', 'active');

      if (activeProfilesError) {
        throw activeProfilesError;
      }

      setActiveProfiles(activeProfilesCount || 0);

      const { count: networkProfilesCount, error: networkProfilesError } =
        await supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

      if (networkProfilesError) {
        throw networkProfilesError;
      }

      setNetworkProfiles(networkProfilesCount || 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfMonthIso = startOfMonth.toISOString();

      const { count: receivedCount, error: receivedError } = await supabase
        .from('contact_view_logs')
        .select('*', { count: 'exact', head: true })
        .eq('uploader_email', userEmail)
        .gte('viewed_at', startOfMonthIso);

      if (receivedError) {
        throw receivedError;
      }

      setContactViewsReceived(receivedCount || 0);

      const { count: madeCount, error: madeError } = await supabase
        .from('contact_view_logs')
        .select('*', { count: 'exact', head: true })
        .eq('viewer_email', userEmail)
        .gte('viewed_at', startOfMonthIso);

      if (madeError) {
        throw madeError;
      }

      setContactViewsMade(madeCount || 0);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Dashboard could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const status = application?.status || 'pending';

  const statusBadge =
    status === 'approved'
      ? 'bg-green-100 text-green-700'
      : status === 'rejected'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700';

  const statusIcon =
    status === 'approved' ? (
      <CheckCircle className="w-4 h-4" />
    ) : status === 'rejected' ? (
      <XCircle className="w-4 h-4" />
    ) : (
      <Clock className="w-4 h-4" />
    );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-16 w-80 bg-slate-200 rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>

        <div className="h-72 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-3xl">
        <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Dashboard Error</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-5 px-5 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
        >
          Reload Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Welcome back, {application?.full_name || 'Bureau User'}
        </h1>

        <p className="text-slate-500 mt-2">
          {application?.business_name || 'Marriage Bureau'}
          {application?.city ? ` • ${application.city}` : ''}
          {application?.province ? `, ${application.province}` : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Profiles</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {totalProfiles}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {activeProfiles} active
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Contact Views Received</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {contactViewsReceived}
              </p>
              <p className="text-sm text-slate-500 mt-2">This month</p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Contact Views Made</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {contactViewsMade}
              </p>
              <p className="text-sm text-slate-500 mt-2">This month</p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Network Profiles</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {networkProfiles}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Available to search
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Subscription Status
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <p className="font-semibold text-slate-900">Free</p>
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Upgrade system can be added later when paid memberships are ready.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Verification Badges
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusBadge}`}
            >
              {statusIcon}
              {status}
            </span>

            {status === 'approved' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-4 h-4" />
                Verified Bureau
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link
            href="/profiles/new"
            className="flex items-center gap-4 p-5 rounded-xl border border-dashed border-green-300 bg-green-50/40 hover:bg-green-50 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-700" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">Upload Profile</p>
              <p className="text-sm text-slate-500">Add new bride/groom</p>
            </div>
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">Search Profiles</p>
              <p className="text-sm text-slate-500">Find network profiles</p>
            </div>
          </Link>

          <Link
            href="/profiles"
            className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-700" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">My Profiles</p>
              <p className="text-sm text-slate-500">Manage uploaded profiles</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
