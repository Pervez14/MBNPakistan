'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Heart,
  Home,
  ImageIcon,
  Languages,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Printer,
  RefreshCcw,
  Ruler,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MarriageProfile = {
  id: string;
  created_by: string | null;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  date_of_birth: string | null;
  marital_status: string | null;
  height: string | null;
  religion: string | null;
  sect: string | null;
  caste: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  nationality: string | null;
  residence_status: string | null;
  education: string | null;
  profession: string | null;
  employment_status: string | null;
  job_type: string | null;
  industry: string | null;
  income_range: string | null;
  complexion: string | null;
  body_type: string | null;
  languages: string | null;
  siblings: string | null;
  total_siblings: number | null;
  brothers_count: number | null;
  sisters_count: number | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  family_details: string | null;
  expected_partner_age: string | null;
  expected_partner_location: string | null;
  expected_partner_education: string | null;
  requirements: string | null;
  additional_notes: string | null;
  photo_url: string | null;
  photo_url_2: string | null;
  photo_visibility: string | null;
  bureau_email: string | null;
  status: string | null;
  created_at: string | null;
};

type BureauSummary = {
  business_name: string | null;
  full_name: string | null;
  city: string | null;
  province: string | null;
  status: string | null;
};

type ContactDetails = {
  business_name: string | null;
  full_name: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  office_phone: string | null;
  email: string | null;
  city: string | null;
  province: string | null;
};

const SHORTLIST_KEY = 'mbn-profile-shortlist-v1';

