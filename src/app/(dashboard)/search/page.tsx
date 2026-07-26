'use client';

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Filter,
  GraduationCap,
  Heart,
  Home,
  ImageOff,
  Languages,
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
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

type Filters = {
  keyword: string;
  gender: string;
  ageMin: string;
  ageMax: string;
  province: string;
  city: string;
  maritalStatus: string;
  sect: string;
  caste: string;
  education: string;
  employmentStatus: string;
  residenceStatus: string;
  photoOnly: boolean;
};

type SortOption = 'newest' | 'age-asc' | 'age-desc' | 'profile-code';
type ViewMode = 'grid' | 'compact';

const emptyFilters: Filters = {
  keyword: '',
  gender: '',
  ageMin: '',
  ageMax: '',
  province: '',
  city: '',
  maritalStatus: '',
  sect: '',
  caste: '',
  education: '',
  employmentStatus: '',
  residenceStatus: '',
  photoOnly: false,
};

const maritalStatusOptions = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Khula',
];

const sectOptions = [
  'Sunni',
  'Shia',
  'Deobandi',
  'Barelvi',
  'Ahl-e-Hadith',
  'Salafi',
  'Ismaili',
  'Bohra',
  'Ahmadi',
  'Other',
  'Prefer not to say',
];

const casteOptions = [
  'Arain',
  'Awan',
  'Baloch',
  'Butt',
  'Chaudhry',
  'Durrani',
  'Gujjar',
  'Hashmi',
  'Jat',
  'Kashmiri',
  'Khan',
  'Khattak',
  'Malik',
  'Memon',
  'Mughal',
  'Pathan',
  'Qureshi',
  'Rajput',
  'Rana',
  'Rao',
  'Sheikh',
  'Siddiqui',
  'Syed',
  'Tareen',
  'Yousafzai',
  'Other',
];

const employmentOptions = [
  'Employed',
  'Self-employed',
  'Business Owner',
  'Government Job',
  'Private Job',
  'Student',
  'Unemployed',
  'Homemaker',
];

const residenceOptions = [
  'Living in Pakistan',
  'Permanent Resident Abroad',
  'Citizen Abroad',
  'Work Visa Abroad',
  'Student Visa Abroad',
  'Other',
];

const citiesByProvince: Record<string, string[]> = {
  Punjab: [
    'Lahore',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Gujranwala',
    'Sialkot',
    'Bahawalpur',
    'Sargodha',
    'Sheikhupura',
    'Rahim Yar Khan',
    'Jhang',
    'Gujrat',
    'Sahiwal',
    'Okara',
    'Kasur',
    'Dera Ghazi Khan',
    'Jhelum',
    'Chakwal',
    'Mianwali',
    'Vehari',
  ],
  Sindh: [
    'Karachi',
    'Hyderabad',
    'Sukkur',
    'Larkana',
    'Nawabshah',
    'Mirpur Khas',
    'Jacobabad',
    'Shikarpur',
    'Khairpur',
    'Dadu',
    'Thatta',
    'Badin',
  ],
  KPK: [
    'Peshawar',
    'Mardan',
    'Abbottabad',
    'Mingora',
    'Kohat',
    'Bannu',
    'Dera Ismail Khan',
    'Swabi',
    'Charsadda',
    'Nowshera',
    'Mansehra',
  ],
  Balochistan: [
    'Quetta',
    'Gwadar',
    'Turbat',
    'Khuzdar',
    'Chaman',
    'Sibi',
    'Zhob',
    'Loralai',
    'Dera Murad Jamali',
  ],
  Islamabad: ['Islamabad'],
  AJK: ['Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bagh', 'Bhimber'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Chilas', 'Ghizer', 'Astore'],
  Overseas: [
    'United Kingdom',
    'United Arab Emirates',
    'Saudi Arabia',
    'United States',
    'Canada',
    'Australia',
    'Other Overseas',
  ],
};

const provinceOptions = Object.keys(citiesByProvince);
const SHORTLIST_KEY = 'mbn-profile-shortlist-v1';

function formatDate(value: string | null) {
  if (!value) return 'Recently added';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Recently added';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function profileTitle(profile: MarriageProfile, isOwn: boolean) {
  if (isOwn && profile.candidate_name) return profile.candidate_name;
  if (profile.gender === 'Female') return 'Bride Profile';
  if (profile.gender === 'Male') return 'Groom Profile';
  return 'Marriage Profile';
}

function photoPrivacyLabel(value: string | null) {
  if (value === 'hidden') return 'Photo protected';
  if (value === 'blurred') return 'Privacy blurred';
  return 'Photo visible';
}

function activeFilterCount(filters: Filters) {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === 'photoOnly') return Boolean(value);
    return String(value).trim().length > 0;
  }).length;
}

