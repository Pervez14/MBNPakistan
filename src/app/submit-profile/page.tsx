'use client';

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
  Star,
  MessageCircle,
  Crown,
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

    premiumTitle: 'Premium Match Preview',
    premiumSubtitle:
      'Your profile preferences can now be reviewed against the MBN Pakistan network.',
    matchesAvailable: 'matches available for your profile',
    previewNote:
      'Preview profiles are limited for privacy. Activate Premium Access to view full details and send interests.',
    moreMatchesText: 'more suitable profiles may be unlocked with Premium Access.',
    premiumRequired: 'Premium Required',
    nameHidden: 'Name Hidden',
    contactHidden: 'Contact Hidden',
    activateWhatsapp: 'Activate on WhatsApp',
    mostPopular: 'Most Popular',

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

    premiumTitle: 'پریمیم میچ پری ویو',
    premiumSubtitle:
      'آپ کی پروفائل ترجیحات کو MBN Pakistan نیٹ ورک کے ساتھ ریویو کیا جا سکتا ہے۔',
    matchesAvailable: 'موزوں رشتے آپ کی پروفائل کے لیے دستیاب ہیں',
    previewNote:
      'پرائیویسی کی وجہ سے پری ویو محدود ہے۔ مکمل تفصیلات اور Interests بھیجنے کے لیے Premium Access حاصل کریں۔',
    moreMatchesText: 'مزید موزوں پروفائلز Premium Access کے ساتھ دیکھی جا سکتی ہیں۔',
    premiumRequired: 'پریمیم درکار ہے',
    nameHidden: 'نام مخفی',
    contactHidden: 'رابطہ مخفی',
    activateWhatsapp: 'WhatsApp پر ایکٹیویٹ کریں',
    mostPopular: 'سب سے مقبول',

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

  const [
    matchPreviewCount,
    setMatchPreviewCount,
  ] = useState(0);

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

      const submissionId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const { error } = await supabase
        .from('public_profile_submissions')
        .insert({
          id: submissionId,
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
        });

      if (error) {
        throw error;
      }

      const {
        data: referenceData,
        error: referenceError,
      } = await supabase.rpc(
        'get_public_submission_reference',
        {
          p_submission_id: submissionId,
        }
      );

      if (referenceError) {
        throw referenceError;
      }

      setSubmissionReference(
        typeof referenceData === 'string'
          ? referenceData
          : ''
      );

      setMatchPreviewCount(
        Math.floor(Math.random() * 25) + 25
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
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
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

            {matchPreviewCount > 0 && (
              <PremiumMatchPreview
                count={matchPreviewCount}
                reference={submissionReference}
                isUrdu={isUrdu}
                t={t}
              />
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
                  setMatchPreviewCount(0);
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



function PremiumMatchPreview({
  count,
  reference,
  isUrdu,
  t,
}: {
  count: number;
  reference: string;
  isUrdu: boolean;
  t: typeof content.en;
}) {
  const previewProfiles = isUrdu
    ? [
        {
          age: '26 سال',
          city: 'Lahore',
          profession: 'Doctor',
          score: '91%',
        },
        {
          age: '29 سال',
          city: 'Islamabad',
          profession: 'Software Engineer',
          score: '87%',
        },
        {
          age: '25 سال',
          city: 'Multan',
          profession: 'Teacher',
          score: '84%',
        },
      ]
    : [
        {
          age: '26 years',
          city: 'Lahore',
          profession: 'Doctor',
          score: '91%',
        },
        {
          age: '29 years',
          city: 'Islamabad',
          profession: 'Software Engineer',
          score: '87%',
        },
        {
          age: '25 years',
          city: 'Multan',
          profession: 'Teacher',
          score: '84%',
        },
      ];


  const remainingCount =
    count > previewProfiles.length
      ? count - previewProfiles.length
      : 0;


  const whatsappNumber = '923001234567';

  const whatsappMessage = encodeURIComponent(
    `Assalamualaikum MBN Pakistan, I want to activate Verified Premium for my profile reference ${reference}.`
  );


  return (
    <section className="mt-8 rounded-[2rem] bg-slate-950 text-white overflow-hidden text-left">

      <div className="relative p-6 md:p-8">

        <div className="absolute inset-0 opacity-20">
          <PatternLayer />
        </div>


        <div className="relative">

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold">
                <Crown className="w-4 h-4 text-amber-300" />
                {t.premiumTitle}
              </span>


              <h2 className="font-heading text-3xl md:text-5xl font-black mt-5 leading-tight">
                <span className="text-amber-300">
                  {count}
                </span>{' '}
                {t.matchesAvailable}
              </h2>


              <p className="text-slate-300 mt-4 leading-relaxed max-w-2xl">
                {t.premiumSubtitle}
              </p>


              <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
                {t.previewNote}
              </p>
            </div>


            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              {t.activateWhatsapp}
            </a>

          </div>


          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

            {previewProfiles.map((profile, index) => (
              <div
                key={`${profile.city}-${index}`}
                className="rounded-2xl bg-white text-slate-900 overflow-hidden border border-white/20"
              >

                <div className="relative h-44 bg-gradient-to-br from-slate-200 to-slate-400 overflow-hidden">

                  <div className="absolute inset-0 blur-md scale-110 bg-[radial-gradient(circle_at_30%_20%,#f8fafc,transparent_25%),linear-gradient(135deg,#cbd5e1,#64748b)]" />


                  <div className="absolute inset-0 bg-slate-900/15" />


                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-slate-700">
                      <Lock className="w-3 h-3" />
                      {t.premiumRequired}
                    </span>
                  </div>


                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-black">
                      {profile.score} Match
                    </span>
                  </div>

                </div>


                <div className="p-5">

                  <p className="font-heading text-xl font-black text-slate-950">
                    {t.nameHidden}
                  </p>


                  <div className="mt-4 space-y-2 text-sm text-slate-600">

                    <p>
                      <span className="font-bold text-slate-900">
                        Age:
                      </span>{' '}
                      {profile.age}
                    </p>


                    <p>
                      <span className="font-bold text-slate-900">
                        City:
                      </span>{' '}
                      {profile.city}
                    </p>


                    <p>
                      <span className="font-bold text-slate-900">
                        Profession:
                      </span>{' '}
                      {profile.profession}
                    </p>


                    <p className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-full px-3 py-1 mt-2">
                      <Lock className="w-3 h-3" />
                      {t.contactHidden}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>


          {remainingCount > 0 && (
            <div className="mt-5 rounded-2xl bg-white/10 border border-white/10 p-5 text-center">

              <p className="font-bold text-white">
                +{remainingCount} {t.moreMatchesText}
              </p>

            </div>
          )}


          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">

            <PlanCard
              title="Premium Match Access"
              price="799 PKR"
              period="/ month"
              features={[
                'View suitable profiles',
                'Daily match suggestions',
                'Verified profile access',
                'Save favourite profiles',
                'WhatsApp notifications',
                '10 interests per month',
              ]}
              cta={t.activateWhatsapp}
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Assalamualaikum MBN Pakistan, I want to activate Premium Match Access for my profile reference ${reference}.`
              )}`}
            />


            <PlanCard
              title="Verified Premium"
              price="1499 PKR"
              period="/ month"
              popularLabel={t.mostPopular}
              highlighted
              features={[
                'Everything in Premium',
                'Verified badge',
                'Higher visibility',
                'Priority support',
                'More recommendations',
                '30 interests per month',
              ]}
              cta={t.activateWhatsapp}
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Assalamualaikum MBN Pakistan, I want to activate Verified Premium for my profile reference ${reference}.`
              )}`}
            />


            <PlanCard
              title="Personal Matchmaking"
              price="4999 PKR"
              period=""
              features={[
                'Dedicated matchmaker',
                'Manual shortlisting',
                'Family coordination',
                'Priority matching',
                'WhatsApp assistance',
                'Unlimited interests',
              ]}
              cta={t.activateWhatsapp}
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Assalamualaikum MBN Pakistan, I want to activate Personal Matchmaking Service for my profile reference ${reference}.`
              )}`}
            />

          </div>

        </div>

      </div>

    </section>
  );
}


function PlanCard({
  title,
  price,
  period,
  features,
  cta,
  href,
  highlighted = false,
  popularLabel,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  popularLabel?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-5 ${
        highlighted
          ? 'bg-white text-slate-950 ring-2 ring-amber-300 shadow-2xl'
          : 'bg-white/10 text-white border border-white/10'
      }`}
    >

      {popularLabel && (
        <span className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-amber-300 text-slate-950 text-xs font-black">
          {popularLabel}
        </span>
      )}


      <h3 className="font-heading text-xl font-black">
        {title}
      </h3>


      <div className="mt-4 flex items-end gap-1">
        <p className="text-3xl font-black">
          {price}
        </p>

        {period && (
          <p
            className={
              highlighted
                ? 'text-slate-500'
                : 'text-slate-300'
            }
          >
            {period}
          </p>
        )}
      </div>


      <ul className="mt-5 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm"
          >
            <CheckCircle
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                highlighted
                  ? 'text-green-600'
                  : 'text-green-300'
              }`}
            />

            <span
              className={
                highlighted
                  ? 'text-slate-700'
                  : 'text-slate-200'
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>


      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold ${
          highlighted
            ? 'bg-green-700 text-white hover:bg-green-800'
            : 'bg-white text-slate-950 hover:bg-slate-100'
        }`}
      >
        <MessageCircle className="w-4 h-4" />
        {cta}
      </a>

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
