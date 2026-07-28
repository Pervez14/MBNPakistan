'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleOff,
  Eye,
  EyeOff,
  FileText,
  Filter,
  HeartHandshake,
  ImageIcon,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  marital_status: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  education: string | null;
  profession: string | null;
  caste: string | null;
  sect: string | null;
  photo_url: string | null;
  photo_visibility: string | null;
  status: string | null;
  removal_reason: string | null;
  removal_notes: string | null;
  removed_at: string | null;
  created_at: string | null;
};

type RemovalReason = {
  value: string;
  label: string;
  urdu: string;
  description: string;
  icon: ReactNode;
};

const REMOVAL_REASONS: RemovalReason[] = [
  {
    value: 'match_made',
    label: 'Match Made / Rishta Done',
    urdu: 'رشتہ طے ہو گیا',
    description: 'The candidate has successfully finalised a matrimonial match.',
    icon: <HeartHandshake className="h-5 w-5" />,
  },
  {
    value: 'client_withdrew',
    label: 'Client Withdrew Profile',
    urdu: 'کلائنٹ نے پروفائل واپس لے لیا',
    description: 'The candidate or family no longer wants the profile in circulation.',
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    value: 'duplicate_profile',
    label: 'Duplicate Profile',
    urdu: 'پروفائل کی دوسری نقل موجود ہے',
    description: 'Another active record already represents the same candidate.',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    value: 'information_outdated',
    label: 'Information Outdated',
    urdu: 'معلومات پرانی ہو گئی ہیں',
    description: 'The profile needs major updates before it should remain searchable.',
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    value: 'privacy_request',
    label: 'Privacy Request',
    urdu: 'رازداری کی درخواست',
    description: 'The candidate or family requested removal for privacy reasons.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    value: 'incorrect_information',
    label: 'Incorrect Information',
    urdu: 'غلط معلومات درج ہیں',
    description: 'Important information is inaccurate and requires correction.',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    value: 'temporarily_unavailable',
    label: 'Temporarily Unavailable',
    urdu: 'عارضی طور پر دستیاب نہیں',
    description: 'The profile should be paused and may be reactivated later.',
    icon: <CircleOff className="h-5 w-5" />,
  },
  {
    value: 'other',
    label: 'Other Reason',
    urdu: 'کوئی اور وجہ',
    description: 'Select this and provide a clear explanation below.',
    icon: <Sparkles className="h-5 w-5" />,
  },
];

