'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Users,
  FileText,
  Mail,
  Eye,
  Clock,
  Search,
  RefreshCcw,'use client';

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import Link from 'next/link';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  HeartHandshake,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Upload,
  X,
  Copy,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { createWatermarkedImageFile } from '@/lib/watermarkImage';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';


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


const content = {
  en: {
    pageTitle: 'Submit Your Profile',
    pageText:
      'Share your information privately with MBN Pakistan. Our team will review your profile and may assign it to a suitable matchmaker or verified marriage bureau.',

    privateTitle: 'Private & Secure Submission',
    privateText:
      'Your submission is reviewed by MBN Pakistan and is not automatically published in the searchable marriage bureau network.',

    submitter: 'Who is submitting this profile?',
    candidate: 'Candidate Information',
    religion: 'Religion & Community',
    location: 'Location',
    career: 'Education & Career',
    family: 'Family Details',
    requirements: 'Partner Requirements',
    additional: 'Additional Information',
    photo: 'Candidate Photo',
    consent: 'Consent & Privacy',

    submitButton: 'Submit Profile for Review',
    submitting: 'Submitting Profile...',

    successTitle: 'Profile Submitted Successfully',
    successText:
      'Thank you for submitting your profile. Our team will review your information and contact you if suitable matching opportunities become available.',
    successNote:
      'Please keep your phone and WhatsApp details active so our team or an assigned matchmaker can contact you.',
    referenceLabel: 'Your Submission Reference',
    referenceHelp:
      'Please save this reference number and use it when contacting MBN Pakistan about your submission.',
    copyReference: 'Copy Reference Number',
    copiedReference: 'Reference Copied',
    backHome: 'Back to Homepage',
    submitAnother: 'Submit Another Profile',
  },

  ur: {
    pageTitle: 'اپنی پروفائل جمع کروائیں',
    pageText:
      'اپنی معلومات MBN Pakistan کے ساتھ نجی طور پر شیئر کریں۔ ہماری ٹیم آپ کی پروفائل کا جائزہ لے گی اور مناسب صورت میں اسے کسی میچ میکر یا تصدیق شدہ میرج بیورو کو اسائن کر سکتی ہے۔',

    privateTitle: 'نجی اور محفوظ سبمیشن',
    privateText:
      'آپ کی پروفائل کا پہلے MBN Pakistan کی ٹیم جائزہ لے گی۔ اسے خودکار طور پر سرچ نیٹ ورک میں شائع نہیں کیا جائے گا۔',

    submitter: 'یہ پروفائل کون جمع کروا رہا ہے؟',
    candidate: 'امیدوار کی معلومات',
    religion: 'مذہب اور کمیونٹی',
    location: 'مقام',
    career: 'تعلیم اور کیریئر',
    family: 'خاندانی معلومات',
    requirements: 'مطلوبہ شریک حیات',
    additional: 'اضافی معلومات',
    photo: 'امیدوار کی تصویر',
    consent: 'رضامندی اور پرائیویسی',

    submitButton: 'پروفائل جائزے کے لیے جمع کروائیں',
    submitting: 'پروفائل جمع ہو رہی ہے...',

    successTitle: 'پروفائل کامیابی سے جمع ہو گئی',
    successText:
      'اپنی پروفائل جمع کروانے کا شکریہ۔ ہماری ٹیم آپ کی معلومات کا جائزہ لے گی اور مناسب رشتے کے مواقع دستیاب ہونے پر آپ سے رابطہ کر سکتی ہے۔',
    successNote:
      'براہِ کرم اپنا فون اور واٹس ایپ فعال رکھیں تاکہ ہماری ٹیم یا اسائن شدہ میچ میکر آپ سے رابطہ کر سکے۔',
    referenceLabel: 'آپ کا سبمیشن ریفرنس',
    referenceHelp:
      'براہِ کرم یہ ریفرنس نمبر محفوظ رکھیں اور اپنی سبمیشن کے بارے میں MBN Pakistan سے رابطہ کرتے وقت اسے استعمال کریں۔',
    copyReference: 'ریفرنس نمبر کاپی کریں',
    copiedReference: 'ریفرنس کاپی ہو گیا',
    backHome: 'ہوم پیج پر واپس جائیں',
    submitAnother: 'ایک اور پروفائل جمع کروائیں',
  },
};


