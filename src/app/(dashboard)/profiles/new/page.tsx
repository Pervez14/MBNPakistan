'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

export default function NewProfilePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [formData, setFormData] = useState({
    candidateName: '',
    photoVisibility: 'public',

    gender: '',
    age: '',
    dateOfBirth: '',
    maritalStatus: '',
    height: '',

    religion: 'Islam',
    sect: '',
    caste: '',

    city: '',
    province: '',
    country: 'Pakistan',
    nationality: 'Pakistani',
    residenceStatus: '',

    education: '',
    profession: '',
    employmentStatus: '',
    jobType: '',
    incomeRange: '',

    complexion: '',
    bodyType: '',
    languages: '',

    siblings: '',
    fatherOccupation: '',
    motherOccupation: '',
    familyDetails: '',

    expectedPartnerAge: '',
    expectedPartnerLocation: '',
    expectedPartnerEducation: '',
    requirements: '',

    additionalNotes: '',
  });

  const updateField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload JPG, PNG, or WEBP image only.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage('Photo must be smaller than 5MB.');
      return;
    }

    setErrorMessage('');
    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview('');
  };

  const uploadPhoto = async (userId: string) => {
    if (!selectedPhoto) return null;

    const fileExt = selectedPhoto.name.split('.').pop() || 'jpg';
    const safeFileName = selectedPhoto.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();

    const filePath = `${userId}/${Date.now()}-${safeFileName || `photo.${fileExt}`}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, selectedPhoto, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('You must login again before creating a profile.');
      }

      if (!formData.gender) {
        throw new Error('Please select gender.');
      }

      if (!formData.province) {
        throw new Error('Please select province / region.');
      }

      if (!formData.city) {
        throw new Error(
          'Please select city. The system needs city to generate profile ID.'
        );
      }

      const photoUrl = await uploadPhoto(user.id);

      const { error } = await supabase.from('marriage_profiles').insert({
        created_by: user.id,
        bureau_email: user.email,

        profile_code: null,
        candidate_name: formData.candidateName || null,
        gender: formData.gender,
        age: formData.age ? Number(formData.age) : null,
        date_of_birth: formData.dateOfBirth || null,

        marital_status: formData.maritalStatus || null,
        height: formData.height || null,

        religion: formData.religion || 'Islam',
        sect: formData.sect || null,
        caste: formData.caste || null,

        city: formData.city || null,
        province: formData.province || null,
        country: formData.country || 'Pakistan',
        nationality: formData.nationality || null,
        residence_status: formData.residenceStatus || null,

        education: formData.education || null,
        profession: formData.profession || null,
        employment_status: formData.employmentStatus || null,
        job_type: formData.jobType || null,
        income_range: formData.incomeRange || null,

        complexion: formData.complexion || null,
        body_type: formData.bodyType || null,
        languages: formData.languages || null,

        siblings: formData.siblings || null,
        father_occupation: formData.fatherOccupation || null,
        mother_occupation: formData.motherOccupation || null,
        family_details: formData.familyDetails || null,

        expected_partner_age: formData.expectedPartnerAge || null,
        expected_partner_location: formData.expectedPartnerLocation || null,
        expected_partner_education: formData.expectedPartnerEducation || null,
        requirements: formData.requirements || null,

        additional_notes: formData.additionalNotes || null,

        photo_url: photoUrl,
        photo_visibility: formData.photoVisibility || 'public',

        status: 'active',
      });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        'Marriage profile created successfully. Profile ID was generated automatically.'
      );

      setTimeout(() => {
        router.push('/profiles');
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Profile could not be created. Please try again.';

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cityOptions = formData.province
    ? citiesByProvince[formData.province] || []
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/profiles"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profiles
        </Link>

        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Add Marriage Profile
        </h1>

        <p className="text-slate-500 mt-1">
          Create a detailed bride or groom profile for your bureau.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6 text-sm text-green-700">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-8 space-y-8">
        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Candidate Photo & Privacy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
            <div className="w-full">
              {photoPreview ? (
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className={`w-full h-72 object-cover object-top border border-slate-200 bg-slate-50 ${
                      formData.photoVisibility === 'blurred'
                        ? 'blur-md scale-105'
                        : ''
                    }`}
                  />

                  {formData.photoVisibility === 'blurred' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-3 py-2 rounded-full bg-white/90 text-slate-700 text-xs font-semibold shadow">
                        Blurred Preview
                      </span>
                    </div>
                  )}

                  {formData.photoVisibility === 'hidden' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <span className="px-3 py-2 rounded-full bg-white text-slate-700 text-xs font-semibold shadow">
                        Hidden Photo
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-slate-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-72 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-sm">No photo selected</p>
                </div>
              )}
            </div>

            <div>
              <label className="label">Upload Photo</label>

              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-700 text-white font-medium cursor-pointer hover:bg-green-800 transition">
                <Upload className="w-4 h-4" />
                Choose Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-slate-500 mt-3">
                Accepted formats: JPG, PNG, WEBP. Maximum size: 5MB.
              </p>

              <div className="mt-5">
                <label className="label">Photo Visibility *</label>
                <select
                  name="photoVisibility"
                  value={formData.photoVisibility}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="public">Public Photo - show clearly</option>
                  <option value="blurred">
                    Blurred Photo - hide photo preview
                  </option>
                  <option value="hidden">
                    Hide Photo - do not show in search
                  </option>
                </select>

                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Public is default. Select blurred or hidden only when the
                    candidate wants privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Basic Information
          </h2>

          <div className="mb-5 flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <BadgeCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">
                Profile ID will be generated automatically
              </p>
              <p className="mt-1">
                The system will create a unique ID based on city and gender,
                for example: MBN-LHR-B-1001 or MBN-MTN-G-1001.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Candidate Name</label>
              <input
                name="candidateName"
                value={formData.candidateName}
                onChange={updateField}
                placeholder="Optional / private"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={updateField}
                required
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male / Groom</option>
                <option value="Female">Female / Bride</option>
              </select>
            </div>

            <div>
              <label className="label">Age</label>
              <input
                name="age"
                type="number"
                min="18"
                max="80"
                value={formData.age}
                onChange={updateField}
                placeholder="28"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={updateField}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widow">Widow</option>
                <option value="Widower">Widower</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

            <div>
              <label className="label">Height</label>
              <input
                name="height"
                value={formData.height}
                onChange={updateField}
                placeholder="5 ft 8 in"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Complexion</label>
              <select
                name="complexion"
                value={formData.complexion}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="Fair">Fair</option>
                <option value="Wheatish">Wheatish</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="label">Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="Slim">Slim</option>
                <option value="Average">Average</option>
                <option value="Athletic">Athletic</option>
                <option value="Healthy">Healthy</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="label">Languages</label>
              <input
                name="languages"
                value={formData.languages}
                onChange={updateField}
                placeholder="Urdu, Punjabi, English"
                className="input-field"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Religious & Community Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Religion</label>
              <input
                name="religion"
                value={formData.religion}
                onChange={updateField}
                placeholder="Islam"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Sect</label>
              <select
                name="sect"
                value={formData.sect}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="Sunni">Sunni</option>
                <option value="Shia">Shia</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Caste / Community</label>
              <select
                name="caste"
                value={formData.caste}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select Caste</option>
                {pakistaniCastes.map((caste) => (
                  <option key={caste} value={caste}>
                    {caste}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Location Details
          </h2>

          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            <p className="font-semibold text-blue-900">
              Province and city are required for automatic profile ID.
            </p>
            <p className="mt-1">
              Example: Lahore creates LHR code, Multan creates MTN code,
              Karachi creates KHI code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Province / Region *</label>
              <select
                name="province"
                value={formData.province}
                onChange={updateField}
                required
                className="input-field"
              >
                <option value="">Select Province</option>
                {Object.keys(citiesByProvince).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={updateField}
                required
                disabled={!formData.province}
                className="input-field disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {formData.province ? 'Select City' : 'Select Province First'}
                </option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={updateField}
                placeholder="Pakistan"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Nationality</label>
              <input
                name="nationality"
                value={formData.nationality}
                onChange={updateField}
                placeholder="Pakistani"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Residence Status</label>
              <select
                name="residenceStatus"
                value={formData.residenceStatus}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="Own House">Own House</option>
                <option value="Rented House">Rented House</option>
                <option value="Joint Family">Joint Family</option>
                <option value="Nuclear Family">Nuclear Family</option>
                <option value="Overseas Resident">Overseas Resident</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Education & Career
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Education</label>
              <input
                name="education"
                value={formData.education}
                onChange={updateField}
                placeholder="MBA, MBBS, BS Computer Science"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Profession</label>
              <input
                name="profession"
                value={formData.profession}
                onChange={updateField}
                placeholder="Doctor, Engineer, Business Owner"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Employment Status</label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select</option>
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
              <label className="label">Job Type / Industry</label>
              <input
                name="jobType"
                value={formData.jobType}
                onChange={updateField}
                placeholder="IT, Medical, Education, Business"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Income Range</label>
              <select
                name="incomeRange"
                value={formData.incomeRange}
                onChange={updateField}
                className="input-field"
              >
                <option value="">Select Income Range</option>
                <option value="Under 50,000 PKR">Under 50,000 PKR</option>
                <option value="50,000 - 100,000 PKR">
                  50,000 - 100,000 PKR
                </option>
                <option value="100,000 - 250,000 PKR">
                  100,000 - 250,000 PKR
                </option>
                <option value="250,000 - 500,000 PKR">
                  250,000 - 500,000 PKR
                </option>
                <option value="500,000+ PKR">500,000+ PKR</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Family Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Siblings</label>
              <input
                name="siblings"
                value={formData.siblings}
                onChange={updateField}
                placeholder="2 brothers, 1 sister"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Father Occupation</label>
              <input
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={updateField}
                placeholder="Businessman, retired, doctor, etc."
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Mother Occupation</label>
              <input
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={updateField}
                placeholder="Housewife, teacher, doctor, etc."
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Family Summary</label>
              <textarea
                name="familyDetails"
                value={formData.familyDetails}
                onChange={updateField}
                rows={3}
                placeholder="Family background, values, siblings details, parents details..."
                className="input-field resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Partner Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Expected Partner Age</label>
              <input
                name="expectedPartnerAge"
                value={formData.expectedPartnerAge}
                onChange={updateField}
                placeholder="24 - 30"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Expected Partner Location</label>
              <input
                name="expectedPartnerLocation"
                value={formData.expectedPartnerLocation}
                onChange={updateField}
                placeholder="Lahore, Islamabad, Overseas"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Expected Partner Education</label>
              <input
                name="expectedPartnerEducation"
                value={formData.expectedPartnerEducation}
                onChange={updateField}
                placeholder="Graduate, Masters, Doctor, Engineer"
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Detailed Match Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={updateField}
                rows={3}
                placeholder="Preferred age, city, caste, education, family background, lifestyle, etc."
                className="input-field resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Additional Notes
          </h2>

          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={updateField}
            rows={3}
            placeholder="Any additional private notes..."
            className="input-field resize-none"
          />
        </section>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Marriage Profile'}
          </button>

          <Link
            href="/profiles"
            className="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
