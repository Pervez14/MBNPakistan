'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
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
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createWatermarkedImageFile } from '@/lib/watermarkImage';

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

const religionOptions = [
  'Islam',
  'Christianity',
  'Hinduism',
  'Sikhism',
  'Ahmadiyya',
  'Other',
];

const maritalStatusOptions = [
  'Never Married',
  'Divorced',
  'Widow',
  'Widower',
  'Separated',
];

const heightOptions = [
  '4 ft 8 in',
  '4 ft 9 in',
  '4 ft 10 in',
  '4 ft 11 in',
  '5 ft 0 in',
  '5 ft 1 in',
  '5 ft 2 in',
  '5 ft 3 in',
  '5 ft 4 in',
  '5 ft 5 in',
  '5 ft 6 in',
  '5 ft 7 in',
  '5 ft 8 in',
  '5 ft 9 in',
  '5 ft 10 in',
  '5 ft 11 in',
  '6 ft 0 in',
  '6 ft 1 in',
  '6 ft 2 in',
  '6 ft 3 in',
  '6 ft 4 in',
  'Other',
];

const complexionOptions = [
  'Fair',
  'Wheatish',
  'Medium',
  'Dark',
  'Prefer not to say',
];

const bodyTypeOptions = [
  'Slim',
  'Average',
  'Athletic',
  'Healthy',
  'Prefer not to say',
];

const languageOptions = [
  'Urdu',
  'Punjabi',
  'English',
  'Sindhi',
  'Pashto',
  'Balochi',
  'Saraiki',
  'Arabic',
  'Other',
];

const residenceStatusOptions = [
  'Own House',
  'Rented House',
  'Joint Family',
  'Nuclear Family',
  'Overseas Resident',
];

const educationOptions = [
  'Matric',
  'Intermediate',
  'Graduation',
  "Master's",
  'MPhil',
  'PhD',
  'MBBS',
  'BDS',
  'Engineering',
  'CA / ACCA',
  'Other',
];

const employmentStatusOptions = [
  'Employed',
  'Self-employed',
  'Business Owner',
  'Government Job',
  'Private Job',
  'Student',
  'Unemployed',
  'Homemaker',
];

const jobTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Business',
  'Freelance',
  'Remote',
  'Not Applicable',
  'Other',
];

const industryOptions = [
  'Medical / Healthcare',
  'Engineering',
  'IT / Software',
  'Education',
  'Banking / Finance',
  'Government',
  'Business / Trade',
  'Real Estate',
  'Legal',
  'Agriculture',
  'Armed Forces',
  'Homemaker',
  'Student',
  'Other',
];

const incomeRangeOptions = [
  'Under 50,000 PKR',
  '50,000 - 100,000 PKR',
  '100,000 - 250,000 PKR',
  '250,000 - 500,000 PKR',
  '500,000+ PKR',
  'Prefer not to say',
];

const siblingCountOptions = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8+',
];

const occupationOptions = [
  'Government Employee',
  'Private Employee',
  'Business Owner',
  'Retired',
  'Farmer',
  'Housewife',
  'Teacher',
  'Doctor',
  'Engineer',
  'Overseas',
  'Deceased',
  'Other',
];

const preferredAgeOptions = [
  '20-25',
  '25-30',
  '30-35',
  '35-40',
  'Custom Range',
];

const preferredCityOptions = [
  'Islamabad',
  'Lahore',
  'Karachi',
  'Multan',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Overseas',
  'Other',
];

const partnerEducationOptions = [
  'Matric',
  'Intermediate',
  'Graduation',
  "Master's",
  'MPhil',
  'PhD',
];

type ProfileFormData = {
  candidateName: string;
  photoVisibility: string;

  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  height: string;

  religion: string;
  sect: string;
  caste: string;

  city: string;
  province: string;
  country: string;
  nationality: string;
  residenceStatus: string;

  education: string;
  profession: string;
  employmentStatus: string;
  jobType: string;
  industry: string;
  incomeRange: string;

  complexion: string;
  bodyType: string;
  languages: string;

  totalSiblings: string;
  brothersCount: string;
  sistersCount: string;
  fatherOccupation: string;
  motherOccupation: string;
  familyDetails: string;

  expectedPartnerAge: string;
  expectedPartnerLocation: string;
  expectedPartnerEducation: string;
  requirements: string;

  additionalNotes: string;
  bureauPrivateNotes: string;
};

function calculateAgeFromDob(dateOfBirth: string) {
  if (!dateOfBirth) return '';

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference = today.getMonth() - dob.getMonth();
  const dayDifference = today.getDate() - dob.getDate();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && dayDifference < 0)
  ) {
    age -= 1;
  }

  if (age < 0 || age > 100) return '';

  return String(age);
}