export default function SubmitProfilePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const t = content[language];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [
    submissionReference,
    setSubmissionReference,
  ] = useState('');

  const [
    referenceCopied,
    setReferenceCopied,
  ] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');


  const [formData, setFormData] = useState({
    submitterFullName: '',
    submitterEmail: '',
    submitterMobile: '',
    submitterWhatsApp: '',
    relationshipToCandidate: 'Self',

    candidateName: '',
    gender: '',
    age: '',
    dateOfBirth: '',
    maritalStatus: '',
    height: '',

    religion: 'Islam',
    sect: '',
    caste: '',

    province: '',
    city: '',
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

    photoVisibility: 'public',

    consentToStore: false,
    consentToShare: false,
  });


  const updateField = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));

      return;
    }

    const value = target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
  };


  const handlePhotoChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Please upload JPG, PNG, or WEBP image only.'
      );
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


  const uploadPhoto = async () => {
    if (!selectedPhoto) return null;

    const watermarkedPhoto =
      await createWatermarkedImageFile(
        selectedPhoto,
        'MBNPakistan.com'
      );

    const safeFileName = watermarkedPhoto.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '')
      .toLowerCase();

    const randomFolder =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const filePath = `${randomFolder}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public-submission-photos')
      .upload(filePath, watermarkedPhoto, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('public-submission-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (!formData.submitterFullName.trim()) {
        throw new Error('Please enter the submitter full name.');
      }

      if (!formData.submitterMobile.trim()) {
        throw new Error('Please enter a mobile number.');
      }

      if (!formData.gender) {
        throw new Error('Please select candidate gender.');
      }

      if (!formData.consentToStore) {
        throw new Error(
          'You must agree to secure storage of your profile information.'
        );
      }

      if (!formData.consentToShare) {
        throw new Error(
          'You must agree to matchmaking sharing with authorized bureaus or matchmakers.'
        );
      }

      const photoUrl = await uploadPhoto();

      const {
        data: submissionData,
        error,
      } = await supabase
        .from('public_profile_submissions')
        .insert({
          source_type: 'public_submission',

          submitter_full_name:
            formData.submitterFullName.trim(),

          submitter_email:
            formData.submitterEmail.trim() || null,

          submitter_mobile:
            formData.submitterMobile.trim(),

          submitter_whatsapp:
            formData.submitterWhatsApp.trim() || null,

          relationship_to_candidate:
            formData.relationshipToCandidate || 'Self',

          candidate_name:
            formData.candidateName.trim() || null,

          gender: formData.gender,

          age:
            formData.age
              ? Number(formData.age)
              : null,

          date_of_birth:
            formData.dateOfBirth || null,

          marital_status:
            formData.maritalStatus || null,

          height:
            formData.height || null,

          religion:
            formData.religion || 'Islam',

          sect:
            formData.sect || null,

          caste:
            formData.caste || null,

          province:
            formData.province || null,

          city:
            formData.city || null,

          country:
            formData.country || 'Pakistan',

          nationality:
            formData.nationality || 'Pakistani',

          residence_status:
            formData.residenceStatus || null,

          education:
            formData.education || null,

          profession:
            formData.profession || null,

          employment_status:
            formData.employmentStatus || null,

          job_type:
            formData.jobType || null,

          income_range:
            formData.incomeRange || null,

          complexion:
            formData.complexion || null,

          body_type:
            formData.bodyType || null,

          languages:
            formData.languages || null,

          siblings:
            formData.siblings || null,

          father_occupation:
            formData.fatherOccupation || null,

          mother_occupation:
            formData.motherOccupation || null,

          family_details:
            formData.familyDetails || null,

          expected_partner_age:
            formData.expectedPartnerAge || null,

          expected_partner_location:
            formData.expectedPartnerLocation || null,

          expected_partner_education:
            formData.expectedPartnerEducation || null,

          requirements:
            formData.requirements || null,

          additional_notes:
            formData.additionalNotes || null,

          photo_url: photoUrl,

          photo_visibility:
            formData.photoVisibility || 'public',

          consent_to_store:
            formData.consentToStore,

          consent_to_share:
            formData.consentToShare,

          review_status: 'new',

          converted_to_profile: false,
        })
        .select(
          'id, submission_reference'
        )
        .single();

      if (error) {
        throw error;
      }

      setSubmissionReference(
        submissionData?.submission_reference || ''
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Profile could not be submitted. Please try again.';

      setErrorMessage(message);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const copyReferenceNumber = async () => {
    if (!submissionReference) return;

    try {
      await navigator.clipboard.writeText(
        submissionReference
      );

      setReferenceCopied(true);

      window.setTimeout(() => {
        setReferenceCopied(false);
      }, 2500);

    } catch {
      setErrorMessage(
        'Reference number could not be copied automatically. Please copy it manually.'
      );
    }
  };


  const cityOptions = formData.province
    ? citiesByProvince[formData.province] || []
    : [];


  if (submitted) {
    return (
      <div
        dir={isUrdu ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#f3f8f4]"
      >
        <PublicHeader
          language={language}
          setLanguage={setLanguage}
        />

        <main className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <div className="bg-white border border-green-200 rounded-[2rem] p-8 md:p-12 text-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#137a4a]" />
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-slate-950 mt-7">
              {t.successTitle}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mt-5">
              {t.successText}
            </p>

            {submissionReference && (
              <div className="mt-8 rounded-3xl border-2 border-[#137a4a]/20 bg-[#f7fcf8] p-6 md:p-8">

                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#137a4a]">
                  {t.referenceLabel}
                </p>

                <div className="mt-4 rounded-2xl bg-white border border-green-200 px-4 py-5 md:px-6">
                  <p
                    dir="ltr"
                    className="font-mono text-2xl md:text-4xl font-black tracking-wide text-slate-950 break-all"
                  >
                    {submissionReference}
                  </p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mt-4">
                  {t.referenceHelp}
                </p>

                <button
                  type="button"
                  onClick={copyReferenceNumber}
                  className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  <Copy className="w-4 h-4" />

                  {referenceCopied
                    ? t.copiedReference
                    : t.copyReference}
                </button>

              </div>
            )}

            <div className="mt-7 rounded-2xl bg-green-50 border border-green-200 p-5">
              <p className="text-sm text-green-800 leading-relaxed">
                {t.successNote}
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#137a4a] text-white font-bold hover:bg-[#0b5f38]"
              >
                {t.backHome}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSubmissionReference('');
                  setReferenceCopied(false);
                  setErrorMessage('');
                  window.location.reload();
                }}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                {t.submitAnother}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#f3f8f4]"
    >
      <PublicHeader
        language={language}
        setLanguage={setLanguage}
      />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#137a4a] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {isUrdu ? 'ہوم پیج' : 'Back to Homepage'}
        </Link>


        <div className="relative overflow-hidden rounded-[2rem] bg-[#137a4a] p-8 md:p-12 text-white mb-8">
          <div className="absolute inset-0 opacity-20">
            <PatternLayer />
          </div>

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
              <HeartHandshake className="w-4 h-4" />
              MBN Pakistan Matchmaking
            </span>

            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-5">
              {t.pageTitle}
            </h1>

            <p className="text-green-50/90 text-lg mt-4 leading-relaxed">
              {t.pageText}
            </p>
          </div>
        </div>


        <div className="flex items-start gap-3 rounded-2xl bg-white border border-green-200 p-5 mb-8">
          <ShieldCheck className="w-6 h-6 text-[#137a4a] mt-0.5 flex-shrink-0" />

          <div>
            <p className="font-bold text-slate-950">
              {t.privateTitle}
            </p>

            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t.privateText}
            </p>
          </div>
        </div>


        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-10 space-y-10 shadow-sm"
        >

          {/* Submitter Details */}
          <FormSection title={t.submitter}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <label className="label">
                  Full Name *
                </label>

                <input
                  name="submitterFullName"
                  value={formData.submitterFullName}
                  onChange={updateField}
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </Field>


              <Field>
                <label className="label">
                  Relationship to Candidate *
                </label>

                <select
                  name="relationshipToCandidate"
                  value={formData.relationshipToCandidate}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="Self">Self</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Relative">Relative</option>
                  <option value="Family Friend">
                    Family Friend
                  </option>
                  <option value="Other">Other</option>
                </select>
              </Field>


              <Field>
                <label className="label">
                  Mobile Number *
                </label>

                <input
                  name="submitterMobile"
                  value={formData.submitterMobile}
                  onChange={updateField}
                  required
                  className="input-field"
                  placeholder="+92 300 1234567"
                />
              </Field>


              <Field>
                <label className="label">
                  WhatsApp Number
                </label>

                <input
                  name="submitterWhatsApp"
                  value={formData.submitterWhatsApp}
                  onChange={updateField}
                  className="input-field"
                  placeholder="+92 300 1234567"
                />
              </Field>


              <Field>
                <label className="label">
                  Email Address
                </label>

                <input
                  type="email"
                  name="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={updateField}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </Field>
            </div>
          </FormSection>


          {/* Candidate */}
          <FormSection title={t.candidate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Candidate Name
                </label>

                <input
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={updateField}
                  className="input-field"
                  placeholder="Full name"
                />
              </Field>


              <Field>
                <label className="label">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={updateField}
                  required
                  className="input-field"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male / Groom
                  </option>

                  <option value="Female">
                    Female / Bride
                  </option>
                </select>
              </Field>


              <Field>
                <label className="label">Age</label>

                <input
                  type="number"
                  min="18"
                  max="80"
                  name="age"
                  value={formData.age}
                  onChange={updateField}
                  className="input-field"
                  placeholder="28"
                />
              </Field>


              <Field>
                <label className="label">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <Field>
                <label className="label">
                  Marital Status
                </label>

                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Never Married">
                    Never Married
                  </option>
                  <option value="Divorced">
                    Divorced
                  </option>
                  <option value="Widow">
                    Widow
                  </option>
                  <option value="Widower">
                    Widower
                  </option>
                  <option value="Separated">
                    Separated
                  </option>
                </select>
              </Field>


              <Field>
                <label className="label">Height</label>

                <input
                  name="height"
                  value={formData.height}
                  onChange={updateField}
                  className="input-field"
                  placeholder="5 ft 8 in"
                />
              </Field>


              <Field>
                <label className="label">
                  Complexion
                </label>

                <select
                  name="complexion"
                  value={formData.complexion}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Fair">Fair</option>
                  <option value="Wheatish">
                    Wheatish
                  </option>
                  <option value="Medium">Medium</option>
                  <option value="Dark">Dark</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </Field>


              <Field>
                <label className="label">
                  Body Type
                </label>

                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Slim">Slim</option>
                  <option value="Average">
                    Average
                  </option>
                  <option value="Athletic">
                    Athletic
                  </option>
                  <option value="Healthy">
                    Healthy
                  </option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </Field>


              <Field>
                <label className="label">
                  Languages
                </label>

                <input
                  name="languages"
                  value={formData.languages}
                  onChange={updateField}
                  className="input-field"
                  placeholder="Urdu, Punjabi, English"
                />
              </Field>
            </div>
          </FormSection>


          {/* Religion */}
          <FormSection title={t.religion}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Religion
                </label>

                <input
                  name="religion"
                  value={formData.religion}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <Field>
                <label className="label">
                  Sect
                </label>

                <select
                  name="sect"
                  value={formData.sect}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">
                    Select Sect
                  </option>

                  {sectOptions.map((sect) => (
                    <option
                      key={sect}
                      value={sect}
                    >
                      {sect}
                    </option>
                  ))}
                </select>
              </Field>


              <Field>
                <label className="label">
                  Caste / Community
                </label>

                <select
                  name="caste"
                  value={formData.caste}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">
                    Select Caste
                  </option>

                  {pakistaniCastes.map((caste) => (
                    <option
                      key={caste}
                      value={caste}
                    >
                      {caste}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>


          {/* Location */}
          <FormSection title={t.location}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Province / Region
                </label>

                <select
                  name="province"
                  value={formData.province}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">
                    Select Province
                  </option>

                  {Object.keys(citiesByProvince).map(
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
              </Field>


              <Field>
                <label className="label">
                  City
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={updateField}
                  disabled={!formData.province}
                  className="input-field disabled:bg-slate-100"
                >
                  <option value="">
                    {formData.province
                      ? 'Select City'
                      : 'Select Province First'}
                  </option>

                  {cityOptions.map((city) => (
                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>
                  ))}
                </select>
              </Field>


              <Field>
                <label className="label">
                  Country
                </label>

                <input
                  name="country"
                  value={formData.country}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <Field>
                <label className="label">
                  Nationality
                </label>

                <input
                  name="nationality"
                  value={formData.nationality}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <Field>
                <label className="label">
                  Residence Status
                </label>

                <select
                  name="residenceStatus"
                  value={formData.residenceStatus}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Own House">
                    Own House
                  </option>
                  <option value="Rented House">
                    Rented House
                  </option>
                  <option value="Joint Family">
                    Joint Family
                  </option>
                  <option value="Nuclear Family">
                    Nuclear Family
                  </option>
                  <option value="Overseas Resident">
                    Overseas Resident
                  </option>
                </select>
              </Field>
            </div>
          </FormSection>


          {/* Career */}
          <FormSection title={t.career}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Education
                </label>

                <input
                  name="education"
                  value={formData.education}
                  onChange={updateField}
                  className="input-field"
                  placeholder="MBA, MBBS, BS Computer Science"
                />
              </Field>


              <Field>
                <label className="label">
                  Profession
                </label>

                <input
                  name="profession"
                  value={formData.profession}
                  onChange={updateField}
                  className="input-field"
                  placeholder="Doctor, Engineer, Business Owner"
                />
              </Field>


              <Field>
                <label className="label">
                  Employment Status
                </label>

                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="Employed">
                    Employed
                  </option>
                  <option value="Self-employed">
                    Self-employed
                  </option>
                  <option value="Business Owner">
                    Business Owner
                  </option>
                  <option value="Government Job">
                    Government Job
                  </option>
                  <option value="Private Job">
                    Private Job
                  </option>
                  <option value="Student">
                    Student
                  </option>
                  <option value="Unemployed">
                    Unemployed
                  </option>
                </select>
              </Field>


              <Field>
                <label className="label">
                  Job Type / Industry
                </label>

                <input
                  name="jobType"
                  value={formData.jobType}
                  onChange={updateField}
                  className="input-field"
                  placeholder="IT, Medical, Education, Business"
                />
              </Field>


              <Field>
                <label className="label">
                  Income Range
                </label>

                <select
                  name="incomeRange"
                  value={formData.incomeRange}
                  onChange={updateField}
                  className="input-field"
                >
                  <option value="">
                    Select Income Range
                  </option>

                  <option value="Under 50,000 PKR">
                    Under 50,000 PKR
                  </option>

                  <option value="50,000 - 100,000 PKR">
                    50,000 - 100,000 PKR
                  </option>

                  <option value="100,000 - 250,000 PKR">
                    100,000 - 250,000 PKR
                  </option>

                  <option value="250,000 - 500,000 PKR">
                    250,000 - 500,000 PKR
                  </option>

                  <option value="500,000+ PKR">
                    500,000+ PKR
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </Field>
            </div>
          </FormSection>


          {/* Family */}
          <FormSection title={t.family}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Siblings
                </label>

                <input
                  name="siblings"
                  value={formData.siblings}
                  onChange={updateField}
                  className="input-field"
                  placeholder="2 brothers, 1 sister"
                />
              </Field>


              <Field>
                <label className="label">
                  Father Occupation
                </label>

                <input
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <Field>
                <label className="label">
                  Mother Occupation
                </label>

                <input
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={updateField}
                  className="input-field"
                />
              </Field>


              <div className="md:col-span-2">
                <label className="label">
                  Family Summary
                </label>

                <textarea
                  name="familyDetails"
                  value={formData.familyDetails}
                  onChange={updateField}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us about family background, values and family structure..."
                />
              </div>
            </div>
          </FormSection>


          {/* Requirements */}
          <FormSection title={t.requirements}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Field>
                <label className="label">
                  Expected Partner Age
                </label>

                <input
                  name="expectedPartnerAge"
                  value={formData.expectedPartnerAge}
                  onChange={updateField}
                  className="input-field"
                  placeholder="24 - 30"
                />
              </Field>


              <Field>
                <label className="label">
                  Expected Partner Location
                </label>

                <input
                  name="expectedPartnerLocation"
                  value={formData.expectedPartnerLocation}
                  onChange={updateField}
                  className="input-field"
                  placeholder="Lahore, Islamabad, Overseas"
                />
              </Field>


              <Field>
                <label className="label">
                  Expected Partner Education
                </label>

                <input
                  name="expectedPartnerEducation"
                  value={formData.expectedPartnerEducation}
                  onChange={updateField}
                  className="input-field"
                  placeholder="Graduate, Masters, Doctor, Engineer"
                />
              </Field>


              <div className="md:col-span-2">
                <label className="label">
                  Detailed Match Requirements
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={updateField}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Preferred age, city, caste, education, family background and lifestyle..."
                />
              </div>
            </div>
          </FormSection>


          {/* Additional */}
          <FormSection title={t.additional}>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={updateField}
              rows={4}
              className="input-field resize-none"
              placeholder="Any other information you would like the matchmaking team to know..."
            />
          </FormSection>


          {/* Photo */}
          <FormSection title={t.photo}>
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">

              <div>
                {photoPreview ? (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={photoPreview}
                      alt="Candidate preview"
                      className="w-full h-72 object-cover object-top border border-slate-200"
                    />

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-72 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                    <p className="text-sm mt-2">
                      No photo selected
                    </p>
                  </div>
                )}
              </div>


              <div>
                <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#137a4a] text-white font-bold cursor-pointer hover:bg-[#0b5f38]">
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
                  JPG, PNG, or WEBP. Maximum 5MB.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Uploaded photos are automatically protected with an
                  MBNPakistan.com watermark.
                </p>


                <div className="mt-5">
                  <label className="label">
                    Photo Visibility Preference
                  </label>

                  <select
                    name="photoVisibility"
                    value={formData.photoVisibility}
                    onChange={updateField}
                    className="input-field"
                  >
                    <option value="public">
                      Public Photo
                    </option>

                    <option value="blurred">
                      Blurred for Privacy
                    </option>

                    <option value="hidden">
                      Hidden Photo
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </FormSection>


          {/* Consent */}
          <FormSection title={t.consent}>
            <div className="rounded-2xl bg-green-50 border border-green-200 p-5 mb-5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#137a4a] mt-0.5 flex-shrink-0" />

                <div>
                  <p className="font-bold text-green-950">
                    How your information may be used
                  </p>

                  <p className="text-sm text-green-800 mt-1 leading-relaxed">
                    MBN Pakistan may securely store your submitted
                    information, review it for matchmaking purposes, and
                    share relevant profile details with authorized
                    matchmakers or verified marriage bureaus where
                    appropriate.
                  </p>
                </div>
              </div>
            </div>


            <div className="space-y-4">

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consentToStore"
                  checked={formData.consentToStore}
                  onChange={updateField}
                  className="mt-1 w-4 h-4"
                />

                <span className="text-sm text-slate-700 leading-relaxed">
                  I agree that MBN Pakistan may securely store and
                  process the information submitted in this profile for
                  matchmaking and administrative purposes.
                </span>
              </label>


              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consentToShare"
                  checked={formData.consentToShare}
                  onChange={updateField}
                  className="mt-1 w-4 h-4"
                />

                <span className="text-sm text-slate-700 leading-relaxed">
                  I agree that relevant profile information may be
                  shared with authorized matchmakers or verified
                  marriage bureaus for legitimate matchmaking purposes.
                </span>
              </label>

            </div>
          </FormSection>


          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#137a4a] text-white font-bold text-lg hover:bg-[#0b5f38] disabled:opacity-50"
            >
              <HeartHandshake className="w-5 h-5" />

              {isSubmitting
                ? t.submitting
                : t.submitButton}
            </button>

            <p className="text-xs text-center text-slate-400 mt-3">
              Submitting a profile does not guarantee a match.
              MBN Pakistan may contact you if additional information is
              required or suitable matching opportunities become available.
            </p>
          </div>

        </form>
      </main>
    </div>
  );
}


function PublicHeader({
  language,
  setLanguage,
}: {
  language: 'en' | 'ur';
  setLanguage: (value: 'en' | 'ur') => void;
}) {
  return (
    <header className="bg-white border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="w-12 h-12 object-contain"
          />

          <div>
            <p className="font-heading font-bold text-slate-950">
              MBN Pakistan
            </p>

            <p className="text-xs text-slate-500">
              Marriage Bureau Network
            </p>
          </div>
        </Link>

        <LanguageToggle
          language={language}
          setLanguage={setLanguage}
        />

      </div>
    </header>
  );
}


function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
        {title}
      </h2>

      {children}
    </section>
  );
}


function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}


function PatternLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 20%, rgba(255,255,255,0.22) 0 2px, transparent 2px),
          radial-gradient(circle at 82% 28%, rgba(255,255,255,0.15) 0 2px, transparent 2px),
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.08) 49%, rgba(255,255,255,0.08) 51%, transparent 52%)
        `,
        backgroundSize:
          '120px 120px, 150px 150px, 34px 34px',
      }}
    />
  );
}
  Building2,
  UserCheck,
  UserX,
  Ban,
  RotateCcw,
  Inbox,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  NotebookPen,
  Lock,
  ImageIcon,
  HeartHandshake,
  UserRoundSearch,
  Send,
  ClipboardList,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';


