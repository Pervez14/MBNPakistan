'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import Link from 'next/link';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  HeartHandshake,
  Home,
  Image as ImageIcon,
  Loader2,
  Lock,
  MapPin,
  PartyPopper,
  Save,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';

import LanguageToggle from '@/components/LanguageToggle';
import { supabase } from '@/lib/supabase';
import { useLanguage, type Language } from '@/lib/useLanguage';
import { createWatermarkedImageFile } from '@/lib/watermarkImage';

const DRAFT_KEY = 'mbn-public-profile-draft-v3';
const MAX_PHOTOS = 2;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const relationshipOptions = [
  'Self',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Relative',
  'Family Friend',
  'Other',
];

const maritalStatusOptions = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Khula',
];

const heightOptions = Array.from({ length: 25 }, (_, index) => {
  const totalInches = 54 + index;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}' ${inches}\"`;
});

const religionOptions = [
  'Islam',
  'Christianity',
  'Hinduism',
  'Sikhism',
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

const countryOptions = [
  'Pakistan',
  'United Kingdom',
  'United Arab Emirates',
  'Saudi Arabia',
  'United States',
  'Canada',
  'Australia',
  'Qatar',
  'Oman',
  'Germany',
  'France',
  'Italy',
  'Other',
];

const nationalityOptions = [
  'Pakistani',
  'British Pakistani',
  'American Pakistani',
  'Canadian Pakistani',
  'Australian Pakistani',
  'Dual National',
  'Other',
];

const residenceStatusOptions = [
  'Living in Pakistan',
  'Permanent Resident Abroad',
  'Citizen Abroad',
  'Work Visa Abroad',
  'Student Visa Abroad',
  'Other',
];

const educationOptions = [
  'Matric',
  'Intermediate',
  'Diploma',
  "Bachelor's",
  "Master's",
  'MPhil',
  'PhD',
  'Professional Degree',
  'Religious Education',
  'Other',
];

const employmentStatusOptions = [
  'Employed',
  'Self-Employed',
  'Business Owner',
  'Student',
  'Homemaker',
  'Not Currently Working',
  'Retired',
  'Other',
];

const jobTypeOptions = [
  'Government',
  'Private Sector',
  'Business',
  'Freelance / Remote',
  'Armed Forces',
  'Medical',
  'Education',
  'Overseas Employment',
  'Not Applicable',
  'Other',
];

const industryOptions = [
  'Information Technology',
  'Healthcare',
  'Education',
  'Engineering',
  'Finance / Banking',
  'Government',
  'Business / Trading',
  'Law',
  'Agriculture',
  'Media / Creative',
  'Hospitality',
  'Religious Services',
  'Not Applicable',
  'Other',
];

const incomeRangeOptions = [
  'Under 50,000 PKR',
  '50,000 - 100,000 PKR',
  '100,000 - 200,000 PKR',
  '200,000 - 300,000 PKR',
  '300,000 - 500,000 PKR',
  '500,000+ PKR',
  'Prefer not to say',
];

const complexionOptions = [
  'Very Fair',
  'Fair',
  'Wheatish',
  'Wheatish Brown',
  'Brown',
  'Dark',
  'Prefer not to say',
];

const bodyTypeOptions = [
  'Slim',
  'Average',
  'Athletic',
  'Healthy',
  'Heavy',
  'Prefer not to say',
];

const languageOptions = [
  'Urdu',
  'Punjabi',
  'Saraiki',
  'Pashto',
  'Sindhi',
  'Balochi',
  'English',
  'Arabic',
  'Multiple Languages',
  'Other',
];

const siblingCountOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8+'];

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

const preferredAgeOptions = ['20-25', '25-30', '30-35', '35-40', '40-45', 'Custom Range'];

const preferredCityOptions = [
  'Anywhere in Pakistan',
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
  'No Preference',
  'Matric',
  'Intermediate',
  'Graduation',
  "Master's",
  'MPhil',
  'PhD',
  'Professional Degree',
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

const initialFormData: PublicProfileFormData = {
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
  residenceStatus: 'Living in Pakistan',
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
  expectedPartnerEducation: 'No Preference',
  requirements: '',
  additionalNotes: '',
  photoVisibility: 'blurred',
  consentToStore: false,
  consentToShare: false,
};

type StepDefinition = {
  title: string;
  titleUrdu: string;
  shortTitle: string;
  shortTitleUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: LucideIcon;
};

const stepDefinitions: StepDefinition[] = [
  {
    title: 'Let’s start with you',
    titleUrdu: 'سب سے پہلے آپ کے بارے میں',
    shortTitle: 'Submitter',
    shortTitleUrdu: 'جمع کروانے والا',
    description: 'Tell us who is creating this profile and how we can contact you securely.',
    descriptionUrdu: 'بتائیں یہ پروفائل کون بنا رہا ہے اور ہم آپ سے محفوظ طریقے سے کیسے رابطہ کریں۔',
    icon: UserRound,
  },
  {
    title: 'Meet the candidate',
    titleUrdu: 'امیدوار کا تعارف',
    shortTitle: 'Candidate',
    shortTitleUrdu: 'امیدوار',
    description: 'The essential details that help us understand the person behind the profile.',
    descriptionUrdu: 'وہ بنیادی معلومات جو ہمیں امیدوار کو بہتر طور پر سمجھنے میں مدد دیتی ہیں۔',
    icon: Heart,
  },
  {
    title: 'Community & location',
    titleUrdu: 'کمیونٹی اور مقام',
    shortTitle: 'Background',
    shortTitleUrdu: 'پس منظر',
    description: 'Share cultural and location details used by families during initial shortlisting.',
    descriptionUrdu: 'ثقافتی اور رہائشی معلومات جو ابتدائی شارٹ لسٹنگ میں مدد دیتی ہیں۔',
    icon: MapPin,
  },
  {
    title: 'Education, career & personality',
    titleUrdu: 'تعلیم، پیشہ اور شخصیت',
    shortTitle: 'Lifestyle',
    shortTitleUrdu: 'طرزِ زندگی',
    description: 'A balanced snapshot of education, work and everyday personality.',
    descriptionUrdu: 'تعلیم، پیشے اور روزمرہ شخصیت کی ایک متوازن تصویر۔',
    icon: Briefcase,
  },
  {
    title: 'Family introduction',
    titleUrdu: 'خاندان کا تعارف',
    shortTitle: 'Family',
    shortTitleUrdu: 'خاندان',
    description: 'A respectful overview of the family environment and background.',
    descriptionUrdu: 'خاندانی ماحول اور پس منظر کا باوقار تعارف۔',
    icon: UsersRound,
  },
  {
    title: 'What kind of match feels right?',
    titleUrdu: 'آپ کے لیے موزوں رشتہ کیسا ہو؟',
    shortTitle: 'Preferences',
    shortTitleUrdu: 'ترجیحات',
    description: 'Keep must-haves realistic and use the notes for what truly matters to your family.',
    descriptionUrdu: 'ضروری ترجیحات حقیقت پسندانہ رکھیں اور اہم باتیں نوٹس میں لکھیں۔',
    icon: Sparkles,
  },
  {
    title: 'Photos & privacy',
    titleUrdu: 'تصاویر اور رازداری',
    shortTitle: 'Privacy',
    shortTitleUrdu: 'رازداری',
    description: 'Choose how the photo should appear and confirm permission to process the profile.',
    descriptionUrdu: 'تصویر کی نمائش کا طریقہ منتخب کریں اور پروفائل کے استعمال کی اجازت دیں۔',
    icon: ShieldCheck,
  },
  {
    title: 'Review your profile',
    titleUrdu: 'اپنی پروفائل کا جائزہ لیں',
    shortTitle: 'Review',
    shortTitleUrdu: 'جائزہ',
    description: 'Check the important details before sending the profile to the MBN review team.',
    descriptionUrdu: 'MBN کی ریویو ٹیم کو بھیجنے سے پہلے اہم معلومات دوبارہ چیک کریں۔',
    icon: ClipboardCheck,
  },
];

function calculateAgeFromDob(dateOfBirth: string) {
  if (!dateOfBirth) return '';

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  const dayDifference = today.getDate() - dob.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1;
  }

  if (age < 0 || age > 100) return '';
  return String(age);
}

function normalizeCount(value: string) {
  if (!value) return null;
  if (value === '8+') return 8;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, '').slice(0, 16);
}

