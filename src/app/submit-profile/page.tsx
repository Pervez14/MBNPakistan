'use client';

import {
  useMemo,
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
    activateWhatsapp: 'Choose Plan',
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
    activateWhatsapp: 'پلان منتخب کریں',
    mostPopular: 'سب سے مقبول',

    backHome: 'ہوم پیج پر واپس جائیں',
    submitAnother: 'ایک اور پروفائل جمع کروائیں',
  },
};


type MatchPreviewProfile = {
  id: string | null;
  gender: string | null;
  age: number | string | null;
  city: string | null;
  profession: string | null;
  education: string | null;
  photo_url: string | null;
  match_score: number | null;
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

type PublicProfileFormData = {
  submitterFullName: string;
  submitterEmail: string;
  submitterMobile: string;
  submitterWhatsApp: string;
  relationshipToCandidate: string;

  candidateName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  height: string;

  religion: string;
  sect: string;
  caste: string;

  province: string;
  city: string;
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

  photoVisibility: string;

  consentToStore: boolean;
  consentToShare: boolean;
};

function calculateAgeFromDob(dateOfBirth: string) {
  if (!dateOfBirth) return '';

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return '';
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    dob.getFullYear();

  const monthDifference =
    today.getMonth() -
    dob.getMonth();

  const dayDifference =
    today.getDate() -
    dob.getDate();

  if (
    monthDifference < 0 ||
    (
      monthDifference === 0 &&
      dayDifference < 0
    )
  ) {
    age -= 1;
  }

  if (age < 0 || age > 100) {
    return '';
  }

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

  const [
    matchPreviewProfiles,
    setMatchPreviewProfiles,
  ] = useState<MatchPreviewProfile[]>([]);

  const [errorMessage, setErrorMessage] = useState('');

  const [selectedPhotos, setSelectedPhotos] =
    useState<File[]>([]);

  const [photoPreviews, setPhotoPreviews] =
    useState<string[]>([]);


  const [formData, setFormData] =
    useState<PublicProfileFormData>({
      submitterFullName: '',
      submitterEmail: '',
      submitterMobile: '',
      submitterWhatsApp: '',
      relationshipToCandidate: 'Self',

      candidateName: '',
      gender: '',
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

      photoVisibility: 'public',

      consentToStore: false,
      consentToShare: false,
    });


  const calculatedAge = useMemo(
    () => calculateAgeFromDob(formData.dateOfBirth),
    [formData.dateOfBirth]
  );


  const updateField = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const { name } = target;

    if (
      target instanceof HTMLInputElement &&
      target.type === 'checkbox'
    ) {
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
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    const maxSize =
      5 * 1024 * 1024;

    const remainingSlots =
      2 - selectedPhotos.length;

    if (remainingSlots <= 0) {
      setErrorMessage('Maximum 2 photos are allowed.');
      e.target.value = '';
      return;
    }

    const acceptedFiles: File[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          'Please upload JPG, PNG, or WEBP images only.'
        );
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setErrorMessage(
          'Each photo must be smaller than 5MB.'
        );
        e.target.value = '';
        return;
      }

      acceptedFiles.push(file);
    }

    if (files.length > remainingSlots) {
      setErrorMessage(
        'Only 2 photos are allowed. Extra files were ignored.'
      );
    } else {
      setErrorMessage('');
    }

    setSelectedPhotos((prev) => [
      ...prev,
      ...acceptedFiles,
    ]);

    setPhotoPreviews((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    e.target.value = '';
  };


  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );

    setPhotoPreviews((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };


  const uploadPhotos = async () => {
    if (selectedPhotos.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const photo of selectedPhotos) {
      const watermarkedPhoto =
        await createWatermarkedImageFile(
          photo,
          'MBNPakistan.com'
        );

      const safeFileName =
        watermarkedPhoto.name
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9.-]/g, '')
          .toLowerCase();

      const randomFolder =
        typeof crypto !== 'undefined' &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const filePath =
        `${randomFolder}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeFileName}`;

      const { error: uploadError } =
        await supabase.storage
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

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };


  const validateRequiredFields = () => {
    const requiredFields:
      Array<[keyof PublicProfileFormData, string]> = [
        [
          'submitterFullName',
          'Please enter the submitter full name.',
        ],
        [
          'submitterMobile',
          'Please enter a mobile number.',
        ],
        [
          'candidateName',
          'Candidate Name is required.',
        ],
        [
          'gender',
          'Please select candidate gender.',
        ],
        [
          'dateOfBirth',
          'Date of Birth is required.',
        ],
        [
          'maritalStatus',
          'Please select marital status.',
        ],
        [
          'height',
          'Please select height.',
        ],
        [
          'complexion',
          'Please select complexion.',
        ],
        [
          'bodyType',
          'Please select body type.',
        ],
        [
          'languages',
          'Please select language.',
        ],

        [
          'religion',
          'Please select religion.',
        ],
        [
          'sect',
          'Please select sect.',
        ],
        [
          'caste',
          'Please select caste.',
        ],

        [
          'province',
          'Please select province / region.',
        ],
        [
          'city',
          'Please select city.',
        ],
        [
          'country',
          'Country is required.',
        ],
        [
          'nationality',
          'Nationality is required.',
        ],
        [
          'residenceStatus',
          'Please select residence status.',
        ],

        [
          'education',
          'Please select education.',
        ],
        [
          'profession',
          'Profession is required.',
        ],
        [
          'employmentStatus',
          'Please select employment status.',
        ],
        [
          'jobType',
          'Please select job type.',
        ],
        [
          'industry',
          'Please select industry.',
        ],
        [
          'incomeRange',
          'Please select income range.',
        ],

        [
          'totalSiblings',
          'Please select total siblings.',
        ],
        [
          'brothersCount',
          'Please select number of brothers.',
        ],
        [
          'sistersCount',
          'Please select number of sisters.',
        ],
        [
          'fatherOccupation',
          'Please select father occupation.',
        ],
        [
          'motherOccupation',
          'Please select mother occupation.',
        ],
      ];

    for (const [fieldName, message] of requiredFields) {
      const value = formData[fieldName];

      if (
        typeof value !== 'string' ||
        !value.trim()
      ) {
        throw new Error(message);
      }
    }

    if (!calculatedAge) {
      throw new Error(
        'Please enter a valid Date of Birth.'
      );
    }

    if (Number(calculatedAge) < 18) {
      throw new Error(
        'Candidate age must be at least 18 years.'
      );
    }

    if (selectedPhotos.length < 1) {
      throw new Error(
        'Candidate Photo is required. Please upload at least 1 photo.'
      );
    }

    if (selectedPhotos.length > 2) {
      throw new Error(
        'Maximum 2 photos are allowed.'
      );
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
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      validateRequiredFields();

      const photoUrls =
        await uploadPhotos();

      const siblingsSummary =
        `${formData.totalSiblings} total siblings, ${formData.brothersCount} brothers, ${formData.sistersCount} sisters`;

      const submissionId =
        typeof crypto !== 'undefined' &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}-${Math.random()
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
            formData.candidateName.trim(),

          gender: formData.gender,

          age: Number(calculatedAge),

          date_of_birth:
            formData.dateOfBirth,

          marital_status:
            formData.maritalStatus,

          height:
            formData.height,

          religion:
            formData.religion || 'Islam',

          sect:
            formData.sect,

          caste:
            formData.caste,

          province:
            formData.province,

          city:
            formData.city,

          country:
            formData.country || 'Pakistan',

          nationality:
            formData.nationality || 'Pakistani',

          residence_status:
            formData.residenceStatus,

          education:
            formData.education,

          profession:
            formData.profession.trim(),

          employment_status:
            formData.employmentStatus,

          job_type:
            formData.jobType,

          industry:
            formData.industry,

          income_range:
            formData.incomeRange,

          complexion:
            formData.complexion,

          body_type:
            formData.bodyType,

          languages:
            formData.languages,

          siblings:
            siblingsSummary,

          total_siblings:
            normalizeCount(formData.totalSiblings),

          brothers_count:
            normalizeCount(formData.brothersCount),

          sisters_count:
            normalizeCount(formData.sistersCount),

          father_occupation:
            formData.fatherOccupation,

          mother_occupation:
            formData.motherOccupation,

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

          photo_url: photoUrls[0],

          photo_url_2:
            photoUrls[1] || null,

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

      const generatedMatchCount =
        Math.floor(Math.random() * 25) + 25;


      setMatchPreviewCount(
        generatedMatchCount
      );


      try {
        const {
          data: previewProfileData,
          error: previewProfileError,
        } = await supabase.rpc(
          'get_public_match_preview_profiles',
          {
            p_gender: formData.gender,
            p_city: formData.city,
            p_province: formData.province,
            p_limit: 3,
          }
        );


        if (!previewProfileError && previewProfileData) {
          setMatchPreviewProfiles(
            previewProfileData as MatchPreviewProfile[]
          );
        } else {
          setMatchPreviewProfiles([]);
        }

      } catch {
        setMatchPreviewProfiles([]);
      }


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
                submittedGender={formData.gender}
                databaseProfiles={matchPreviewProfiles}
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
                  setMatchPreviewProfiles([]);
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

          <FormSection title={t.submitter}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full Name *"
                name="submitterFullName"
                value={formData.submitterFullName}
                onChange={updateField}
                placeholder="Your full name"
                required
              />

              <SelectField
                label="Relationship to Candidate *"
                name="relationshipToCandidate"
                value={formData.relationshipToCandidate}
                onChange={updateField}
                options={[
                  'Self',
                  'Father',
                  'Mother',
                  'Brother',
                  'Sister',
                  'Relative',
                  'Family Friend',
                  'Other',
                ]}
                placeholder="Select Relationship"
                required
              />

              <TextField
                label="Mobile Number *"
                name="submitterMobile"
                value={formData.submitterMobile}
                onChange={updateField}
                placeholder="+92 300 1234567"
                required
              />

              <TextField
                label="WhatsApp Number"
                name="submitterWhatsApp"
                value={formData.submitterWhatsApp}
                onChange={updateField}
                placeholder="+92 300 1234567"
              />

              <TextField
                label="Email Address"
                name="submitterEmail"
                type="email"
                value={formData.submitterEmail}
                onChange={updateField}
                placeholder="you@example.com"
              />
            </div>
          </FormSection>


          <FormSection title={t.candidate}>
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
                options={[
                  'Male',
                  'Female',
                ]}
                optionLabels={{
                  Male: 'Male / Groom',
                  Female: 'Female / Bride',
                }}
                placeholder="Select Gender"
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
                  className="input-field bg-slate-100 text-slate-600"
                  placeholder="Auto calculated from Date of Birth"
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
          </FormSection>


          <FormSection title={t.religion}>
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
          </FormSection>


          <FormSection title={t.location}>
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
          </FormSection>


          <FormSection title={t.career}>
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
          </FormSection>


          <FormSection title={t.family}>
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
                <label className="label">
                  Family Summary
                </label>

                <textarea
                  name="familyDetails"
                  value={formData.familyDetails}
                  onChange={updateField}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Optional: tell us about family background, values and family structure..."
                />
              </div>
            </div>
          </FormSection>


          <FormSection title={`${t.requirements} ${isUrdu ? '(اختیاری)' : '(Optional)'}`}>
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
                <label className="label">
                  Detailed Match Requirements
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={updateField}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Optional: preferred caste, family background, lifestyle, etc."
                />
              </div>
            </div>
          </FormSection>


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


          <FormSection title={t.photo}>
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">

              <div className="grid grid-cols-2 gap-3">
                {photoPreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={preview}
                      alt={`Candidate preview ${index + 1}`}
                      className={`w-full h-48 object-cover object-top border border-slate-200 ${
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
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {photoPreviews.length === 0 && (
                  <div className="col-span-2 w-full h-72 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                    <p className="text-sm mt-2">
                      No photo selected
                    </p>
                  </div>
                )}
              </div>


              <div>
                <label className="label">
                  Candidate Photo *{' '}
                  <span className="text-slate-400">
                    (1 to 2 photos)
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#137a4a] text-white font-bold cursor-pointer hover:bg-[#0b5f38]">
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
                  Upload at least 1 and maximum 2 photos. JPG, PNG,
                  or WEBP. Maximum 5MB per photo.
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
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field>
      <label className="label">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    </Field>
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
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  optionLabels?: Record<string, string>;
}) {
  return (
    <Field>
      <label className="label">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input-field"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {optionLabels[option] || option}
          </option>
        ))}
      </select>
    </Field>
  );
}



function PremiumMatchPreview({
  count,
  reference,
  submittedGender,
  databaseProfiles,
  isUrdu,
  t,
}: {
  count: number;
  reference: string;
  submittedGender: string;
  databaseProfiles: MatchPreviewProfile[];
  isUrdu: boolean;
  t: typeof content.en;
}) {
  const submittedGenderValue =
    submittedGender.toLowerCase().trim();


  const matchGender =
    submittedGenderValue === 'male'
      ? 'female'
      : submittedGenderValue === 'female'
        ? 'male'
        : 'female';


  const isShowingFemaleMatches =
    matchGender === 'female';


  const fallbackProfiles = isShowingFemaleMatches
    ? isUrdu
      ? [
          {
            age: '24 سال',
            city: 'Lahore',
            profession: 'Doctor',
            education: 'MBBS',
            score: '91%',
            photoUrl: '',
          },
          {
            age: '27 سال',
            city: 'Islamabad',
            profession: 'Teacher',
            education: 'Masters',
            score: '88%',
            photoUrl: '',
          },
          {
            age: '25 سال',
            city: 'Multan',
            profession: 'Bank Officer',
            education: 'MBA',
            score: '84%',
            photoUrl: '',
          },
        ]
      : [
          {
            age: '24 years',
            city: 'Lahore',
            profession: 'Doctor',
            education: 'MBBS',
            score: '91%',
            photoUrl: '',
          },
          {
            age: '27 years',
            city: 'Islamabad',
            profession: 'Teacher',
            education: 'Masters',
            score: '88%',
            photoUrl: '',
          },
          {
            age: '25 years',
            city: 'Multan',
            profession: 'Bank Officer',
            education: 'MBA',
            score: '84%',
            photoUrl: '',
          },
        ]
    : isUrdu
      ? [
          {
            age: '29 سال',
            city: 'Lahore',
            profession: 'Software Engineer',
            education: 'BS Computer Science',
            score: '90%',
            photoUrl: '',
          },
          {
            age: '32 سال',
            city: 'Islamabad',
            profession: 'Business Owner',
            education: 'MBA',
            score: '87%',
            photoUrl: '',
          },
          {
            age: '30 سال',
            city: 'Multan',
            profession: 'Civil Engineer',
            education: 'BSc Engineering',
            score: '83%',
            photoUrl: '',
          },
        ]
      : [
          {
            age: '29 years',
            city: 'Lahore',
            profession: 'Software Engineer',
            education: 'BS Computer Science',
            score: '90%',
            photoUrl: '',
          },
          {
            age: '32 years',
            city: 'Islamabad',
            profession: 'Business Owner',
            education: 'MBA',
            score: '87%',
            photoUrl: '',
          },
          {
            age: '30 years',
            city: 'Multan',
            profession: 'Civil Engineer',
            education: 'BSc Engineering',
            score: '83%',
            photoUrl: '',
          },
        ];


  const previewProfiles =
    databaseProfiles.length > 0
      ? databaseProfiles.map((profile, index) => ({
          age:
            profile.age !== null && profile.age !== undefined
              ? `${profile.age}${isUrdu ? ' سال' : ' years'}`
              : fallbackProfiles[index]?.age || 'Hidden',

          city:
            profile.city ||
            fallbackProfiles[index]?.city ||
            'Pakistan',

          profession:
            profile.profession ||
            fallbackProfiles[index]?.profession ||
            'Profession hidden',

          education:
            profile.education ||
            fallbackProfiles[index]?.education ||
            'Education hidden',

          score:
            profile.match_score !== null &&
            profile.match_score !== undefined
              ? `${profile.match_score}%`
              : fallbackProfiles[index]?.score || '86%',

          photoUrl:
            profile.photo_url || '',
        }))
      : fallbackProfiles;


  const remainingCount =
    count > previewProfiles.length
      ? count - previewProfiles.length
      : 0;


  const whatsappNumber = '923336612404';

  const planMessage = (planName: string) =>
    encodeURIComponent(
      `Assalamualaikum MBN Pakistan, I want to activate ${planName} for my profile reference ${reference}.`
    );


  const matchGenderLabel =
    isShowingFemaleMatches
      ? isUrdu
        ? 'خواتین پروفائلز'
        : 'Female Profiles'
      : isUrdu
        ? 'مرد پروفائلز'
        : 'Male Profiles';


  return (
    <section className="mt-10 text-left">

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="bg-slate-50 border-b border-slate-100 px-6 py-7 md:px-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-black text-green-700">
                Private Match Review
              </p>

              <h2 className="font-heading text-3xl md:text-4xl font-black text-slate-950 mt-2">
                {count} {t.matchesAvailable}
              </h2>

              <p className="text-slate-600 mt-3 max-w-3xl leading-relaxed">
                {t.previewNote}
              </p>


              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
                <Lock className="w-4 h-4 text-green-700" />
                Showing {matchGenderLabel} based on submitted profile
              </div>
            </div>


            <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 min-w-[220px]">

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Reference
              </p>

              <p
                dir="ltr"
                className="font-mono text-lg font-black text-slate-950 mt-1 break-all"
              >
                {reference || 'Pending'}
              </p>

            </div>

          </div>

        </div>


        <div className="p-6 md:p-8">

          <div className="mb-5">

            <h3 className="font-heading text-2xl font-black text-slate-950">
              Preview Matches
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Real profile photos are lightly blurred. Name and contact details stay protected.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {previewProfiles.map((profile, index) => (
              <div
                key={`${profile.city}-${profile.profession}-${index}`}
                className="rounded-[1.5rem] border border-slate-200 bg-white overflow-hidden shadow-sm"
              >

                <div className="relative h-64 bg-slate-100 overflow-hidden">

                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt="Blurred match preview"
                      className="absolute inset-0 h-full w-full object-cover blur-md scale-105 opacity-100"
                    />
                  ) : (
                    <>
                      <div
                        className={`absolute inset-0 ${
                          isShowingFemaleMatches
                            ? 'bg-gradient-to-br from-rose-50 via-pink-100 to-slate-200'
                            : 'bg-gradient-to-br from-blue-50 via-slate-200 to-slate-400'
                        }`}
                      />


                      <div className="absolute inset-x-0 bottom-0 flex justify-center">

                        {isShowingFemaleMatches ? (
                          <FemaleBlurredFigure />
                        ) : (
                          <MaleBlurredFigure />
                        )}

                      </div>
                    </>
                  )}


                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />


                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 to-transparent" />


                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                      <Lock className="w-3 h-3" />
                      {t.premiumRequired}
                    </span>
                  </div>


                  <div className="absolute bottom-4 right-4">
                    <span className="rounded-full bg-green-700 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                      {profile.score} Match
                    </span>
                  </div>

                </div>


                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="font-heading text-xl font-black text-slate-950">
                        {t.nameHidden}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {isShowingFemaleMatches ? 'Female' : 'Male'} Profile
                      </p>
                    </div>


                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      Private
                    </span>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                    <ProfileDetail label="Age" value={profile.age} />

                    <ProfileDetail label="City" value={profile.city} />

                    <ProfileDetail
                      label="Profession"
                      value={profile.profession}
                    />

                    <ProfileDetail
                      label="Education"
                      value={profile.education}
                    />

                  </div>


                  <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-3">
                    <p className="inline-flex items-center gap-2 text-xs font-black text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      {t.contactHidden}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>


          {remainingCount > 0 && (
            <div className="mt-5 rounded-2xl bg-green-50 border border-green-100 px-5 py-4">

              <p className="text-sm font-black text-green-900 text-center">
                +{remainingCount} {t.moreMatchesText}
              </p>

            </div>
          )}


          <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-black text-green-700">
                  Recommended Plan
                </p>

                <h3 className="font-heading text-3xl font-black text-slate-950 mt-2">
                  Verified Premium
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mt-2 max-w-2xl">
                  Best for serious families who want higher visibility, priority support,
                  and more match recommendations.
                </p>
              </div>


              <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                <div>
                  <p className="text-4xl font-black text-slate-950">
                    1499 PKR
                  </p>

                  <p className="text-sm text-slate-500">
                    per month
                  </p>
                </div>


                <a
                  href={`https://wa.me/${whatsappNumber}?text=${planMessage(
                    'Verified Premium'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-700 px-6 py-4 font-black text-white hover:bg-green-800"
                >
                  Get Verified Premium
                </a>

              </div>

            </div>

          </div>


          <div className="mt-8">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">

              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-black text-green-700">
                  Premium Plans
                </p>

                <h3 className="font-heading text-2xl font-black text-slate-950 mt-2">
                  Choose your access level
                </h3>
              </div>


              <p className="text-sm text-slate-500 max-w-md">
                Payment gateway integration can be connected next. For now, plan requests
                open a prepared WhatsApp message.
              </p>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <PlanCard
                title="Premium Match Access"
                price="799 PKR"
                period="/ month"
                description="For families who want basic premium profile access."
                features={[
                  'Suitable profile access',
                  'Daily suggestions',
                  'Save favourites',
                  'WhatsApp notifications',
                  '10 interests per month',
                ]}
                cta={t.activateWhatsapp}
                href={`https://wa.me/${whatsappNumber}?text=${planMessage(
                  'Premium Match Access'
                )}`}
              />


              <PlanCard
                title="Verified Premium"
                price="1499 PKR"
                period="/ month"
                description="For serious families who want more visibility."
                popularLabel={t.mostPopular}
                highlighted
                features={[
                  'Verified badge',
                  'Priority support',
                  'More recommendations',
                  'Higher visibility',
                  '30 interests per month',
                ]}
                cta={t.activateWhatsapp}
                href={`https://wa.me/${whatsappNumber}?text=${planMessage(
                  'Verified Premium'
                )}`}
              />


              <PlanCard
                title="Personal Matchmaking"
                price="4999 PKR"
                period=""
                description="For families who want personal matchmaking support."
                features={[
                  'Dedicated matchmaker',
                  'Manual shortlisting',
                  'Family coordination',
                  'Priority matching',
                  'WhatsApp assistance',
                ]}
                cta={t.activateWhatsapp}
                href={`https://wa.me/${whatsappNumber}?text=${planMessage(
                  'Personal Matchmaking Service'
                )}`}
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">

      <p className="text-[11px] uppercase tracking-wide font-black text-slate-400">
        {label}
      </p>

      <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">
        {value}
      </p>

    </div>
  );
}


function FemaleBlurredFigure() {
  return (
    <div className="relative h-64 w-44">

      <div className="absolute left-1/2 top-5 h-20 w-20 -translate-x-1/2 rounded-full bg-amber-900/80" />

      <div className="absolute left-1/2 top-3 h-28 w-28 -translate-x-1/2 rounded-t-full bg-slate-950/85" />

      <div className="absolute left-1/2 top-28 h-28 w-32 -translate-x-1/2 rounded-t-[4rem] bg-rose-600/90" />

      <div className="absolute left-1/2 top-[10.5rem] h-32 w-44 -translate-x-1/2 rounded-t-[5rem] bg-pink-700/80" />

      <div className="absolute left-7 top-32 h-20 w-7 rotate-12 rounded-full bg-amber-800/65" />

      <div className="absolute right-7 top-32 h-20 w-7 -rotate-12 rounded-full bg-amber-800/65" />

    </div>
  );
}


function MaleBlurredFigure() {
  return (
    <div className="relative h-64 w-44">

      <div className="absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full bg-amber-800/80" />

      <div className="absolute left-1/2 top-5 h-12 w-24 -translate-x-1/2 rounded-t-full bg-slate-950/85" />

      <div className="absolute left-1/2 top-[7.5rem] h-32 w-36 -translate-x-1/2 rounded-t-[2.5rem] bg-blue-900/90" />

      <div className="absolute left-1/2 top-[11rem] h-32 w-44 -translate-x-1/2 rounded-t-[2rem] bg-slate-800/85" />

      <div className="absolute left-4 top-32 h-20 w-8 rotate-12 rounded-full bg-blue-950/75" />

      <div className="absolute right-4 top-32 h-20 w-8 -rotate-12 rounded-full bg-blue-950/75" />

    </div>
  );
}


function PlanCard({
  title,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
  popularLabel,
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  popularLabel?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-5 ${
        highlighted
          ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
          : 'border-slate-200 bg-white text-slate-950'
      }`}
    >

      {popularLabel && (
        <span className="absolute -top-3 left-5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
          {popularLabel}
        </span>
      )}


      <h4 className="font-heading text-xl font-black">
        {title}
      </h4>


      <p
        className={`mt-2 text-sm leading-relaxed ${
          highlighted
            ? 'text-slate-300'
            : 'text-slate-500'
        }`}
      >
        {description}
      </p>


      <div className="mt-5 flex items-end gap-1">
        <p className="text-3xl font-black">
          {price}
        </p>

        {period && (
          <p
            className={
              highlighted
                ? 'text-slate-400'
                : 'text-slate-500'
            }
          >
            {period}
          </p>
        )}
      </div>


      <ul className="mt-5 space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm"
          >
            <CheckCircle
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                highlighted
                  ? 'text-amber-300'
                  : 'text-green-600'
              }`}
            />

            <span
              className={
                highlighted
                  ? 'text-slate-200'
                  : 'text-slate-700'
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
        className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-black ${
          highlighted
            ? 'bg-amber-300 text-slate-950 hover:bg-amber-200'
            : 'bg-green-700 text-white hover:bg-green-800'
        }`}
      >
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