type BureauApplication = {
  id: string;
  full_name: string | null;
  role_in_bureau: string | null;
  mobile_number: string | null;
  whatsapp_number: string | null;
  email: string | null;
  cnic: string | null;

  business_name: string | null;
  years_in_business: string | null;
  active_profiles: string | null;
  has_physical_office: string | null;
  office_phone: string | null;

  city: string | null;
  province: string | null;
  country: string | null;
  office_address: string | null;
  areas_served: string | null;

  website: string | null;
  social_link: string | null;
  google_business_link: string | null;

  specializations: string[] | null;

  reference_name_1: string | null;
  reference_phone_1: string | null;
  reference_name_2: string | null;
  reference_phone_2: string | null;

  status: string | null;
  admin_notes: string | null;
  created_at: string | null;
};


type MarriageProfile = {
  id: string;
  profile_code: string | null;
  candidate_name: string | null;
  gender: string | null;
  age: number | null;
  marital_status: string | null;
  city: string | null;
  province: string | null;
  caste: string | null;
  sect: string | null;
  education: string | null;
  profession: string | null;
  employment_status: string | null;
  bureau_email: string | null;
  photo_url: string | null;
  photo_visibility: string | null;
  status: string | null;
  created_at: string | null;
};


type PublicSubmission = {
  id: string;

  source_type: string | null;

  submitter_full_name: string | null;
  submitter_email: string | null;
  submitter_mobile: string | null;
  submitter_whatsapp: string | null;
  relationship_to_candidate: string | null;

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

  consent_to_store: boolean | null;
  consent_to_share: boolean | null;

  review_status: string | null;

  admin_private_notes: string | null;

  assigned_bureau_email: string | null;
  assigned_matchmaker_name: string | null;
  assigned_at: string | null;
  assigned_by_email: string | null;

  converted_to_profile: boolean | null;
  converted_profile_id: string | null;
  converted_at: string | null;

  submitted_at: string | null;
  updated_at: string | null;

  bureau_work_status?: string | null;
  bureau_private_notes?: string | null;
  bureau_last_follow_up_at?: string | null;
  bureau_next_follow_up_at?: string | null;
  bureau_work_updated_at?: string | null;
};


type AdminBureauWork = {
  submission_id: string;
  work_status: string | null;
  bureau_private_notes: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  updated_at: string | null;
};


type AdminFollowUp = {
  id: string;
  note: string;
  status_at_time: string | null;
  created_at: string | null;
};


type ContactMessage = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bureau_name: string | null;
  inquiry_type: string | null;
  message: string | null;
  status: string | null;
  created_at: string | null;
};


type ContactLog = {
  id: string;
  viewer_email: string | null;
  viewer_business_name: string | null;
  profile_code: string | null;
  profile_candidate_name: string | null;
  profile_gender: string | null;
  uploader_email: string | null;
  uploader_business_name: string | null;
  viewed_at: string | null;
};


type Stats = {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;

  totalProfiles: number;
  activeProfiles: number;
  inactiveProfiles: number;

  publicSubmissions: number;
  newPublicSubmissions: number;
  assignedPublicSubmissions: number;

  contactMessages: number;
  newMessages: number;

  contactViews: number;
};


type TabKey =
  | 'overview'
  | 'applications'
  | 'public-submissions'
  | 'profiles'
  | 'messages'
  | 'logs';


const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'applications', label: 'Bureau Requests' },
  { key: 'public-submissions', label: 'Public Submissions' },
  { key: 'profiles', label: 'Profiles Control' },
  { key: 'messages', label: 'Contact Messages' },
  { key: 'logs', label: 'Contact View Logs' },
];


const publicSubmissionStatuses = [
  'new',
  'under_review',
  'need_more_information',
  'approved_for_matching',
  'assigned',
  'matching_active',
  'potential_match_found',
  'in_discussion',
  'matched',
  'closed',
  'rejected',
];


function formatDate(value: string | null) {
  if (!value) return 'N/A';

  return new Date(value).toLocaleString();
}


function statusClass(status: string | null) {
  if (
    status === 'approved' ||
    status === 'active' ||
    status === 'closed' ||
    status === 'matched' ||
    status === 'approved_for_matching'
  ) {
    return 'bg-green-100 text-green-700';
  }

  if (
    status === 'rejected' ||
    status === 'inactive'
  ) {
    return 'bg-red-100 text-red-700';
  }

  if (
    status === 'reviewed' ||
    status === 'under_review' ||
    status === 'matching_active' ||
    status === 'in_discussion'
  ) {
    return 'bg-blue-100 text-blue-700';
  }

  if (
    status === 'assigned' ||
    status === 'potential_match_found'
  ) {
    return 'bg-purple-100 text-purple-700';
  }

  return 'bg-amber-100 text-amber-700';
}


function formatStatus(value: string | null) {
  if (!value) return 'New';

  return value
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
}


function getWhatsAppLink(number: string | null) {
  if (!number) return '';

  const clean = number.replace(/\D/g, '');

  return clean ? `https://wa.me/${clean}` : '';
}


function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-3">
            {value}
          </p>

          <p className="text-sm text-slate-500 mt-2">
            {subtitle}
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


function SectionHeader({
  title,
  count,
  subtitle,
}: {
  title: string;
  count: number;
  subtitle?: string;
}) {
  return (
    <div className="px-6 py-5 border-b border-slate-100">
      <h2 className="font-heading text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {count} record(s)
        {subtitle ? ` • ${subtitle}` : ''}
      </p>
    </div>
  );
}


function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-slate-400" />
      </div>

      <p className="font-semibold text-slate-900">
        {text}
      </p>
    </div>
  );
}


function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (!value) return null;

  return (
    <p>
      <span className="font-semibold text-slate-900">
        {label}:
      </span>{' '}

      <span>{value}</span>
    </p>
  );
}


