'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle,
  Eye,
  FileText,
  GraduationCap,
  HeartHandshake,
  ImageIcon,
  Lock,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Save,
  MessageSquareText,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';


type AssignedProfile = {
  submission_id: string;

  profile_id: string | null;
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

  review_status: string | null;

  assigned_at: string | null;

  converted_to_profile: boolean | null;

  network_profile_status: string | null;

  work_status?: string | null;
  bureau_private_notes?: string | null;
  last_follow_up_at?: string | null;
  next_follow_up_at?: string | null;
  work_updated_at?: string | null;
};


type FollowUp = {
  id: string;
  note: string;
  status_at_time: string | null;
  created_at: string | null;
};


type WorkRecord = {
  submission_id: string;
  work_status: string | null;
  bureau_private_notes: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  updated_at: string | null;
};


type Filters = {
  keyword: string;
  gender: string;
  province: string;
  city: string;
  sect: string;
  status: string;
};


const emptyFilters: Filters = {
  keyword: '',
  gender: '',
  province: '',
  city: '',
  sect: '',
  status: '',
};


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

  Islamabad: [
    'Islamabad',
  ],

  AJK: [
    'Muzaffarabad',
    'Mirpur',
    'Kotli',
    'Rawalakot',
    'Bagh',
    'Bhimber',
  ],

  'Gilgit-Baltistan': [
    'Gilgit',
    'Skardu',
    'Hunza',
    'Chilas',
    'Ghizer',
    'Astore',
  ],

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


const assignmentStatuses = [
  'assigned',
  'matching_active',
  'potential_match_found',
  'in_discussion',
  'matched',
  'no_suitable_match',
  'closed',
];


function formatDate(
  value: string | null
) {
  if (!value) return 'N/A';

  return new Date(value).toLocaleString();
}


function formatStatus(
  value: string | null
) {
  if (!value) return 'Assigned';

  return value
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
}


function statusClass(
  status: string | null
) {
  if (
    status === 'matched' ||
    status === 'closed'
  ) {
    return 'bg-green-100 text-green-700';
  }

  if (
    status === 'matching_active' ||
    status === 'in_discussion'
  ) {
    return 'bg-blue-100 text-blue-700';
  }

  if (
    status === 'potential_match_found'
  ) {
    return 'bg-purple-100 text-purple-700';
  }

  return 'bg-amber-100 text-amber-700';
}


function InfoLine({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
}) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return (
    <p className="text-sm leading-relaxed">
      <span className="font-semibold text-slate-900">
        {label}:
      </span>{' '}

      <span className="text-slate-600">
        {value}
      </span>
    </p>
  );
}