function formatDate(value: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatReason(value: string | null) {
  return REMOVAL_REASONS.find((reason) => reason.value === value)?.label || 'Not specified';
}

export default function MyProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const [removalProfile, setRemovalProfile] = useState<MarriageProfile | null>(null);
  const [removalReason, setRemovalReason] = useState('');
  const [removalNotes, setRemovalNotes] = useState('');
  const [modalError, setModalError] = useState('');

  const loadProfiles = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error('Please login again to view your profiles.');

      const { data, error } = await supabase
        .from('marriage_profiles')
        .select(`
          id, profile_code, candidate_name, gender, age, marital_status,
          city, province, country, education, profession, caste, sect,
          photo_url, photo_visibility, status, removal_reason, removal_notes,
          removed_at, created_at
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data || []) as MarriageProfile[]);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Profiles could not be loaded.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const counts = useMemo(() => {
    const active = profiles.filter((profile) => profile.status === 'active').length;
    const inactive = profiles.filter((profile) => profile.status !== 'active').length;
    const matched = profiles.filter((profile) => profile.removal_reason === 'match_made').length;
    const protectedPhotos = profiles.filter((profile) => profile.photo_visibility !== 'visible').length;
    return { total: profiles.length, active, inactive, matched, protectedPhotos };
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return profiles.filter((profile) => {
      if (statusFilter !== 'all') {
        const isActive = profile.status === 'active';
        if (statusFilter === 'active' && !isActive) return false;
        if (statusFilter === 'inactive' && isActive) return false;
      }
      if (genderFilter !== 'all' && profile.gender !== genderFilter) return false;
      if (!search) return true;
      return [
        profile.profile_code,
        profile.candidate_name,
        profile.gender,
        profile.age,
        profile.marital_status,
        profile.city,
        profile.province,
        profile.education,
        profile.profession,
        profile.caste,
        profile.sect,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [profiles, keyword, statusFilter, genderFilter]);

  const openRemovalModal = (profile: MarriageProfile) => {
    setRemovalProfile(profile);
    setRemovalReason('');
    setRemovalNotes('');
    setModalError('');
  };

  const closeRemovalModal = () => {
    if (actionLoading) return;
    setRemovalProfile(null);
    setRemovalReason('');
    setRemovalNotes('');
    setModalError('');
  };

  const deactivateProfile = async () => {
    if (!removalProfile) return;
    if (!removalReason) {
      setModalError('Please select a removal reason.');
      return;
    }
    if (removalReason === 'other' && removalNotes.trim().length < 5) {
      setModalError('Please provide a clear explanation for Other Reason.');
      return;
    }

    try {
      setActionLoading(removalProfile.id);
      setModalError('');
      const { error } = await supabase.rpc('deactivate_my_profile', {
        p_profile_id: removalProfile.id,
        p_reason: removalReason,
        p_notes: removalNotes.trim() || null,
      });
      if (error) throw error;
      closeRemovalModal();
      await loadProfiles(true);
    } catch (error: unknown) {
      setModalError(error instanceof Error ? error.message : 'Profile could not be removed.');
    } finally {
      setActionLoading('');
    }
  };

  const reactivateProfile = async (profile: MarriageProfile) => {
    const confirmed = window.confirm(
      `Reactivate ${profile.profile_code || 'this profile'} and return it to network search?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(profile.id);
      setErrorMessage('');
      const { error } = await supabase.rpc('reactivate_my_profile', {
        p_profile_id: profile.id,
      });
      if (error) throw error;
      await loadProfiles(true);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Profile could not be reactivated.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1500px] space-y-6 pb-12">
        <div className="h-64 animate-pulse rounded-[34px] bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[26px] bg-slate-200" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-[30px] bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#073b2a] via-[#0b5d3d] to-[#168a58] px-6 py-8 text-white shadow-xl shadow-emerald-950/10 md:px-9 lg:px-11">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur">
              <UsersRound className="h-4 w-4" /> Bureau Profile Library
            </div>
            <h1 className="mt-5 font-heading text-3xl font-black tracking-tight md:text-5xl">Manage every profile with clarity</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80 md:text-base">
              Review active and paused profiles, update information, protect photos and record a mandatory reason whenever a profile leaves the active network.
            </p>
            <p dir="rtl" className="mt-2 max-w-2xl text-sm leading-7 text-emerald-100/65">
              اپنے تمام پروفائلز کو منظم کریں، معلومات اپڈیٹ کریں اور پروفائل غیر فعال کرتے وقت لازمی وجہ محفوظ کریں۔
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => loadProfiles(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black backdrop-blur transition hover:bg-white/15 disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link href="/profiles/new" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-lg transition hover:-translate-y-0.5">
              <Plus className="h-4 w-4" /> Add New Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Profiles" value={counts.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Active Network" value={counts.active} icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
        <StatCard label="Inactive / Removed" value={counts.inactive} icon={<CircleOff className="h-5 w-5" />} tone="amber" />
        <StatCard label="Matches Completed" value={counts.matched} icon={<HeartHandshake className="h-5 w-5" />} tone="purple" />
        <StatCard label="Protected Photos" value={counts.protectedPhotos} icon={<ShieldCheck className="h-5 w-5" />} tone="blue" />
      </section>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" /> {errorMessage}
        </div>
      )}

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by name, profile code, city, education or profession…"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-300">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / removed</option>
            </select>
            <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-300">
              <option value="all">All genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button type="button" onClick={() => setViewMode('cards')} className={`rounded-xl px-3 py-2 text-xs font-black ${viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Cards</button>
              <button type="button" onClick={() => setViewMode('compact')} className={`rounded-xl px-3 py-2 text-xs font-black ${viewMode === 'compact' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Compact</button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <p className="font-bold text-slate-600"><Filter className="mr-2 inline h-4 w-4" />Showing {filteredProfiles.length} of {profiles.length} profiles</p>
          {(keyword || statusFilter !== 'all' || genderFilter !== 'all') && (
            <button type="button" onClick={() => { setKeyword(''); setStatusFilter('all'); setGenderFilter('all'); }} className="font-black text-emerald-700 hover:text-emerald-800">Clear filters</button>
          )}
        </div>
      </section>

      {filteredProfiles.length === 0 ? (
        <section className="rounded-[30px] border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Search className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-black text-slate-900">No profiles match these filters</h2>
          <p className="mt-2 text-sm text-slate-500">Adjust the filters or add a new bureau profile.</p>
        </section>
      ) : viewMode === 'cards' ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              actionLoading={actionLoading === profile.id}
              onRemove={() => openRemovalModal(profile)}
              onReactivate={() => reactivateProfile(profile)}
            />
          ))}
        </section>
      ) : (
        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-5 py-4">Profile</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Career</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-emerald-50/30">
                    <td className="px-5 py-4"><p className="font-black text-slate-900">{profile.candidate_name || 'Unnamed Profile'}</p><p className="mt-1 text-xs text-slate-500">{profile.profile_code || 'Code pending'} · {profile.age || '—'} years</p></td>
                    <td className="px-5 py-4 text-sm text-slate-600">{[profile.city, profile.province].filter(Boolean).join(', ') || 'Not provided'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{profile.profession || profile.education || 'Not provided'}</td>
                    <td className="px-5 py-4"><StatusBadge active={profile.status === 'active'} /></td>
                    <td className="px-5 py-4"><div className="flex flex-wrap gap-2"><Link href={`/profiles/${profile.id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">View</Link><Link href={`/profiles/${profile.id}/edit`} className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-700 hover:bg-emerald-50">Edit</Link>{profile.status === 'active' ? <button type="button" onClick={() => openRemovalModal(profile)} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50">Remove</button> : <button type="button" onClick={() => reactivateProfile(profile)} className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-50">Reactivate</button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {removalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close removal dialog" onClick={closeRemovalModal} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 bg-gradient-to-br from-[#073b2a] to-[#168a58] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Trash2 className="h-6 w-6" /></div>
                  <div><h2 className="text-xl font-black">Remove profile from active network</h2><p dir="rtl" className="mt-1 text-sm text-emerald-100/75">پروفائل غیر فعال کرنے کی وجہ منتخب کریں</p></div>
                </div>
                <button type="button" onClick={closeRemovalModal} className="rounded-xl bg-white/10 p-2 hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-black text-slate-900">{removalProfile.candidate_name || 'Profile'} · {removalProfile.profile_code || 'Code pending'}</p>
                <p className="mt-1 text-sm text-slate-500">The record will be preserved but removed from active search results.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {REMOVAL_REASONS.map((reason) => (
                  <button key={reason.value} type="button" onClick={() => { setRemovalReason(reason.value); setModalError(''); }} className={`rounded-2xl border p-4 text-left transition ${removalReason === reason.value ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100' : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40'}`}>
                    <div className="flex items-start gap-3"><div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${removalReason === reason.value ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{reason.icon}</div><div><p className="font-black text-slate-900">{reason.label}</p><p dir="rtl" className="mt-0.5 text-xs font-semibold text-emerald-700">{reason.urdu}</p><p className="mt-2 text-xs leading-5 text-slate-500">{reason.description}</p></div></div>
                  </button>
                ))}
              </div>
              <label className="mt-5 block"><span className="text-sm font-black text-slate-800">Additional details <span className="font-semibold text-slate-400">(required for Other)</span></span><textarea value={removalNotes} onChange={(event) => setRemovalNotes(event.target.value)} rows={4} placeholder="Add a clear note for your records and Super Admin oversight…" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>
              {modalError && <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4" />{modalError}</div>}
              <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={closeRemovalModal} disabled={Boolean(actionLoading)} className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="button" onClick={deactivateProfile} disabled={Boolean(actionLoading)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-3.5 text-sm font-black text-white hover:bg-red-800 disabled:opacity-60">{actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}{actionLoading ? 'Removing…' : 'Confirm Profile Removal'}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, tone = 'slate' }: { label: string; value: number; icon: ReactNode; tone?: 'slate' | 'green' | 'amber' | 'purple' | 'blue' }) {
  const tones = { slate: 'bg-slate-100 text-slate-700', green: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700', purple: 'bg-purple-100 text-purple-700', blue: 'bg-blue-100 text-blue-700' };
  return <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-slate-950">{value}</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div></div></div>;
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleOff className="h-3.5 w-3.5" />}{active ? 'Active' : 'Inactive'}</span>;
}

function ProfileCard({ profile, actionLoading, onRemove, onReactivate }: { profile: MarriageProfile; actionLoading: boolean; onRemove: () => void; onReactivate: () => void }) {
  const active = profile.status === 'active';
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
        <div className="relative min-h-[210px] bg-gradient-to-br from-emerald-100 to-emerald-50">
          {profile.photo_url ? <img src={profile.photo_url} alt={profile.profile_code || 'Profile'} className={`absolute inset-0 h-full w-full object-cover object-top ${profile.photo_visibility === 'blurred' ? 'blur-xl scale-110' : ''}`} /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-700"><ImageIcon className="h-10 w-10" /><p className="mt-3 text-sm font-black">No profile photo</p></div>}
          {profile.photo_visibility === 'hidden' && <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/85 text-white"><div className="text-center"><EyeOff className="mx-auto h-7 w-7" /><p className="mt-2 text-xs font-black">Photo hidden</p></div></div>}
          <div className="absolute left-3 top-3"><StatusBadge active={active} /></div>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{profile.profile_code || 'Code pending'}</p><h2 className="mt-2 text-xl font-black text-slate-950">{profile.candidate_name || 'Unnamed Profile'}</h2><p className="mt-1 text-sm font-semibold text-slate-500">{[profile.age ? `${profile.age} years` : null, profile.gender, profile.marital_status].filter(Boolean).join(' · ')}</p></div><BadgeCheck className="h-5 w-5 text-emerald-600" /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><MiniFact icon={<MapPin className="h-4 w-4" />} label="Location" value={[profile.city, profile.province].filter(Boolean).join(', ') || 'Not provided'} /><MiniFact icon={<BriefcaseBusiness className="h-4 w-4" />} label="Profession" value={profile.profession || 'Not provided'} /><MiniFact icon={<FileText className="h-4 w-4" />} label="Education" value={profile.education || 'Not provided'} /><MiniFact icon={<ShieldCheck className="h-4 w-4" />} label="Photo Privacy" value={profile.photo_visibility === 'visible' ? 'Visible' : profile.photo_visibility === 'blurred' ? 'Blurred' : 'Hidden'} /></div>
          {!active && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-black text-amber-950">Removal reason: {formatReason(profile.removal_reason)}</p>{profile.removal_notes && <p className="mt-1 text-xs leading-5 text-amber-800/75">{profile.removal_notes}</p>}<p className="mt-2 text-xs text-amber-700">Removed {formatDate(profile.removed_at)}</p></div>}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5"><Link href={`/profiles/${profile.id}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-800"><Eye className="h-4 w-4" /> View Profile</Link><Link href={`/profiles/${profile.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"><Pencil className="h-4 w-4" /> Edit</Link>{active ? <button type="button" onClick={onRemove} disabled={actionLoading} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 className="h-4 w-4" /> Remove</button> : <button type="button" onClick={onReactivate} disabled={actionLoading} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-100 disabled:opacity-50">{actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Reactivate</button>}<Link href={`/profiles/${profile.id}`} className="ml-auto inline-flex items-center gap-1 text-xs font-black text-slate-500 hover:text-emerald-700">Details <ChevronRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </article>
  );
}

function MiniFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3"><div className="mt-0.5 text-emerald-700">{icon}</div><div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-700">{value}</p></div></div>;
}