export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [currentEmail, setCurrentEmail] =
    useState('');

  const [activeTab, setActiveTab] =
    useState<TabKey>('overview');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [actionLoading, setActionLoading] =
    useState('');


  const [conversionResult, setConversionResult] =
    useState<
      Record<
        string,
        {
          profileCode: string | null;
          profileId: string | null;
        }
      >
    >({});


  const [stats, setStats] =
    useState<Stats>({
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,

      totalProfiles: 0,
      activeProfiles: 0,
      inactiveProfiles: 0,

      publicSubmissions: 0,
      newPublicSubmissions: 0,
      assignedPublicSubmissions: 0,

      contactMessages: 0,
      newMessages: 0,

      contactViews: 0,
    });


  const [applications, setApplications] =
    useState<BureauApplication[]>([]);

  const [profiles, setProfiles] =
    useState<MarriageProfile[]>([]);

  const [publicSubmissions, setPublicSubmissions] =
    useState<PublicSubmission[]>([]);

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [logs, setLogs] =
    useState<ContactLog[]>([]);


  const [
    selectedMonitoringSubmission,
    setSelectedMonitoringSubmission,
  ] =
    useState<PublicSubmission | null>(
      null
    );


  const [adminNotesDraft, setAdminNotesDraft] =
    useState<Record<string, string>>({});


  const [
    publicAdminNotesDraft,
    setPublicAdminNotesDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    bureauAssignmentDraft,
    setBureauAssignmentDraft,
  ] =
    useState<Record<string, string>>({});


  const [
    matchmakerAssignmentDraft,
    setMatchmakerAssignmentDraft,
  ] =
    useState<Record<string, string>>({});


  const checkAdmin = async (
    email: string
  ) => {
    const { data, error } = await supabase
      .from('site_admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) return false;

    return Boolean(data);
  };


  const getCount = async (
    tableName: string,
    column?: string,
    value?: string
  ) => {
    let query = supabase
      .from(tableName)
      .select('*', {
        count: 'exact',
        head: true,
      });

    if (column && value) {
      query = query.eq(column, value);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  };


  const loadAdminData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');


      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();


      if (
        userError ||
        !user ||
        !user.email
      ) {
        throw new Error(
          'Please login again to access admin console.'
        );
      }


      setCurrentEmail(user.email);


      const adminStatus =
        await checkAdmin(user.email);

      setIsAdmin(adminStatus);


      if (!adminStatus) {
        return;
      }


      const [
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,

        totalProfiles,
        activeProfiles,
        inactiveProfiles,

        publicSubmissionCount,
        newPublicSubmissionCount,
        assignedPublicSubmissionCount,

        contactMessages,
        newMessages,

        contactViews,
      ] = await Promise.all([
        getCount('bureau_applications'),

        getCount(
          'bureau_applications',
          'status',
          'pending'
        ),

        getCount(
          'bureau_applications',
          'status',
          'approved'
        ),

        getCount(
          'bureau_applications',
          'status',
          'rejected'
        ),

        getCount('marriage_profiles'),

        getCount(
          'marriage_profiles',
          'status',
          'active'
        ),

        getCount(
          'marriage_profiles',
          'status',
          'inactive'
        ),

        getCount(
          'public_profile_submissions'
        ),

        getCount(
          'public_profile_submissions',
          'review_status',
          'new'
        ),

        getCount(
          'public_profile_submissions',
          'review_status',
          'assigned'
        ),

        getCount('contact_messages'),

        getCount(
          'contact_messages',
          'status',
          'new'
        ),

        getCount('contact_view_logs'),
      ]);


      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,

        totalProfiles,
        activeProfiles,
        inactiveProfiles,

        publicSubmissions:
          publicSubmissionCount,

        newPublicSubmissions:
          newPublicSubmissionCount,

        assignedPublicSubmissions:
          assignedPublicSubmissionCount,

        contactMessages,
        newMessages,

        contactViews,
      });


      const {
        data: applicationData,
        error: applicationError,
      } = await supabase
        .from('bureau_applications')
        .select(`
          id,
          full_name,
          role_in_bureau,
          mobile_number,
          whatsapp_number,
          email,
          cnic,
          business_name,
          years_in_business,
          active_profiles,
          has_physical_office,
          office_phone,
          city,
          province,
          country,
          office_address,
          areas_served,
          website,
          social_link,
          google_business_link,
          specializations,
          reference_name_1,
          reference_phone_1,
          reference_name_2,
          reference_phone_2,
          status,
          admin_notes,
          created_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (applicationError) {
        throw applicationError;
      }


      const {
        data: publicSubmissionData,
        error: publicSubmissionError,
      } = await supabase
        .from('public_profile_submissions')
        .select(`
          id,
          source_type,

          submitter_full_name,
          submitter_email,
          submitter_mobile,
          submitter_whatsapp,
          relationship_to_candidate,

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

          consent_to_store,
          consent_to_share,

          review_status,

          admin_private_notes,

          assigned_bureau_email,
          assigned_matchmaker_name,
          assigned_at,
          assigned_by_email,

          converted_to_profile,
          converted_profile_id,
          converted_at,

          submitted_at,
          updated_at
        `)
        .order(
          'submitted_at',
          { ascending: false }
        )
        .limit(500);


      if (publicSubmissionError) {
        throw publicSubmissionError;
      }


      const {
        data: bureauWorkData,
        error: bureauWorkError,
      } = await supabase.rpc(
        'get_admin_assigned_profile_work'
      );


      if (bureauWorkError) {
        throw bureauWorkError;
      }


      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from('marriage_profiles')
        .select(`
          id,
          profile_code,
          candidate_name,
          gender,
          age,
          marital_status,
          city,
          province,
          caste,
          sect,
          education,
          profession,
          employment_status,
          bureau_email,
          photo_url,
          photo_visibility,
          status,
          created_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (profileError) {
        throw profileError;
      }


      const {
        data: messageData,
        error: messageError,
      } = await supabase
        .from('contact_messages')
        .select(`
          id,
          full_name,
          email,
          phone,
          bureau_name,
          inquiry_type,
          message,
          status,
          created_at
        `)
        .order(
          'created_at',
          { ascending: false }
        )
        .limit(500);


      if (messageError) {
        throw messageError;
      }


      const {
        data: logData,
        error: logError,
      } = await supabase
        .from('contact_view_logs')
        .select(`
          id,
          viewer_email,
          viewer_business_name,
          profile_code,
          profile_candidate_name,
          profile_gender,
          uploader_email,
          uploader_business_name,
          viewed_at
        `)
        .order(
          'viewed_at',
          { ascending: false }
        )
        .limit(700);


      if (logError) {
        throw logError;
      }


      const loadedApplications =
        (applicationData || []) as BureauApplication[];


      const loadedPublicSubmissions =
        (publicSubmissionData || []) as PublicSubmission[];


      const loadedBureauWork =
        (bureauWorkData || []) as AdminBureauWork[];


      const bureauWorkMap = new Map(
        loadedBureauWork.map(
          (work) => [
            work.submission_id,
            work,
          ]
        )
      );


      const submissionsWithBureauWork =
        loadedPublicSubmissions.map(
          (submission) => {

            const work =
              bureauWorkMap.get(
                submission.id
              );


            return {
              ...submission,

              bureau_work_status:
                work?.work_status ||
                null,

              bureau_private_notes:
                work?.bureau_private_notes ||
                null,

              bureau_last_follow_up_at:
                work?.last_follow_up_at ||
                null,

              bureau_next_follow_up_at:
                work?.next_follow_up_at ||
                null,

              bureau_work_updated_at:
                work?.updated_at ||
                null,
            };
          }
        );


      const bureauNotes:
        Record<string, string> = {};


      loadedApplications.forEach(
        (app) => {
          bureauNotes[app.id] =
            app.admin_notes || '';
        }
      );


      const publicNotes:
        Record<string, string> = {};


      const bureauDraft:
        Record<string, string> = {};


      const matchmakerDraft:
        Record<string, string> = {};


      loadedPublicSubmissions.forEach(
        (submission) => {
          publicNotes[submission.id] =
            submission.admin_private_notes || '';

          bureauDraft[submission.id] =
            submission.assigned_bureau_email || '';

          matchmakerDraft[submission.id] =
            submission.assigned_matchmaker_name || '';
        }
      );


      setAdminNotesDraft(bureauNotes);

      setPublicAdminNotesDraft(
        publicNotes
      );

      setBureauAssignmentDraft(
        bureauDraft
      );

      setMatchmakerAssignmentDraft(
        matchmakerDraft
      );


      setApplications(
        loadedApplications
      );

      setPublicSubmissions(
        submissionsWithBureauWork
      );

      setProfiles(
        (profileData || []) as MarriageProfile[]
      );

      setMessages(
        (messageData || []) as ContactMessage[]
      );

      setLogs(
        (logData || []) as ContactLog[]
      );

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Admin console could not be loaded. Please try again.';

      setErrorMessage(message);

    } finally {
      setLoading(false);
    }
  };


  const updateApplicationStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('bureau_applications')
        .update({ status })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Bureau request marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Request could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const saveAdminNotes = async (
    id: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('bureau_applications')
        .update({
          admin_notes:
            adminNotesDraft[id] || null,
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        'Admin notes saved.'
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Admin notes could not be saved.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updatePublicSubmissionStatus = async (
    id: string,
    reviewStatus: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('public_profile_submissions')
        .update({
          review_status: reviewStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Public submission status changed to ${formatStatus(
          reviewStatus
        )}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Submission status could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };



  const convertPublicSubmission = async (
    submissionId: string
  ) => {
    const confirmed = window.confirm(
      'Convert this approved public submission into an active MBN network profile? This action should only be completed once.'
    );

    if (!confirmed) return;

    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');

      const { data, error } = await supabase.rpc(
        'convert_public_submission_to_profile',
        {
          p_submission_id: submissionId,
        }
      );

      if (error) {
        throw error;
      }

      const result =
        typeof data === 'object' &&
        data !== null
          ? (data as {
              profile_code?: string | null;
              profile_id?: string | null;
            })
          : null;

      const profileCode =
        result?.profile_code || null;

      const profileId =
        result?.profile_id || null;

      setConversionResult((prev) => ({
        ...prev,
        [submissionId]: {
          profileCode,
          profileId,
        },
      }));

      setSuccessMessage(
        profileCode
          ? `Profile successfully converted. New MBN ID: ${profileCode}`
          : 'Profile successfully converted to the MBN network.'
      );

      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Submission could not be converted.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const savePublicAdminNotes = async (
    id: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('public_profile_submissions')
        .update({
          admin_private_notes:
            publicAdminNotesDraft[id] || null,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        'Private admin notes saved.'
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Private notes could not be saved.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const assignSubmissionToBureau = async (
    submissionId: string
  ) => {
    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');


      const bureauEmail =
        bureauAssignmentDraft[
          submissionId
        ]?.trim();


      if (!bureauEmail) {
        throw new Error(
          'Please select a marriage bureau first.'
        );
      }


      const bureau =
        applications.find(
          (item) =>
            item.email === bureauEmail
        );


      const assignmentTime =
        new Date().toISOString();


      const { error: updateError } =
        await supabase
          .from(
            'public_profile_submissions'
          )
          .update({
            assigned_bureau_email:
              bureauEmail,

            assigned_matchmaker_name:
              null,

            assigned_at:
              assignmentTime,

            assigned_by_email:
              currentEmail,

            review_status:
              'assigned',

            updated_at:
              assignmentTime,
          })
          .eq(
            'id',
            submissionId
          );


      if (updateError) {
        throw updateError;
      }


      const {
        error: historyError,
      } = await supabase
        .from(
          'public_profile_assignment_history'
        )
        .insert({
          submission_id:
            submissionId,

          assigned_to_type:
            'bureau',

          assigned_to_name:
            bureau?.business_name ||
            bureau?.full_name ||
            bureauEmail,

          assigned_to_email:
            bureauEmail,

          assigned_by_email:
            currentEmail,

          assignment_notes:
            `Assigned by Super Admin to ${
              bureau?.business_name ||
              bureauEmail
            }.`,
        });


      if (historyError) {
        throw historyError;
      }


      setSuccessMessage(
        `Profile assigned to ${
          bureau?.business_name ||
          bureauEmail
        }.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be assigned.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const assignSubmissionToMatchmaker = async (
    submissionId: string
  ) => {
    try {
      setActionLoading(submissionId);
      setErrorMessage('');
      setSuccessMessage('');


      const matchmakerName =
        matchmakerAssignmentDraft[
          submissionId
        ]?.trim();


      if (!matchmakerName) {
        throw new Error(
          'Please enter a matchmaker name.'
        );
      }


      const assignmentTime =
        new Date().toISOString();


      const { error: updateError } =
        await supabase
          .from(
            'public_profile_submissions'
          )
          .update({
            assigned_matchmaker_name:
              matchmakerName,

            assigned_bureau_email:
              null,

            assigned_at:
              assignmentTime,

            assigned_by_email:
              currentEmail,

            review_status:
              'assigned',

            updated_at:
              assignmentTime,
          })
          .eq(
            'id',
            submissionId
          );


      if (updateError) {
        throw updateError;
      }


      const {
        error: historyError,
      } = await supabase
        .from(
          'public_profile_assignment_history'
        )
        .insert({
          submission_id:
            submissionId,

          assigned_to_type:
            'matchmaker',

          assigned_to_name:
            matchmakerName,

          assigned_to_email:
            null,

          assigned_by_email:
            currentEmail,

          assignment_notes:
            `Assigned by Super Admin to matchmaker ${matchmakerName}.`,
        });


      if (historyError) {
        throw historyError;
      }


      setSuccessMessage(
        `Profile assigned to matchmaker ${matchmakerName}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be assigned.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updateProfileStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('marriage_profiles')
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Profile marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Profile could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updateProfilePhotoVisibility = async (
    id: string,
    photoVisibility: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('marriage_profiles')
        .update({
          photo_visibility:
            photoVisibility,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Profile photo visibility changed to ${photoVisibility}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Photo privacy could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  const updateMessageStatus = async (
    id: string,
    status: string
  ) => {
    try {
      setActionLoading(id);
      setErrorMessage('');
      setSuccessMessage('');


      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);


      if (error) throw error;


      setSuccessMessage(
        `Message marked as ${status}.`
      );


      await loadAdminData();

    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Message could not be updated.'
      );

    } finally {
      setActionLoading('');
    }
  };


  useEffect(() => {
    loadAdminData();
  }, []);


  const filteredApplications =
    applications.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


      const matchesSearch = [
        item.full_name,
        item.business_name,
        item.email,
        item.mobile_number,
        item.whatsapp_number,
        item.city,
        item.province,
        item.status,
        item.cnic,
        item.office_address,
        item.areas_served,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredPublicSubmissions =
    publicSubmissions.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.review_status ===
            statusFilter
          : true;


      const matchesSearch = [
        item.submitter_full_name,
        item.submitter_email,
        item.submitter_mobile,
        item.submitter_whatsapp,

        item.candidate_name,
        item.gender,
        item.age,
        item.marital_status,

        item.city,
        item.province,

        item.sect,
        item.caste,

        item.education,
        item.profession,
        item.employment_status,

        item.assigned_bureau_email,
        item.assigned_matchmaker_name,

        item.review_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredProfiles =
    profiles.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


      const matchesSearch = [
        item.profile_code,
        item.candidate_name,
        item.gender,
        item.age,
        item.marital_status,
        item.city,
        item.province,
        item.caste,
        item.sect,
        item.education,
        item.profession,
        item.employment_status,
        item.bureau_email,
        item.status,
        item.photo_visibility,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredMessages =
    messages.filter((item) => {
      const matchesStatus =
        statusFilter
          ? item.status === statusFilter
          : true;


      const matchesSearch = [
        item.full_name,
        item.email,
        item.phone,
        item.bureau_name,
        item.inquiry_type,
        item.message,
        item.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );


      return (
        matchesStatus &&
        matchesSearch
      );
    });


  const filteredLogs =
    logs.filter((item) =>
      [
        item.viewer_email,
        item.viewer_business_name,
        item.profile_code,
        item.profile_candidate_name,
        item.profile_gender,
        item.uploader_email,
        item.uploader_business_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );


  const approvedBureaus =
    applications.filter(
      (app) =>
        app.status === 'approved' &&
        app.email
    );


  const recentPendingApplications =
    applications
      .filter(
        (app) =>
          app.status === 'pending'
      )
      .slice(0, 5);


  const recentPublicSubmissions =
    publicSubmissions
      .filter(
        (submission) =>
          submission.review_status ===
          'new'
      )
      .slice(0, 5);


  const recentMessages =
    messages.slice(0, 5);


  const recentLogs =
    logs.slice(0, 5);


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-80 bg-slate-200 rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 bg-slate-200 rounded-2xl animate-pulse"
              />
            )
          )}
        </div>

        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }


  if (!isAdmin) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Super Admin Access Required
          </h1>

          <p className="text-slate-500 mt-2">
            This console is private and only
            accessible to the website owner /
            super admin.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
            Logged in email:{' '}

            <span className="font-semibold">
              {currentEmail || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Super Admin Console
          </h1>

          <p className="text-slate-500 mt-1">
            Full control center for bureau requests,
            public submissions, profiles, messages,
            assignments, and contact activity.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>


      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}


      {successMessage && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5">

        <StatCard
          title="Applications"
          value={stats.totalApplications}
          subtitle={`${stats.pendingApplications} pending`}
          icon={
            <Building2 className="w-6 h-6 text-green-700" />
          }
          bg="bg-green-50"
        />


        <StatCard
          title="Approved Bureaus"
          value={stats.approvedApplications}
          subtitle={`${stats.rejectedApplications} rejected`}
          icon={
            <UserCheck className="w-6 h-6 text-blue-700" />
          }
          bg="bg-blue-50"
        />


        <StatCard
          title="Public Submissions"
          value={stats.publicSubmissions}
          subtitle={`${stats.newPublicSubmissions} new`}
          icon={
            <HeartHandshake className="w-6 h-6 text-emerald-700" />
          }
          bg="bg-emerald-50"
        />


        <StatCard
          title="Network Profiles"
          value={stats.totalProfiles}
          subtitle={`${stats.activeProfiles} active`}
          icon={
            <FileText className="w-6 h-6 text-purple-700" />
          }
          bg="bg-purple-50"
        />


        <StatCard
          title="Messages"
          value={stats.contactMessages}
          subtitle={`${stats.newMessages} new`}
          icon={
            <Mail className="w-6 h-6 text-amber-700" />
          }
          bg="bg-amber-50"
        />


        <StatCard
          title="Contact Views"
          value={stats.contactViews}
          subtitle="Total reveal logs"
          icon={
            <Eye className="w-6 h-6 text-red-700" />
          }
          bg="bg-red-50"
        />

      </div>


      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">

          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setSearchTerm('');
                setStatusFilter('');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}

              {tab.key ===
                'public-submissions' &&
                stats.newPublicSubmissions > 0 && (
                  <span className="ml-2 inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-white text-green-700 text-xs">
                    {
                      stats.newPublicSubmissions
                    }
                  </span>
                )}
            </button>
          ))}

        </div>


        {activeTab !== 'overview' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_240px] gap-3">

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search current section..."
                className="input-field pl-10"
              />
            </div>


            {(
              activeTab === 'applications' ||
              activeTab === 'public-submissions' ||
              activeTab === 'profiles' ||
              activeTab === 'messages'
            ) && (
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="input-field"
              >
                <option value="">
                  All Status
                </option>


                {activeTab ===
                  'applications' && (
                  <>
                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </>
                )}


                {activeTab ===
                  'public-submissions' &&
                  publicSubmissionStatuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {
                          formatStatus(
                            status
                          )
                        }
                      </option>
                    )
                  )}


                {activeTab ===
                  'profiles' && (
                  <>
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </>
                )}


                {activeTab ===
                  'messages' && (
                  <>
                    <option value="new">
                      New
                    </option>

                    <option value="reviewed">
                      Reviewed
                    </option>

                    <option value="closed">
                      Closed
                    </option>
                  </>
                )}

              </select>
            )}

          </div>
        )}
      </div>


      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Platform Status
            </h2>


            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Pending Bureau Requests
                </span>

                <span className="font-bold text-amber-600">
                  {
                    stats.pendingApplications
                  }
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  New Public Profiles
                </span>

                <span className="font-bold text-green-600">
                  {
                    stats.newPublicSubmissions
                  }
                </span>
              </div>


              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Active Network Profiles
                </span>

                <span className="font-bold text-blue-600">
                  {stats.activeProfiles}
                </span>
              </div>

            </div>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-2">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              New Public Submissions
            </h2>


            {recentPublicSubmissions.length ===
            0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No new public profile submissions.
              </p>
            ) : (
              <div className="mt-5 space-y-4">

                {recentPublicSubmissions.map(
                  (submission) => (
                    <div
                      key={submission.id}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>
                          <p className="font-bold text-slate-900">
                            {
                              submission.candidate_name ||
                              submission.submitter_full_name ||
                              'Public Submission'
                            }
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              submission.gender ||
                              'Gender N/A'
                            }{' '}
                            •{' '}
                            {
                              submission.age ||
                              'Age N/A'
                            }{' '}
                            •{' '}
                            {
                              submission.city ||
                              'City N/A'
                            }
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Submitted:{' '}
                            {
                              formatDate(
                                submission.submitted_at
                              )
                            }
                          </p>
                        </div>


                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(
                              'public-submissions'
                            );

                            setSearchTerm(
                              submission.submitter_mobile ||
                              submission.candidate_name ||
                              ''
                            );
                          }}
                          className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100"
                        >
                          Review Submission
                        </button>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Pending Bureau Requests
            </h2>


            {recentPendingApplications.length ===
            0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No pending bureau requests.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentPendingApplications.map(
                  (app) => (
                    <div
                      key={app.id}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {
                          app.business_name ||
                          'Unnamed Bureau'
                        }
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {
                          app.city ||
                          'N/A'
                        }
                      </p>
                    </div>
                  )
                )}

              </div>
            )}
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6 xl:col-span-2">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Latest Contact Activity
            </h2>


            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No contact view logs yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-50 text-sm text-slate-600"
                  >
                    <span className="font-semibold text-slate-900">
                      {
                        log.viewer_business_name ||
                        log.viewer_email ||
                        'Viewer'
                      }
                    </span>{' '}

                    viewed contact for{' '}

                    <span className="font-semibold text-slate-900">
                      {
                        log.profile_code ||
                        'profile'
                      }
                    </span>

                    <p className="text-xs text-slate-400 mt-1">
                      {
                        formatDate(
                          log.viewed_at
                        )
                      }
                    </p>
                  </div>
                ))}

              </div>
            )}
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="font-heading text-xl font-bold text-slate-900">
              Latest Messages
            </h2>


            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500 mt-5">
                No messages yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentMessages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-xl bg-slate-50 text-sm"
                    >
                      <p className="font-semibold text-slate-900">
                        {
                          message.full_name ||
                          'No name'
                        }
                      </p>

                      <p className="text-slate-500">
                        {message.email}
                      </p>
                    </div>
                  )
                )}

              </div>
            )}
          </div>

        </div>
      )}


      {/* PUBLIC SUBMISSIONS */}
      {activeTab ===
        'public-submissions' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Public Profile Submissions"
            count={
              filteredPublicSubmissions.length
            }
            subtitle="Review individuals, update workflow, add private notes, and assign profiles"
          />


          <div className="divide-y divide-slate-100">

            {filteredPublicSubmissions.map(
              (submission) => {

                const whatsappLink =
                  getWhatsAppLink(
                    submission.submitter_whatsapp ||
                    submission.submitter_mobile
                  );


                const assignedBureau =
                  applications.find(
                    (item) =>
                      item.email ===
                      submission.assigned_bureau_email
                  );


                return (
                  <div
                    key={submission.id}
                    className="p-6"
                  >

                    <div className="flex flex-col 2xl:flex-row 2xl:items-start gap-6">


                      {/* Main Submission Details */}
                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-heading text-2xl font-bold text-slate-900">
                            {
                              submission.candidate_name ||
                              submission.submitter_full_name ||
                              'Public Submission'
                            }
                          </h3>


                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                              submission.review_status
                            )}`}
                          >
                            {
                              formatStatus(
                                submission.review_status
                              )
                            }
                          </span>


                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Public Submission
                          </span>


                          {submission.converted_to_profile && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              Converted to Network Profile
                            </span>
                          )}

                        </div>


                        <p className="text-xs text-slate-400 mt-2">
                          Submitted:{' '}
                          {
                            formatDate(
                              submission.submitted_at
                            )
                          }
                        </p>


                        {/* Contact + Candidate */}
                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">


                          <div className="rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-slate-900">
                                Submitter Information
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-slate-600">

                              <InfoLine
                                label="Name"
                                value={
                                  submission.submitter_full_name
                                }
                              />

                              <InfoLine
                                label="Relationship"
                                value={
                                  submission.relationship_to_candidate
                                }
                              />

                              <InfoLine
                                label="Mobile"
                                value={
                                  submission.submitter_mobile
                                }
                              />

                              <InfoLine
                                label="WhatsApp"
                                value={
                                  submission.submitter_whatsapp
                                }
                              />

                              <InfoLine
                                label="Email"
                                value={
                                  submission.submitter_email
                                }
                              />

                            </div>


                            <div className="mt-4 flex flex-wrap gap-2">

                              {submission.submitter_mobile && (
                                <a
                                  href={`tel:${submission.submitter_mobile}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call
                                </a>
                              )}


                              {whatsappLink && (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  WhatsApp
                                </a>
                              )}


                              {submission.submitter_email && (
                                <a
                                  href={`mailto:${submission.submitter_email}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold"
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </a>
                              )}

                            </div>
                          </div>


                          <div className="rounded-xl bg-green-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <UserRoundSearch className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-green-900">
                                Candidate
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-green-900">

                              <InfoLine
                                label="Name"
                                value={
                                  submission.candidate_name
                                }
                              />

                              <InfoLine
                                label="Gender"
                                value={
                                  submission.gender
                                }
                              />

                              <InfoLine
                                label="Age"
                                value={
                                  submission.age
                                }
                              />

                              <InfoLine
                                label="Date of Birth"
                                value={
                                  submission.date_of_birth
                                }
                              />

                              <InfoLine
                                label="Marital Status"
                                value={
                                  submission.marital_status
                                }
                              />

                              <InfoLine
                                label="Height"
                                value={
                                  submission.height
                                }
                              />

                              <InfoLine
                                label="Sect"
                                value={
                                  submission.sect
                                }
                              />

                              <InfoLine
                                label="Caste"
                                value={
                                  submission.caste
                                }
                              />

                            </div>
                          </div>


                          <div className="rounded-xl bg-blue-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-blue-700" />

                              <p className="font-bold text-blue-900">
                                Location & Career
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-blue-900">

                              <InfoLine
                                label="City"
                                value={
                                  submission.city
                                }
                              />

                              <InfoLine
                                label="Province"
                                value={
                                  submission.province
                                }
                              />

                              <InfoLine
                                label="Country"
                                value={
                                  submission.country
                                }
                              />

                              <InfoLine
                                label="Nationality"
                                value={
                                  submission.nationality
                                }
                              />

                              <InfoLine
                                label="Education"
                                value={
                                  submission.education
                                }
                              />

                              <InfoLine
                                label="Profession"
                                value={
                                  submission.profession
                                }
                              />

                              <InfoLine
                                label="Employment"
                                value={
                                  submission.employment_status
                                }
                              />

                              <InfoLine
                                label="Income"
                                value={
                                  submission.income_range
                                }
                              />

                            </div>
                          </div>

                        </div>


                        {/* Photo + Family + Requirements */}
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-4">


                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="font-bold text-slate-900 mb-3">
                              Candidate Photo
                            </p>


                            {submission.photo_url ? (
                              <img
                                src={
                                  submission.photo_url
                                }
                                alt="Candidate"
                                className="w-full h-56 object-cover object-top rounded-xl"
                              />
                            ) : (
                              <div className="h-56 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                                <ImageIcon className="w-9 h-9" />

                                <p className="text-xs mt-2">
                                  No photo
                                </p>
                              </div>
                            )}


                            <p className="text-xs text-slate-500 mt-3">
                              Visibility:{' '}
                              <span className="font-semibold capitalize">
                                {
                                  submission.photo_visibility ||
                                  'public'
                                }
                              </span>
                            </p>

                          </div>


                          <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-900">

                            <p className="font-bold mb-3">
                              Family Information
                            </p>


                            <div className="space-y-2">

                              <InfoLine
                                label="Siblings"
                                value={
                                  submission.siblings
                                }
                              />

                              <InfoLine
                                label="Father Occupation"
                                value={
                                  submission.father_occupation
                                }
                              />

                              <InfoLine
                                label="Mother Occupation"
                                value={
                                  submission.mother_occupation
                                }
                              />


                              {submission.family_details && (
                                <div className="pt-2">
                                  <p className="font-semibold">
                                    Family Summary:
                                  </p>

                                  <p className="mt-1 leading-relaxed">
                                    {
                                      submission.family_details
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>


                          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">

                            <p className="font-bold mb-3">
                              Match Requirements
                            </p>


                            <div className="space-y-2">

                              <InfoLine
                                label="Expected Age"
                                value={
                                  submission.expected_partner_age
                                }
                              />

                              <InfoLine
                                label="Expected Location"
                                value={
                                  submission.expected_partner_location
                                }
                              />

                              <InfoLine
                                label="Expected Education"
                                value={
                                  submission.expected_partner_education
                                }
                              />


                              {submission.requirements && (
                                <div className="pt-2">
                                  <p className="font-semibold">
                                    Requirements:
                                  </p>

                                  <p className="mt-1 leading-relaxed">
                                    {
                                      submission.requirements
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>

                        </div>


                        {submission.additional_notes && (
                          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
                            <p className="font-bold text-amber-900">
                              Additional Information
                            </p>

                            <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                              {
                                submission.additional_notes
                              }
                            </p>
                          </div>
                        )}


                        {/* Private Notes */}
                        <div className="mt-4 rounded-xl bg-slate-900 p-5">

                          <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                            <Lock className="w-4 h-4 text-slate-300" />
                            Admin Private Notes
                          </label>


                          <textarea
                            value={
                              publicAdminNotesDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setPublicAdminNotesDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            rows={4}
                            placeholder="Call notes, family preferences, verification information, follow-up details..."
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 p-4 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              savePublicAdminNotes(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="mt-3 px-4 py-2 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
                          >
                            Save Private Notes
                          </button>

                        </div>


                        {/* Current Assignment */}
                        {(submission.assigned_bureau_email ||
                          submission.assigned_matchmaker_name) && (
                          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-5">

                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-green-900">
                                Current Assignment
                              </p>
                            </div>


                            <div className="mt-3 text-sm text-green-900 space-y-1">

                              <InfoLine
                                label="Bureau"
                                value={
                                  submission.assigned_bureau_email
                                }
                              />

                              <InfoLine
                                label="Matchmaker"
                                value={
                                  submission.assigned_matchmaker_name
                                }
                              />

                              <InfoLine
                                label="Assigned By"
                                value={
                                  submission.assigned_by_email
                                }
                              />

                              <InfoLine
                                label="Assigned At"
                                value={
                                  submission.assigned_at
                                    ? formatDate(
                                        submission.assigned_at
                                      )
                                    : null
                                }
                              />

                            </div>
                          </div>
                        )}


                        {/* Bureau Work Monitoring */}
                        {submission.assigned_bureau_email && (
                          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                              <div className="flex-1">

                                <div className="flex items-center gap-2">

                                  <ClipboardList className="w-5 h-5 text-blue-700" />

                                  <p className="font-bold text-blue-950">
                                    Bureau Work Monitoring
                                  </p>

                                </div>


                                <p className="text-sm text-blue-700 mt-1">
                                  Live progress reported by the assigned marriage bureau.
                                </p>


                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">

                                  <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Assigned Bureau
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1">
                                      {
                                        assignedBureau?.business_name ||
                                        assignedBureau?.full_name ||
                                        submission.assigned_bureau_email
                                      }
                                    </p>

                                    {assignedBureau?.business_name &&
                                      assignedBureau.email && (
                                        <p className="text-xs text-slate-400 mt-1">
                                          {assignedBureau.email}
                                        </p>
                                      )}

                                  </div>


                                  <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Bureau Work Status
                                    </p>

                                    <span
                                      className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                                        submission.bureau_work_status ||
                                        'assigned'
                                      )}`}
                                    >
                                      {
                                        formatStatus(
                                          submission.bureau_work_status ||
                                          'assigned'
                                        )
                                      }
                                    </span>

                                  </div>


                                  <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Last Follow-up
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1">
                                      {
                                        submission.bureau_last_follow_up_at
                                          ? formatDate(
                                              submission.bureau_last_follow_up_at
                                            )
                                          : 'No follow-up yet'
                                      }
                                    </p>

                                  </div>


                                  <div className="rounded-xl bg-white p-4">

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Next Follow-up
                                    </p>

                                    <p className="font-semibold text-slate-900 mt-1">
                                      {
                                        submission.bureau_next_follow_up_at
                                          ? formatDate(
                                              submission.bureau_next_follow_up_at
                                            )
                                          : 'Not scheduled'
                                      }
                                    </p>

                                  </div>

                                </div>


                                <div className="mt-3 rounded-xl bg-white p-4">

                                  <div className="flex items-center gap-2">

                                    <Lock className="w-4 h-4 text-slate-500" />

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                      Bureau Private Working Notes
                                    </p>

                                  </div>


                                  <p className="text-sm text-slate-700 mt-3 leading-relaxed whitespace-pre-wrap">
                                    {
                                      submission.bureau_private_notes ||
                                      'The bureau has not added private work notes yet.'
                                    }
                                  </p>


                                  {submission.bureau_work_updated_at && (
                                    <p className="text-xs text-slate-400 mt-3">
                                      Last work update:{' '}
                                      {
                                        formatDate(
                                          submission.bureau_work_updated_at
                                        )
                                      }
                                    </p>
                                  )}


                                  <p className="text-xs text-slate-400 mt-2">
                                    Bureau work notes are separate from Super Admin private notes.
                                  </p>

                                </div>

                              </div>


                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedMonitoringSubmission(
                                    submission
                                  )
                                }
                                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800"
                              >

                                <Clock className="w-4 h-4" />

                                View Timeline

                              </button>

                            </div>

                          </div>
                        )}

                      </div>


                      {/* Right Controls */}
                      <div className="2xl:w-80 space-y-4">


                        {/* Status */}
                        <div className="rounded-xl border border-slate-200 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                            Workflow Status
                          </p>


                          <select
                            value={
                              submission.review_status ||
                              'new'
                            }
                            onChange={(e) =>
                              updatePublicSubmissionStatus(
                                submission.id,
                                e.target.value
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="input-field"
                          >
                            {publicSubmissionStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {
                                    formatStatus(
                                      status
                                    )
                                  }
                                </option>
                              )
                            )}
                          </select>

                        </div>


                        {/* Assign to Bureau */}
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-5 h-5 text-green-700" />

                            <p className="font-bold text-green-900">
                              Assign to Bureau
                            </p>
                          </div>


                          <select
                            value={
                              bureauAssignmentDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setBureauAssignmentDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            className="input-field"
                          >
                            <option value="">
                              Select Approved Bureau
                            </option>


                            {approvedBureaus.map(
                              (bureau) => (
                                <option
                                  key={bureau.id}
                                  value={
                                    bureau.email ||
                                    ''
                                  }
                                >
                                  {
                                    bureau.business_name ||
                                    bureau.full_name ||
                                    bureau.email
                                  }
                                  {
                                    bureau.city
                                      ? ` — ${bureau.city}`
                                      : ''
                                  }
                                </option>
                              )
                            )}

                          </select>


                          <button
                            type="button"
                            onClick={() =>
                              assignSubmissionToBureau(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            Assign to Bureau
                          </button>

                        </div>


                        {/* Assign Matchmaker */}
                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <HeartHandshake className="w-5 h-5 text-purple-700" />

                            <p className="font-bold text-purple-900">
                              Assign Matchmaker
                            </p>
                          </div>


                          <input
                            value={
                              matchmakerAssignmentDraft[
                                submission.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setMatchmakerAssignmentDraft(
                                (prev) => ({
                                  ...prev,

                                  [submission.id]:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="Matchmaker name"
                            className="input-field"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              assignSubmissionToMatchmaker(
                                submission.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              submission.id
                            }
                            className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            Assign Matchmaker
                          </button>

                        </div>


                        {/* Convert to Network Profile */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-blue-700" />

                            <p className="font-bold text-blue-900">
                              Network Profile
                            </p>
                          </div>


                          {submission.converted_to_profile ? (
                            <div>

                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />

                                <p className="font-semibold">
                                  Already Converted
                                </p>
                              </div>


                              <p className="text-xs text-slate-500 mt-2">
                                This public submission already has a profile in the MBN network.
                              </p>


                              {submission.converted_at && (
                                <p className="text-xs text-slate-400 mt-2">
                                  Converted: {formatDate(submission.converted_at)}
                                </p>
                              )}


                              {conversionResult[submission.id]?.profileCode && (
                                <div className="mt-3 rounded-lg bg-white border border-blue-200 p-3">
                                  <p className="text-xs text-slate-500">
                                    Generated Profile ID
                                  </p>

                                  <p className="font-bold text-blue-900 mt-1">
                                    {
                                      conversionResult[submission.id]
                                        .profileCode
                                    }
                                  </p>
                                </div>
                              )}

                            </div>
                          ) : (
                            <>

                              <p className="text-sm text-blue-800 leading-relaxed">
                                Convert this reviewed submission into an active searchable profile in the MBN bureau network.
                              </p>


                              <button
                                type="button"
                                onClick={() =>
                                  convertPublicSubmission(
                                    submission.id
                                  )
                                }
                                disabled={
                                  actionLoading === submission.id ||
                                  ![
                                    'approved_for_matching',
                                    'assigned',
                                    'matching_active',
                                    'potential_match_found',
                                    'in_discussion',
                                  ].includes(
                                    submission.review_status || ''
                                  )
                                }
                                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <FileText className="w-4 h-4" />

                                {
                                  actionLoading === submission.id
                                    ? 'Converting...'
                                    : 'Convert to Network Profile'
                                }
                              </button>


                              {![
                                'approved_for_matching',
                                'assigned',
                                'matching_active',
                                'potential_match_found',
                                'in_discussion',
                              ].includes(
                                submission.review_status || ''
                              ) && (
                                <p className="text-xs text-amber-700 mt-2">
                                  Approve this submission for matching before conversion.
                                </p>
                              )}

                            </>
                          )}

                        </div>


                        {/* Consent */}
                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                            Consent Record
                          </p>


                          <div className="space-y-3 text-sm">

                            <div className="flex items-center gap-2">
                              {submission.consent_to_store ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}

                              <span>
                                Data Storage Consent
                              </span>
                            </div>


                            <div className="flex items-center gap-2">
                              {submission.consent_to_share ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}

                              <span>
                                Matchmaking Share Consent
                              </span>
                            </div>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              }
            )}


            {filteredPublicSubmissions.length ===
              0 && (
              <EmptyState text="No public profile submissions found." />
            )}

          </div>
        </div>
      )}


      {/* Bureau Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Bureau Requests / Applications"
            count={
              filteredApplications.length
            }
            subtitle="Approve, reject, and review bureau applications"
          />


          <div className="divide-y divide-slate-100">

            {filteredApplications.map(
              (app) => {

                const whatsappLink =
                  getWhatsAppLink(
                    app.whatsapp_number
                  );


                return (
                  <div
                    key={app.id}
                    className="p-6"
                  >

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-heading text-2xl font-bold text-slate-900">
                            {
                              app.business_name ||
                              'Unnamed Bureau'
                            }
                          </h3>


                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                              app.status
                            )}`}
                          >
                            {
                              app.status ||
                              'pending'
                            }
                          </span>

                        </div>


                        <p className="text-sm text-slate-400 mt-1">
                          Applied:{' '}
                          {
                            formatDate(
                              app.created_at
                            )
                          }
                        </p>


                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">


                          <div className="rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-green-700" />

                              <p className="font-bold text-slate-900">
                                Applicant
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-slate-600">

                              <InfoLine
                                label="Full Name"
                                value={
                                  app.full_name
                                }
                              />

                              <InfoLine
                                label="Role"
                                value={
                                  app.role_in_bureau
                                }
                              />

                              <InfoLine
                                label="CNIC"
                                value={
                                  app.cnic
                                }
                              />

                              <InfoLine
                                label="Email"
                                value={
                                  app.email
                                }
                              />

                              <InfoLine
                                label="Mobile"
                                value={
                                  app.mobile_number
                                }
                              />

                              <InfoLine
                                label="WhatsApp"
                                value={
                                  app.whatsapp_number
                                }
                              />

                            </div>


                            <div className="mt-4 flex flex-wrap gap-2">

                              {app.email && (
                                <a
                                  href={`mailto:${app.email}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
                                >
                                  <Mail className="w-4 h-4" />
                                  Email
                                </a>
                              )}


                              {app.mobile_number && (
                                <a
                                  href={`tel:${app.mobile_number}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call
                                </a>
                              )}


                              {whatsappLink && (
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  WhatsApp
                                </a>
                              )}

                            </div>
                          </div>


                          <div className="rounded-xl bg-blue-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <Building2 className="w-5 h-5 text-blue-700" />

                              <p className="font-bold text-blue-900">
                                Business Details
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-blue-900">

                              <InfoLine
                                label="Business Name"
                                value={
                                  app.business_name
                                }
                              />

                              <InfoLine
                                label="Years in Business"
                                value={
                                  app.years_in_business
                                }
                              />

                              <InfoLine
                                label="Active Profiles"
                                value={
                                  app.active_profiles
                                }
                              />

                              <InfoLine
                                label="Physical Office"
                                value={
                                  app.has_physical_office
                                }
                              />

                              <InfoLine
                                label="Office Phone"
                                value={
                                  app.office_phone
                                }
                              />

                            </div>
                          </div>


                          <div className="rounded-xl bg-amber-50 p-4">

                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-amber-700" />

                              <p className="font-bold text-amber-900">
                                Location
                              </p>
                            </div>


                            <div className="space-y-2 text-sm text-amber-900">

                              <InfoLine
                                label="City"
                                value={
                                  app.city
                                }
                              />

                              <InfoLine
                                label="Province"
                                value={
                                  app.province
                                }
                              />

                              <InfoLine
                                label="Country"
                                value={
                                  app.country
                                }
                              />

                              <InfoLine
                                label="Areas Served"
                                value={
                                  app.areas_served
                                }
                              />

                            </div>
                          </div>

                        </div>


                        <div className="mt-4 rounded-xl bg-slate-50 p-4">

                          <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                            <NotebookPen className="w-4 h-4 text-slate-500" />
                            Admin Notes
                          </label>


                          <textarea
                            value={
                              adminNotesDraft[
                                app.id
                              ] || ''
                            }
                            onChange={(e) =>
                              setAdminNotesDraft(
                                (prev) => ({
                                  ...prev,

                                  [app.id]:
                                    e.target.value,
                                })
                              )
                            }
                            rows={3}
                            placeholder="Add internal notes..."
                            className="input-field resize-none"
                          />


                          <button
                            type="button"
                            onClick={() =>
                              saveAdminNotes(
                                app.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              app.id
                            }
                            className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
                          >
                            Save Notes
                          </button>

                        </div>
                      </div>


                      <div className="xl:w-56 flex xl:flex-col flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'approved'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'rejected'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          <UserX className="w-4 h-4" />
                          Reject
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'pending'
                            )
                          }
                          disabled={
                            actionLoading ===
                            app.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold disabled:opacity-50"
                        >
                          <Clock className="w-4 h-4" />
                          Pending
                        </button>

                      </div>
                    </div>
                  </div>
                );
              }
            )}


            {filteredApplications.length ===
              0 && (
              <EmptyState text="No bureau requests found." />
            )}

          </div>
        </div>
      )}


      {/* Profiles */}
      {activeTab === 'profiles' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Profiles Control"
            count={
              filteredProfiles.length
            }
            subtitle="Activate, deactivate, and control photo privacy"
          />


          <div className="divide-y divide-slate-100">

            {filteredProfiles.map(
              (profile) => (
                <div
                  key={profile.id}
                  className="p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">


                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-heading text-xl font-bold text-slate-900">
                          {
                            profile.profile_code ||
                            profile.candidate_name ||
                            'Marriage Profile'
                          }
                        </h3>


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                            profile.status
                          )}`}
                        >
                          {
                            profile.status ||
                            'active'
                          }
                        </span>


                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 capitalize">
                          Photo:{' '}
                          {
                            profile.photo_visibility ||
                            'public'
                          }
                        </span>

                      </div>


                      <p className="text-xs text-slate-400 mt-1">
                        Created:{' '}
                        {
                          formatDate(
                            profile.created_at
                          )
                        }
                      </p>


                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">


                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">

                          <p className="font-bold text-slate-900 mb-2">
                            Candidate
                          </p>

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
                            label="Marital"
                            value={
                              profile.marital_status
                            }
                          />

                          <InfoLine
                            label="Caste"
                            value={
                              profile.caste
                            }
                          />

                          <InfoLine
                            label="Sect"
                            value={
                              profile.sect
                            }
                          />

                        </div>


                        <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">

                          <p className="font-bold mb-2">
                            Education / Work
                          </p>

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

                        </div>


                        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">

                          <p className="font-bold mb-2">
                            Location / Uploader
                          </p>

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
                            label="Uploader"
                            value={
                              profile.bureau_email
                            }
                          />

                        </div>

                      </div>
                    </div>


                    <div className="xl:w-64 space-y-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateProfileStatus(
                            profile.id,
                            'active'
                          )
                        }
                        disabled={
                          actionLoading ===
                          profile.id
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Activate Profile
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateProfileStatus(
                            profile.id,
                            'inactive'
                          )
                        }
                        disabled={
                          actionLoading ===
                          profile.id
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-semibold disabled:opacity-50"
                      >
                        <Ban className="w-4 h-4" />
                        Deactivate Profile
                      </button>


                      <div className="rounded-xl border border-slate-200 p-3">

                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                          Photo Privacy
                        </p>


                        <div className="space-y-2">

                          <button
                            type="button"
                            onClick={() =>
                              updateProfilePhotoVisibility(
                                profile.id,
                                'public'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-700 text-sm font-semibold"
                          >
                            Public
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              updateProfilePhotoVisibility(
                                profile.id,
                                'blurred'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold"
                          >
                            Blur
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              updateProfilePhotoVisibility(
                                profile.id,
                                'hidden'
                              )
                            }
                            disabled={
                              actionLoading ===
                              profile.id
                            }
                            className="w-full px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold"
                          >
                            Hide
                          </button>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )
            )}


            {filteredProfiles.length ===
              0 && (
              <EmptyState text="No profiles found." />
            )}

          </div>
        </div>
      )}


      {/* Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Contact Messages"
            count={
              filteredMessages.length
            }
            subtitle="Public contact form messages"
          />


          <div className="divide-y divide-slate-100">

            {filteredMessages.map(
              (message) => (
                <div
                  key={message.id}
                  className="p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">


                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-heading text-xl font-bold text-slate-900">
                          {
                            message.full_name ||
                            'No name'
                          }
                        </h3>


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                            message.status
                          )}`}
                        >
                          {
                            message.status ||
                            'new'
                          }
                        </span>

                      </div>


                      <p className="text-xs text-slate-400 mt-1">
                        Received:{' '}
                        {
                          formatDate(
                            message.created_at
                          )
                        }
                      </p>


                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">

                        <div className="rounded-xl bg-slate-50 p-4">

                          <InfoLine
                            label="Email"
                            value={
                              message.email
                            }
                          />

                          <InfoLine
                            label="Phone"
                            value={
                              message.phone
                            }
                          />

                          <InfoLine
                            label="Bureau"
                            value={
                              message.bureau_name
                            }
                          />

                        </div>


                        <div className="rounded-xl bg-green-50 p-4 text-green-900">

                          <p className="font-bold mb-2">
                            Message
                          </p>

                          <p className="leading-relaxed">
                            {
                              message.message ||
                              'No message'
                            }
                          </p>

                        </div>
                      </div>
                    </div>


                    <div className="xl:w-52 flex xl:flex-col flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'new'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold"
                      >
                        New
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'reviewed'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold"
                      >
                        Reviewed
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          updateMessageStatus(
                            message.id,
                            'closed'
                          )
                        }
                        disabled={
                          actionLoading ===
                          message.id
                        }
                        className="px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-semibold"
                      >
                        Closed
                      </button>

                    </div>
                  </div>
                </div>
              )
            )}


            {filteredMessages.length ===
              0 && (
              <EmptyState text="No contact messages found." />
            )}

          </div>
        </div>
      )}


      {/* Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          <SectionHeader
            title="Contact View Logs"
            count={
              filteredLogs.length
            }
            subtitle="Who viewed whose contact"
          />


          <div className="divide-y divide-slate-100">

            {filteredLogs.map(
              (log) => (
                <div
                  key={log.id}
                  className="p-6"
                >

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                    <div className="p-4 rounded-xl bg-blue-50">

                      <p className="font-bold text-blue-900 mb-2">
                        Viewer Bureau
                      </p>

                      <p className="text-sm text-blue-900">
                        {
                          log.viewer_business_name ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-blue-700 mt-1">
                        {
                          log.viewer_email ||
                          'N/A'
                        }
                      </p>

                    </div>


                    <div className="p-4 rounded-xl bg-green-50">

                      <p className="font-bold text-green-900 mb-2">
                        Viewed Profile
                      </p>

                      <p className="text-sm text-green-900">
                        {
                          log.profile_code ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-green-700 mt-1">
                        {
                          log.profile_gender ||
                          'N/A'
                        }
                      </p>

                    </div>


                    <div className="p-4 rounded-xl bg-amber-50">

                      <p className="font-bold text-amber-900 mb-2">
                        Uploader Bureau
                      </p>

                      <p className="text-sm text-amber-900">
                        {
                          log.uploader_business_name ||
                          'N/A'
                        }
                      </p>

                      <p className="text-xs text-amber-700 mt-1">
                        {
                          log.uploader_email ||
                          'N/A'
                        }
                      </p>

                    </div>

                  </div>


                  <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {
                      formatDate(
                        log.viewed_at
                      )
                    }
                  </p>

                </div>
              )
            )}


            {filteredLogs.length ===
              0 && (
              <EmptyState text="No logs found." />
            )}

          </div>
        </div>
      )}


      {/* Bureau Follow-up Timeline Modal */}
      {selectedMonitoringSubmission && (
        <AdminBureauTimelineModal
          submission={
            selectedMonitoringSubmission
          }
          bureau={
            applications.find(
              (item) =>
                item.email ===
                selectedMonitoringSubmission.assigned_bureau_email
            ) || null
          }
          onClose={() =>
            setSelectedMonitoringSubmission(
              null
            )
          }
        />
      )}

    </div>
  );
}