export default function SubmitProfilePage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const tr = (english: string, urdu: string) => (isUrdu ? urdu : english);

  const [formData, setFormData] = useState<PublicProfileFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState('');
  const [referenceCopied, setReferenceCopied] = useState(false);

  const formTopRef = useRef<HTMLDivElement>(null);
  const photoPreviewsRef = useRef<string[]>([]);

  const calculatedAge = useMemo(
    () => calculateAgeFromDob(formData.dateOfBirth),
    [formData.dateOfBirth]
  );

  const cityOptions = formData.province
    ? citiesByProvince[formData.province] || []
    : [];

  const completionPercent = useMemo(() => {
    const completionFields: Array<keyof PublicProfileFormData> = [
      'submitterFullName',
      'submitterMobile',
      'relationshipToCandidate',
      'candidateName',
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'height',
      'religion',
      'sect',
      'caste',
      'province',
      'city',
      'country',
      'nationality',
      'residenceStatus',
      'education',
      'profession',
      'employmentStatus',
      'jobType',
      'industry',
      'incomeRange',
      'complexion',
      'bodyType',
      'languages',
      'totalSiblings',
      'brothersCount',
      'sistersCount',
      'fatherOccupation',
      'motherOccupation',
      'expectedPartnerAge',
      'expectedPartnerLocation',
    ];

    const completed = completionFields.reduce((total, key) => {
      const value = formData[key];
      return total + (typeof value === 'string' && value.trim() ? 1 : 0);
    }, 0);

    const photoScore = selectedPhotos.length > 0 ? 1 : 0;
    const consentScore = formData.consentToStore && formData.consentToShare ? 1 : 0;

    return Math.round(((completed + photoScore + consentScore) / (completionFields.length + 2)) * 100);
  }, [formData, selectedPhotos.length]);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_KEY);
      if (storedDraft) {
        const parsed = JSON.parse(storedDraft) as {
          formData?: Partial<PublicProfileFormData>;
          currentStep?: number;
          maxStepReached?: number;
          savedAt?: string;
        };

        if (parsed.formData) {
          setFormData((previous) => ({ ...previous, ...parsed.formData }));
        }

        if (
          typeof parsed.currentStep === 'number' &&
          parsed.currentStep >= 0 &&
          parsed.currentStep < stepDefinitions.length
        ) {
          setCurrentStep(parsed.currentStep);
          setMaxStepReached(
            typeof parsed.maxStepReached === 'number'
              ? Math.max(parsed.currentStep, Math.min(parsed.maxStepReached, stepDefinitions.length - 1))
              : parsed.currentStep
          );
        }

        if (parsed.savedAt) {
          const savedDate = new Date(parsed.savedAt);
          if (!Number.isNaN(savedDate.getTime())) {
            setLastSavedAt(savedDate);
            setDraftStatus('saved');
          }
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!draftLoaded || submitted) return;

    setDraftStatus('saving');

    const timer = window.setTimeout(() => {
      try {
        const savedAt = new Date();
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ formData, currentStep, maxStepReached, savedAt: savedAt.toISOString() })
        );
        setLastSavedAt(savedAt);
        setDraftStatus('saved');
      } catch {
        setDraftStatus('idle');
      }
    }, 550);

    return () => window.clearTimeout(timer);
  }, [formData, currentStep, maxStepReached, draftLoaded, submitted]);

  useEffect(() => {
    photoPreviewsRef.current = photoPreviews;
  }, [photoPreviews]);

  useEffect(() => {
    return () => {
      photoPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData((previous) => ({ ...previous, [name]: target.checked }));
      setErrorMessage('');
      return;
    }

    let value = target.value;
    if (name === 'submitterMobile' || name === 'submitterWhatsApp') {
      value = cleanPhone(value);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
    setErrorMessage('');
  };

  const updateValue = <K extends keyof PublicProfileFormData>(
    name: K,
    value: PublicProfileFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
    setErrorMessage('');
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - selectedPhotos.length;
    if (remainingSlots <= 0) {
      setErrorMessage(tr('You can upload a maximum of 2 photos.', 'آپ زیادہ سے زیادہ 2 تصاویر اپ لوڈ کر سکتے ہیں۔'));
      event.target.value = '';
      return;
    }

    const acceptedFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of files.slice(0, remainingSlots)) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(tr('Only JPG, PNG or WEBP images are accepted.', 'صرف JPG، PNG یا WEBP تصاویر قبول کی جاتی ہیں۔'));
        event.target.value = '';
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setErrorMessage(tr('Each photo must be smaller than 5MB.', 'ہر تصویر کا سائز 5MB سے کم ہونا چاہیے۔'));
        event.target.value = '';
        return;
      }

      acceptedFiles.push(file);
    }

    setSelectedPhotos((previous) => [...previous, ...acceptedFiles]);
    setPhotoPreviews((previous) => [
      ...previous,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setErrorMessage(
      files.length > remainingSlots
        ? tr('Only the first available photo slots were added.', 'صرف دستیاب جگہ کے مطابق ابتدائی تصاویر شامل کی گئی ہیں۔')
        : ''
    );
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    const previewToRemove = photoPreviews[index];
    if (previewToRemove) URL.revokeObjectURL(previewToRemove);

    setSelectedPhotos((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
    setPhotoPreviews((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearDraft = () => {
    const shouldClear = window.confirm(
      tr(
        'Clear all saved answers and start again?',
        'تمام محفوظ شدہ معلومات مٹا کر دوبارہ شروع کرنا چاہتے ہیں؟'
      )
    );

    if (!shouldClear) return;

    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setCurrentStep(0);
    setMaxStepReached(0);
    setErrorMessage('');
    setDraftStatus('idle');
    setLastSavedAt(null);
  };

  const getStepError = (stepIndex: number) => {
    const required = (
      fields: Array<[keyof PublicProfileFormData, string, string]>
    ) => {
      for (const [field, english, urdu] of fields) {
        const value = formData[field];
        if (typeof value !== 'string' || !value.trim()) {
          return { message: tr(english, urdu), field };
        }
      }
      return null;
    };

    if (stepIndex === 0) {
      return required([
        ['submitterFullName', 'Please enter your full name.', 'براہِ کرم اپنا مکمل نام درج کریں۔'],
        ['relationshipToCandidate', 'Please select your relationship to the candidate.', 'امیدوار سے اپنا تعلق منتخب کریں۔'],
        ['submitterMobile', 'Please enter an active mobile number.', 'فعال موبائل نمبر درج کریں۔'],
      ]);
    }

    if (stepIndex === 1) {
      const basicError = required([
        ['candidateName', 'Please enter the candidate name.', 'امیدوار کا نام درج کریں۔'],
        ['gender', 'Please select the candidate gender.', 'امیدوار کی جنس منتخب کریں۔'],
        ['dateOfBirth', 'Please enter the date of birth.', 'تاریخِ پیدائش درج کریں۔'],
        ['maritalStatus', 'Please select marital status.', 'ازدواجی حیثیت منتخب کریں۔'],
        ['height', 'Please select height.', 'قد منتخب کریں۔'],
      ]);

      if (basicError) return basicError;
      if (!calculatedAge) {
        return {
          message: tr('Please enter a valid date of birth.', 'درست تاریخِ پیدائش درج کریں۔'),
          field: 'dateOfBirth' as keyof PublicProfileFormData,
        };
      }
      if (Number(calculatedAge) < 18) {
        return {
          message: tr('The candidate must be at least 18 years old.', 'امیدوار کی عمر کم از کم 18 سال ہونی چاہیے۔'),
          field: 'dateOfBirth' as keyof PublicProfileFormData,
        };
      }
      return null;
    }

    if (stepIndex === 2) {
      return required([
        ['religion', 'Please select religion.', 'مذہب منتخب کریں۔'],
        ['sect', 'Please select sect or “Prefer not to say”.', 'مسلک یا “بتانا پسند نہیں” منتخب کریں۔'],
        ['caste', 'Please select community or “Prefer not to say”.', 'برادری یا “بتانا پسند نہیں” منتخب کریں۔'],
        ['province', 'Please select province or region.', 'صوبہ یا علاقہ منتخب کریں۔'],
        ['city', 'Please select city.', 'شہر منتخب کریں۔'],
        ['country', 'Please select country.', 'ملک منتخب کریں۔'],
        ['nationality', 'Please select nationality.', 'قومیت منتخب کریں۔'],
        ['residenceStatus', 'Please select residence status.', 'رہائشی حیثیت منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 3) {
      return required([
        ['education', 'Please select education.', 'تعلیم منتخب کریں۔'],
        ['profession', 'Please enter profession or role.', 'پیشہ یا کردار درج کریں۔'],
        ['employmentStatus', 'Please select employment status.', 'ملازمت کی حیثیت منتخب کریں۔'],
        ['jobType', 'Please select job type.', 'ملازمت کی قسم منتخب کریں۔'],
        ['industry', 'Please select industry.', 'شعبہ منتخب کریں۔'],
        ['incomeRange', 'Please select income range or “Prefer not to say”.', 'آمدنی کی حد یا “بتانا پسند نہیں” منتخب کریں۔'],
        ['complexion', 'Please select complexion or “Prefer not to say”.', 'رنگت یا “بتانا پسند نہیں” منتخب کریں۔'],
        ['bodyType', 'Please select body type or “Prefer not to say”.', 'جسمانی ساخت یا “بتانا پسند نہیں” منتخب کریں۔'],
        ['languages', 'Please select the main language.', 'مرکزی زبان منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 4) {
      return required([
        ['totalSiblings', 'Please select total siblings.', 'کل بہن بھائیوں کی تعداد منتخب کریں۔'],
        ['brothersCount', 'Please select number of brothers.', 'بھائیوں کی تعداد منتخب کریں۔'],
        ['sistersCount', 'Please select number of sisters.', 'بہنوں کی تعداد منتخب کریں۔'],
        ['fatherOccupation', 'Please select father’s occupation.', 'والد کا پیشہ منتخب کریں۔'],
        ['motherOccupation', 'Please select mother’s occupation.', 'والدہ کا پیشہ منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 5) {
      return required([
        ['expectedPartnerAge', 'Please select a preferred age range.', 'ترجیحی عمر کی حد منتخب کریں۔'],
        ['expectedPartnerLocation', 'Please select a preferred location.', 'ترجیحی مقام منتخب کریں۔'],
        ['expectedPartnerEducation', 'Please select an education preference.', 'تعلیمی ترجیح منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 6 || stepIndex === 7) {
      if (selectedPhotos.length < 1) {
        return {
          message: tr('Please upload at least one candidate photo.', 'امیدوار کی کم از کم ایک تصویر اپ لوڈ کریں۔'),
          field: 'photoVisibility' as keyof PublicProfileFormData,
        };
      }

      if (!formData.consentToStore) {
        return {
          message: tr('Please allow secure storage and processing of this profile.', 'اس پروفائل کو محفوظ رکھنے اور پراسیس کرنے کی اجازت دیں۔'),
          field: 'consentToStore' as keyof PublicProfileFormData,
        };
      }

      if (!formData.consentToShare) {
        return {
          message: tr('Please confirm authorized matchmaking sharing.', 'مجاز میچ میکنگ شیئرنگ کی اجازت کی تصدیق کریں۔'),
          field: 'consentToShare' as keyof PublicProfileFormData,
        };
      }
    }

    return null;
  };

  const scrollToFormTop = () => {
    window.setTimeout(() => {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const focusInvalidField = (field?: keyof PublicProfileFormData) => {
    if (!field) return;
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[name="${String(field)}"]`)?.focus();
    }, 350);
  };

  const goNext = () => {
    const validationError = getStepError(currentStep);
    if (validationError) {
      setErrorMessage(validationError.message);
      focusInvalidField(validationError.field);
      return;
    }

    setErrorMessage('');
    setTransitionDirection('forward');
    const nextStep = Math.min(currentStep + 1, stepDefinitions.length - 1);
    setCurrentStep(nextStep);
    setMaxStepReached((previous) => Math.max(previous, nextStep));
    scrollToFormTop();
  };

  const goBack = () => {
    setErrorMessage('');
    setTransitionDirection('back');
    setCurrentStep((previous) => Math.max(previous - 1, 0));
    scrollToFormTop();
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex > maxStepReached) return;
    setTransitionDirection(stepIndex < currentStep ? 'back' : 'forward');
    setCurrentStep(stepIndex);
    setErrorMessage('');
    scrollToFormTop();
  };

  const uploadPhotos = async () => {
    const uploadedUrls: string[] = [];

    for (let index = 0; index < selectedPhotos.length; index += 1) {
      const photo = selectedPhotos[index];
      setSubmissionStage(
        tr(
          `Protecting photo ${index + 1} of ${selectedPhotos.length}…`,
          `تصویر ${index + 1} از ${selectedPhotos.length} محفوظ کی جا رہی ہے…`
        )
      );

      const watermarkedPhoto = await createWatermarkedImageFile(photo, 'MBNPakistan.com');
      const safeFileName = watermarkedPhoto.name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '')
        .toLowerCase();

      const randomFolder =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const filePath = `${randomFolder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-submission-photos')
        .upload(filePath, watermarkedPhoto, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('public-submission-photos')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationError = getStepError(7);
    if (validationError) {
      setErrorMessage(validationError.message);
      focusInvalidField(validationError.field);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const photoUrls = await uploadPhotos();
      setSubmissionStage(tr('Sending your profile securely…', 'آپ کی پروفائل محفوظ طریقے سے بھیجی جا رہی ہے…'));

      const siblingsSummary = `${formData.totalSiblings} total siblings, ${formData.brothersCount} brothers, ${formData.sistersCount} sisters`;
      const submissionId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const { error } = await supabase.from('public_profile_submissions').insert({
        id: submissionId,
        source_type: 'public_submission',
        submitter_full_name: formData.submitterFullName.trim(),
        submitter_email: formData.submitterEmail.trim() || null,
        submitter_mobile: formData.submitterMobile.trim(),
        submitter_whatsapp: formData.submitterWhatsApp.trim() || null,
        relationship_to_candidate: formData.relationshipToCandidate || 'Self',
        candidate_name: formData.candidateName.trim(),
        gender: formData.gender,
        age: Number(calculatedAge),
        date_of_birth: formData.dateOfBirth,
        marital_status: formData.maritalStatus,
        height: formData.height,
        religion: formData.religion || 'Islam',
        sect: formData.sect,
        caste: formData.caste,
        province: formData.province,
        city: formData.city,
        country: formData.country || 'Pakistan',
        nationality: formData.nationality || 'Pakistani',
        residence_status: formData.residenceStatus,
        education: formData.education,
        profession: formData.profession.trim(),
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
        family_details: formData.familyDetails.trim() || null,
        expected_partner_age: formData.expectedPartnerAge || null,
        expected_partner_location: formData.expectedPartnerLocation || null,
        expected_partner_education: formData.expectedPartnerEducation || null,
        requirements: formData.requirements.trim() || null,
        additional_notes: formData.additionalNotes.trim() || null,
        photo_url: photoUrls[0],
        photo_url_2: photoUrls[1] || null,
        photo_visibility: formData.photoVisibility || 'blurred',
        consent_to_store: formData.consentToStore,
        consent_to_share: formData.consentToShare,
        review_status: 'new',
        converted_to_profile: false,
      });

      if (error) throw error;

      setSubmissionStage(tr('Creating your private reference…', 'آپ کا نجی ریفرنس بنایا جا رہا ہے…'));

      const { data: referenceData, error: referenceError } = await supabase.rpc(
        'get_public_submission_reference',
        { p_submission_id: submissionId }
      );

      if (referenceError) throw referenceError;

      setSubmissionReference(typeof referenceData === 'string' ? referenceData : submissionId);
      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof (error as { message?: unknown }).message === 'string'
            ? (error as { message: string }).message
            : tr('Profile could not be submitted. Please try again.', 'پروفائل جمع نہیں ہو سکی۔ دوبارہ کوشش کریں۔');

      setErrorMessage(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setSubmissionStage('');
    }
  };

  const copyReferenceNumber = async () => {
    if (!submissionReference) return;

    try {
      await navigator.clipboard.writeText(submissionReference);
      setReferenceCopied(true);
      window.setTimeout(() => setReferenceCopied(false), 2400);
    } catch {
      setErrorMessage(
        tr(
          'Reference number could not be copied automatically.',
          'ریفرنس نمبر خودکار طور پر کاپی نہیں ہو سکا۔'
        )
      );
    }
  };

  const resetForAnotherProfile = () => {
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setFormData(initialFormData);
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setCurrentStep(0);
    setMaxStepReached(0);
    setSubmitted(false);
    setSubmissionReference('');
    setErrorMessage('');
    setDraftStatus('idle');
    setLastSavedAt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-hidden bg-[#f3f8f4]">
        <PublicHeader language={language} setLanguage={setLanguage} />

        <main className="relative mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-20">
          <div className="pointer-events-none absolute left-[-8rem] top-6 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />

          <section className="relative overflow-hidden rounded-[2.25rem] border border-emerald-200/80 bg-white px-6 py-10 text-center shadow-[0_30px_90px_-42px_rgba(15,79,50,0.45)] md:px-12 md:py-14">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#c8a84b] to-emerald-500" />
            <div className="success-orbit mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-[#137a4a]" />
            </div>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              <PartyPopper className="h-4 w-4" />
              {tr('Profile received securely', 'پروفائل محفوظ طریقے سے موصول ہو گئی')}
            </div>

            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              {tr('Thank you for trusting MBN', 'MBN پر اعتماد کرنے کا شکریہ')}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              {tr(
                'Your profile is now in the private review queue. It is not automatically published or shown as a public match.',
                'آپ کی پروفائل اب نجی ریویو قطار میں ہے۔ اسے خودکار طور پر شائع یا عوامی میچ کے طور پر نہیں دکھایا جائے گا۔'
              )}
            </p>

            <div className="mx-auto mt-9 max-w-xl rounded-3xl border border-emerald-200 bg-[#f7fcf8] p-5 md:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
                {tr('Your private reference', 'آپ کا نجی ریفرنس')}
              </p>
              <div className="mt-3 flex flex-col items-stretch gap-3 rounded-2xl border border-emerald-100 bg-white p-3 sm:flex-row sm:items-center">
                <code dir="ltr" className="flex-1 select-all text-xl font-black tracking-wider text-slate-900 md:text-2xl">
                  {submissionReference}
                </code>
                <button
                  type="button"
                  onClick={copyReferenceNumber}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800"
                >
                  {referenceCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {referenceCopied ? tr('Copied', 'کاپی ہو گیا') : tr('Copy', 'کاپی کریں')}
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {tr(
                  'Save this number. Our team may ask for it when you contact MBN about this submission.',
                  'یہ نمبر محفوظ رکھیں۔ اس پروفائل کے متعلق رابطہ کرتے وقت ہماری ٹیم یہ نمبر پوچھ سکتی ہے۔'
                )}
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-3xl gap-3 text-start md:grid-cols-3">
              <SuccessStage
                icon={CheckCircle2}
                title={tr('Received', 'موصول')}
                text={tr('Your answers and photos were submitted.', 'آپ کی معلومات اور تصاویر جمع ہو گئیں۔')}
                active
              />
              <SuccessStage
                icon={ShieldCheck}
                title={tr('Private review', 'نجی جائزہ')}
                text={tr('The MBN team checks completeness and consent.', 'MBN ٹیم معلومات اور اجازت کا جائزہ لے گی۔')}
              />
              <SuccessStage
                icon={HeartHandshake}
                title={tr('Matchmaking', 'میچ میکنگ')}
                text={tr('You will be contacted when a suitable next step exists.', 'مناسب اگلے مرحلے پر آپ سے رابطہ کیا جائے گا۔')}
              />
            </div>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#137a4a] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b5f38]"
              >
                <Home className="h-4 w-4" />
                {tr('Back to homepage', 'ہوم پیج پر جائیں')}
              </Link>
              <button
                type="button"
                onClick={resetForAnotherProfile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
              >
                <UserRound className="h-4 w-4" />
                {tr('Submit another profile', 'ایک اور پروفائل جمع کریں')}
              </button>
            </div>
          </section>
        </main>

        <PageAnimations />
      </div>
    );
  }

  const currentStepDefinition = stepDefinitions[currentStep];
  const CurrentStepIcon = currentStepDefinition.icon;
  const stepProgress = Math.round(((currentStep + 1) / stepDefinitions.length) * 100);

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-x-hidden bg-[#f4f8f5]">
      <PublicHeader language={language} setLanguage={setLanguage} />

      <main className="relative mx-auto max-w-[1380px] px-4 py-7 md:px-8 md:py-10 xl:px-10">
        <div className="pointer-events-none absolute left-[-12rem] top-20 h-[30rem] w-[30rem] rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[-12rem] top-80 h-[28rem] w-[28rem] rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <ArrowLeft className={`h-4 w-4 ${isUrdu ? 'rotate-180' : ''}`} />
            {tr('Back to homepage', 'ہوم پیج پر واپس')}
          </Link>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
              {draftStatus === 'saving' ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : draftStatus === 'saved' ? (
                <Cloud className="h-4 w-4 text-emerald-600" />
              ) : (
                <Save className="h-4 w-4 text-slate-400" />
              )}
              <span>
                {draftStatus === 'saving'
                  ? tr('Saving…', 'محفوظ ہو رہا ہے…')
                  : draftStatus === 'saved'
                    ? tr('Draft saved', 'ڈرافٹ محفوظ ہے')
                    : tr('Auto-save on', 'آٹو سیو فعال')}
              </span>
              {lastSavedAt && draftStatus === 'saved' && (
                <span className="hidden text-slate-400 sm:inline">
                  · {lastSavedAt.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={clearDraft}
              className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm backdrop-blur transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              {tr('Clear', 'صاف کریں')}
            </button>
          </div>
        </div>

        <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-[#0f5939] px-6 py-8 text-white shadow-[0_28px_80px_-40px_rgba(15,79,50,0.65)] md:px-10 md:py-10">
          <div className="absolute inset-0 opacity-30">
            <PatternLayer />
          </div>
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-white/5" />
          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-[#c8a84b]/15 blur-2xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-300" />
                {tr('A private profile journey', 'ایک نجی پروفائل کا سفر')}
              </div>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
                {tr('Tell your story, one easy step at a time.', 'اپنی کہانی آسان مراحل میں بیان کریں۔')}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/85 md:text-lg">
                {tr(
                  'A guided, privacy-first questionnaire designed for Pakistani families. Your profile remains under review and is never auto-published.',
                  'پاکستانی خاندانوں کے لیے ایک آسان اور رازداری پر مبنی سوالنامہ۔ آپ کی پروفائل پہلے ریویو ہوگی اور خودکار طور پر شائع نہیں کی جائے گی۔'
                )}
              </p>
            </div>

            <div className="hidden min-w-[210px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:block">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-50/75">{tr('Profile completion', 'پروفائل تکمیل')}</span>
                <strong>{completionPercent}%</strong>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-100 transition-all duration-700"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="mt-5 flex items-start gap-3 text-sm text-emerald-50/80">
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
                <span>{tr('Drafts stay on this device until submission.', 'ڈرافٹ جمع ہونے تک اسی ڈیوائس پر محفوظ رہتا ہے۔')}</span>
              </div>
            </div>
          </div>
        </section>

        <div ref={formTopRef} className="scroll-mt-6" />

        <div className="relative grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur">
              <div className="px-3 pb-4 pt-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>{tr('Your progress', 'آپ کی پیش رفت')}</span>
                  <span className="text-emerald-700">{stepProgress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
              </div>

              <nav className="space-y-1.5" aria-label={tr('Profile steps', 'پروفائل مراحل')}>
                {stepDefinitions.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isComplete = index !== currentStep && index <= maxStepReached;
                  const isLocked = index > maxStepReached;

                  return (
                    <button
                      key={step.shortTitle}
                      type="button"
                      disabled={isLocked}
                      onClick={() => jumpToStep(index)}
                      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/10'
                          : isComplete
                            ? 'text-slate-700 hover:bg-emerald-50'
                            : 'cursor-default text-slate-400'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition ${
                          isActive
                            ? 'border-white/20 bg-white/15'
                            : isComplete
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[11px] font-bold uppercase tracking-[0.14em] ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {tr(`Step ${index + 1}`, `مرحلہ ${index + 1}`)}
                        </span>
                        <span className="block truncate text-sm font-bold">
                          {isUrdu ? step.shortTitleUrdu : step.shortTitle}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                  <p className="text-xs leading-5 text-amber-900/75">
                    {tr(
                      'Only authorized MBN reviewers and approved matchmaking partners should access submitted details.',
                      'جمع شدہ معلومات صرف مجاز MBN ریویورز اور منظور شدہ میچ میکنگ پارٹنرز کے لیے ہیں۔'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <CurrentStepIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      {tr(`Step ${currentStep + 1} of ${stepDefinitions.length}`, `مرحلہ ${currentStep + 1} از ${stepDefinitions.length}`)}
                    </p>
                    <p className="truncate font-bold text-slate-900">
                      {isUrdu ? currentStepDefinition.shortTitleUrdu : currentStepDefinition.shortTitle}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700">{stepProgress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-600 transition-all duration-700" style={{ width: `${stepProgress}%` }} />
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 flex animate-error-shake items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm" role="alert">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-1 font-semibold leading-6">{errorMessage}</div>
                <button type="button" onClick={() => setErrorMessage('')} className="rounded-full p-1 hover:bg-red-100" aria-label={tr('Close error', 'غلطی بند کریں')}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_26px_80px_-48px_rgba(15,23,42,0.45)]">
                <div className="border-b border-slate-100 bg-gradient-to-r from-white via-emerald-50/60 to-white px-5 py-6 md:px-8 md:py-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 md:h-16 md:w-16">
                      <CurrentStepIcon className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                        {tr(`Step ${currentStep + 1} of ${stepDefinitions.length}`, `مرحلہ ${currentStep + 1} از ${stepDefinitions.length}`)}
                      </p>
                      <h2 className="mt-1 font-heading text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                        {isUrdu ? currentStepDefinition.titleUrdu : currentStepDefinition.title}
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                        {isUrdu ? currentStepDefinition.descriptionUrdu : currentStepDefinition.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  key={currentStep}
                  className={`min-h-[470px] px-5 py-6 md:px-8 md:py-9 ${
                    transitionDirection === 'forward' ? 'animate-step-forward' : 'animate-step-back'
                  }`}
                >
                  {currentStep === 0 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Who is this profile for?', 'یہ پروفائل کس کے لیے ہے؟')}
                        help={tr('Choose the relationship of the person completing this form.', 'فارم مکمل کرنے والے فرد کا امیدوار سے تعلق منتخب کریں۔')}
                      >
                        <ChoiceGrid
                          name="relationshipToCandidate"
                          value={formData.relationshipToCandidate}
                          options={relationshipOptions}
                          onSelect={(value) => updateValue('relationshipToCandidate', value)}
                          labels={{
                            Self: tr('Myself', 'اپنے لیے'),
                            Father: tr('My child — father', 'اپنی اولاد — والد'),
                            Mother: tr('My child — mother', 'اپنی اولاد — والدہ'),
                            Brother: tr('My sibling — brother', 'اپنے بہن بھائی — بھائی'),
                            Sister: tr('My sibling — sister', 'اپنے بہن بھائی — بہن'),
                            Relative: tr('A relative', 'رشتہ دار'),
                            'Family Friend': tr('A family friend', 'خاندانی دوست'),
                            Other: tr('Someone else', 'کوئی اور'),
                          }}
                          columns="sm:grid-cols-2 xl:grid-cols-4"
                        />
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('How should we identify and contact you?', 'ہم آپ کو کیسے شناخت اور رابطہ کریں؟')}
                        help={tr('Use an active number that you personally control.', 'ایسا فعال نمبر دیں جو آپ خود استعمال کرتے ہوں۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextInput
                            label={tr('Your full name', 'آپ کا مکمل نام')}
                            name="submitterFullName"
                            value={formData.submitterFullName}
                            onChange={updateField}
                            placeholder={tr('e.g. Muhammad Ahmed', 'مثلاً محمد احمد')}
                            required
                            autoComplete="name"
                          />
                          <TextInput
                            label={tr('Mobile number', 'موبائل نمبر')}
                            name="submitterMobile"
                            value={formData.submitterMobile}
                            onChange={updateField}
                            placeholder="+92 300 1234567"
                            required
                            inputMode="tel"
                            autoComplete="tel"
                            dir="ltr"
                          />
                          <TextInput
                            label={tr('WhatsApp number', 'واٹس ایپ نمبر')}
                            name="submitterWhatsApp"
                            value={formData.submitterWhatsApp}
                            onChange={updateField}
                            placeholder={tr('Leave blank if same as mobile', 'اگر موبائل نمبر ہی ہے تو خالی چھوڑ دیں')}
                            inputMode="tel"
                            autoComplete="tel"
                            dir="ltr"
                          />
                          <TextInput
                            label={tr('Email address', 'ای میل ایڈریس')}
                            name="submitterEmail"
                            type="email"
                            value={formData.submitterEmail}
                            onChange={updateField}
                            placeholder="you@example.com"
                            autoComplete="email"
                            dir="ltr"
                          />
                        </div>
                      </QuestionBlock>

                      <TrustNote
                        icon={Lock}
                        title={tr('Why we ask', 'ہم یہ کیوں پوچھتے ہیں')}
                        text={tr(
                          'This contact is used for profile review and follow-up. It is not displayed on a public page.',
                          'یہ رابطہ پروفائل ریویو اور فالو اَپ کے لیے استعمال ہوگا۔ اسے عوامی صفحے پر نہیں دکھایا جائے گا۔'
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Is the candidate a bride or groom?', 'امیدوار دلہن ہے یا دلہا؟')}
                        help={tr('This helps us show the right wording and matchmaking filters.', 'اس سے درست الفاظ اور میچ میکنگ فلٹرز استعمال ہوتے ہیں۔')}
                      >
                        <ChoiceGrid
                          name="gender"
                          value={formData.gender}
                          options={['Female', 'Male']}
                          onSelect={(value) => updateValue('gender', value)}
                          labels={{ Female: tr('Bride profile', 'دلہن کی پروفائل'), Male: tr('Groom profile', 'دلہا کی پروفائل') }}
                          icons={{ Female: Heart, Male: HeartHandshake }}
                          columns="sm:grid-cols-2"
                          large
                        />
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('Tell us the candidate’s essentials', 'امیدوار کی بنیادی معلومات')}
                        help={tr('These details form the identity section of the private profile.', 'یہ معلومات نجی پروفائل کے شناختی حصے میں شامل ہوں گی۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextInput
                            label={tr('Candidate full name', 'امیدوار کا مکمل نام')}
                            name="candidateName"
                            value={formData.candidateName}
                            onChange={updateField}
                            placeholder={tr('Full name', 'مکمل نام')}
                            required
                          />
                          <TextInput
                            label={tr('Date of birth', 'تاریخِ پیدائش')}
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={updateField}
                            required
                            dir="ltr"
                          />
                          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                              {tr('Calculated age', 'حساب شدہ عمر')}
                            </p>
                            <p className="mt-1 text-2xl font-black text-slate-950">
                              {calculatedAge ? tr(`${calculatedAge} years`, `${calculatedAge} سال`) : '—'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {tr('Automatically calculated from date of birth.', 'تاریخِ پیدائش سے خودکار طور پر حساب کیا گیا۔')}
                            </p>
                          </div>
                          <SelectInput
                            label={tr('Height', 'قد')}
                            name="height"
                            value={formData.height}
                            onChange={updateField}
                            options={heightOptions}
                            placeholder={tr('Select height', 'قد منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="03"
                        title={tr('What is the current marital status?', 'موجودہ ازدواجی حیثیت کیا ہے؟')}
                      >
                        <ChoiceGrid
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          options={maritalStatusOptions}
                          onSelect={(value) => updateValue('maritalStatus', value)}
                          labels={{
                            'Never Married': tr('Never married', 'غیر شادی شدہ'),
                            Divorced: tr('Divorced', 'طلاق یافتہ'),
                            Widowed: tr('Widowed', 'بیوہ / رنڈوا'),
                            Separated: tr('Separated', 'علیحدہ'),
                            Khula: tr('Khula', 'خلع یافتہ'),
                          }}
                          columns="sm:grid-cols-2 xl:grid-cols-3"
                        />
                      </QuestionBlock>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Religious and community background', 'مذہبی اور برادری کا پس منظر')}
                        help={tr('You may choose “Prefer not to say” for sensitive community details.', 'حساس برادری کی معلومات کے لیے “بتانا پسند نہیں” منتخب کیا جا سکتا ہے۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <SelectInput
                            label={tr('Religion', 'مذہب')}
                            name="religion"
                            value={formData.religion}
                            onChange={updateField}
                            options={religionOptions}
                            placeholder={tr('Select religion', 'مذہب منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Sect', 'مسلک')}
                            name="sect"
                            value={formData.sect}
                            onChange={updateField}
                            options={sectOptions}
                            placeholder={tr('Select sect', 'مسلک منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Caste / community', 'ذات / برادری')}
                            name="caste"
                            value={formData.caste}
                            onChange={updateField}
                            options={pakistaniCastes}
                            placeholder={tr('Select community', 'برادری منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('Where does the candidate live?', 'امیدوار کہاں رہتا ہے؟')}
                        help={tr('Select Overseas as the region when the candidate mainly lives abroad.', 'اگر امیدوار بیرونِ ملک رہتا ہے تو علاقہ Overseas منتخب کریں۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <SelectInput
                            label={tr('Province / region', 'صوبہ / علاقہ')}
                            name="province"
                            value={formData.province}
                            onChange={updateField}
                            options={Object.keys(citiesByProvince)}
                            placeholder={tr('Select province or region', 'صوبہ یا علاقہ منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('City', 'شہر')}
                            name="city"
                            value={formData.city}
                            onChange={updateField}
                            options={cityOptions}
                            placeholder={formData.province ? tr('Select city', 'شہر منتخب کریں') : tr('Select region first', 'پہلے علاقہ منتخب کریں')}
                            required
                            disabled={!formData.province}
                          />
                          <SelectInput
                            label={tr('Current country', 'موجودہ ملک')}
                            name="country"
                            value={formData.country}
                            onChange={updateField}
                            options={countryOptions}
                            placeholder={tr('Select country', 'ملک منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Nationality', 'قومیت')}
                            name="nationality"
                            value={formData.nationality}
                            onChange={updateField}
                            options={nationalityOptions}
                            placeholder={tr('Select nationality', 'قومیت منتخب کریں')}
                            required
                          />
                          <div className="md:col-span-2">
                            <SelectInput
                              label={tr('Residence status', 'رہائشی حیثیت')}
                              name="residenceStatus"
                              value={formData.residenceStatus}
                              onChange={updateField}
                              options={residenceStatusOptions}
                              placeholder={tr('Select residence status', 'رہائشی حیثیت منتخب کریں')}
                              required
                            />
                          </div>
                        </div>
                      </QuestionBlock>

                      <TrustNote
                        icon={MapPin}
                        title={tr('Location helps, but does not define compatibility', 'مقام مدد کرتا ہے، مگر مطابقت کا واحد معیار نہیں')}
                        text={tr(
                          'The review team can consider relocation and overseas preferences later in the process.',
                          'ریویو ٹیم بعد میں منتقلی اور بیرونِ ملک ترجیحات کو بھی مدِنظر رکھ سکتی ہے۔'
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Education and professional life', 'تعلیم اور پیشہ ورانہ زندگی')}
                        help={tr('Choose the closest option; details can be clarified in the profession field.', 'قریب ترین آپشن منتخب کریں؛ مزید تفصیل پیشے کے خانے میں لکھی جا سکتی ہے۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <SelectInput
                            label={tr('Highest education', 'اعلیٰ ترین تعلیم')}
                            name="education"
                            value={formData.education}
                            onChange={updateField}
                            options={educationOptions}
                            placeholder={tr('Select education', 'تعلیم منتخب کریں')}
                            required
                          />
                          <TextInput
                            label={tr('Profession / role', 'پیشہ / کردار')}
                            name="profession"
                            value={formData.profession}
                            onChange={updateField}
                            placeholder={tr('e.g. Doctor, Teacher, Business Owner', 'مثلاً ڈاکٹر، ٹیچر، بزنس اونر')}
                            required
                          />
                          <SelectInput
                            label={tr('Employment status', 'ملازمت کی حیثیت')}
                            name="employmentStatus"
                            value={formData.employmentStatus}
                            onChange={updateField}
                            options={employmentStatusOptions}
                            placeholder={tr('Select status', 'حیثیت منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Work type', 'کام کی قسم')}
                            name="jobType"
                            value={formData.jobType}
                            onChange={updateField}
                            options={jobTypeOptions}
                            placeholder={tr('Select work type', 'کام کی قسم منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Industry', 'شعبہ')}
                            name="industry"
                            value={formData.industry}
                            onChange={updateField}
                            options={industryOptions}
                            placeholder={tr('Select industry', 'شعبہ منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Monthly income range', 'ماہانہ آمدنی کی حد')}
                            name="incomeRange"
                            value={formData.incomeRange}
                            onChange={updateField}
                            options={incomeRangeOptions}
                            placeholder={tr('Select range', 'حد منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('A simple personality snapshot', 'شخصیت کی مختصر جھلک')}
                        help={tr('Privacy-respecting “Prefer not to say” options are available.', 'رازداری کے لیے “بتانا پسند نہیں” کے آپشن موجود ہیں۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <SelectInput
                            label={tr('Complexion', 'رنگت')}
                            name="complexion"
                            value={formData.complexion}
                            onChange={updateField}
                            options={complexionOptions}
                            placeholder={tr('Select', 'منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Body type', 'جسمانی ساخت')}
                            name="bodyType"
                            value={formData.bodyType}
                            onChange={updateField}
                            options={bodyTypeOptions}
                            placeholder={tr('Select', 'منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Main language', 'مرکزی زبان')}
                            name="languages"
                            value={formData.languages}
                            onChange={updateField}
                            options={languageOptions}
                            placeholder={tr('Select language', 'زبان منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <TrustNote
                        icon={GraduationCap}
                        title={tr('Good profiles feel human', 'اچھی پروفائل انسان کو ظاہر کرتی ہے')}
                        text={tr(
                          'Use Additional Notes later to share values, interests or ambitions that cannot fit into a dropdown.',
                          'بعد میں اضافی نوٹس میں اقدار، دلچسپیاں یا مقاصد لکھیں جو ڈراپ ڈاؤن میں بیان نہیں ہو سکتے۔'
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Siblings at a glance', 'بہن بھائیوں کی مختصر معلومات')}
                        help={tr('Use the counts as a simple family overview.', 'یہ تعداد خاندان کے مختصر تعارف کے طور پر استعمال ہوگی۔')}
                      >
                        <div className="grid gap-4 sm:grid-cols-3">
                          <SelectInput
                            label={tr('Total siblings', 'کل بہن بھائی')}
                            name="totalSiblings"
                            value={formData.totalSiblings}
                            onChange={updateField}
                            options={siblingCountOptions}
                            placeholder={tr('Select', 'منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Brothers', 'بھائی')}
                            name="brothersCount"
                            value={formData.brothersCount}
                            onChange={updateField}
                            options={siblingCountOptions}
                            placeholder={tr('Select', 'منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Sisters', 'بہنیں')}
                            name="sistersCount"
                            value={formData.sistersCount}
                            onChange={updateField}
                            options={siblingCountOptions}
                            placeholder={tr('Select', 'منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('Parents and family environment', 'والدین اور خاندانی ماحول')}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <SelectInput
                            label={tr('Father’s occupation', 'والد کا پیشہ')}
                            name="fatherOccupation"
                            value={formData.fatherOccupation}
                            onChange={updateField}
                            options={occupationOptions}
                            placeholder={tr('Select occupation', 'پیشہ منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Mother’s occupation', 'والدہ کا پیشہ')}
                            name="motherOccupation"
                            value={formData.motherOccupation}
                            onChange={updateField}
                            options={occupationOptions}
                            placeholder={tr('Select occupation', 'پیشہ منتخب کریں')}
                            required
                          />
                          <div className="md:col-span-2">
                            <TextAreaInput
                              label={tr('Family introduction', 'خاندان کا تعارف')}
                              name="familyDetails"
                              value={formData.familyDetails}
                              onChange={updateField}
                              placeholder={tr(
                                'Share family values, family system, hometown or anything important for a respectful introduction…',
                                'خاندانی اقدار، فیملی سسٹم، آبائی شہر یا باوقار تعارف کے لیے کوئی اہم بات لکھیں…'
                              )}
                              rows={5}
                              maxLength={800}
                            />
                          </div>
                        </div>
                      </QuestionBlock>

                      <TrustNote
                        icon={UsersRound}
                        title={tr('Respect over excessive detail', 'ضرورت سے زیادہ تفصیل کے بجائے احترام')}
                        text={tr(
                          'Avoid CNIC numbers, exact addresses, bank details or private documents in this text box.',
                          'اس خانے میں شناختی کارڈ نمبر، مکمل پتہ، بینک تفصیل یا نجی دستاویزات نہ لکھیں۔'
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Your practical preferences', 'آپ کی عملی ترجیحات')}
                        help={tr('Choose broad ranges where possible to avoid missing compatible profiles.', 'ممکن ہو تو وسیع حد منتخب کریں تاکہ موزوں پروفائل چھوٹ نہ جائے۔')}
                      >
                        <div className="grid gap-4 md:grid-cols-3">
                          <SelectInput
                            label={tr('Preferred age range', 'ترجیحی عمر')}
                            name="expectedPartnerAge"
                            value={formData.expectedPartnerAge}
                            onChange={updateField}
                            options={preferredAgeOptions}
                            placeholder={tr('Select age range', 'عمر کی حد منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Preferred location', 'ترجیحی مقام')}
                            name="expectedPartnerLocation"
                            value={formData.expectedPartnerLocation}
                            onChange={updateField}
                            options={preferredCityOptions}
                            placeholder={tr('Select location', 'مقام منتخب کریں')}
                            required
                          />
                          <SelectInput
                            label={tr('Education preference', 'تعلیمی ترجیح')}
                            name="expectedPartnerEducation"
                            value={formData.expectedPartnerEducation}
                            onChange={updateField}
                            options={partnerEducationOptions}
                            placeholder={tr('Select preference', 'ترجیح منتخب کریں')}
                            required
                          />
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('What truly matters in a partner?', 'شریکِ حیات میں واقعی کیا اہم ہے؟')}
                        help={tr('Focus on values, lifestyle, family expectations and genuine deal-breakers.', 'اقدار، طرزِ زندگی، خاندانی توقعات اور حقیقی ضروریات پر توجہ دیں۔')}
                      >
                        <TextAreaInput
                          label={tr('Partner requirements', 'شریکِ حیات کی ضروریات')}
                          name="requirements"
                          value={formData.requirements}
                          onChange={updateField}
                          placeholder={tr(
                            'Example: family-oriented, respectful, open to relocation, values education and clear communication…',
                            'مثال: خاندان کو اہمیت دینے والا، باعزت، منتقلی کے لیے تیار، تعلیم اور واضح گفتگو کو اہمیت دینے والا…'
                          )}
                          rows={6}
                          maxLength={1000}
                        />
                      </QuestionBlock>

                      <QuestionBlock
                        number="03"
                        title={tr('Anything else our reviewer should know?', 'ریویور کو کوئی اور اہم بات بتانا چاہتے ہیں؟')}
                      >
                        <TextAreaInput
                          label={tr('Additional notes', 'اضافی نوٹس')}
                          name="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={updateField}
                          placeholder={tr(
                            'Optional: personality, hobbies, marriage timeline or a detail that helps us understand the profile better…',
                            'اختیاری: شخصیت، دلچسپیاں، شادی کا متوقع وقت یا کوئی بات جو پروفائل سمجھنے میں مدد دے…'
                          )}
                          rows={4}
                          maxLength={800}
                        />
                      </QuestionBlock>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-7">
                      <QuestionBlock
                        number="01"
                        title={tr('Add one or two clear photos', 'ایک یا دو واضح تصاویر شامل کریں')}
                        help={tr('Photos are watermarked before upload. Choose recent, respectful and front-facing images.', 'تصاویر اپ لوڈ سے پہلے واٹر مارک کی جاتی ہیں۔ حالیہ، باوقار اور سامنے سے لی گئی تصاویر منتخب کریں۔')}
                      >
                        <div className="grid items-start gap-6 xl:grid-cols-[1fr_0.9fr]">
                          <div className="grid min-h-[300px] grid-cols-2 gap-3">
                            {photoPreviews.map((preview, index) => (
                              <div key={preview} className="group relative min-h-[260px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                                <img
                                  src={preview}
                                  alt={tr(`Candidate photo ${index + 1}`, `امیدوار کی تصویر ${index + 1}`)}
                                  className={`h-full min-h-[260px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03] ${
                                    formData.photoVisibility === 'blurred' ? 'scale-105 blur-md' : ''
                                  }`}
                                />
                                {formData.photoVisibility === 'hidden' && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white">
                                    <EyeOff className="h-9 w-9" />
                                    <span className="mt-2 text-sm font-bold">{tr('Hidden preview', 'پوشیدہ تصویر')}</span>
                                  </div>
                                )}
                                {formData.photoVisibility === 'blurred' && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="rounded-full border border-white/50 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg">
                                      {tr('Blurred for privacy', 'رازداری کے لیے دھندلی')}
                                    </span>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:scale-105 hover:text-red-600"
                                  aria-label={tr('Remove photo', 'تصویر ہٹائیں')}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}

                            {photoPreviews.length < MAX_PHOTOS && (
                              <label className={`${photoPreviews.length === 0 ? 'col-span-2' : ''} group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-6 text-center transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50`}>
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm transition group-hover:scale-105">
                                  <UploadCloud className="h-8 w-8" />
                                </span>
                                <span className="mt-4 font-bold text-slate-900">{tr('Choose photo', 'تصویر منتخب کریں')}</span>
                                <span className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                  {tr('JPG, PNG or WEBP · maximum 5MB each', 'JPG، PNG یا WEBP · ہر تصویر زیادہ سے زیادہ 5MB')}
                                </span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  multiple
                                  onChange={handlePhotoChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm font-extrabold text-slate-900">{tr('Photo visibility preference', 'تصویر کی رازداری منتخب کریں')}</p>
                            <PrivacyOption
                              name="photoVisibility"
                              value="public"
                              selected={formData.photoVisibility === 'public'}
                              onSelect={() => updateValue('photoVisibility', 'public')}
                              icon={Eye}
                              title={tr('Visible', 'نظر آئے')}
                              text={tr('Suitable where the review team may show the normal photo.', 'جہاں ریویو ٹیم مناسب سمجھے وہاں عام تصویر دکھائی جا سکے۔')}
                            />
                            <PrivacyOption
                              name="photoVisibility"
                              value="blurred"
                              selected={formData.photoVisibility === 'blurred'}
                              onSelect={() => updateValue('photoVisibility', 'blurred')}
                              icon={Camera}
                              title={tr('Blurred first', 'پہلے دھندلی')}
                              text={tr('A privacy-friendly preview before any approved reveal.', 'منظور شدہ نمائش سے پہلے رازداری والا دھندلا پری ویو۔')}
                              recommended
                            />
                            <PrivacyOption
                              name="photoVisibility"
                              value="hidden"
                              selected={formData.photoVisibility === 'hidden'}
                              onSelect={() => updateValue('photoVisibility', 'hidden')}
                              icon={EyeOff}
                              title={tr('Hidden', 'پوشیدہ')}
                              text={tr('Keep the photo hidden in normal profile previews.', 'عام پروفائل پری ویو میں تصویر پوشیدہ رکھی جائے۔')}
                            />
                          </div>
                        </div>
                      </QuestionBlock>

                      <QuestionBlock
                        number="02"
                        title={tr('Confirm privacy permissions', 'رازداری کی اجازت کی تصدیق')}
                        help={tr('Both confirmations are required to submit the profile for matchmaking review.', 'میچ میکنگ ریویو کے لیے دونوں اجازتیں ضروری ہیں۔')}
                      >
                        <div className="space-y-3">
                          <ConsentCard
                            name="consentToStore"
                            checked={formData.consentToStore}
                            onChange={updateField}
                            title={tr('Secure storage and processing', 'محفوظ اسٹوریج اور پراسیسنگ')}
                            text={tr(
                              'I allow MBN Pakistan to securely store and process this information for profile review, administration and matchmaking.',
                              'میں MBN Pakistan کو پروفائل ریویو، انتظام اور میچ میکنگ کے لیے یہ معلومات محفوظ رکھنے اور پراسیس کرنے کی اجازت دیتا/دیتی ہوں۔'
                            )}
                          />
                          <ConsentCard
                            name="consentToShare"
                            checked={formData.consentToShare}
                            onChange={updateField}
                            title={tr('Authorized matchmaking sharing', 'مجاز میچ میکنگ شیئرنگ')}
                            text={tr(
                              'I allow relevant profile details to be shared with authorized matchmakers or verified bureaus for legitimate matchmaking.',
                              'میں حقیقی میچ میکنگ کے لیے متعلقہ پروفائل معلومات مجاز میچ میکرز یا تصدیق شدہ بیوروز کے ساتھ شیئر کرنے کی اجازت دیتا/دیتی ہوں۔'
                            )}
                          />
                        </div>
                      </QuestionBlock>

                      <TrustNote
                        icon={ShieldCheck}
                        title={tr('Your profile is reviewed before use', 'آپ کی پروفائل استعمال سے پہلے ریویو ہوتی ہے')}
                        text={tr(
                          'Submitting does not automatically publish the profile and does not guarantee a match.',
                          'پروفائل جمع کروانے سے یہ خودکار طور پر شائع نہیں ہوتی اور رشتہ کی ضمانت نہیں دی جاتی۔'
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                            <CheckCircle2 className="h-6 w-6" />
                          </span>
                          <div>
                            <p className="font-bold text-emerald-950">{tr('Almost ready', 'تقریباً مکمل')}</p>
                            <p className="mt-1 text-sm leading-6 text-emerald-900/70">
                              {tr('Review each section. Use Edit to return without losing your answers.', 'ہر حصے کا جائزہ لیں۔ معلومات ضائع کیے بغیر واپس جانے کے لیے ترمیم منتخب کریں۔')}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                          <p className="text-2xl font-black text-emerald-700">{completionPercent}%</p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{tr('Complete', 'مکمل')}</p>
                        </div>
                      </div>

                      <ReviewSection
                        icon={UserRound}
                        title={tr('Submitter', 'جمع کروانے والا')}
                        onEdit={() => jumpToStep(0)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Name', 'نام'), formData.submitterFullName],
                            [tr('Relationship', 'تعلق'), formData.relationshipToCandidate],
                            [tr('Mobile', 'موبائل'), formData.submitterMobile],
                            [tr('WhatsApp', 'واٹس ایپ'), formData.submitterWhatsApp || tr('Same / not provided', 'وہی / فراہم نہیں کیا')],
                          ]}
                        />
                      </ReviewSection>

                      <ReviewSection
                        icon={Heart}
                        title={tr('Candidate', 'امیدوار')}
                        onEdit={() => jumpToStep(1)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Name', 'نام'), formData.candidateName],
                            [tr('Profile', 'پروفائل'), formData.gender === 'Female' ? tr('Bride', 'دلہن') : tr('Groom', 'دلہا')],
                            [tr('Age', 'عمر'), calculatedAge ? tr(`${calculatedAge} years`, `${calculatedAge} سال`) : '—'],
                            [tr('Marital status', 'ازدواجی حیثیت'), formData.maritalStatus],
                            [tr('Height', 'قد'), formData.height],
                          ]}
                        />
                      </ReviewSection>

                      <ReviewSection
                        icon={MapPin}
                        title={tr('Background & location', 'پس منظر اور مقام')}
                        onEdit={() => jumpToStep(2)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Religion / sect', 'مذہب / مسلک'), `${formData.religion} · ${formData.sect}`],
                            [tr('Community', 'برادری'), formData.caste],
                            [tr('Location', 'مقام'), `${formData.city}, ${formData.province}`],
                            [tr('Country', 'ملک'), formData.country],
                            [tr('Residence', 'رہائش'), formData.residenceStatus],
                          ]}
                        />
                      </ReviewSection>

                      <ReviewSection
                        icon={Briefcase}
                        title={tr('Education & lifestyle', 'تعلیم اور طرزِ زندگی')}
                        onEdit={() => jumpToStep(3)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Education', 'تعلیم'), formData.education],
                            [tr('Profession', 'پیشہ'), formData.profession],
                            [tr('Employment', 'ملازمت'), formData.employmentStatus],
                            [tr('Industry', 'شعبہ'), formData.industry],
                            [tr('Income', 'آمدنی'), formData.incomeRange],
                            [tr('Language', 'زبان'), formData.languages],
                          ]}
                        />
                      </ReviewSection>

                      <ReviewSection
                        icon={UsersRound}
                        title={tr('Family', 'خاندان')}
                        onEdit={() => jumpToStep(4)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Siblings', 'بہن بھائی'), `${formData.totalSiblings} total · ${formData.brothersCount} brothers · ${formData.sistersCount} sisters`],
                            [tr('Father', 'والد'), formData.fatherOccupation],
                            [tr('Mother', 'والدہ'), formData.motherOccupation],
                          ]}
                        />
                        {formData.familyDetails && <ReviewLongText label={tr('Family introduction', 'خاندان کا تعارف')} text={formData.familyDetails} />}
                      </ReviewSection>

                      <ReviewSection
                        icon={Sparkles}
                        title={tr('Partner preferences', 'شریکِ حیات کی ترجیحات')}
                        onEdit={() => jumpToStep(5)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <ReviewGrid
                          items={[
                            [tr('Age', 'عمر'), formData.expectedPartnerAge],
                            [tr('Location', 'مقام'), formData.expectedPartnerLocation],
                            [tr('Education', 'تعلیم'), formData.expectedPartnerEducation],
                          ]}
                        />
                        {formData.requirements && <ReviewLongText label={tr('Important requirements', 'اہم ضروریات')} text={formData.requirements} />}
                      </ReviewSection>

                      <ReviewSection
                        icon={ImageIcon}
                        title={tr('Photos & privacy', 'تصاویر اور رازداری')}
                        onEdit={() => jumpToStep(6)}
                        editLabel={tr('Edit', 'ترمیم')}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          {photoPreviews.map((preview, index) => (
                            <img key={preview} src={preview} alt="" className={`h-20 w-20 rounded-2xl border border-slate-200 object-cover object-top ${formData.photoVisibility === 'blurred' ? 'blur-sm' : ''}`} />
                          ))}
                          <div>
                            <p className="font-bold text-slate-900">
                              {tr(`${selectedPhotos.length} photo${selectedPhotos.length === 1 ? '' : 's'} selected`, `${selectedPhotos.length} تصویر منتخب`)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {tr('Visibility', 'نمائش')}: <span className="font-semibold text-slate-700">{formData.photoVisibility}</span>
                            </p>
                          </div>
                        </div>
                      </ReviewSection>

                      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-700" />
                          <div>
                            <p className="font-bold text-amber-950">{tr('Before you submit', 'جمع کروانے سے پہلے')}</p>
                            <p className="mt-1 text-sm leading-6 text-amber-900/75">
                              {tr(
                                'Confirm the candidate knows about this submission. MBN may contact the submitter or candidate to verify information and consent.',
                                'تصدیق کریں کہ امیدوار اس پروفائل سے آگاہ ہے۔ MBN معلومات اور اجازت کی تصدیق کے لیے جمع کروانے والے یا امیدوار سے رابطہ کر سکتا ہے۔'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 md:px-8">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={currentStep === 0 || isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isUrdu ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                      {tr('Previous', 'پچھلا مرحلہ')}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                      <Lock className="h-4 w-4" />
                      {tr('Private review · not auto-published', 'نجی ریویو · خودکار اشاعت نہیں')}
                    </div>

                    {currentStep < stepDefinitions.length - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#137a4a] px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#0b5f38]"
                      >
                        {tr('Continue', 'آگے بڑھیں')}
                        {isUrdu ? <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" /> : <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:from-emerald-800 hover:to-emerald-700 disabled:cursor-wait disabled:opacity-70"
                      >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <HeartHandshake className="h-5 w-5" />}
                        {isSubmitting ? submissionStage || tr('Submitting…', 'جمع ہو رہی ہے…') : tr('Submit for private review', 'نجی ریویو کے لیے جمع کریں')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>

      <PageAnimations />
    </div>
  );
}

type TextInputProps = {
  label: string;
  name: keyof PublicProfileFormData;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal' | 'search' | 'url' | 'none';
  autoComplete?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
};

function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  inputMode,
  autoComplete,
  dir,
}: TextInputProps) {
  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ms-1 text-emerald-700">*</span>}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        dir={dir}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

type SelectInputProps = {
  label: string;
  name: keyof PublicProfileFormData;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
};

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: SelectInputProps) {
  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ms-1 text-emerald-700">*</span>}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pe-11 text-[15px] text-slate-900 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon />
      </div>
    </label>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
    >
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type TextAreaInputProps = {
  label: string;
  name: keyof PublicProfileFormData;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

function TextAreaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
}: TextAreaInputProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        {maxLength && <span className="text-xs font-semibold text-slate-400">{value.length}/{maxLength}</span>}
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

type ChoiceGridProps = {
  name: keyof PublicProfileFormData;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  labels?: Record<string, string>;
  icons?: Record<string, LucideIcon>;
  columns?: string;
  large?: boolean;
};

function ChoiceGrid({
  name,
  value,
  options,
  onSelect,
  labels,
  icons,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
  large,
}: ChoiceGridProps) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((option) => {
        const selected = value === option;
        const Icon = icons?.[option];

        return (
          <button
            key={option}
            type="button"
            name={selected ? name : undefined}
            onClick={() => onSelect(option)}
            aria-pressed={selected}
            className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border p-4 text-start transition-all duration-200 ${
              large ? 'min-h-[108px]' : 'min-h-[70px]'
            } ${
              selected
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-[0_12px_35px_-22px_rgba(5,150,105,0.8)] ring-2 ring-emerald-500/10'
                : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            {Icon && (
              <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon className="h-6 w-6" />
              </span>
            )}
            <span className="font-bold leading-5">{labels?.[option] || option}</span>
            <span className={`absolute end-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border transition ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-transparent'}`}>
              <Check className="h-3.5 w-3.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionBlock({
  number,
  title,
  help,
  children,
}: {
  number: string;
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-slate-900 px-2 text-xs font-black tracking-wider text-white">
          {number}
        </span>
        <div>
          <h3 className="text-lg font-black leading-7 text-slate-950 md:text-xl">{title}</h3>
          {help && <p className="mt-1 text-sm leading-6 text-slate-500">{help}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function TrustNote({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-bold text-emerald-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-emerald-900/70">{text}</p>
        </div>
      </div>
    </div>
  );
}

function PrivacyOption({
  name,
  value,
  selected,
  onSelect,
  icon: Icon,
  title,
  text,
  recommended,
}: {
  name: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
  icon: LucideIcon;
  title: string;
  text: string;
  recommended?: boolean;
}) {
  return (
    <button
      type="button"
      name={selected ? name : undefined}
      value={value}
      onClick={onSelect}
      className={`relative w-full rounded-2xl border p-4 text-start transition ${
        selected
          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10'
          : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40'
      }`}
    >
      {recommended && (
        <span className="absolute end-3 top-3 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
          Recommended
        </span>
      )}
      <div className="flex items-start gap-3 pe-16">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
        </div>
      </div>
    </button>
  );
}

function ConsentCard({
  name,
  checked,
  onChange,
  title,
  text,
}: {
  name: keyof PublicProfileFormData;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  text: string;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${checked ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-200'}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border transition ${checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
        <Check className="h-4 w-4" />
      </span>
      <span>
        <span className="block font-bold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">{text}</span>
      </span>
    </label>
  );
}

function ReviewSection({
  icon: Icon,
  title,
  onEdit,
  editLabel,
  children,
}: {
  icon: LucideIcon;
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-black text-slate-950">{title}</h3>
        </div>
        <button type="button" onClick={onEdit} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50">
          {editLabel}
        </button>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ReviewGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={`${label}-${value}`}>
          <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
          <dd className="mt-1 break-words font-semibold leading-6 text-slate-800">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

function ReviewLongText({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function SuccessStage({
  icon: Icon,
  title,
  text,
  active,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50/70'}`}>
      <Icon className={`h-5 w-5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
      <p className="mt-3 font-bold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function PublicHeader({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (value: Language) => void;
}) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-4 py-4 md:px-8 xl:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-11 w-11 rounded-full object-contain" />
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-bold leading-tight text-slate-950 md:text-xl">MBN Pakistan</p>
            <p className="hidden text-xs font-semibold text-slate-400 sm:block">Marriage Bureau Network</p>
          </div>
        </Link>
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>
    </header>
  );
}

function PatternLayer() {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="mbn-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M24 0 48 24 24 48 0 24Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.22" />
          <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.14" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mbn-pattern)" />
    </svg>
  );
}

function PageAnimations() {
  return (
    <style jsx global>{`
      @keyframes mbn-step-forward {
        from {
          opacity: 0;
          transform: translate3d(28px, 0, 0) scale(0.992);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }

      @keyframes mbn-step-back {
        from {
          opacity: 0;
          transform: translate3d(-28px, 0, 0) scale(0.992);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }

      @keyframes mbn-error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-3px); }
      }

      @keyframes mbn-success-orbit {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(2deg); }
      }

      .animate-step-forward {
        animation: mbn-step-forward 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      .animate-step-back {
        animation: mbn-step-back 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      .animate-error-shake {
        animation: mbn-error-shake 360ms ease both;
      }

      .success-orbit {
        animation: mbn-success-orbit 3s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-step-forward,
        .animate-step-back,
        .animate-error-shake,
        .success-orbit {
          animation: none !important;
        }

        * {
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  );
}