function normalizeCount(value: string) {
  if (!value) return null;

  if (value === '8+') return 8;

  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}

export default function NewProfilePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProfileFormData>({
    candidateName: '',
    photoVisibility: 'public',

    gender: '',
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
    industry: '',
    incomeRange: '',

    complexion: '',
    bodyType: '',
    languages: '',

    totalSiblings: '',
    brothersCount: '',
    sistersCount: '',
    fatherOccupation: '',
    motherOccupation: '',
    familyDetails: '',

    expectedPartnerAge: '',
    expectedPartnerLocation: '',
    expectedPartnerEducation: '',
    requirements: '',

    additionalNotes: '',
    bureauPrivateNotes: '',
  });

  const calculatedAge = useMemo(
    () => calculateAgeFromDob(formData.dateOfBirth),
    [formData.dateOfBirth]
  );

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
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    const remainingSlots = 2 - selectedPhotos.length;

    if (remainingSlots <= 0) {
      setErrorMessage('Maximum 2 photos are allowed.');
      e.target.value = '';
      return;
    }

    const acceptedFiles: File[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload JPG, PNG, or WEBP images only.');
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage('Each photo must be smaller than 5MB.');
        e.target.value = '';
        return;
      }

      acceptedFiles.push(file);
    }

    if (files.length > remainingSlots) {
      setErrorMessage('Only 2 photos are allowed. Extra files were ignored.');
    } else {
      setErrorMessage('');
    }

    setSelectedPhotos((prev) => [...prev, ...acceptedFiles]);
    setPhotoPreviews((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setPhotoPreviews((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const uploadPhotos = async (userId: string) => {
    if (selectedPhotos.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const photo of selectedPhotos) {
      const watermarkedPhoto = await createWatermarkedImageFile(
        photo,
        'MBNPakistan.com'
      );

      const safeFileName = watermarkedPhoto.name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '')
        .toLowerCase();

      const filePath = `${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, watermarkedPhoto, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const validateRequiredFields = () => {
    const requiredFields: Array<[keyof ProfileFormData, string]> = [
      ['candidateName', 'Candidate Name is required.'],
      ['gender', 'Please select gender.'],
      ['dateOfBirth', 'Date of Birth is required.'],
      ['maritalStatus', 'Please select marital status.'],
      ['height', 'Please select height.'],
      ['complexion', 'Please select complexion.'],
      ['bodyType', 'Please select body type.'],
      ['languages', 'Please select language.'],

      ['religion', 'Please select religion.'],
      ['sect', 'Please select sect.'],
      ['caste', 'Please select caste.'],

      ['province', 'Please select province / region.'],
      ['city', 'Please select city. The system needs city to generate profile ID.'],
      ['country', 'Country is required.'],
      ['nationality', 'Nationality is required.'],
      ['residenceStatus', 'Please select residence status.'],

      ['education', 'Please select education.'],
      ['profession', 'Profession is required.'],
      ['employmentStatus', 'Please select employment status.'],
      ['jobType', 'Please select job type.'],
      ['industry', 'Please select industry.'],
      ['incomeRange', 'Please select income range.'],

      ['totalSiblings', 'Please select total siblings.'],
      ['brothersCount', 'Please select number of brothers.'],
      ['sistersCount', 'Please select number of sisters.'],
      ['fatherOccupation', 'Please select father occupation.'],
      ['motherOccupation', 'Please select mother occupation.'],
    ];

    for (const [fieldName, message] of requiredFields) {
      if (!formData[fieldName]?.trim()) {
        throw new Error(message);
      }
    }

    if (!calculatedAge) {
      throw new Error('Please enter a valid Date of Birth.');
    }

    if (Number(calculatedAge) < 18) {
      throw new Error('Candidate age must be at least 18 years.');
    }

    if (selectedPhotos.length < 1) {
      throw new Error('Candidate Photo is required. Please upload at least 1 photo.');
    }

    if (selectedPhotos.length > 2) {
      throw new Error('Maximum 2 photos are allowed.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      validateRequiredFields();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error('You must login again before creating a profile.');
      }

      const photoUrls = await uploadPhotos(user.id);
      const siblingsSummary = `${formData.totalSiblings} total siblings, ${formData.brothersCount} brothers, ${formData.sistersCount} sisters`;

      const { error } = await supabase.from('marriage_profiles').insert({
        created_by: user.id,
        bureau_email: user.email,

        profile_code: null,
        candidate_name: formData.candidateName.trim(),
        gender: formData.gender,
        age: Number(calculatedAge),
        date_of_birth: formData.dateOfBirth,

        marital_status: formData.maritalStatus,
        height: formData.height,

        religion: formData.religion || 'Islam',
        sect: formData.sect,
        caste: formData.caste,

        city: formData.city,
        province: formData.province,
        country: formData.country || 'Pakistan',
        nationality: formData.nationality || 'Pakistani',
        residence_status: formData.residenceStatus,

        education: formData.education,
        profession: formData.profession,
        employment_status: formData.employmentStatus,
        job_type: formData.jobType,
        industry: formData.industry,
        income_range: formData.incomeRange,

        complexion: formData.complexion,
        body_type: formData.bodyType,
        languages: formData.languages,

        siblings: siblingsSummary,
        total_siblings: normalizeCount(formData.totalSiblings),
        brothers_count: normalizeCount(formData.brothersCount),
        sisters_count: normalizeCount(formData.sistersCount),
        father_occupation: formData.fatherOccupation,
        mother_occupation: formData.motherOccupation,
        family_details: formData.familyDetails || null,

        expected_partner_age: formData.expectedPartnerAge || null,
        expected_partner_location: formData.expectedPartnerLocation || null,
        expected_partner_education: formData.expectedPartnerEducation || null,
        requirements: formData.requirements || null,

        additional_notes: formData.additionalNotes || null,
        bureau_private_notes: formData.bureauPrivateNotes || null,

        photo_url: photoUrls[0],
        photo_url_2: photoUrls[1] || null,
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
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
          Create a complete bride or groom profile for your bureau.
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
            Candidate Photos & Privacy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
            <div className="grid grid-cols-2 gap-3">
              {photoPreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <img
                    src={preview}
                    alt={`Profile preview ${index + 1}`}
                    className={`w-full h-48 object-cover object-top border border-slate-200 bg-slate-50 ${
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
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-slate-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photoPreviews.length === 0 && (
                <div className="col-span-2 w-full h-72 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-sm">No photo selected</p>
                </div>
              )}
            </div>

            <div>
              <label className="label">
                Candidate Photo * <span className="text-slate-400">(1 to 2 photos)</span>
              </label>

              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-green-700 text-white font-medium cursor-pointer hover:bg-green-800 transition">
                <Upload className="w-4 h-4" />
                Choose Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-slate-500 mt-3">
                Upload at least 1 and maximum 2 photos. Accepted formats: JPG,
                PNG, WEBP. Maximum size: 5MB per photo.
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
                    candidate wants privacy. Uploaded photos will automatically
                    include MBNPakistan.com watermark.
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
            <TextField
              label="Candidate Name *"
              name="candidateName"
              value={formData.candidateName}
              onChange={updateField}
              placeholder="Candidate full name"
              required
            />

            <SelectField
              label="Gender *"
              name="gender"
              value={formData.gender}
              onChange={updateField}
              options={['Male', 'Female']}
              placeholder="Select Gender"
              optionLabels={{
                Male: 'Male / Groom',
                Female: 'Female / Bride',
              }}
              required
            />

            <TextField
              label="Date of Birth *"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={updateField}
              required
            />

            <div>
              <label className="label">Age</label>
              <input
                value={calculatedAge ? `${calculatedAge} years` : ''}
                readOnly
                placeholder="Auto calculated from Date of Birth"
                className="input-field bg-slate-100 text-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1">
                Age is automatically calculated in completed years.
              </p>
            </div>

            <SelectField
              label="Marital Status *"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={updateField}
              options={maritalStatusOptions}
              placeholder="Select Marital Status"
              required
            />

            <SelectField
              label="Height *"
              name="height"
              value={formData.height}
              onChange={updateField}
              options={heightOptions}
              placeholder="Select Height"
              required
            />

            <SelectField
              label="Complexion *"
              name="complexion"
              value={formData.complexion}
              onChange={updateField}
              options={complexionOptions}
              placeholder="Select Complexion"
              required
            />

            <SelectField
              label="Body Type *"
              name="bodyType"
              value={formData.bodyType}
              onChange={updateField}
              options={bodyTypeOptions}
              placeholder="Select Body Type"
              required
            />

            <SelectField
              label="Languages *"
              name="languages"
              value={formData.languages}
              onChange={updateField}
              options={languageOptions}
              placeholder="Select Main Language"
              required
            />
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Religion & Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Religion *"
              name="religion"
              value={formData.religion}
              onChange={updateField}
              options={religionOptions}
              placeholder="Select Religion"
              required
            />

            <SelectField
              label="Sect *"
              name="sect"
              value={formData.sect}
              onChange={updateField}
              options={sectOptions}
              placeholder="Select Sect"
              required
            />

            <SelectField
              label="Caste / Community *"
              name="caste"
              value={formData.caste}
              onChange={updateField}
              options={pakistaniCastes}
              placeholder="Select Caste"
              required
            />
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Location Information
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
            <SelectField
              label="Province / Region *"
              name="province"
              value={formData.province}
              onChange={updateField}
              options={Object.keys(citiesByProvince)}
              placeholder="Select Province"
              required
            />

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

            <TextField
              label="Country *"
              name="country"
              value={formData.country}
              onChange={updateField}
              placeholder="Pakistan"
              required
            />

            <TextField
              label="Nationality *"
              name="nationality"
              value={formData.nationality}
              onChange={updateField}
              placeholder="Pakistani"
              required
            />

            <SelectField
              label="Residence Status *"
              name="residenceStatus"
              value={formData.residenceStatus}
              onChange={updateField}
              options={residenceStatusOptions}
              placeholder="Select Residence Status"
              required
            />
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Education & Career
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Education *"
              name="education"
              value={formData.education}
              onChange={updateField}
              options={educationOptions}
              placeholder="Select Education"
              required
            />

            <TextField
              label="Profession *"
              name="profession"
              value={formData.profession}
              onChange={updateField}
              placeholder="Doctor, Engineer, Business Owner"
              required
            />

            <SelectField
              label="Employment Status *"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={updateField}
              options={employmentStatusOptions}
              placeholder="Select Employment Status"
              required
            />

            <SelectField
              label="Job Type *"
              name="jobType"
              value={formData.jobType}
              onChange={updateField}
              options={jobTypeOptions}
              placeholder="Select Job Type"
              required
            />

            <SelectField
              label="Industry *"
              name="industry"
              value={formData.industry}
              onChange={updateField}
              options={industryOptions}
              placeholder="Select Industry"
              required
            />

            <SelectField
              label="Income Range *"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={updateField}
              options={incomeRangeOptions}
              placeholder="Select Income Range"
              required
            />
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Family Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Total Siblings *"
              name="totalSiblings"
              value={formData.totalSiblings}
              onChange={updateField}
              options={siblingCountOptions}
              placeholder="Select Total Siblings"
              required
            />

            <SelectField
              label="Brothers *"
              name="brothersCount"
              value={formData.brothersCount}
              onChange={updateField}
              options={siblingCountOptions}
              placeholder="Select Brothers"
              required
            />

            <SelectField
              label="Sisters *"
              name="sistersCount"
              value={formData.sistersCount}
              onChange={updateField}
              options={siblingCountOptions}
              placeholder="Select Sisters"
              required
            />

            <SelectField
              label="Father Occupation *"
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={updateField}
              options={occupationOptions}
              placeholder="Select Father Occupation"
              required
            />

            <SelectField
              label="Mother Occupation *"
              name="motherOccupation"
              value={formData.motherOccupation}
              onChange={updateField}
              options={occupationOptions}
              placeholder="Select Mother Occupation"
              required
            />

            <div className="md:col-span-2">
              <label className="label">Family Summary</label>
              <textarea
                name="familyDetails"
                value={formData.familyDetails}
                onChange={updateField}
                rows={3}
                placeholder="Optional: family background, values, siblings details, parents details..."
                className="input-field resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Partner Requirements <span className="text-slate-400 font-normal">(Optional)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Preferred Age Range"
              name="expectedPartnerAge"
              value={formData.expectedPartnerAge}
              onChange={updateField}
              options={preferredAgeOptions}
              placeholder="Select Preferred Age Range"
            />

            <SelectField
              label="Preferred City"
              name="expectedPartnerLocation"
              value={formData.expectedPartnerLocation}
              onChange={updateField}
              options={preferredCityOptions}
              placeholder="Select Preferred City"
            />

            <SelectField
              label="Expected Partner Education"
              name="expectedPartnerEducation"
              value={formData.expectedPartnerEducation}
              onChange={updateField}
              options={partnerEducationOptions}
              placeholder="Select Education"
            />

            <div className="md:col-span-2">
              <label className="label">Detailed Match Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={updateField}
                rows={3}
                placeholder="Optional: preferred caste, family background, lifestyle, etc."
                className="input-field resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Additional Public Notes
          </h2>

          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={updateField}
            rows={3}
            placeholder="Any additional notes that can be visible on profile search..."
            className="input-field resize-none"
          />

          <p className="text-xs text-slate-400 mt-2">
            This note may appear on public profile search. Do not write private
            bureau-only details here.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Bureau Private Notes
          </h2>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-4 flex items-start gap-3 text-sm text-slate-600">
            <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">
                Private note for your bureau only
              </p>
              <p className="mt-1">
                Use this for internal notes. Do not add information that should
                be visible to other bureaus.
              </p>
            </div>
          </div>

          <textarea
            name="bureauPrivateNotes"
            value={formData.bureauPrivateNotes}
            onChange={updateField}
            rows={4}
            placeholder="Internal note for your bureau only. Example: family serious, father abroad, only Multan/Bahawalpur preference..."
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

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  optionLabels = {},
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  optionLabels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input-field"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}