function profileCompleteness(profile: MarriageProfile) {
  const checks = [
    profile.gender,
    profile.age,
    profile.marital_status,
    profile.city,
    profile.province,
    profile.education,
    profile.profession,
    profile.religion,
    profile.sect,
    profile.family_details,
    profile.requirements,
    profile.photo_url,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'green' | 'blue' | 'amber' | 'purple' | 'slate' }) {
  const tones = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Field({
  label,
  urdu,
  children,
}: {
  label: string;
  urdu?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </span>
      {urdu && (
        <span dir="rtl" className="-mt-1 mb-2 block text-xs font-medium text-slate-400">
          {urdu}
        </span>
      )}
      {children}
    </label>
  );
}

function SelectControl({
  name,
  value,
  onChange,
  children,
}: {
  name: keyof Filters;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  if (!value) return null;

  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <div className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function SearchProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentUserId, setCurrentUserId] = useState('');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SHORTLIST_KEY);
      if (saved) setShortlistedIds(JSON.parse(saved) as string[]);
    } catch {
      setShortlistedIds([]);
    }
  }, []);

  const updateFilter = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
  };

  const setQuickGender = (gender: string) => {
    setFilters((previous) => ({ ...previous, gender }));
  };

  const loadProfiles = async (activeFilters: Filters = filters) => {
    try {
      setSearching(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to search the MBN profile network.');
      }

      setCurrentUserId(user.id);

      const { data: application, error: applicationError } = await supabase
        .from('bureau_applications')
        .select('status')
        .ilike('email', user.email)
        .maybeSingle();

      if (applicationError) throw applicationError;

      if (!application || application.status !== 'approved') {
        throw new Error('Your bureau account must be approved before searching network profiles.');
      }

      let query = supabase
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
        .eq('status', 'active');

      if (activeFilters.gender) query = query.eq('gender', activeFilters.gender);
      if (activeFilters.province) query = query.eq('province', activeFilters.province);
      if (activeFilters.city) query = query.eq('city', activeFilters.city);
      if (activeFilters.maritalStatus) query = query.eq('marital_status', activeFilters.maritalStatus);
      if (activeFilters.sect) query = query.eq('sect', activeFilters.sect);
      if (activeFilters.caste) query = query.eq('caste', activeFilters.caste);
      if (activeFilters.employmentStatus) query = query.eq('employment_status', activeFilters.employmentStatus);
      if (activeFilters.residenceStatus) query = query.eq('residence_status', activeFilters.residenceStatus);
      if (activeFilters.ageMin) query = query.gte('age', Number(activeFilters.ageMin));
      if (activeFilters.ageMax) query = query.lte('age', Number(activeFilters.ageMax));
      if (activeFilters.photoOnly) query = query.not('photo_url', 'is', null);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      let result = (data || []) as MarriageProfile[];

      if (activeFilters.education.trim()) {
        const educationKeyword = activeFilters.education.toLowerCase().trim();
        result = result.filter((profile) =>
          (profile.education || '').toLowerCase().includes(educationKeyword)
        );
      }

      if (activeFilters.keyword.trim()) {
        const keyword = activeFilters.keyword.toLowerCase().trim();
        result = result.filter((profile) => {
          const searchableText = [
            profile.profile_code,
            profile.candidate_name,
            profile.city,
            profile.province,
            profile.country,
            profile.education,
            profile.profession,
            profile.employment_status,
            profile.job_type,
            profile.industry,
            profile.caste,
            profile.sect,
            profile.languages,
            profile.family_details,
            profile.requirements,
            profile.expected_partner_location,
            profile.expected_partner_education,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchableText.includes(keyword);
        });
      }

      setProfiles(result);
    } catch (error: unknown) {
      setProfiles([]);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Profiles could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    loadProfiles(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedProfiles = useMemo(() => {
    const result = [...profiles];

    if (sortBy === 'age-asc') {
      return result.sort((a, b) => (a.age ?? 999) - (b.age ?? 999));
    }

    if (sortBy === 'age-desc') {
      return result.sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
    }

    if (sortBy === 'profile-code') {
      return result.sort((a, b) =>
        (a.profile_code || '').localeCompare(b.profile_code || '')
      );
    }

    return result.sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [profiles, sortBy]);

  const activeCount = activeFilterCount(filters);
  const cityOptions = filters.province ? citiesByProvince[filters.province] || [] : [];

  const resetFilters = () => {
    setFilters(emptyFilters);
    setMobileFiltersOpen(false);
    loadProfiles(emptyFilters);
  };

  const removeFilter = (key: keyof Filters) => {
    const next = {
      ...filters,
      [key]: key === 'photoOnly' ? false : '',
      ...(key === 'province' ? { city: '' } : {}),
    } as Filters;
    setFilters(next);
    loadProfiles(next);
  };

  const toggleShortlist = (profileId: string) => {
    setShortlistedIds((previous) => {
      const next = previous.includes(profileId)
        ? previous.filter((id) => id !== profileId)
        : [...previous, profileId];

      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const activeChips = useMemo(() => {
    const chips: Array<{ key: keyof Filters; label: string }> = [];
    const labels: Partial<Record<keyof Filters, string>> = {
      keyword: filters.keyword ? `Keyword: ${filters.keyword}` : '',
      gender: filters.gender,
      ageMin: filters.ageMin ? `Age from ${filters.ageMin}` : '',
      ageMax: filters.ageMax ? `Age up to ${filters.ageMax}` : '',
      province: filters.province,
      city: filters.city,
      maritalStatus: filters.maritalStatus,
      sect: filters.sect,
      caste: filters.caste,
      education: filters.education ? `Education: ${filters.education}` : '',
      employmentStatus: filters.employmentStatus,
      residenceStatus: filters.residenceStatus,
      photoOnly: filters.photoOnly ? 'Profiles with photo' : '',
    };

    (Object.keys(labels) as Array<keyof Filters>).forEach((key) => {
      const label = labels[key];
      if (label) chips.push({ key, label });
    });

    return chips;
  }, [filters]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 pb-12">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#073b2a] via-[#0b5d3d] to-[#168a58] px-6 py-8 text-white shadow-xl shadow-emerald-950/10 md:px-9 md:py-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-50 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Private Bureau Network
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl">
              Search Marriage Profiles
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/85 md:text-base">
              Explore active profiles through structured filters, respectful privacy controls and a professional contact-reveal process.
            </p>
            <p dir="rtl" className="mt-2 max-w-2xl text-sm leading-7 text-emerald-100/75">
              منظم فلٹرز، رازداری کے اصولوں اور ذمہ دار رابطہ نظام کے ساتھ موزوں پروفائلز تلاش کریں۔
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[390px]">
            <HeroStat icon={<Users className="h-5 w-5" />} value={loading ? '—' : profiles.length} label="Results" />
            <HeroStat icon={<Heart className="h-5 w-5" />} value={shortlistedIds.length} label="Shortlisted" />
            <HeroStat icon={<ShieldCheck className="h-5 w-5" />} value="Private" label="Contact flow" />
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Search could not be completed</p>
            <p className="mt-1 text-sm leading-6 text-red-700">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => loadProfiles(filters)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
          >
            <RefreshCcw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      <div className="grid gap-7 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              setQuickGender={setQuickGender}
              cityOptions={cityOptions}
              activeCount={activeCount}
              searching={searching}
              onSearch={() => loadProfiles(filters)}
              onReset={resetFilters}
              setPhotoOnly={(value) => setFilters((previous) => ({ ...previous, photoOnly: value }))}
            />
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 xl:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-emerald-700 px-1.5 py-0.5 text-[10px] text-white">{activeCount}</span>
                )}
              </button>

              <div>
                <p className="font-bold text-slate-900">
                  {loading ? 'Loading profiles…' : `${sortedProfiles.length} active profile${sortedProfiles.length === 1 ? '' : 's'}`}
                </p>
                <p className="text-xs text-slate-500">Candidate names remain privacy-aware in network search.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="newest">Newest first</option>
                  <option value="age-asc">Age: low to high</option>
                  <option value="age-desc">Age: high to low</option>
                  <option value="profile-code">Profile code</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${viewMode === 'compact' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => removeFilter(chip.key)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5" />
                </button>
              ))}
              <button type="button" onClick={resetFilters} className="text-xs font-bold text-slate-500 hover:text-red-600">
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
                  <div className="h-56 animate-pulse bg-slate-200" />
                  <div className="space-y-4 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProfiles.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-black text-slate-900">No suitable profiles found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Broaden the age, location or education filters. A smaller number of precise filters often gives better results.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                <RefreshCcw className="h-4 w-4" /> Reset search
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-4'}>
              {sortedProfiles.map((profile) => (
                <ProfileResultCard
                  key={profile.id}
                  profile={profile}
                  compact={viewMode === 'compact'}
                  isOwn={profile.created_by === currentUserId}
                  shortlisted={shortlistedIds.includes(profile.id)}
                  onToggleShortlist={() => toggleShortlist(profile.id)}
                />
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
              <div>
                <p className="font-bold text-amber-950">Responsible matchmaking reminder</p>
                <p className="mt-1 text-sm leading-6 text-amber-900/75">
                  Profile information supports initial screening only. Independently verify identity, family information and compatibility before making any commitment.
                </p>
                <p dir="rtl" className="mt-1 text-sm leading-6 text-amber-900/70">
                  کسی بھی حتمی فیصلے سے پہلے شناخت، خاندانی معلومات اور مطابقت کی آزادانہ تصدیق ضرور کریں۔
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[30px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="font-black text-slate-900">Search filters</p>
                <p dir="rtl" className="text-xs text-slate-400">تلاش کو بہتر بنائیں</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-xl bg-slate-100 p-2 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              setQuickGender={setQuickGender}
              cityOptions={cityOptions}
              activeCount={activeCount}
              searching={searching}
              onSearch={() => {
                setMobileFiltersOpen(false);
                loadProfiles(filters);
              }}
              onReset={resetFilters}
              setPhotoOnly={(value) => setFilters((previous) => ({ ...previous, photoOnly: value }))}
              mobile
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HeroStat({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-emerald-100">{icon}<span className="text-xs font-semibold">{label}</span></div>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function FilterPanel({
  filters,
  updateFilter,
  setQuickGender,
  cityOptions,
  activeCount,
  searching,
  onSearch,
  onReset,
  setPhotoOnly,
  mobile = false,
}: {
  filters: Filters;
  updateFilter: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setQuickGender: (gender: string) => void;
  cityOptions: string[];
  activeCount: number;
  searching: boolean;
  onSearch: () => void;
  onReset: () => void;
  setPhotoOnly: (value: boolean) => void;
  mobile?: boolean;
}) {
  return (
    <div className={mobile ? 'p-5 pb-8' : ''}>
      {!mobile && (
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 font-black text-slate-900"><Filter className="h-4 w-4 text-emerald-700" /> Refine search</p>
              <p dir="rtl" className="mt-1 text-xs text-slate-400">موزوں پروفائل تلاش کریں</p>
            </div>
            {activeCount > 0 && <Badge tone="green">{activeCount} active</Badge>}
          </div>
        </div>
      )}

      <div className={mobile ? 'space-y-5' : 'space-y-5 p-5'}>
        <Field label="Keyword" urdu="نام، پیشہ، شہر یا پروفائل کوڈ">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="keyword"
              value={filters.keyword}
              onChange={updateFilter}
              placeholder="Profile code, profession, city…"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </Field>

        <Field label="Looking for" urdu="دلہا یا دلہن">
          <div className="grid grid-cols-3 gap-2">
            {[
              ['', 'All'],
              ['Male', 'Groom'],
              ['Female', 'Bride'],
            ].map(([value, label]) => (
              <button
                key={value || 'all'}
                type="button"
                onClick={() => setQuickGender(value)}
                className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition ${filters.gender === value ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Age range" urdu="عمر کی حد">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              min="18"
              max="80"
              name="ageMin"
              value={filters.ageMin}
              onChange={updateFilter}
              placeholder="Min"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
            <span className="text-slate-300">—</span>
            <input
              type="number"
              min="18"
              max="80"
              name="ageMax"
              value={filters.ageMax}
              onChange={updateFilter}
              placeholder="Max"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field label="Province / region" urdu="صوبہ یا خطہ">
            <SelectControl name="province" value={filters.province} onChange={updateFilter}>
              <option value="">All regions</option>
              {provinceOptions.map((province) => <option key={province} value={province}>{province}</option>)}
            </SelectControl>
          </Field>

          <Field label="City" urdu="شہر">
            {filters.province && cityOptions.length > 0 ? (
              <SelectControl name="city" value={filters.city} onChange={updateFilter}>
                <option value="">All cities</option>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </SelectControl>
            ) : (
              <input
                name="city"
                value={filters.city}
                onChange={updateFilter}
                placeholder="Type a city"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            )}
          </Field>
        </div>

        <Field label="Marital status" urdu="ازدواجی حیثیت">
          <SelectControl name="maritalStatus" value={filters.maritalStatus} onChange={updateFilter}>
            <option value="">Any status</option>
            {maritalStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </SelectControl>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field label="Sect" urdu="مسلک">
            <SelectControl name="sect" value={filters.sect} onChange={updateFilter}>
              <option value="">Any sect</option>
              {sectOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectControl>
          </Field>

          <Field label="Caste / community" urdu="برادری">
            <SelectControl name="caste" value={filters.caste} onChange={updateFilter}>
              <option value="">Any community</option>
              {casteOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </SelectControl>
          </Field>
        </div>

        <Field label="Education contains" urdu="تعلیم">
          <input
            name="education"
            value={filters.education}
            onChange={updateFilter}
            placeholder="MBBS, Master's, Engineering…"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </Field>

        <Field label="Employment" urdu="ملازمت یا کاروبار">
          <SelectControl name="employmentStatus" value={filters.employmentStatus} onChange={updateFilter}>
            <option value="">Any employment</option>
            {employmentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </SelectControl>
        </Field>

        <Field label="Residence status" urdu="رہائشی حیثیت">
          <SelectControl name="residenceStatus" value={filters.residenceStatus} onChange={updateFilter}>
            <option value="">Any residence</option>
            {residenceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </SelectControl>
        </Field>

        <button
          type="button"
          onClick={() => setPhotoOnly(!filters.photoOnly)}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${filters.photoOnly ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${filters.photoOnly ? 'bg-emerald-700 text-white' : 'bg-white text-slate-500'}`}>
              <ImageOff className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Profiles with photo</p>
              <p dir="rtl" className="text-xs text-slate-400">صرف تصویر والی پروفائلز</p>
            </div>
          </div>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${filters.photoOnly ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
            <Check className="h-3.5 w-3.5" />
          </div>
        </button>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
          <button
            type="button"
            onClick={onSearch}
            disabled={searching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-65"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {searching ? 'Searching…' : 'Search profiles'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Reset filters"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileResultCard({
  profile,
  compact,
  isOwn,
  shortlisted,
  onToggleShortlist,
}: {
  profile: MarriageProfile;
  compact: boolean;
  isOwn: boolean;
  shortlisted: boolean;
  onToggleShortlist: () => void;
}) {
  const location = [profile.city, profile.province, profile.country]
    .filter(Boolean)
    .join(', ');
  const title = profileTitle(profile, isOwn);
  const privacy = profile.photo_visibility || 'blurred';
  const completeness = profileCompleteness(profile);
  const photoVisible = Boolean(profile.photo_url) && privacy !== 'hidden';

  if (compact) {
    return (
      <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5">
        <div className="grid gap-0 sm:grid-cols-[170px_minmax(0,1fr)_190px]">
          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 sm:h-full">
            {photoVisible ? (
              <img
                src={profile.photo_url || ''}
                alt={profile.profile_code || 'Marriage profile'}
                className={`h-full w-full object-cover object-top ${!isOwn && privacy === 'blurred' ? 'scale-105 blur-lg' : ''}`}
              />
            ) : (
              <PhotoPlaceholder gender={profile.gender} />
            )}
            {!isOwn && privacy === 'blurred' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10">
                <Badge tone="slate"><ShieldCheck className="mr-1 h-3 w-3" /> Privacy blurred</Badge>
              </div>
            )}
          </div>

          <div className="min-w-0 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="green">{profile.profile_code || 'Profile pending code'}</Badge>
              {isOwn && <Badge tone="blue">Your profile</Badge>}
              <Badge>{photoPrivacyLabel(privacy)}</Badge>
            </div>
            <h2 className="mt-3 text-xl font-black text-slate-900">{title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {[profile.age ? `${profile.age} years` : null, profile.marital_status, location].filter(Boolean).join(' · ')}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Fact icon={<GraduationCap className="h-4 w-4" />} label="Education" value={profile.education} />
              <Fact icon={<BriefcaseBusiness className="h-4 w-4" />} label="Profession" value={profile.profession} />
              <Fact icon={<Building2 className="h-4 w-4" />} label="Employment" value={profile.employment_status} />
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-slate-100 bg-slate-50/70 p-5 sm:border-l sm:border-t-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Profile readiness</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${completeness}%` }} />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">{completeness}% information complete</p>
            </div>

            <div className="mt-5 space-y-2">
              <Link
                href={`/profiles/${profile.id}`}
                className="group/link inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                View full profile
                <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={onToggleShortlist}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${shortlisted ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700'}`}
              >
                <Heart className={`h-4 w-4 ${shortlisted ? 'fill-current' : ''}`} />
                {shortlisted ? 'Shortlisted' : 'Shortlist'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/7">
      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50">
        {photoVisible ? (
          <img
            src={profile.photo_url || ''}
            alt={profile.profile_code || 'Marriage profile'}
            className={`h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] ${!isOwn && privacy === 'blurred' ? 'scale-105 blur-xl' : ''}`}
          />
        ) : (
          <PhotoPlaceholder gender={profile.gender} />
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <Badge tone="green">{profile.profile_code || 'New profile'}</Badge>
          <button
            type="button"
            onClick={onToggleShortlist}
            aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition ${shortlisted ? 'border-rose-200 bg-rose-50/95 text-rose-600' : 'border-white/50 bg-white/85 text-slate-600 hover:text-rose-600'}`}
          >
            <Heart className={`h-4 w-4 ${shortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {!isOwn && privacy === 'blurred' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-black text-slate-700 shadow-lg backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-emerald-700" /> Privacy blurred
            </span>
          </div>
        )}

        {privacy === 'hidden' && (
          <div className="absolute bottom-4 left-4">
            <Badge tone="slate"><ShieldCheck className="mr-1 h-3 w-3" /> Photo protected</Badge>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {profile.gender && <Badge tone="green">{profile.gender}</Badge>}
          {profile.age && <Badge tone="blue">{profile.age} years</Badge>}
          {profile.marital_status && <Badge tone="amber">{profile.marital_status}</Badge>}
          {isOwn && <Badge tone="purple">Your profile</Badge>}
        </div>

        <h2 className="mt-3 text-xl font-black text-slate-900">{title}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
          <MapPin className="h-4 w-4 text-emerald-600" />
          {location || 'Location available in profile'}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Fact icon={<GraduationCap className="h-4 w-4" />} label="Education" value={profile.education} />
          <Fact icon={<BriefcaseBusiness className="h-4 w-4" />} label="Profession" value={profile.profession} />
          <Fact icon={<Building2 className="h-4 w-4" />} label="Employment" value={profile.employment_status} />
          <Fact icon={<Home className="h-4 w-4" />} label="Residence" value={profile.residence_status} />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Profile information</span>
            <span className="text-emerald-700">{completeness}% complete</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400" style={{ width: `${completeness}%` }} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Added</p>
            <p className="mt-0.5 text-xs font-bold text-slate-600">{formatDate(profile.created_at)}</p>
          </div>
          <Link
            href={`/profiles/${profile.id}`}
            className="group/link inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
          >
            View profile
            <ArrowRight className="h-4 w-4 transition group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function PhotoPlaceholder({ gender }: { gender: string | null }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#ecfdf5,_#f8fafc_58%,_#e2e8f0)] text-slate-400">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white bg-white/80 shadow-sm">
        <UserRound className="h-9 w-9 text-emerald-700/55" />
      </div>
      <p className="mt-3 text-sm font-black text-slate-500">{gender || 'Profile'} photo protected</p>
      <p className="mt-1 text-xs text-slate-400">Visible according to privacy settings</p>
    </div>
  );
}