function formatDate(value: string | null) {
  if (!value) return 'Not available';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

function formatLabel(value: string | null | undefined) {
  if (!value) return 'Not provided';
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function profileCompleteness(profile: MarriageProfile) {
  const checks = [
    profile.gender,
    profile.age,
    profile.marital_status,
    profile.height,
    profile.religion,
    profile.sect,
    profile.caste,
    profile.city,
    profile.province,
    profile.education,
    profile.profession,
    profile.employment_status,
    profile.family_details,
    profile.expected_partner_age,
    profile.expected_partner_location,
    profile.requirements,
    profile.photo_url,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function getWhatsAppLink(number: string | null) {
  if (!number) return '';
  let digits = number.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

function privacyLabel(value: string | null) {
  if (value === 'hidden') return 'Photo hidden in network search';
  if (value === 'blurred') return 'Photo blurred in network search';
  return 'Photo visible to approved network users';
}

function displayTitle(profile: MarriageProfile, isOwner: boolean) {
  if (isOwner && profile.candidate_name) return profile.candidate_name;
  const gender = profile.gender === 'Female' ? 'Bride' : profile.gender === 'Male' ? 'Groom' : 'Marriage';
  return `${gender} Profile`;
}

function Badge({
  children,
  tone = 'slate',
}: {
  children: ReactNode;
  tone?: 'green' | 'blue' | 'amber' | 'purple' | 'slate' | 'red';
}) {
  const styles = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
    red: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${styles[tone]}`}>
      {children}
    </span>
  );
}

function InfoTile({
  icon,
  label,
  urdu,
  value,
}: {
  icon: ReactNode;
  label: string;
  urdu?: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === '') return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">{label}</p>
          {urdu && <p dir="rtl" className="mt-0.5 text-[11px] text-slate-400">{urdu}</p>}
          <p className="mt-1 break-words text-sm font-black text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  urdu,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  urdu: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 md:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            <p dir="rtl" className="mt-0.5 text-sm font-semibold text-emerald-700/75">{urdu}</p>
            {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-5 md:p-7">{children}</div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | null;
  href?: string;
  external?: boolean;
}) {
  if (!value) return null;

  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700/60">{label}</p>
        <p className="mt-0.5 break-all text-sm font-black text-emerald-950">{value}</p>
      </div>
      {href && <ExternalLink className="ml-auto h-4 w-4 flex-shrink-0 text-emerald-600" />}
    </div>
  );

  if (!href) return <div className="rounded-2xl bg-white/75 p-3">{content}</div>;

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="block rounded-2xl bg-white/75 p-3 transition hover:bg-white hover:shadow-sm"
    >
      {content}
    </a>
  );
}

export default function ProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const profileId = params.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MarriageProfile | null>(null);
  const [bureau, setBureau] = useState<BureauSummary | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const [shortlisted, setShortlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRevealConfirmation, setShowRevealConfirmation] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState('');
  const [contact, setContact] = useState<ContactDetails | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view this profile.');
      }

      setCurrentUserId(user.id);

      const { data: application, error: applicationError } = await supabase
        .from('bureau_applications')
        .select('status')
        .ilike('email', user.email)
        .maybeSingle();

      if (applicationError) throw applicationError;
      if (!application || application.status !== 'approved') {
        throw new Error('Your bureau account must be approved before viewing network profiles.');
      }

      const { data, error } = await supabase
        .from('marriage_profiles')
        .select(
          `
          id,
          created_by,
          profile_code,
          candidate_name,
          gender,
          age,
          date_of_birth,
          marital_status,
          height,
          religion,
          sect,
          caste,
          city,
          province,
          country,
          nationality,
          residence_status,
          education,
          profession,
          employment_status,
          job_type,
          industry,
          income_range,
          complexion,
          body_type,
          languages,
          siblings,
          total_siblings,
          brothers_count,
          sisters_count,
          father_occupation,
          mother_occupation,
          family_details,
          expected_partner_age,
          expected_partner_location,
          expected_partner_education,
          requirements,
          additional_notes,
          photo_url,
          photo_url_2,
          photo_visibility,
          bureau_email,
          status,
          created_at
        `
        )
        .eq('id', profileId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('This profile could not be found or you do not have permission to view it.');

      const loadedProfile = data as MarriageProfile;
      if (loadedProfile.status !== 'active' && loadedProfile.created_by !== user.id) {
        throw new Error('This profile is not currently active in the MBN network.');
      }

      setProfile(loadedProfile);

      if (loadedProfile.bureau_email) {
        const { data: bureauData } = await supabase
          .from('bureau_applications')
          .select('business_name, full_name, city, province, status')
          .ilike('email', loadedProfile.bureau_email)
          .maybeSingle();

        setBureau((bureauData as BureauSummary | null) || null);
      }

      try {
        const saved = window.localStorage.getItem(SHORTLIST_KEY);
        const shortlist = saved ? (JSON.parse(saved) as string[]) : [];
        setShortlisted(shortlist.includes(profileId));
      } catch {
        setShortlisted(false);
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Profile could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const isOwner = Boolean(profile && profile.created_by === currentUserId);
  const photos = useMemo(
    () => [profile?.photo_url, profile?.photo_url_2].filter(Boolean) as string[],
    [profile]
  );
  const canSeeClearPhoto = isOwner || profile?.photo_visibility === 'visible';
  const photoHidden = !isOwner && profile?.photo_visibility === 'hidden';
  const photoBlurred = !isOwner && profile?.photo_visibility === 'blurred';
  const completeness = profile ? profileCompleteness(profile) : 0;

  const toggleShortlist = () => {
    if (!profile) return;

    try {
      const saved = window.localStorage.getItem(SHORTLIST_KEY);
      const current = saved ? (JSON.parse(saved) as string[]) : [];
      const next = current.includes(profile.id)
        ? current.filter((id) => id !== profile.id)
        : [...current, profile.id];
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      setShortlisted(next.includes(profile.id));
    } catch {
      setShortlisted((value) => !value);
    }
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const revealContact = async () => {
    if (!profile) return;

    try {
      setRevealLoading(true);
      setRevealError('');

      const { data, error } = await supabase.rpc('reveal_profile_contact', {
        p_profile_id: profile.id,
      });

      if (error) throw error;

      const revealed = Array.isArray(data) ? data[0] : data;
      if (!revealed) throw new Error('Uploader contact details are not available.');

      setContact(revealed as ContactDetails);
      setShowRevealConfirmation(false);
    } catch (error: unknown) {
      setRevealError(
        error instanceof Error
          ? error.message
          : 'Contact details could not be revealed. Please try again.'
      );
    } finally {
      setRevealLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1450px] space-y-6 pb-12">
        <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-[340px] animate-pulse rounded-[32px] bg-slate-200" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[28px] bg-slate-200" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-[28px] bg-slate-200" />
        </div>
      </div>
    );
  }

  if (errorMessage || !profile) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-red-950">Profile unavailable</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-800/80">{errorMessage}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">
              <ArrowLeft className="h-4 w-4" /> Back to search
            </Link>
            <button type="button" onClick={loadProfile} className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-700 hover:bg-red-100">
              <RefreshCcw className="h-4 w-4" /> Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = displayTitle(profile, isOwner);
  const location = [profile.city, profile.province, profile.country].filter(Boolean).join(', ');
  const bureauName = bureau?.business_name || bureau?.full_name || 'MBN network bureau';
  const whatsappLink = getWhatsAppLink(contact?.whatsapp_number || null);

  return (
    <div className="mx-auto max-w-[1450px] space-y-6 pb-12 print:max-w-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to results
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {!isOwner && (
            <button
              type="button"
              onClick={toggleShortlist}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${shortlisted ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'}`}
            >
              <Heart className={`h-4 w-4 ${shortlisted ? 'fill-current' : ''}`} />
              {shortlisted ? 'Shortlisted' : 'Shortlist'}
            </button>
          )}
          <button
            type="button"
            onClick={copyProfileLink}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          {isOwner && (
            <Link
              href={`/profiles/${profile.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
            >
              <Pencil className="h-4 w-4" /> Edit profile
            </Link>
          )}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#073b2a] via-[#0b5d3d] to-[#168a58] text-white shadow-xl shadow-emerald-950/10">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-200/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="relative min-h-[320px] overflow-hidden bg-emerald-950/30 lg:min-h-[420px]">
            {photos.length > 0 && !photoHidden ? (
              <>
                <img
                  src={photos[activePhoto] || photos[0]}
                  alt={profile.profile_code || 'Marriage profile'}
                  className={`absolute inset-0 h-full w-full object-cover object-top ${photoBlurred ? 'scale-110 blur-2xl' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-transparent" />
                {photoBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-2xl border border-white/20 bg-emerald-950/55 px-5 py-4 text-center backdrop-blur">
                      <EyeOff className="mx-auto h-7 w-7 text-emerald-100" />
                      <p className="mt-2 text-sm font-black">Photo blurred for privacy</p>
                      <p dir="rtl" className="mt-1 text-xs text-emerald-100/75">تصویر رازداری کے لیے دھندلی ہے</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.22),_rgba(6,78,59,0.9)_65%)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                  <UserRound className="h-11 w-11 text-emerald-100" />
                </div>
                <p className="mt-4 font-black text-emerald-50">Photo protected by profile owner</p>
                <p dir="rtl" className="mt-1 text-sm text-emerald-100/70">تصویر رازداری کی وجہ سے محفوظ ہے</p>
              </div>
            )}

            {photos.length > 1 && !photoHidden && (
              <div className="absolute bottom-4 left-4 flex gap-2 print:hidden">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`h-14 w-14 overflow-hidden rounded-xl border-2 bg-white/15 backdrop-blur transition ${activePhoto === index ? 'border-white shadow-lg' : 'border-white/35 opacity-75 hover:opacity-100'}`}
                  >
                    <img src={photo} alt="" className={`h-full w-full object-cover object-top ${photoBlurred ? 'blur-sm' : ''}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex flex-col justify-center px-6 py-8 md:px-9 lg:py-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black tracking-wide text-emerald-50 backdrop-blur">
                <FileText className="h-4 w-4" /> {profile.profile_code || 'Profile code pending'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black text-emerald-50 backdrop-blur">
                <ShieldCheck className="h-4 w-4" /> Privacy controlled
              </span>
              {isOwner && (
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-400/15 px-3 py-1.5 text-xs font-black text-blue-50 backdrop-blur">
                  <BadgeCheck className="h-4 w-4" /> Your bureau profile
                </span>
              )}
            </div>

            <h1 className="mt-5 font-heading text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-3 text-lg font-bold text-emerald-50/90">
              {[profile.age ? `${profile.age} years` : null, profile.gender, profile.marital_status].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-100/80">
              <MapPin className="h-4 w-4" /> {location || 'Location not provided'}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroFact label="Education" value={profile.education} />
              <HeroFact label="Profession" value={profile.profession} />
              <HeroFact label="Height" value={profile.height} />
              <HeroFact label="Community" value={profile.caste} />
            </div>

            <div className="mt-7 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-50">
                <span>Profile information completeness</span>
                <span>{completeness}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-200 to-white" style={{ width: `${completeness}%` }} />
              </div>
              <p dir="rtl" className="mt-2 text-xs text-emerald-100/65">پروفائل کی دستیاب معلومات</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <main className="min-w-0 space-y-6">
          <DetailSection
            icon={<UserRound className="h-5 w-5" />}
            title="Personal Overview"
            urdu="ذاتی معلومات"
            description="Core details provided for initial matrimonial screening."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile icon={<UserRound className="h-4 w-4" />} label="Gender" urdu="جنس" value={profile.gender} />
              <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Age" urdu="عمر" value={profile.age ? `${profile.age} years` : null} />
              <InfoTile icon={<Heart className="h-4 w-4" />} label="Marital status" urdu="ازدواجی حیثیت" value={profile.marital_status} />
              <InfoTile icon={<Ruler className="h-4 w-4" />} label="Height" urdu="قد" value={profile.height} />
              <InfoTile icon={<Sparkles className="h-4 w-4" />} label="Complexion" urdu="رنگت" value={profile.complexion} />
              <InfoTile icon={<UserRound className="h-4 w-4" />} label="Body type" urdu="جسمانی ساخت" value={profile.body_type} />
              <InfoTile icon={<ShieldCheck className="h-4 w-4" />} label="Religion" urdu="مذہب" value={profile.religion} />
              <InfoTile icon={<UsersRound className="h-4 w-4" />} label="Sect" urdu="مسلک" value={profile.sect} />
              <InfoTile icon={<UsersRound className="h-4 w-4" />} label="Caste / community" urdu="برادری" value={profile.caste} />
              <InfoTile icon={<Languages className="h-4 w-4" />} label="Languages" urdu="زبانیں" value={profile.languages} />
            </div>
          </DetailSection>

          <DetailSection
            icon={<MapPin className="h-5 w-5" />}
            title="Location & Residence"
            urdu="مقام اور رہائش"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="City" urdu="شہر" value={profile.city} />
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Province / region" urdu="صوبہ یا خطہ" value={profile.province} />
              <InfoTile icon={<Home className="h-4 w-4" />} label="Country" urdu="ملک" value={profile.country} />
              <InfoTile icon={<BadgeCheck className="h-4 w-4" />} label="Nationality" urdu="قومیت" value={profile.nationality} />
              <InfoTile icon={<Home className="h-4 w-4" />} label="Residence status" urdu="رہائشی حیثیت" value={profile.residence_status} />
            </div>
          </DetailSection>

          <DetailSection
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Education & Career"
            urdu="تعلیم اور پیشہ"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile icon={<GraduationCap className="h-4 w-4" />} label="Education" urdu="تعلیم" value={profile.education} />
              <InfoTile icon={<BriefcaseBusiness className="h-4 w-4" />} label="Profession" urdu="پیشہ" value={profile.profession} />
              <InfoTile icon={<Building2 className="h-4 w-4" />} label="Employment" urdu="ملازمت" value={profile.employment_status} />
              <InfoTile icon={<Clipboard className="h-4 w-4" />} label="Job type" urdu="ملازمت کی نوعیت" value={profile.job_type} />
              <InfoTile icon={<Building2 className="h-4 w-4" />} label="Industry" urdu="شعبہ" value={profile.industry} />
              <InfoTile icon={<Sparkles className="h-4 w-4" />} label="Income range" urdu="آمدنی کی حد" value={profile.income_range} />
            </div>
          </DetailSection>

          <DetailSection
            icon={<UsersRound className="h-5 w-5" />}
            title="Family Background"
            urdu="خاندانی پس منظر"
            description="Family information is shown as provided and should be independently verified."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile icon={<UsersRound className="h-4 w-4" />} label="Siblings" urdu="بہن بھائی" value={profile.siblings} />
              <InfoTile icon={<UsersRound className="h-4 w-4" />} label="Total siblings" urdu="کل بہن بھائی" value={profile.total_siblings} />
              <InfoTile icon={<UserRound className="h-4 w-4" />} label="Brothers" urdu="بھائی" value={profile.brothers_count} />
              <InfoTile icon={<UserRound className="h-4 w-4" />} label="Sisters" urdu="بہنیں" value={profile.sisters_count} />
              <InfoTile icon={<BriefcaseBusiness className="h-4 w-4" />} label="Father's occupation" urdu="والد کا پیشہ" value={profile.father_occupation} />
              <InfoTile icon={<BriefcaseBusiness className="h-4 w-4" />} label="Mother's occupation" urdu="والدہ کا پیشہ" value={profile.mother_occupation} />
            </div>

            {profile.family_details && (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Family introduction</p>
                <p dir="rtl" className="mt-1 text-xs text-slate-400">خاندان کا تعارف</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{profile.family_details}</p>
              </div>
            )}
          </DetailSection>

          <DetailSection
            icon={<Heart className="h-5 w-5" />}
            title="Partner Preferences"
            urdu="شریکِ حیات کے لیے ترجیحات"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Preferred age" urdu="ترجیحی عمر" value={profile.expected_partner_age} />
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Preferred location" urdu="ترجیحی مقام" value={profile.expected_partner_location} />
              <InfoTile icon={<GraduationCap className="h-4 w-4" />} label="Preferred education" urdu="ترجیحی تعلیم" value={profile.expected_partner_education} />
            </div>

            {profile.requirements ? (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">Additional requirements</p>
                <p dir="rtl" className="mt-1 text-xs text-emerald-700/65">مزید ترجیحات</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-950/80">{profile.requirements}</p>
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No additional partner requirements were provided.</p>
            )}
          </DetailSection>

          {profile.additional_notes && (
            <DetailSection icon={<FileText className="h-5 w-5" />} title="Additional Profile Notes" urdu="اضافی معلومات">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{profile.additional_notes}</p>
            </DetailSection>
          )}

          <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-700" />
              <div>
                <p className="font-black text-amber-950">Independent verification remains essential</p>
                <p className="mt-2 text-sm leading-6 text-amber-900/75">
                  MBN structures profile information and contact accountability, but it does not replace family meetings, identity checks, references or professional due diligence.
                </p>
                <p dir="rtl" className="mt-2 text-sm leading-6 text-amber-900/70">
                  حتمی فیصلے سے پہلے شناخت، خاندانی حوالہ جات اور تمام اہم معلومات کی آزادانہ تصدیق ضروری ہے۔
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">Profile custodian</p>
                  <h2 className="mt-2 text-lg font-black text-slate-900">{bureauName}</h2>
                  <p dir="rtl" className="mt-1 text-sm text-slate-500">پروفائل جمع کرنے والا بیورو</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {bureau?.status === 'approved' ? (
                  <Badge tone="green"><BadgeCheck className="mr-1 h-3.5 w-3.5" /> Approved bureau</Badge>
                ) : (
                  <Badge tone="slate">MBN network profile</Badge>
                )}
                {(bureau?.city || bureau?.province) && (
                  <Badge tone="blue"><MapPin className="mr-1 h-3.5 w-3.5" /> {[bureau.city, bureau.province].filter(Boolean).join(', ')}</Badge>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 p-5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
                  <div>
                    <p className="font-black text-slate-900">Contact details are protected</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Revealing the uploader bureau's contact creates an accountability log for administrative review.
                    </p>
                    <p dir="rtl" className="mt-1 text-xs leading-5 text-slate-400">
                      رابطہ دیکھنے کا ریکارڈ انتظامی نگرانی کے لیے محفوظ کیا جائے گا۔
                    </p>
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 text-blue-700" />
                    <div>
                      <p className="font-black text-blue-950">This profile belongs to your bureau</p>
                      <p className="mt-1 text-sm leading-6 text-blue-800/75">Update information or privacy settings from the edit page.</p>
                      <Link href={`/profiles/${profile.id}/edit`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800">
                        <Pencil className="h-4 w-4" /> Edit this profile
                      </Link>
                    </div>
                  </div>
                </div>
              ) : contact ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="font-black text-emerald-950">Contact revealed securely</p>
                      <p className="mt-1 text-xs leading-5 text-emerald-800/70">This access has been recorded in the contact-view log.</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <ContactRow icon={<Building2 className="h-4 w-4" />} label="Bureau" value={contact.business_name} />
                    <ContactRow icon={<UserRound className="h-4 w-4" />} label="Contact person" value={contact.full_name} />
                    <ContactRow icon={<Phone className="h-4 w-4" />} label="Mobile" value={contact.mobile_number} href={contact.mobile_number ? `tel:${contact.mobile_number}` : undefined} />
                    <ContactRow icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" value={contact.whatsapp_number} href={whatsappLink || undefined} external />
                    <ContactRow icon={<Phone className="h-4 w-4" />} label="Office phone" value={contact.office_phone} href={contact.office_phone ? `tel:${contact.office_phone}` : undefined} />
                    <ContactRow icon={<Mail className="h-4 w-4" />} label="Email" value={contact.email} href={contact.email ? `mailto:${contact.email}` : undefined} />
                    <ContactRow icon={<MapPin className="h-4 w-4" />} label="Location" value={[contact.city, contact.province].filter(Boolean).join(', ') || null} />
                  </div>
                </div>
              ) : (
                <>
                  {revealError && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {revealError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setRevealError('');
                      setShowRevealConfirmation(true);
                    }}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                  >
                    <Eye className="h-4 w-4" /> Reveal bureau contact
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-slate-900">Privacy status</p>
                <p dir="rtl" className="text-xs text-slate-400">رازداری کی حیثیت</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">{privacyLabel(profile.photo_visibility)}</p>
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
              <SideFact label="Profile status" value={formatLabel(profile.status)} />
              <SideFact label="Added to network" value={formatDate(profile.created_at)} />
              <SideFact label="Profile code" value={profile.profile_code || 'Pending'} />
            </div>
          </div>

          <Link
            href="/search"
            className="group flex items-center justify-between rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 transition hover:bg-emerald-100"
          >
            <div>
              <p className="font-black text-emerald-950">Continue searching</p>
              <p className="mt-1 text-xs text-emerald-800/65">Return to filtered profile results</p>
            </div>
            <ChevronRight className="h-5 w-5 text-emerald-700 transition group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>

      {showRevealConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() => !revealLoading && setShowRevealConfirmation(false)}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-[#073b2a] to-[#168a58] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Reveal bureau contact?</h2>
                    <p dir="rtl" className="mt-1 text-sm text-emerald-100/75">کیا آپ بیورو کا رابطہ دیکھنا چاہتے ہیں؟</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !revealLoading && setShowRevealConfirmation(false)}
                  className="rounded-xl bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 text-slate-600">
                This action will reveal the profile uploader's professional contact details and create a contact-view log containing your bureau identity, profile reference and access time.
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                  <div>
                    <p className="font-black text-amber-950">Use contact information responsibly</p>
                    <p className="mt-1 text-sm leading-6 text-amber-900/75">Only contact the uploader for genuine matrimonial coordination. Do not copy, distribute or use the information for unrelated purposes.</p>
                  </div>
                </div>
              </div>

              {revealError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {revealError}
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowRevealConfirmation(false)}
                  disabled={revealLoading}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={revealContact}
                  disabled={revealLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-65"
                >
                  {revealLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  {revealLoading ? 'Revealing…' : 'Confirm and reveal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroFact({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-100/65">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value || 'Not provided'}</p>
    </div>
  );
}

function SideFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-800">{value}</span>
    </div>
  );
}
