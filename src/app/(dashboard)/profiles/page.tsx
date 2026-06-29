'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Application = {
  business_name: string | null;
  status: string | null;
  city: string | null;
  province: string | null;
  created_at: string | null;
};

type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  city: string | null;
  province: string | null;
  caste: string | null;
  education: string | null;
  profession: string | null;
  photo_url: string | null;
  created_at: string | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [application, setApplication] = useState<Application | null>(null);
  const [myProfilesCount, setMyProfilesCount] = useState(0);
  const [networkProfilesCount, setNetworkProfilesCount] = useState(0);
  const [recentProfiles, setRecentProfiles] = useState<MarriageProfile[]>([]);

  useEffect(() => {
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

        const { data: applicationData } = await supabase
          .from('bureau_applications')
          .select('business_name, status, city, province, created_at')
          .eq('email', user.email)
          .maybeSingle();

        setApplication(applicationData || null);

        const { count: myCount, error: myCountError } = await supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id)
          .eq('status', 'active');

        if (myCountError) {
          throw myCountError;
        }

        setMyProfilesCount(myCount || 0);

        const { count: totalCount, error: totalCountError } = await supabase
          .from('marriage_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        if (totalCountError) {
          throw totalCountError;
        }

        setNetworkProfilesCount(totalCount || 0);

        const { data: recentData, error: recentError } = await supabase
          .from('marriage_profiles')
          .select(
            'id, profile_code, candidate_name, gender, age, city, province, caste, education, profession, photo_url, created_at'
          )
          .eq('created_by', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) {
          throw recentError;
        }

        setRecentProfiles((recentData || []) as MarriageProfile[]);
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
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : status === 'rejected' ? (
      <AlertCircle className="w-5 h-5 text-red-600" />
    ) : (
      <Clock className="w-5 h-5 text-amber-600" />
    );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-36 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-36 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Dashboard Error</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex mt-5 px-5 py-3 rounded-lg bg-green-700 text-white font-medium hover:bg-green-800"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Bureau Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {application?.business_name || 'Marriage Bureau'}.
          </p>
        </div>

        <Link
          href="/profiles/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 transition"
        >
          <UserPlus className="w-4 h-4" />
          Add Marriage Profile
        </Link>
      </div>

      {/* Status Notice */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          {statusIcon}
          <div>
            <p className="font-semibold text-slate-900">Account Status</p>
            <p className="text-sm text-slate-500 mt-1">
              Your bureau application status is currently{' '}
              <span className="font-semibold capitalize">{status}</span>.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusBadge}`}
        >
          {status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-700" />
          </div>

          <p className="text-sm text-slate-500">My Uploaded Profiles</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {myProfilesCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-sm text-slate-500">Network Active Profiles</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {networkProfilesCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>

          <p className="text-sm text-slate-500">Bureau Location</p>
          <p className="text-lg font-bold text-slate-900 mt-2">
            {application?.city || 'Not added'}
            {application?.province ? `, ${application.province}` : ''}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/profiles/new"
          className="bg-green-700 rounded-2xl p-6 text-white hover:bg-green-800 transition"
        >
          <UserPlus className="w-8 h-8 mb-4" />
          <p className="font-bold text-lg">Add New Profile</p>
          <p className="text-green-50 text-sm mt-1">
            Upload a new bride or groom profile.
          </p>
        </Link>

        <Link
          href="/profiles"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
        >
          <Users className="w-8 h-8 mb-4 text-green-700" />
          <p className="font-bold text-lg text-slate-900">My Profiles</p>
          <p className="text-slate-500 text-sm mt-1">
            View profiles uploaded by your bureau.
          </p>
        </Link>

        <Link
          href="/search"
          className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
        >
          <Search className="w-8 h-8 mb-4 text-amber-600" />
          <p className="font-bold text-lg text-slate-900">Search Network</p>
          <p className="text-slate-500 text-sm mt-1">
            Search profiles from other approved bureaus.
          </p>
        </Link>
      </div>

      {/* Recent Profiles */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Recent Uploaded Profiles
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Latest profiles added by your bureau.
            </p>
          </div>

          <Link
            href="/profiles"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProfiles.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No profiles uploaded yet
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Start by adding your first marriage profile.
            </p>

            <Link
              href="/profiles/new"
              className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-lg bg-green-700 text-white font-medium hover:bg-green-800"
            >
              <UserPlus className="w-4 h-4" />
              Add Profile
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentProfiles.map((profile) => (
              <div
                key={profile.id}
                className="p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.profile_code || 'Marriage profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {profile.profile_code ||
                        profile.candidate_name ||
                        'Marriage Profile'}
                    </p>

                    {profile.gender && (
                      <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                        {profile.gender}
                      </span>
                    )}

                    {profile.age && (
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                        {profile.age} years
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    {(profile.city || profile.province) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.city}
                        {profile.province ? `, ${profile.province}` : ''}
                      </span>
                    )}

                    {profile.education && (
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {profile.education}
                      </span>
                    )}

                    {profile.profession && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {profile.profession}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