function AdminBureauTimelineModal({
  submission,
  bureau,
  onClose,
}: {
  submission: PublicSubmission;
  bureau: BureauApplication | null;
  onClose: () => void;
}) {

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    followUps,
    setFollowUps,
  ] = useState<AdminFollowUp[]>([]);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');


  const loadTimeline =
    async () => {
      try {
        setLoading(true);
        setErrorMessage('');


        const {
          data,
          error,
        } = await supabase.rpc(
          'get_admin_assigned_profile_followups',
          {
            p_submission_id:
              submission.id,
          }
        );


        if (error) {
          throw error;
        }


        setFollowUps(
          (data || []) as AdminFollowUp[]
        );

      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Follow-up timeline could not be loaded.'
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadTimeline();
  }, [submission.id]);


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">


        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <Clock className="w-6 h-6 text-blue-700" />

              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Bureau Follow-up Timeline
              </h2>

            </div>


            <p className="text-sm text-slate-500 mt-2">
              {
                submission.candidate_name ||
                'Public Submission'
              }

              {' • '}

              {
                bureau?.business_name ||
                bureau?.full_name ||
                submission.assigned_bureau_email ||
                'Assigned Bureau'
              }
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


        <div className="p-6">


          {/* Current Monitoring Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <div className="rounded-xl bg-blue-50 p-4">

              <p className="text-xs font-bold uppercase text-blue-500">
                Current Status
              </p>

              <p className="font-bold text-blue-900 mt-2">
                {
                  formatStatus(
                    submission.bureau_work_status ||
                    'assigned'
                  )
                }
              </p>

            </div>


            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-xs font-bold uppercase text-green-600">
                Last Follow-up
              </p>

              <p className="font-bold text-green-900 mt-2">
                {
                  submission.bureau_last_follow_up_at
                    ? formatDate(
                        submission.bureau_last_follow_up_at
                      )
                    : 'None'
                }
              </p>

            </div>


            <div className="rounded-xl bg-purple-50 p-4">

              <p className="text-xs font-bold uppercase text-purple-600">
                Next Follow-up
              </p>

              <p className="font-bold text-purple-900 mt-2">
                {
                  submission.bureau_next_follow_up_at
                    ? formatDate(
                        submission.bureau_next_follow_up_at
                      )
                    : 'Not scheduled'
                }
              </p>

            </div>

          </div>


          {/* Current Bureau Notes */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-center gap-2">

              <Lock className="w-4 h-4 text-slate-500" />

              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Current Bureau Private Working Notes
              </p>

            </div>


            <p className="text-sm text-slate-700 mt-3 leading-relaxed whitespace-pre-wrap">
              {
                submission.bureau_private_notes ||
                'No bureau private work notes have been added yet.'
              }
            </p>

          </div>


          {errorMessage && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">

              {errorMessage}

            </div>
          )}


          {/* Timeline */}
          <div className="mt-6">

            <div className="flex items-center justify-between gap-3">

              <h3 className="font-heading text-lg font-bold text-slate-900">
                Follow-up History
              </h3>


              <span className="text-xs font-semibold text-slate-500">
                {followUps.length} note(s)
              </span>

            </div>


            {loading ? (
              <div className="mt-4 space-y-3">

                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-24 rounded-xl bg-slate-100 animate-pulse"
                    />
                  )
                )}

              </div>
            ) : followUps.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-10 text-center">

                <Clock className="w-8 h-8 text-slate-300 mx-auto" />

                <p className="font-semibold text-slate-700 mt-3">
                  No follow-up notes yet
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  The assigned bureau has not logged any follow-up activity for this case.
                </p>

              </div>
            ) : (
              <div className="mt-5 space-y-4">

                {followUps.map(
                  (followUp) => (
                    <div
                      key={followUp.id}
                      className="relative pl-6 border-l-2 border-blue-200"
                    >

                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-700" />


                      <div className="rounded-xl bg-slate-50 p-4">

                        <div className="flex flex-wrap items-center justify-between gap-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                              followUp.status_at_time
                            )}`}
                          >
                            {
                              formatStatus(
                                followUp.status_at_time
                              )
                            }
                          </span>


                          <span className="text-xs text-slate-400">
                            {
                              formatDate(
                                followUp.created_at
                              )
                            }
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

    </div>
  );
}
