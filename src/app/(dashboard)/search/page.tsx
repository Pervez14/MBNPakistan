'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  Search,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Filter,
  Heart,
  Home,
  Languages,
  UserRound,
  Building2,
  BadgeDollarSign,
  Ruler,
  Baby,
  RotateCcw,
  Phone,
  Mail,
  Eye,
  MessageCircle,
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
  created_at: string | null;
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

type Filters = {
  keyword: string;
  gender: string;
  province: string;
  city: string;
  caste: string;
  maritalStatus: string;
  employmentStatus: string;
  education: string;
};

const emptyFilters: Filters = {
  keyword: '',
  gender: '',
  province: '',
  city: '',
  caste: '',
  maritalStatus: '',
  employmentStatus: '',
  education: '',
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
  color?: 'green' | 'amber' | 'blue' | 'slate';
}) {
  const styles = {
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}

function getWhatsAppLink(number: string | null) {
  if (!number) return '';

  const digitsOnly = number.replace(/\D/g, '');

  if (!digitsOnly) return '';

  return `https://wa.me/${digitsOnly}`;
}

export default function SearchProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profiles, setProfiles] = useState<MarriageProfile[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const [contactDetails, setContactDetails] = useState<
    Record<string, ContactDetails>
  >({});
  const [contactLoading, setContactLoading] = useState('');

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

  const loadProfiles = async (activeFilters: Filters = filters) => {
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
        throw new Error(
          'Your bureau account must be approved before searching profiles.'
        );
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
          created_at
        `
        )
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeFilters.gender) {
        query = query.eq('gender', activeFilters.gender);
      }

      if (activeFilters.province) {
        query = query.eq('province', activeFilters.province);
      }

      if (activeFilters.city) {
        query = query.eq('city', activeFilters.city);
      }

      if (activeFilters.caste) {
        query = query.eq('caste', activeFilters.caste);
      }

      if (activeFilters.maritalStatus) {
        query = query.eq('marital_status', activeFilters.maritalStatus);
      }

      if (activeFilters.employmentStatus) {
        query = query.eq('employment_status', activeFilters.employmentStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

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
      setSearching(false);
    }
  };

  const revealContact = async (profileId: string) => {
    try {
      setContactLoading(profileId);
      setErrorMessage('');

      const { data, error } = await supabase.rpc('reveal_profile_contact', {
        p_profile_id: profileId,
      });

      if (error) {
        throw error;
      }

      const contact = Array.isArray(data) ? data[0] : data;

      if (!contact) {
        throw new Error('Contact details could not be found.');
      }

      setContactDetails((prev) => ({
        ...prev,
        [profileId]: contact as ContactDetails,
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Contact details could not be loaded. Please try again.';

      setErrorMessage(message);
    } finally {
      setContactLoading('');
    }
  };

  useEffect(() => {
    loadProfiles(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cityOptions = filters.province
    ? citiesByProvince[filters.province] || []
    : [];

  const resetFilters = () => {
    setFilters(emptyFilters);
    setContactDetails({});
    loadProfiles(emptyFilters);
  };

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

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-5 h-5 text-green-700" />
          <h2 className="font-semibold text-slate-900">Search Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Keyword</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={updateFilter}
              placeholder="Search education, profession, family, city..."
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

          <div>
            <label className="label">Employment</label>
            <select
              name="employmentStatus"
              value={filters.employmentStatus}
              onChange={updateFilter}
              className="input-field"
            >
              <option value="">All</option>
              <option value="Employed">Employed</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Government Job">Government Job</option>
              <option value="Private Job">Private Job</option>
              <option value="Student">Student</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>

          <div>
            <label className="label">Education Contains</label>
            <input
              name="education"
              value={filters.education}
              onChange={updateFilter}
              placeholder="BS, MBA, MBBS..."
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => loadProfiles(filters)}
            disabled={searching}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {searching ? 'Searching...' : 'Search Profiles'}
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
            Try changing filters or add more profiles to the network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            const contact = contactDetails[profile.id];
            const whatsappLink = getWhatsAppLink(contact?.whatsapp_number);

            return (
              <div
                key={profile.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                {/* Image */}
                <div className="h-80 bg-slate-100 border-b border-slate-100">
                  {profile.photo_url && profile.photo_visibility !== 'hidden' ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={profile.photo_url}
                        alt={profile.profile_code || 'Marriage profile'}
                        className={`w-full h-full object-contain object-top bg-slate-50 ${
                          profile.photo_visibility === 'blurred'
                            ? 'blur-md scale-105'
                            : ''
                        }`}
                      />

                      {profile.photo_visibility === 'blurred' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                          <span className="px-4 py-2 rounded-full bg-white/90 text-slate-700 text-sm font-semibold shadow">
                            Photo blurred for privacy
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Users className="w-16 h-16 text-slate-300" />
                      <p className="text-sm text-slate-400 mt-2">
                        Photo hidden for privacy
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
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
                              profile.complexion && profile.body_type
                                ? ' / '
                                : ''
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
                                <span className="font-semibold">
                                  Location:
                                </span>{' '}
                                {profile.expected_partner_location}
                              </p>
                            )}

                            {profile.expected_partner_education && (
                              <p>
                                <span className="font-semibold">
                                  Education:
                                </span>{' '}
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

                  {/* Contact Section */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    {!contact ? (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-green-700 mt-0.5" />
                            <div>
                              <p className="font-semibold text-slate-900">
                                Contact details hidden
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                Click View Contact to reveal uploader contact.
                                This action will be logged for admin review.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => revealContact(profile.id)}
                            disabled={contactLoading === profile.id}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
                          >
                            <Eye className="w-4 h-4" />
                            {contactLoading === profile.id
                              ? 'Loading...'
                              : 'View Contact'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                        <div className="flex items-start gap-3 mb-4">
                          <Phone className="w-5 h-5 text-green-700 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">
                              Contact Details Revealed
                            </p>
                            <p className="text-sm text-green-700">
                              This view has been saved in admin contact logs.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {contact.business_name && (
                            <p>
                              <span className="font-semibold">
                                Bureau Name:
                              </span>{' '}
                              {contact.business_name}
                            </p>
                          )}

                          {contact.full_name && (
                            <p>
                              <span className="font-semibold">
                                Contact Person:
                              </span>{' '}
                              {contact.full_name}
                            </p>
                          )}

                          {contact.mobile_number && (
                            <p>
                              <span className="font-semibold">Mobile:</span>{' '}
                              <a
                                href={`tel:${contact.mobile_number}`}
                                className="text-green-800 font-semibold hover:underline"
                              >
                                {contact.mobile_number}
                              </a>
                            </p>
                          )}

                          {contact.whatsapp_number && (
                            <p>
                              <span className="font-semibold">WhatsApp:</span>{' '}
                              {whatsappLink ? (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-green-800 font-semibold hover:underline"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  {contact.whatsapp_number}
                                </a>
                              ) : (
                                contact.whatsapp_number
                              )}
                            </p>
                          )}

                          {contact.office_phone && (
                            <p>
                              <span className="font-semibold">
                                Office Phone:
                              </span>{' '}
                              <a
                                href={`tel:${contact.office_phone}`}
                                className="text-green-800 font-semibold hover:underline"
                              >
                                {contact.office_phone}
                              </a>
                            </p>
                          )}

                          {contact.email && (
                            <p>
                              <span className="font-semibold">Email:</span>{' '}
                              <a
                                href={`mailto:${contact.email}`}
                                className="inline-flex items-center gap-1 text-green-800 font-semibold hover:underline"
                              >
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </a>
                            </p>
                          )}

                          {(contact.city || contact.province) && (
                            <p>
                              <span className="font-semibold">Location:</span>{' '}
                              {contact.city}
                              {contact.province ? `, ${contact.province}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-slate-400">
                      Uploader contact hidden until View Contact is clicked.
                    </p>

                    {profile.created_at && (
                      <p className="text-xs text-slate-400">
                        Added:{' '}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
