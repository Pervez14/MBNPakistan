'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  marital_status: string | null;
  height: string | null;
  religion: string | null;
  sect: string | null;
  caste: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  nationality: string | null;
  education: string | null;
  profession: string | null;
  income_range: string | null;
  family_details: string | null;
  requirements: string | null;
  additional_notes: string | null;
  photo_url: string | null;
  bureau_email: string | null;
  created_at: string | null;
};

const pakistaniCastes = [
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

export default function SearchProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);

  const [filters, setFilters] = useState({
    keyword: '',
    gender: '',
    province: '',
    city: '',
    caste: '',
    maritalStatus: '',
  });

  const updateFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
  };

  const loadProfiles = async () => {
    try {
      setSearching(true);
      setErrorMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('Please login again to search profiles.');
      }

      const { data: application } = await supabase
        .from('bureau_applications')
        .select('status')
        .eq('email', user.email)
        .maybeSingle();

      if (!application || application.status !== 'approved') {
        throw new Error('Your bureau account must be approved before searching profiles.');
      }

      let query = supabase
        .from('marriage_profiles')
        .select(
          'id, profile_code, candidate_name, gender, age, marital_status, height, religion, sect, caste, city, province, country, nationality, education, profession, income_range, family_details, requirements, additional_notes, photo_url, bureau_email, created_at'
        )
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }

      if (filters.province) {
        query = query.eq('province', filters.province);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.caste) {
        query = query.eq('caste', filters.caste);
      }

      if (filters.maritalStatus) {
        query = query.eq('marital_status', filters.maritalStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let result = (data || []) as MarriageProfile[];

      if (filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase().trim();

        result = result.filter((profile) => {
          const searchableText = [
            profile.profile_code,
            profile.candidate_name,
            profile.education,
            profile.profession,
            profile.city,
            profile.province,
            profile.caste,
            profile.sect,
            profile.family_details,
            profile.requirements,
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
      setSearching(false);
    }
  };

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cityOptions = filters.province
    ? citiesByProvince[filters.province] || []
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Search Profiles
        </h1>
        <p className="text-slate-500 mt-1">
          Search active marriage profiles from the MBN Pakistan bureau network.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-5 h-5 text-green-700" />
          <h2 className="font-semibold text-slate-900">Search Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Keyword</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={updateFilter}
              placeholder="Education, profession, city..."
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
            <label className="label">Marital Status</label>
            <select
              name="maritalStatus"
              value={filters.maritalStatus}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="">All</option>
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widow">Widow</option>
              <option value="Widower">Widower</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          <div>
            <label className="label">Province</label>
            <select
              name="province"
              value={filters.province}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="">All Provinces</option>
              {Object.keys(citiesByProvince).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">City</label>
            <select
              name="city"
              value={filters.city}
              onChange={updateFilter}
              disabled={!filters.province}
              className="input-field disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {filters.province ? 'All Cities' : 'Select Province First'}
              </option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Caste / Community</label>
            <select
              name="caste"
              value={filters.caste}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="">All Castes</option>
              {pakistaniCastes.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={loadProfiles}
            disabled={searching}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {searching ? 'Searching...' : 'Search Profiles'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFilters({
                keyword: '',
                gender: '',
                province: '',
                city: '',
                caste: '',
                maritalStatus: '',
              });
              setTimeout(loadProfiles, 100);
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 bg-slate-200 rounded-2xl animate-pulse"
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
            Try changing filters or add more profiles to the network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <div className="h-56 bg-slate-100">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.profile_code || 'Marriage profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-14 h-14 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    {profile.gender || 'Profile'}
                  </span>

                  {profile.age && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                      {profile.age} years
                    </span>
                  )}

                  {profile.marital_status && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs">
                      {profile.marital_status}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {profile.profile_code ||
                    profile.candidate_name ||
                    'Marriage Profile'}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {(profile.city || profile.province) && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {profile.city}
                      {profile.province ? `, ${profile.province}` : ''}
                    </p>
                  )}

                  {profile.education && (
                    <p className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      {profile.education}
                    </p>
                  )}

                  {profile.profession && (
                    <p className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {profile.profession}
                    </p>
                  )}

                  {profile.caste && (
                    <p>
                      <span className="font-medium text-slate-700">Caste:</span>{' '}
                      {profile.caste}
                    </p>
                  )}

                  {profile.sect && (
                    <p>
                      <span className="font-medium text-slate-700">Sect:</span>{' '}
                      {profile.sect}
                    </p>
                  )}

                  {profile.income_range && (
                    <p>
                      <span className="font-medium text-slate-700">Income:</span>{' '}
                      {profile.income_range}
                    </p>
                  )}
                </div>

                {profile.requirements && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 text-sm text-slate-600">
                    <p className="font-medium text-slate-700 mb-1">
                      Requirements
                    </p>
                    <p className="line-clamp-3">{profile.requirements}</p>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Bureau: {profile.bureau_email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