export default function AssignedProfilesPage() {
  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    profiles,
    setProfiles,
  ] = useState<AssignedProfile[]>([]);

  const [
    filters,
    setFilters,
  ] = useState<Filters>(
    emptyFilters
  );

  const [
    selectedProfile,
    setSelectedProfile,
  ] =
    useState<AssignedProfile | null>(
      null
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');


  const loadAssignedProfiles =
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage('');


        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth.getUser();


        if (
          userError ||
          !user
        ) {
          throw new Error(
            'Please login again.'
          );
        }


        const [
          profileResponse,
          workResponse,
        ] = await Promise.all([
          supabase.rpc(
            'get_my_assigned_profiles'
          ),
          supabase.rpc(
            'get_my_assigned_profile_work'
          ),
        ]);


        if (profileResponse.error) {
          throw profileResponse.error;
        }


        if (workResponse.error) {
          throw workResponse.error;
        }


        const workMap = new Map(
          (
            (workResponse.data || []) as WorkRecord[]
          ).map((work) => [
            work.submission_id,
            work,
          ])
        );


        const mergedProfiles = (
          (profileResponse.data || []) as AssignedProfile[]
        ).map((profile) => {
          const work = workMap.get(
            profile.submission_id
          );

          return {
            ...profile,

            work_status:
              work?.work_status ||
              profile.review_status ||
              'assigned',

            bureau_private_notes:
              work?.bureau_private_notes ||
              '',

            last_follow_up_at:
              work?.last_follow_up_at ||
              null,

            next_follow_up_at:
              work?.next_follow_up_at ||
              null,

            work_updated_at:
              work?.updated_at ||
              null,
          };
        });


        setProfiles(
          mergedProfiles
        );

      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Assigned profiles could not be loaded.'
        );

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };


  useEffect(() => {
    loadAssignedProfiles();
  }, []);


  const cityOptions =
    filters.province
      ? citiesByProvince[
          filters.province
        ] || []
      : [];


  const filteredProfiles =
    useMemo(() => {
      return profiles.filter(
        (profile) => {

          const matchesKeyword =
            [
              profile.profile_code,
              profile.candidate_name,
              profile.gender,
              profile.age,
              profile.marital_status,
              profile.city,
              profile.province,
              profile.sect,
              profile.caste,
              profile.education,
              profile.profession,
              profile.employment_status,
              profile.job_type,
              profile.languages,
              profile.family_details,
              profile.requirements,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()
              .includes(
                filters.keyword
                  .toLowerCase()
              );


          const matchesGender =
            filters.gender
              ? profile.gender ===
                filters.gender
              : true;


          const matchesProvince =
            filters.province
              ? profile.province ===
                filters.province
              : true;


          const matchesCity =
            filters.city
              ? profile.city ===
                filters.city
              : true;


          const matchesSect =
            filters.sect
              ? profile.sect ===
                filters.sect
              : true;


          const matchesStatus =
            filters.status
              ? (
                  profile.work_status ||
                  profile.review_status ||
                  'assigned'
                ) === filters.status
              : true;


          return (
            matchesKeyword &&
            matchesGender &&
            matchesProvince &&
            matchesCity &&
            matchesSect &&
            matchesStatus
          );
        }
      );
    }, [
      profiles,
      filters,
    ]);


  const clearFilters = () => {
    setFilters(emptyFilters);
  };


  const summary = {
    total: profiles.length,

    active: profiles.filter(
      (item) =>
        (
          item.work_status ||
          item.review_status
        ) === 'matching_active'
    ).length,

    potential: profiles.filter(
      (item) =>
        (
          item.work_status ||
          item.review_status
        ) === 'potential_match_found'
    ).length,

    discussion: profiles.filter(
      (item) =>
        (
          item.work_status ||
          item.review_status
        ) === 'in_discussion'
    ).length,
  };


  if (loading) {
    return (
      <div className="space-y-6">

        <div className="h-12 w-72 bg-slate-200 rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 bg-slate-200 rounded-2xl animate-pulse"
              />
            )
          )}

        </div>


        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />

      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 text-green-700" />
            </div>


            <div>
              <h1 className="font-heading text-3xl font-bold text-slate-900">
                Assigned Profiles
              </h1>

              <p className="text-slate-500 mt-1">
                Profiles assigned to your bureau by MBN Pakistan.
              </p>
            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={() =>
            loadAssignedProfiles(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCcw
            className={`w-4 h-4 ${
              refreshing
                ? 'animate-spin'
                : ''
            }`}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh Profiles'}
        </button>

      </div>


      {/* Privacy Notice */}
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">

        <ShieldCheck className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />


        <div>

          <p className="font-bold text-green-900">
            MBN Assigned Profile
          </p>


          <p className="text-sm text-green-800 mt-1 leading-relaxed">
            These profiles are assigned by MBN Pakistan for matchmaking work.
            Personal submitter contact details and private admin notes are not
            included in this section.
          </p>

        </div>

      </div>


      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">

          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

          <span>
            {errorMessage}
          </span>

        </div>
      )}


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <SummaryCard
          label="Total Assigned"
          value={summary.total}
          icon={
            <Users className="w-6 h-6 text-green-700" />
          }
          bg="bg-green-50"
        />


        <SummaryCard
          label="Matching Active"
          value={summary.active}
          icon={
            <Search className="w-6 h-6 text-blue-700" />
          }
          bg="bg-blue-50"
        />


        <SummaryCard
          label="Potential Matches"
          value={summary.potential}
          icon={
            <HeartHandshake className="w-6 h-6 text-purple-700" />
          }
          bg="bg-purple-50"
        />


        <SummaryCard
          label="In Discussion"
          value={summary.discussion}
          icon={
            <CheckCircle className="w-6 h-6 text-amber-700" />
          }
          bg="bg-amber-50"
        />

      </div>


      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">

          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Find Assigned Profiles
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Filter profiles assigned to your bureau.
            </p>
          </div>


          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Clear Filters
          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">

          <div className="relative xl:col-span-2">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={filters.keyword}
              onChange={(e) =>
                setFilters(
                  (prev) => ({
                    ...prev,
                    keyword:
                      e.target.value,
                  })
                )
              }
              placeholder="Search name, city, education..."
              className="input-field pl-10"
            />

          </div>


          <select
            value={filters.gender}
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  gender:
                    e.target.value,
                })
              )
            }
            className="input-field"
          >
            <option value="">
              All Gender
            </option>

            <option value="Male">
              Male / Groom
            </option>

            <option value="Female">
              Female / Bride
            </option>

          </select>


          <select
            value={filters.province}
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  province:
                    e.target.value,
                  city: '',
                })
              )
            }
            className="input-field"
          >
            <option value="">
              All Provinces
            </option>

            {Object.keys(
              citiesByProvince
            ).map(
              (province) => (
                <option
                  key={province}
                  value={province}
                >
                  {province}
                </option>
              )
            )}

          </select>


          <select
            value={filters.city}
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  city:
                    e.target.value,
                })
              )
            }
            disabled={
              !filters.province
            }
            className="input-field disabled:bg-slate-100"
          >
            <option value="">
              {filters.province
                ? 'All Cities'
                : 'Select Province'}
            </option>

            {cityOptions.map(
              (city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              )
            )}

          </select>


          <select
            value={filters.sect}
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  sect:
                    e.target.value,
                })
              )
            }
            className="input-field"
          >
            <option value="">
              All Sects
            </option>

            {sectOptions.map(
              (sect) => (
                <option
                  key={sect}
                  value={sect}
                >
                  {sect}
                </option>
              )
            )}

          </select>


          <select
            value={filters.status}
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  status:
                    e.target.value,
                })
              )
            }
            className="input-field"
          >
            <option value="">
              All Status
            </option>

            {assignmentStatuses.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {formatStatus(status)}
                </option>
              )
            )}

          </select>

        </div>

      </div>


      {/* Profiles */}
      <div>

        <div className="flex items-center justify-between mb-4">

          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {filteredProfiles.length}
            </span>{' '}
            assigned profile(s)
          </p>

        </div>


        {filteredProfiles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center">

              <HeartHandshake className="w-8 h-8 text-slate-400" />

            </div>


            <h3 className="font-heading text-xl font-bold text-slate-900 mt-5">
              No Assigned Profiles Found
            </h3>


            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              There are no profiles matching your current filters, or MBN
              Pakistan has not assigned any profiles to your bureau yet.
            </p>

          </div>
        ) : (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {filteredProfiles.map(
              (profile) => (
                <AssignedProfileCard
                  key={
                    profile.submission_id
                  }
                  profile={profile}
                  onView={() =>
                    setSelectedProfile(
                      profile
                    )
                  }
                />
              )
            )}

          </div>
        )}

      </div>


      {/* Full Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={
            selectedProfile
          }
          onClose={() =>
            setSelectedProfile(null)
          }
          onSaved={async () => {
            await loadAssignedProfiles(true);
          }}
        />
      )}

    </div>
  );
}


function SummaryCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

        </div>


        <div
          className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


function AssignedProfileCard({
  profile,
  onView,
}: {
  profile: AssignedProfile;
  onView: () => void;
}) {
  const photoVisible =
    profile.photo_url &&
    profile.photo_visibility !==
      'hidden';


  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">


        {/* Photo */}
        <div className="relative bg-slate-100 min-h-[240px]">

          {photoVisible ? (
            <img
              src={
                profile.photo_url ||
                ''
              }
              alt="Candidate"
              className={`w-full h-full min-h-[240px] object-cover object-top ${
                profile.photo_visibility ===
                'blurred'
                  ? 'blur-md scale-105'
                  : ''
              }`}
            />
          ) : (
            <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-slate-400">

              {profile.photo_visibility ===
              'hidden' ? (
                <Lock className="w-10 h-10" />
              ) : (
                <ImageIcon className="w-10 h-10" />
              )}


              <p className="text-xs mt-3">
                {profile.photo_visibility ===
                'hidden'
                  ? 'Photo Hidden'
                  : 'No Photo'}
              </p>

            </div>
          )}


          <div className="absolute top-3 left-3">

            <span className="inline-flex px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 shadow-sm">

              {profile.gender ||
                'Profile'}

            </span>

          </div>

        </div>


        {/* Content */}
        <div className="p-6">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-heading text-xl font-bold text-slate-900">

              {profile.profile_code ||
                profile.candidate_name ||
                'Assigned Profile'}

            </h3>


            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                profile.work_status ||
                profile.review_status
              )}`}
            >

              {formatStatus(
                profile.work_status ||
                profile.review_status
              )}

            </span>

          </div>


          {profile.candidate_name && (
            <p className="text-sm text-slate-500 mt-1">

              {profile.candidate_name}

            </p>
          )}


          <div className="mt-5 grid grid-cols-2 gap-4">

            <QuickInfo
              icon={
                <UserRound className="w-4 h-4" />
              }
              label="Candidate"
              value={[
                profile.age
                  ? `${profile.age} years`
                  : null,

                profile.marital_status,
              ]
                .filter(Boolean)
                .join(' • ') ||
                'N/A'}
            />


            <QuickInfo
              icon={
                <MapPin className="w-4 h-4" />
              }
              label="Location"
              value={[
                profile.city,
                profile.province,
              ]
                .filter(Boolean)
                .join(', ') ||
                'N/A'}
            />


            <QuickInfo
              icon={
                <ShieldCheck className="w-4 h-4" />
              }
              label="Community"
              value={[
                profile.sect,
                profile.caste,
              ]
                .filter(Boolean)
                .join(' • ') ||
                'N/A'}
            />


            <QuickInfo
              icon={
                <BriefcaseBusiness className="w-4 h-4" />
              }
              label="Profession"
              value={
                profile.profession ||
                profile.employment_status ||
                'N/A'
              }
            />

          </div>


          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">

            <CalendarDays className="w-4 h-4" />

            Assigned:{' '}

            {formatDate(
              profile.assigned_at
            )}

          </div>


          <button
            type="button"
            onClick={onView}
            className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800"
          >

            <Eye className="w-4 h-4" />

            View Full Profile

          </button>

        </div>

      </div>

    </div>
  );
}


function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="flex items-center gap-2 text-xs text-slate-400">

        {icon}

        {label}

      </div>


      <p className="text-sm font-semibold text-slate-800 mt-1">

        {value}

      </p>

    </div>
  );
}


function ProfileDetailModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: AssignedProfile;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const photoVisible =
    profile.photo_url &&
    profile.photo_visibility !==
      'hidden';


  const [
    workStatus,
    setWorkStatus,
  ] = useState(
    profile.work_status ||
      profile.review_status ||
      'assigned'
  );


  const [
    privateNotes,
    setPrivateNotes,
  ] = useState(
    profile.bureau_private_notes ||
      ''
  );


  const [
    nextFollowUp,
    setNextFollowUp,
  ] = useState(
    profile.next_follow_up_at
      ? profile.next_follow_up_at.slice(
          0,
          10
        )
      : ''
  );


  const [
    followUpNote,
    setFollowUpNote,
  ] = useState('');


  const [
    followUps,
    setFollowUps,
  ] = useState<FollowUp[]>([]);


  const [
    workflowLoading,
    setWorkflowLoading,
  ] = useState(false);


  const [
    followUpLoading,
    setFollowUpLoading,
  ] = useState(false);


  const [
    timelineLoading,
    setTimelineLoading,
  ] = useState(true);


  const [
    modalError,
    setModalError,
  ] = useState('');


  const [
    modalSuccess,
    setModalSuccess,
  ] = useState('');


  const loadFollowUps =
    async () => {
      try {
        setTimelineLoading(true);

        const {
          data,
          error,
        } = await supabase.rpc(
          'get_assigned_profile_followups',
          {
            p_submission_id:
              profile.submission_id,
          }
        );


        if (error) {
          throw error;
        }


        setFollowUps(
          (data || []) as FollowUp[]
        );

      } catch (err: unknown) {
        setModalError(
          err instanceof Error
            ? err.message
            : 'Follow-up history could not be loaded.'
        );

      } finally {
        setTimelineLoading(false);
      }
    };


  useEffect(() => {
    loadFollowUps();
  }, [profile.submission_id]);


  const saveWorkflow =
    async () => {
      try {
        setWorkflowLoading(true);
        setModalError('');
        setModalSuccess('');


        const nextFollowUpValue =
          nextFollowUp
            ? new Date(
                `${nextFollowUp}T12:00:00`
              ).toISOString()
            : null;


        const {
          error,
        } = await supabase.rpc(
          'update_assigned_profile_work',
          {
            p_submission_id:
              profile.submission_id,

            p_work_status:
              workStatus,

            p_private_notes:
              privateNotes.trim() ||
              null,

            p_next_follow_up_at:
              nextFollowUpValue,
          }
        );


        if (error) {
          throw error;
        }


        setModalSuccess(
          'Work status, private notes, and follow-up date saved.'
        );


        await onSaved();

      } catch (err: unknown) {
        setModalError(
          err instanceof Error
            ? err.message
            : 'Workflow details could not be saved.'
        );

      } finally {
        setWorkflowLoading(false);
      }
    };


  const addFollowUp =
    async () => {
      try {
        if (!followUpNote.trim()) {
          setModalError(
            'Please enter a follow-up note.'
          );

          return;
        }


        setFollowUpLoading(true);
        setModalError('');
        setModalSuccess('');


        const {
          error,
        } = await supabase.rpc(
          'add_assigned_profile_followup',
          {
            p_submission_id:
              profile.submission_id,

            p_note:
              followUpNote.trim(),

            p_status_at_time:
              workStatus,
          }
        );


        if (error) {
          throw error;
        }


        setFollowUpNote('');

        setModalSuccess(
          'Follow-up note added successfully.'
        );


        await loadFollowUps();

        await onSaved();

      } catch (err: unknown) {
        setModalError(
          err instanceof Error
            ? err.message
            : 'Follow-up note could not be added.'
        );

      } finally {
        setFollowUpLoading(false);
      }
    };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-[2rem] max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">


        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-4">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="font-heading text-2xl font-bold text-slate-900">

                {profile.profile_code ||
                  profile.candidate_name ||
                  'Assigned Profile'}

              </h2>


              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                  workStatus
                )}`}
              >

                {formatStatus(
                  workStatus
                )}

              </span>

            </div>


            <p className="text-sm text-slate-500 mt-1">

              Assigned by MBN Pakistan

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
          >

            Close

          </button>

        </div>


        <div className="p-6 md:p-8 space-y-6">


          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">


            <div className="rounded-2xl overflow-hidden bg-slate-100 min-h-[340px]">

              {photoVisible ? (
                <img
                  src={
                    profile.photo_url ||
                    ''
                  }
                  alt="Candidate"
                  className={`w-full h-full min-h-[340px] object-cover object-top ${
                    profile.photo_visibility ===
                    'blurred'
                      ? 'blur-md scale-105'
                      : ''
                  }`}
                />
              ) : (
                <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-slate-400">

                  {profile.photo_visibility ===
                  'hidden' ? (
                    <Lock className="w-12 h-12" />
                  ) : (
                    <ImageIcon className="w-12 h-12" />
                  )}


                  <p className="text-sm mt-3">

                    {profile.photo_visibility ===
                    'hidden'
                      ? 'Photo Hidden'
                      : 'No Photo Available'}

                  </p>

                </div>
              )}

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <DetailBox
                title="Candidate Information"
                icon={
                  <UserRound className="w-5 h-5 text-green-700" />
                }
              >

                <InfoLine
                  label="Name"
                  value={
                    profile.candidate_name
                  }
                />

                <InfoLine
                  label="Gender"
                  value={
                    profile.gender
                  }
                />

                <InfoLine
                  label="Age"
                  value={
                    profile.age
                  }
                />

                <InfoLine
                  label="Date of Birth"
                  value={
                    profile.date_of_birth
                  }
                />

                <InfoLine
                  label="Marital Status"
                  value={
                    profile.marital_status
                  }
                />

                <InfoLine
                  label="Height"
                  value={
                    profile.height
                  }
                />

                <InfoLine
                  label="Complexion"
                  value={
                    profile.complexion
                  }
                />

                <InfoLine
                  label="Body Type"
                  value={
                    profile.body_type
                  }
                />

                <InfoLine
                  label="Languages"
                  value={
                    profile.languages
                  }
                />

              </DetailBox>


              <DetailBox
                title="Religion & Community"
                icon={
                  <ShieldCheck className="w-5 h-5 text-green-700" />
                }
              >

                <InfoLine
                  label="Religion"
                  value={
                    profile.religion
                  }
                />

                <InfoLine
                  label="Sect"
                  value={
                    profile.sect
                  }
                />

                <InfoLine
                  label="Caste"
                  value={
                    profile.caste
                  }
                />

              </DetailBox>


              <DetailBox
                title="Location"
                icon={
                  <MapPin className="w-5 h-5 text-blue-700" />
                }
              >

                <InfoLine
                  label="City"
                  value={
                    profile.city
                  }
                />

                <InfoLine
                  label="Province"
                  value={
                    profile.province
                  }
                />

                <InfoLine
                  label="Country"
                  value={
                    profile.country
                  }
                />

                <InfoLine
                  label="Nationality"
                  value={
                    profile.nationality
                  }
                />

                <InfoLine
                  label="Residence"
                  value={
                    profile.residence_status
                  }
                />

              </DetailBox>


              <DetailBox
                title="Education & Career"
                icon={
                  <GraduationCap className="w-5 h-5 text-purple-700" />
                }
              >

                <InfoLine
                  label="Education"
                  value={
                    profile.education
                  }
                />

                <InfoLine
                  label="Profession"
                  value={
                    profile.profession
                  }
                />

                <InfoLine
                  label="Employment"
                  value={
                    profile.employment_status
                  }
                />

                <InfoLine
                  label="Job Type"
                  value={
                    profile.job_type
                  }
                />

                <InfoLine
                  label="Income Range"
                  value={
                    profile.income_range
                  }
                />

              </DetailBox>

            </div>

          </div>


          {/* Family */}
          <DetailBox
            title="Family Information"
            icon={
              <Users className="w-5 h-5 text-purple-700" />
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <InfoLine
                label="Siblings"
                value={
                  profile.siblings
                }
              />

              <InfoLine
                label="Father Occupation"
                value={
                  profile.father_occupation
                }
              />

              <InfoLine
                label="Mother Occupation"
                value={
                  profile.mother_occupation
                }
              />

            </div>


            {profile.family_details && (
              <div className="mt-4">

                <p className="font-semibold text-slate-900">
                  Family Summary
                </p>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                  {profile.family_details}
                </p>

              </div>
            )}

          </DetailBox>


          {/* Match Requirements */}
          <DetailBox
            title="Partner Requirements"
            icon={
              <HeartHandshake className="w-5 h-5 text-amber-700" />
            }
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <InfoLine
                label="Expected Age"
                value={
                  profile.expected_partner_age
                }
              />

              <InfoLine
                label="Expected Location"
                value={
                  profile.expected_partner_location
                }
              />

              <InfoLine
                label="Expected Education"
                value={
                  profile.expected_partner_education
                }
              />

            </div>


            {profile.requirements && (
              <div className="mt-4">

                <p className="font-semibold text-slate-900">
                  Detailed Requirements
                </p>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                  {profile.requirements}
                </p>

              </div>
            )}

          </DetailBox>


          {/* Public Notes */}
          {profile.additional_notes && (
            <DetailBox
              title="Additional Profile Information"
              icon={
                <FileText className="w-5 h-5 text-slate-700" />
              }
            >

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.additional_notes}
              </p>

            </DetailBox>
          )}



          {/* Bureau Workflow */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">

            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-5 h-5 text-blue-700" />
              </div>


              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Bureau Matchmaking Workflow
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Update your work status, keep private bureau notes, and schedule the next follow-up.
                </p>
              </div>

            </div>


            {modalError && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}


            {modalSuccess && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{modalSuccess}</span>
              </div>
            )}


            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Work Status
                </label>

                <select
                  value={workStatus}
                  onChange={(e) =>
                    setWorkStatus(
                      e.target.value
                    )
                  }
                  className="input-field"
                >
                  {assignmentStatuses
                    .filter(
                      (status) =>
                        status !== 'closed'
                    )
                    .map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatStatus(status)}
                      </option>
                    ))}
                </select>
              </div>


              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Next Follow-up Date
                </label>

                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) =>
                    setNextFollowUp(
                      e.target.value
                    )
                  }
                  className="input-field"
                />
              </div>

            </div>


            <div className="mt-5">

              <label className="block text-sm font-bold text-slate-900 mb-2">
                Bureau Private Working Notes
              </label>

              <textarea
                value={privateNotes}
                onChange={(e) =>
                  setPrivateNotes(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Internal bureau notes, family preferences, match research, verification details, or next actions..."
                className="input-field resize-none"
              />

              <p className="text-xs text-slate-500 mt-2">
                These notes are separate from Super Admin private notes.
              </p>

            </div>


            <button
              type="button"
              onClick={saveWorkflow}
              disabled={workflowLoading}
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />

              {workflowLoading
                ? 'Saving...'
                : 'Save Work Details'}
            </button>

          </div>


          {/* Follow-up Center */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">

              <div className="flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-green-700" />

                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Add Follow-up Note
                </h3>
              </div>


              <p className="text-sm text-slate-500 mt-2">
                Keep a dated history of calls, meetings, introductions, and family feedback.
              </p>


              <textarea
                value={followUpNote}
                onChange={(e) =>
                  setFollowUpNote(
                    e.target.value
                  )
                }
                rows={6}
                placeholder="Example: Spoke with candidate family. They are interested in Lahore-based matches and requested two profiles for review."
                className="input-field resize-none mt-5"
              />


              <button
                type="button"
                onClick={addFollowUp}
                disabled={followUpLoading}
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
              >
                <MessageSquareText className="w-4 h-4" />

                {followUpLoading
                  ? 'Adding...'
                  : 'Add Follow-up Note'}
              </button>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-purple-700" />

                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Follow-up Timeline
                  </h3>
                </div>


                <span className="text-xs font-semibold text-slate-500">
                  {followUps.length} note(s)
                </span>

              </div>


              <div className="mt-5">

                {timelineLoading ? (
                  <div className="space-y-3">

                    {[1, 2, 3].map(
                      (item) => (
                        <div
                          key={item}
                          className="h-20 rounded-xl bg-slate-100 animate-pulse"
                        />
                      )
                    )}

                  </div>
                ) : followUps.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-6 text-center">

                    <MessageSquareText className="w-8 h-8 text-slate-300 mx-auto" />

                    <p className="text-sm font-semibold text-slate-700 mt-3">
                      No follow-up notes yet
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Add the first update after contacting or reviewing this profile.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {followUps.map(
                      (followUp) => (
                        <div
                          key={followUp.id}
                          className="relative pl-5 border-l-2 border-green-200"
                        >

                          <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-green-600" />


                          <div className="rounded-xl bg-slate-50 p-4">

                            <div className="flex flex-wrap items-center justify-between gap-2">

                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
                                  followUp.status_at_time
                                )}`}
                              >
                                {formatStatus(
                                  followUp.status_at_time
                                )}
                              </span>


                              <span className="text-xs text-slate-400">
                                {formatDate(
                                  followUp.created_at
                                )}
                              </span>

                            </div>


                            <p className="text-sm text-slate-700 mt-3 leading-relaxed whitespace-pre-wrap">
                              {followUp.note}
                            </p>

                          </div>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>


          {/* Assignment Information */}
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5">

            <div className="flex items-center gap-2">

              <CheckCircle className="w-5 h-5 text-green-700" />

              <p className="font-bold text-green-900">
                Assignment Information
              </p>

            </div>


            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

              <InfoLine
                label="Assignment Status"
                value={
                  formatStatus(
                    workStatus
                  )
                }
              />

              <InfoLine
                label="Assigned Date"
                value={
                  profile.assigned_at
                    ? formatDate(
                        profile.assigned_at
                      )
                    : null
                }
              />

              <InfoLine
                label="Network Status"
                value={
                  profile.network_profile_status
                    ? formatStatus(
                        profile.network_profile_status
                      )
                    : 'Not Yet Converted'
                }
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


function DetailBox({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">

      <div className="flex items-center gap-2 mb-4">

        {icon}

        <h3 className="font-heading font-bold text-slate-900">
          {title}
        </h3>

      </div>


      <div className="space-y-2">
        {children}
      </div>

    </div>
  );
}
