'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertCircle,
  UserPlus,
  Search,
  Heart,
  Home,
  Languages,
  UserRound,
  Building2,
  BadgeDollarSign,
  Ruler,
  Baby,
  Trash2,
  RotateCcw,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MarriageProfile = {
  id: string;
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
  income_range: string | null;

  complexion: string | null;
  body_type: string | null;
  languages: string | null;

  siblings: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  family_details: string | null;

  expected_partner_age: string | null;
  expected_partner_location: string | null;
  expected_partner_education: string | null;
  requirements: string | null;

  additional_notes: string | null;
  photo_url: string | null;
  photo_visibility: string | null;
  bureau_email: string | null;
  status: string | null;
  created_at: string | null;
};

type Filters = {
  keyword: string;
  gender: string;
  status: string;
};

const emptyFilters: Filters = {
  keyword: '',
  gender: '',
  status: 'active',
};

function InfoItem({
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
    <div className="flex items-start gap-2 text-sm">
      <div className="mt-0.5 text-slate-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
          {label}
        </p>
        <p className="text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

function DetailPill({
  children,
  color = 'slate',
}: {
  children: ReactNode;
  color?: 'green' | 'amber' | 'blue' | 'slate' | 'red' | 'purple';
}) {
  const styles = {
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    slate: 'bg-slate-100 text-slate-600',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}

function getPhotoPrivacyLabel(value: string | null) {
  if (value === 'blurred') return 'Blurred in search';
  if (value === 'hidden') return 'Hidden in search';
  return 'Public photo';
}

export default function MyProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const updateFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadProfiles = async (activeFilters: Filters = filters) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to view your profiles.');
      }

      let query = supabase
        .from('marriage_profiles')
        .select(
          `
          id,
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
          income_range,
          complexion,
          body_type,
          languages,
          siblings,
          father_occupation,
          mother_occupation,
          family_details,
          expected_partner_age,
          expected_partner_location,
          expected_partner_education,
          requirements,
          additional_notes,
          photo_url,
          photo_visibility,
          bureau_email,
          status,
          created_at
        `
        )
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (activeFilters.status) {
        query = query.eq('status', activeFilters.status);
      }

      if (activeFilters.gender) {
        query = query.eq('gender', activeFilters.gender);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let result = (data || []) as MarriageProfile[];

      if (activeFilters.keyword.trim()) {
        const keyword = activeFilters.keyword.toLowerCase().trim();

        result = result.filter((profile) => {
          const searchableText = [
            profile.profile_code,
            profile.candidate_name,
            profile.gender,
            profile.age,
            profile.marital_status,
            profile.education,
            profile.profession,
            profile.employment_status,
            profile.job_type,
            profile.city,
            profile.province,
            profile.caste,
            profile.sect,
            profile.siblings,
            profile.father_occupation,
            profile.mother_occupation,
            profile.family_details,
            profile.requirements,
            profile.expected_partner_location,
            profile.expected_partner_education,
            profile.languages,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchableText.includes(keyword);
        });
      }

      setProfiles(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Profiles could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const markInactive = async (profileId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this profile from active listings?'
    );

    if (!confirmed) return;

    try {
      setActionLoading(profileId);
      setErrorMessage('');

      const { error } = await supabase
        .from('marriage_profiles')
        .update({ status: 'inactive' })
        .eq('id', profileId);

      if (error) {
        throw error;
      }

      await loadProfiles(filters);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Profile could not be updated. Please try again.';

      setErrorMessage(message);
    } finally {
      setActionLoading('');
    }
  };

  const reactivateProfile = async (profileId: string) => {
    try {
      setActionLoading(profileId);
      setErrorMessage('');

      const { error } = await supabase
        .from('marriage_profiles')
        .update({ status: 'active' })
        .eq('id', profileId);

      if (error) {
        throw error;
      }

      await loadProfiles(filters);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Profile could not be reactivated. Please try again.';

      setErrorMessage(message);
    } finally {
      setActionLoading('');
    }
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    loadProfiles(emptyFilters);
  };

  useEffect(() => {
    loadProfiles(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            My Profiles
          </h1>
          <p className="text-slate-500 mt-1">
            View, edit, and manage marriage profiles uploaded by your bureau.
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

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Search My Profiles</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={updateFilter}
              placeholder="Search code, education, city, profession..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Gender</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="">All</option>
              <option value="Male">Male / Groom</option>
              <option value="Female">Female / Bride</option>
            </select>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => loadProfiles(filters)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
          >
            <Search className="w-4 h-4" />
            Search
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading profiles...' : `${profiles.length} profile(s) found`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-[520px] bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>

          <h3 className="font-semibold text-slate-900">No profiles found</h3>
          <p className="text-slate-500 text-sm mt-1">
            Add your first bride or groom profile to start building your bureau
            database.
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <div className="h-80 bg-slate-100 border-b border-slate-100 relative">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.profile_code || 'Marriage profile'}
                    className="w-full h-full object-contain object-top bg-slate-50"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-slate-300" />
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 shadow text-xs font-semibold text-slate-700">
                    <ShieldCheck className="w-3 h-3" />
                    {getPhotoPrivacyLabel(profile.photo_visibility)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {profile.gender && (
                    <DetailPill color="green">{profile.gender}</DetailPill>
                  )}

                  {profile.age && (
                    <DetailPill color="blue">{profile.age} years</DetailPill>
                  )}

                  {profile.marital_status && (
                    <DetailPill color="amber">
                      {profile.marital_status}
                    </DetailPill>
                  )}

                  {profile.profile_code && (
                    <DetailPill>{profile.profile_code}</DetailPill>
                  )}

                  {profile.status === 'inactive' && (
                    <DetailPill color="red">Inactive</DetailPill>
                  )}

                  {profile.photo_visibility === 'blurred' && (
                    <DetailPill color="purple">Photo Blurred</DetailPill>
                  )}

                  {profile.photo_visibility === 'hidden' && (
                    <DetailPill color="red">Photo Hidden</DetailPill>
                  )}
                </div>

                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  {profile.profile_code ||
                    profile.candidate_name ||
                    'Marriage Profile'}
                </h3>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="Location"
                    value={
                      profile.city || profile.province
                        ? `${profile.city || ''}${
                            profile.city && profile.province ? ', ' : ''
                          }${profile.province || ''}`
                        : null
                    }
                  />

                  <InfoItem
                    icon={<GraduationCap className="w-4 h-4" />}
                    label="Education"
                    value={profile.education}
                  />

                  <InfoItem
                    icon={<Briefcase className="w-4 h-4" />}
                    label="Profession"
                    value={profile.profession}
                  />

                  <InfoItem
                    icon={<Building2 className="w-4 h-4" />}
                    label="Employment"
                    value={profile.employment_status || profile.job_type}
                  />

                  <InfoItem
                    icon={<BadgeDollarSign className="w-4 h-4" />}
                    label="Income"
                    value={profile.income_range}
                  />

                  <InfoItem
                    icon={<Heart className="w-4 h-4" />}
                    label="Caste / Sect"
                    value={
                      profile.caste || profile.sect
                        ? `${profile.caste || ''}${
                            profile.caste && profile.sect ? ' / ' : ''
                          }${profile.sect || ''}`
                        : null
                    }
                  />

                  <InfoItem
                    icon={<Ruler className="w-4 h-4" />}
                    label="Height"
                    value={profile.height}
                  />

                  <InfoItem
                    icon={<UserRound className="w-4 h-4" />}
                    label="Appearance"
                    value={
                      profile.complexion || profile.body_type
                        ? `${profile.complexion || ''}${
                            profile.complexion && profile.body_type ? ' / ' : ''
                          }${profile.body_type || ''}`
                        : null
                    }
                  />

                  <InfoItem
                    icon={<Languages className="w-4 h-4" />}
                    label="Languages"
                    value={profile.languages}
                  />

                  <InfoItem
                    icon={<Home className="w-4 h-4" />}
                    label="Residence"
                    value={profile.residence_status}
                  />

                  <InfoItem
                    icon={<Baby className="w-4 h-4" />}
                    label="Siblings"
                    value={profile.siblings}
                  />

                  <InfoItem
                    icon={<Users className="w-4 h-4" />}
                    label="Parents"
                    value={
                      profile.father_occupation || profile.mother_occupation
                        ? `Father: ${
                            profile.father_occupation || 'N/A'
                          } | Mother: ${profile.mother_occupation || 'N/A'}`
                        : null
                    }
                  />
                </div>

                {(profile.family_details ||
                  profile.expected_partner_age ||
                  profile.expected_partner_location ||
                  profile.expected_partner_education ||
                  profile.requirements) && (
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {profile.family_details && (
                      <div className="p-4 rounded-xl bg-slate-50">
                        <p className="font-semibold text-slate-800 mb-1">
                          Family Details
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {profile.family_details}
                        </p>
                      </div>
                    )}

                    {(profile.expected_partner_age ||
                      profile.expected_partner_location ||
                      profile.expected_partner_education ||
                      profile.requirements) && (
                      <div className="p-4 rounded-xl bg-green-50">
                        <p className="font-semibold text-green-900 mb-2">
                          Partner Requirements
                        </p>

                        <div className="space-y-1 text-sm text-green-800">
                          {profile.expected_partner_age && (
                            <p>
                              <span className="font-semibold">Age:</span>{' '}
                              {profile.expected_partner_age}
                            </p>
                          )}

                          {profile.expected_partner_location && (
                            <p>
                              <span className="font-semibold">Location:</span>{' '}
                              {profile.expected_partner_location}
                            </p>
                          )}

                          {profile.expected_partner_education && (
                            <p>
                              <span className="font-semibold">Education:</span>{' '}
                              {profile.expected_partner_education}
                            </p>
                          )}

                          {profile.requirements && (
                            <p className="pt-1 leading-relaxed">
                              {profile.requirements}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {profile.additional_notes && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 text-sm text-amber-800">
                    <p className="font-semibold mb-1">Additional Notes</p>
                    <p>{profile.additional_notes}</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    {profile.created_at && (
                      <p className="text-xs text-slate-400">
                        Added:{' '}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/profiles/${profile.id}/edit`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>

                    {profile.status === 'inactive' ? (
                      <button
                        type="button"
                        onClick={() => reactivateProfile(profile.id)}
                        disabled={actionLoading === profile.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markInactive(profile.id)}
                        disabled={actionLoading === profile.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
