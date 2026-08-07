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
import { useRouter } from 'next/navigation';
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
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  Loader2,
  Lock,
  MapPin,
  Plus,
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
import { useLanguage } from '@/lib/useLanguage';
import { createWatermarkedImageFile } from '@/lib/watermarkImage';

const DRAFT_KEY = 'mbn-bureau-new-profile-draft-v1';
const MAX_PHOTOS = 2;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

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
    'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot',
    'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Gujrat',
    'Sahiwal', 'Okara', 'Kasur', 'Dera Ghazi Khan', 'Jhelum', 'Chakwal',
    'Mianwali', 'Vehari', 'Khanewal', 'Lodhran', 'Muzaffargarh', 'Layyah',
    'Rajanpur', 'Bahawalnagar', 'Pakpattan', 'Toba Tek Singh', 'Chiniot',
    'Hafizabad', 'Mandi Bahauddin', 'Narowal', 'Attock', 'Bhakkar', 'Khushab',
    'Nankana Sahib', 'Mian Channu', 'Kabirwala', 'Jahanian', 'Burewala', 'Mailsi',
    'Arifwala', 'Hasilpur', 'Ahmadpur East', 'Kot Addu', 'Jatoi', 'Alipur',
    'Shujabad', 'Jalalpur Pirwala', 'Taunsa', 'Chichawatni', 'Kamalia', 'Gojra',
    'Wazirabad', 'Kamoke', 'Muridke', 'Kharian', 'Sambrial', 'Daska', 'Pasrur',
    'Shakargarh', 'Taxila', 'Wah Cantt', 'Murree', 'Bhalwal', 'Jauharabad',
    'Fort Abbas', 'Haroonabad', 'Chishtian', 'Kahror Pacca', 'Dunyapur'
  ],
  Sindh: [
    'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah (Shaheed Benazirabad)',
    'Mirpur Khas', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Thatta', 'Badin',
    'Jamshoro', 'Matiari', 'Tando Allahyar', 'Tando Muhammad Khan', 'Sanghar',
    'Umerkot', 'Tharparkar (Mithi)', 'Naushahro Feroze', 'Ghotki', 'Kashmore',
    'Qambar Shahdadkot', 'Sujawal', 'Kotri', 'Rohri', 'Moro', 'Mehar', 'Sehwan',
    'Mirpur Mathelo', 'Kandhkot', 'Daharki'
  ],
  KPK: [
    'Peshawar', 'Mardan', 'Abbottabad', 'Mingora (Swat)', 'Kohat', 'Bannu',
    'Dera Ismail Khan', 'Swabi', 'Charsadda', 'Nowshera', 'Mansehra', 'Haripur',
    'Batkhela (Malakand)', 'Timergara (Lower Dir)', 'Dir (Upper Dir)', 'Chitral',
    'Tank', 'Hangu', 'Karak', 'Lakki Marwat', 'Parachinar (Kurram)', 'Khar (Bajaur)',
    'Ghalanai (Mohmand)', 'Landi Kotal (Khyber)', 'Wana (South Waziristan)',
    'Miranshah (North Waziristan)', 'Daggar (Buner)', 'Alpuri (Shangla)',
    'Dasu (Upper Kohistan)', 'Battagram', 'Topi'
  ],
  Balochistan: [
    'Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman', 'Sibi', 'Zhob', 'Loralai',
    'Dera Murad Jamali', 'Pishin', 'Kalat', 'Mastung', 'Nushki', 'Kharan', 'Dalbandin',
    'Uthal', 'Hub', 'Bela', 'Dera Allah Yar', 'Barkhan', 'Kohlu', 'Dera Bugti',
    'Musakhel', 'Qila Saifullah', 'Qila Abdullah', 'Ziarat', 'Harnai', 'Awaran',
    'Panjgur', 'Surab', 'Washuk'
  ],
  Islamabad: ['Islamabad'],
  AJK: [
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bagh', 'Bhimber', 'Pallandri',
    'Hattian Bala', 'Haveli (Kahuta)', 'Neelum (Athmuqam)', 'Dadyal'
  ],
  'Gilgit-Baltistan': [
    'Gilgit', 'Skardu', 'Hunza (Aliabad)', 'Chilas', 'Ghizer (Gahkuch)', 'Astore',
    'Khaplu', 'Shigar', 'Nagar', 'Ghanche', 'Diamer'
  ],
  Overseas: [
    'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'United States',
    'Canada', 'Australia', 'Qatar', 'Oman', 'Germany', 'France', 'Italy',
    'Other Overseas'
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
  'MBBS',
  'BDS',
  'Engineering',
  'CA / ACCA',
  'Professional Degree',
  'Religious Education',
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

const preferredAgeOptions = [
  '20-25',
  '25-30',
  '30-35',
  '35-40',
  '40-45',
  'Custom Range',
];

const preferredCityOptions = [
  'Anywhere in Pakistan',
  'Islamabad',
  'Lahore',
  'Karachi',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Bahawalpur',
  'Sialkot',
  'Khanewal',
  'Lodhran',
  'Vehari',
  'Muzaffargarh',
  'Dera Ghazi Khan',
  'Rahim Yar Khan',
  'Sahiwal',
  'Sargodha',
  'Abbottabad',
  'Hyderabad',
  'Sukkur',
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

type ProfileFormData = {
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
  bureauPrivateNotes: string;
  photoVisibility: string;
};

const initialFormData: ProfileFormData = {
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
  bureauPrivateNotes: '',
  photoVisibility: 'blurred',
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
    title: 'Meet the candidate',
    titleUrdu: 'امیدوار کا تعارف',
    shortTitle: 'Candidate',
    shortTitleUrdu: 'امیدوار',
    description: 'Start with the essential identity details for this bride or groom profile.',
    descriptionUrdu: 'دلہن یا دلہا کی بنیادی شناختی معلومات سے آغاز کریں۔',
    icon: UserRound,
  },
  {
    title: 'Community & location',
    titleUrdu: 'کمیونٹی اور مقام',
    shortTitle: 'Background',
    shortTitleUrdu: 'پس منظر',
    description: 'Add cultural, religious and residence details used in relevant searches.',
    descriptionUrdu: 'متعلقہ تلاش کے لیے ثقافتی، مذہبی اور رہائشی معلومات شامل کریں۔',
    icon: MapPin,
  },
  {
    title: 'Education, career & personality',
    titleUrdu: 'تعلیم، پیشہ اور شخصیت',
    shortTitle: 'Lifestyle',
    shortTitleUrdu: 'طرزِ زندگی',
    description: 'Create a balanced snapshot of education, work and everyday personality.',
    descriptionUrdu: 'تعلیم، پیشے اور روزمرہ شخصیت کی ایک متوازن تصویر بنائیں۔',
    icon: Briefcase,
  },
  {
    title: 'Family introduction',
    titleUrdu: 'خاندان کا تعارف',
    shortTitle: 'Family',
    shortTitleUrdu: 'خاندان',
    description: 'Capture the family background respectfully and clearly.',
    descriptionUrdu: 'خاندانی پس منظر کو باوقار اور واضح انداز میں درج کریں۔',
    icon: UsersRound,
  },
  {
    title: 'Match preferences & bureau notes',
    titleUrdu: 'رشتہ کی ترجیحات اور بیورو نوٹس',
    shortTitle: 'Preferences',
    shortTitleUrdu: 'ترجیحات',
    description: 'Separate searchable requirements from confidential internal bureau notes.',
    descriptionUrdu: 'تلاش کی ضروریات کو خفیہ اندرونی بیورو نوٹس سے الگ رکھیں۔',
    icon: Sparkles,
  },
  {
    title: 'Photos & privacy',
    titleUrdu: 'تصاویر اور رازداری',
    shortTitle: 'Privacy',
    shortTitleUrdu: 'رازداری',
    description: 'Upload watermarked photos and choose how they should appear to other bureaus.',
    descriptionUrdu: 'واٹر مارک تصاویر اپ لوڈ کریں اور دوسرے بیوروز کے لیے نمائش منتخب کریں۔',
    icon: ShieldCheck,
  },
  {
    title: 'Review & create profile',
    titleUrdu: 'جائزہ لیں اور پروفائل بنائیں',
    shortTitle: 'Review',
    shortTitleUrdu: 'جائزہ',
    description: 'Check every section before adding the profile to your bureau catalog.',
    descriptionUrdu: 'پروفائل کو بیورو کیٹلاگ میں شامل کرنے سے پہلے ہر حصہ چیک کریں۔',
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

export default function NewProfilePage() {
  const router = useRouter();
  const { language, setLanguage, isUrdu } = useLanguage();
  const tr = (english: string, urdu: string) => (isUrdu ? urdu : english);

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
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
  const [created, setCreated] = useState(false);

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
    const completionFields: Array<keyof ProfileFormData> = [
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
      'expectedPartnerEducation',
    ];

    const completed = completionFields.reduce((total, key) => {
      const value = formData[key];
      return total + (typeof value === 'string' && value.trim() ? 1 : 0);
    }, 0);

    const photoScore = selectedPhotos.length > 0 ? 1 : 0;
    return Math.round(((completed + photoScore) / (completionFields.length + 1)) * 100);
  }, [formData, selectedPhotos.length]);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as {
          formData?: Partial<ProfileFormData>;
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
        }

        if (typeof parsed.maxStepReached === 'number') {
          setMaxStepReached(
            Math.min(Math.max(parsed.maxStepReached, 0), stepDefinitions.length - 1)
          );
        }

        if (parsed.savedAt) setLastSavedAt(new Date(parsed.savedAt));
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!draftLoaded || created) return;

    setDraftStatus('saving');
    const timer = window.setTimeout(() => {
      try {
        const savedAt = new Date();
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            formData,
            currentStep,
            maxStepReached,
            savedAt: savedAt.toISOString(),
          })
        );
        setLastSavedAt(savedAt);
        setDraftStatus('saved');
      } catch {
        setDraftStatus('idle');
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [formData, currentStep, maxStepReached, draftLoaded, created]);

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
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}),
    }));
    setErrorMessage('');
  };

  const updateValue = (name: keyof ProfileFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrorMessage('');
  };

  const clearDraft = () => {
    const confirmed = window.confirm(
      tr(
        'Clear all entered profile information and start again?',
        'تمام درج شدہ معلومات صاف کر کے دوبارہ شروع کریں؟'
      )
    );

    if (!confirmed) return;

    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setCurrentStep(0);
    setMaxStepReached(0);
    setErrorMessage('');
    setLastSavedAt(null);
    setDraftStatus('idle');
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const remainingSlots = MAX_PHOTOS - selectedPhotos.length;

    if (remainingSlots <= 0) {
      setErrorMessage(tr('Maximum two photos are allowed.', 'زیادہ سے زیادہ دو تصاویر کی اجازت ہے۔'));
      event.target.value = '';
      return;
    }

    const acceptedFiles: File[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          tr('Please upload JPG, PNG or WEBP images only.', 'صرف JPG، PNG یا WEBP تصاویر اپ لوڈ کریں۔')
        );
        event.target.value = '';
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setErrorMessage(
          tr('Each photo must be smaller than 5MB.', 'ہر تصویر 5MB سے کم ہونی چاہیے۔')
        );
        event.target.value = '';
        return;
      }

      acceptedFiles.push(file);
    }

    if (files.length > remainingSlots) {
      setErrorMessage(
        tr('Only two photos are allowed. Extra files were ignored.', 'صرف دو تصاویر کی اجازت ہے۔ اضافی فائلیں نظر انداز کر دی گئیں۔')
      );
    } else {
      setErrorMessage('');
    }

    setSelectedPhotos((previous) => [...previous, ...acceptedFiles]);
    setPhotoPreviews((previous) => [
      ...previous,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    const previewToRemove = photoPreviews[index];
    if (previewToRemove) URL.revokeObjectURL(previewToRemove);

    setSelectedPhotos((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
    setPhotoPreviews((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const getStepError = (stepIndex: number) => {
    const required = (
      fields: Array<[keyof ProfileFormData, string, string]>
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
          field: 'dateOfBirth' as keyof ProfileFormData,
        };
      }
      if (Number(calculatedAge) < 18) {
        return {
          message: tr('The candidate must be at least 18 years old.', 'امیدوار کی عمر کم از کم 18 سال ہونی چاہیے۔'),
          field: 'dateOfBirth' as keyof ProfileFormData,
        };
      }
      return null;
    }

    if (stepIndex === 1) {
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

    if (stepIndex === 2) {
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

    if (stepIndex === 3) {
      return required([
        ['totalSiblings', 'Please select total siblings.', 'کل بہن بھائیوں کی تعداد منتخب کریں۔'],
        ['brothersCount', 'Please select number of brothers.', 'بھائیوں کی تعداد منتخب کریں۔'],
        ['sistersCount', 'Please select number of sisters.', 'بہنوں کی تعداد منتخب کریں۔'],
        ['fatherOccupation', 'Please select father’s occupation.', 'والد کا پیشہ منتخب کریں۔'],
        ['motherOccupation', 'Please select mother’s occupation.', 'والدہ کا پیشہ منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 4) {
      return required([
        ['expectedPartnerAge', 'Please select a preferred age range.', 'ترجیحی عمر کی حد منتخب کریں۔'],
        ['expectedPartnerLocation', 'Please select a preferred location.', 'ترجیحی مقام منتخب کریں۔'],
        ['expectedPartnerEducation', 'Please select an education preference.', 'تعلیمی ترجیح منتخب کریں۔'],
      ]);
    }

    if (stepIndex === 5 || stepIndex === 6) {
      if (selectedPhotos.length < 1) {
        return {
          message: tr('Please upload at least one candidate photo.', 'امیدوار کی کم از کم ایک تصویر اپ لوڈ کریں۔'),
          field: 'photoVisibility' as keyof ProfileFormData,
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

  const focusInvalidField = (field?: keyof ProfileFormData) => {
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

  const uploadPhotos = async (userId: string) => {
    const uploadedUrls: string[] = [];

    for (let index = 0; index < selectedPhotos.length; index += 1) {
      const photo = selectedPhotos[index];
      setSubmissionStage(
        tr(
          `Protecting photo ${index + 1} of ${selectedPhotos.length}…`,
          `تصویر ${index + 1} از ${selectedPhotos.length} محفوظ کی جا رہی ہے…`
        )
      );

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

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationError = getStepError(6);
    if (validationError) {
      setErrorMessage(validationError.message);
      focusInvalidField(validationError.field);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSubmissionStage(tr('Checking bureau account…', 'بیورو اکاؤنٹ چیک کیا جا رہا ہے…'));

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        throw new Error(
          tr(
            'You must login again before creating a profile.',
            'پروفائل بنانے سے پہلے دوبارہ لاگ اِن کریں۔'
          )
        );
      }

      const photoUrls = await uploadPhotos(user.id);
      setSubmissionStage(tr('Creating marriage profile…', 'میریج پروفائل بنائی جا رہی ہے…'));

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
        bureau_private_notes: formData.bureauPrivateNotes.trim() || null,
        photo_url: photoUrls[0],
        photo_url_2: photoUrls[1] || null,
        photo_visibility: formData.photoVisibility || 'blurred',
        status: 'active',
      });

      if (error) throw error;

      localStorage.removeItem(DRAFT_KEY);
      setCreated(true);
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
            : tr(
                'Profile could not be created. Please try again.',
                'پروفائل نہیں بن سکی۔ دوبارہ کوشش کریں۔'
              );

      setErrorMessage(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setSubmissionStage('');
    }
  };

  const resetForAnotherProfile = () => {
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setFormData(initialFormData);
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setCurrentStep(0);
    setMaxStepReached(0);
    setCreated(false);
    setErrorMessage('');
    setDraftStatus('idle');
    setLastSavedAt(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (created) {
    return (
      <div dir={isUrdu ? 'rtl' : 'ltr'} className="relative mx-auto max-w-5xl overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-white px-6 py-12 text-center shadow-[0_30px_90px_-48px_rgba(15,79,50,0.55)] md:px-12 md:py-16">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-500" />
          <div className="success-orbit mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/70">
            <CheckCircle2 className="h-12 w-12 text-emerald-700" />
          </div>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            {tr('Profile created successfully', 'پروفائل کامیابی سے بن گئی')}
          </div>
          <h1 className="mt-5 font-heading text-3xl font-black text-slate-950 md:text-5xl">
            {tr('The profile is now in your bureau catalog.', 'پروفائل اب آپ کے بیورو کیٹلاگ میں شامل ہے۔')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {tr(
              'Its profile ID is generated automatically by the existing database workflow. You can review, edit or manage privacy from the Profiles area.',
              'موجودہ ڈیٹابیس ورک فلو پروفائل آئی ڈی خودکار طور پر بناتا ہے۔ آپ پروفائلز سیکشن سے اس کا جائزہ، ترمیم یا رازداری منظم کر سکتے ہیں۔'
            )}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push('/profiles')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              <ClipboardCheck className="h-5 w-5" />
              {tr('View all profiles', 'تمام پروفائلز دیکھیں')}
            </button>
            <button
              type="button"
              onClick={resetForAnotherProfile}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Plus className="h-5 w-5" />
              {tr('Add another profile', 'ایک اور پروفائل شامل کریں')}
            </button>
          </div>
        </section>
        <PageAnimations />
      </div>
    );
  }

  const currentStepDefinition = stepDefinitions[currentStep];
  const CurrentStepIcon = currentStepDefinition.icon;
  const stepProgress = Math.round(((currentStep + 1) / stepDefinitions.length) * 100);

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="relative mx-auto max-w-[1380px] overflow-x-hidden pb-10">
      <div className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-44 top-96 h-[28rem] w-[28rem] rounded-full bg-amber-100/55 blur-3xl" />

      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/profiles"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-700"
        >
          <ArrowLeft className={`h-4 w-4 ${isUrdu ? 'rotate-180' : ''}`} />
          {tr('Back to profiles', 'پروفائلز پر واپس')}
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
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
                ·{' '}
                {lastSavedAt.toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm backdrop-blur transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            {tr('Clear', 'صاف کریں')}
          </button>
        </div>
      </div>

      <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-[#0f5939] px-6 py-8 text-white shadow-[0_28px_80px_-40px_rgba(15,79,50,0.65)] md:px-10 md:py-10">
        <PatternLayer />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-white/5" />
        <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-amber-300/15 blur-2xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              {tr('Bureau profile builder', 'بیورو پروفائل بلڈر')}
            </div>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              {tr('Build a quality profile, one focused step at a time.', 'ایک معیاری پروفائل آسان مراحل میں بنائیں۔')}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/85 md:text-lg">
              {tr(
                'A guided workflow for verified bureaus with autosave, privacy controls and a complete review before creation.',
                'تصدیق شدہ بیوروز کے لیے آٹو سیو، رازداری کنٹرول اور تخلیق سے پہلے مکمل جائزے والا آسان ورک فلو۔'
              )}
            </p>
          </div>

          <div className="hidden min-w-[220px] rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:block">
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
              <span>{tr('Draft stays on this device until creation.', 'ڈرافٹ تخلیق تک اسی ڈیوائس پر محفوظ رہتا ہے۔')}</span>
            </div>
          </div>
        </div>
      </section>

      <div ref={formTopRef} className="scroll-mt-6" />

      <div className="relative grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur">
            <div className="px-3 pb-4 pt-2">
              <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                <span>{tr('Profile progress', 'پروفائل کی پیش رفت')}</span>
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
                    'Private bureau notes stay separate from searchable profile information.',
                    'خفیہ بیورو نوٹس تلاش میں نظر آنے والی معلومات سے الگ رہتے ہیں۔'
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
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
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
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_-48px_rgba(15,23,42,0.55)]">
              <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-white to-emerald-50/70 px-5 py-6 md:px-8 md:py-8">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-emerald-100/45" />
                <div className="relative flex items-start gap-4">
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
                    <CurrentStepIcon className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                      {tr(`Step ${currentStep + 1} of ${stepDefinitions.length}`, `مرحلہ ${currentStep + 1} از ${stepDefinitions.length}`)}
                    </p>
                    <h2 className="mt-1 font-heading text-2xl font-black text-slate-950 md:text-4xl">
                      {isUrdu ? currentStepDefinition.titleUrdu : currentStepDefinition.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                      {isUrdu ? currentStepDefinition.descriptionUrdu : currentStepDefinition.description}
                    </p>
                  </div>
                </div>
              </header>

              {errorMessage && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 md:mx-8">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div
                key={currentStep}
                className={`min-h-[500px] px-5 py-6 md:px-8 md:py-9 ${
                  transitionDirection === 'forward'
                    ? 'animate-step-forward'
                    : 'animate-step-back'
                }`}
              >
                {currentStep === 0 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Is this a bride or groom profile?', 'یہ دلہن کی پروفائل ہے یا دلہا کی؟')}
                      help={tr('This controls profile wording and matching filters.', 'اس سے پروفائل کے الفاظ اور میچنگ فلٹرز طے ہوتے ہیں۔')}
                    >
                      <ChoiceGrid
                        name="gender"
                        value={formData.gender}
                        options={['Female', 'Male']}
                        onSelect={(value) => updateValue('gender', value)}
                        labels={{
                          Female: tr('Bride profile', 'دلہن کی پروفائل'),
                          Male: tr('Groom profile', 'دلہا کی پروفائل'),
                        }}
                        icons={{ Female: Heart, Male: HeartHandshake }}
                        columns="sm:grid-cols-2"
                        large
                      />
                    </QuestionBlock>

                    <QuestionBlock
                      number="02"
                      title={tr('Enter the candidate’s essentials', 'امیدوار کی بنیادی معلومات درج کریں')}
                      help={tr('These details form the identity section of the profile.', 'یہ معلومات پروفائل کے شناختی حصے میں شامل ہوں گی۔')}
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
                            {calculatedAge
                              ? tr(`${calculatedAge} years`, `${calculatedAge} سال`)
                              : '—'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {tr('Automatically calculated from date of birth.', 'تاریخِ پیدائش سے خودکار حساب۔')}
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

                {currentStep === 1 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Religious and community background', 'مذہبی اور برادری کا پس منظر')}
                      help={tr('Use “Prefer not to say” where the family does not want to disclose sensitive details.', 'حساس معلومات ظاہر نہ کرنی ہوں تو “بتانا پسند نہیں” منتخب کریں۔')}
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
                      help={tr('Province and city are used by the automatic profile ID and search filters.', 'صوبہ اور شہر خودکار پروفائل آئی ڈی اور سرچ فلٹرز میں استعمال ہوتے ہیں۔')}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectInput
                          label={tr('Province / region', 'صوبہ / علاقہ')}
                          name="province"
                          value={formData.province}
                          onChange={updateField}
                          options={Object.keys(citiesByProvince)}
                          placeholder={tr('Select province', 'صوبہ منتخب کریں')}
                          required
                        />
                        <SelectInput
                          label={tr('City', 'شہر')}
                          name="city"
                          value={formData.city}
                          onChange={updateField}
                          options={cityOptions}
                          placeholder={formData.province ? tr('Select city', 'شہر منتخب کریں') : tr('Select province first', 'پہلے صوبہ منتخب کریں')}
                          required
                          disabled={!formData.province}
                        />
                        <SelectInput
                          label={tr('Country', 'ملک')}
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
                      title={tr('Better data creates better shortlists', 'بہتر معلومات بہتر شارٹ لسٹ بناتی ہیں')}
                      text={tr('Accurate current location helps bureaus avoid irrelevant introductions and unnecessary travel.', 'درست موجودہ مقام غیر متعلقہ تعارف اور غیر ضروری سفر سے بچاتا ہے۔')}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Education and professional life', 'تعلیم اور پیشہ ورانہ زندگی')}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectInput
                          label={tr('Education', 'تعلیم')}
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
                          placeholder={tr('e.g. Software Engineer', 'مثلاً سافٹ ویئر انجینئر')}
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
                          label={tr('Job type', 'ملازمت کی قسم')}
                          name="jobType"
                          value={formData.jobType}
                          onChange={updateField}
                          options={jobTypeOptions}
                          placeholder={tr('Select job type', 'ملازمت کی قسم منتخب کریں')}
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
                          label={tr('Income range', 'آمدنی کی حد')}
                          name="incomeRange"
                          value={formData.incomeRange}
                          onChange={updateField}
                          options={incomeRangeOptions}
                          placeholder={tr('Select income range', 'آمدنی کی حد منتخب کریں')}
                          required
                        />
                      </div>
                    </QuestionBlock>

                    <QuestionBlock
                      number="02"
                      title={tr('Appearance and communication', 'ظاہری خصوصیات اور زبان')}
                      help={tr('Sensitive fields include a “Prefer not to say” option.', 'حساس فیلڈز میں “بتانا پسند نہیں” کا آپشن موجود ہے۔')}
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <SelectInput
                          label={tr('Complexion', 'رنگت')}
                          name="complexion"
                          value={formData.complexion}
                          onChange={updateField}
                          options={complexionOptions}
                          placeholder={tr('Select complexion', 'رنگت منتخب کریں')}
                          required
                        />
                        <SelectInput
                          label={tr('Body type', 'جسمانی ساخت')}
                          name="bodyType"
                          value={formData.bodyType}
                          onChange={updateField}
                          options={bodyTypeOptions}
                          placeholder={tr('Select body type', 'جسمانی ساخت منتخب کریں')}
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
                      title={tr('Keep titles clear and factual', 'معلومات واضح اور حقیقت پر مبنی رکھیں')}
                      text={tr('Use the candidate’s actual role rather than promotional wording. This improves trust between bureaus.', 'تشہیری الفاظ کے بجائے امیدوار کا اصل پیشہ لکھیں۔ اس سے بیوروز کے درمیان اعتماد بہتر ہوتا ہے۔')}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Siblings overview', 'بہن بھائیوں کا خلاصہ')}
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <SelectInput
                          label={tr('Total siblings', 'کل بہن بھائی')}
                          name="totalSiblings"
                          value={formData.totalSiblings}
                          onChange={updateField}
                          options={siblingCountOptions}
                          placeholder={tr('Select total', 'کل تعداد منتخب کریں')}
                          required
                        />
                        <SelectInput
                          label={tr('Brothers', 'بھائی')}
                          name="brothersCount"
                          value={formData.brothersCount}
                          onChange={updateField}
                          options={siblingCountOptions}
                          placeholder={tr('Select brothers', 'بھائیوں کی تعداد')}
                          required
                        />
                        <SelectInput
                          label={tr('Sisters', 'بہنیں')}
                          name="sistersCount"
                          value={formData.sistersCount}
                          onChange={updateField}
                          options={siblingCountOptions}
                          placeholder={tr('Select sisters', 'بہنوں کی تعداد')}
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
                            placeholder={tr('Briefly describe family values, location, education and environment…', 'خاندانی اقدار، مقام، تعلیم اور ماحول کا مختصر تعارف…')}
                            rows={5}
                            maxLength={800}
                          />
                        </div>
                      </div>
                    </QuestionBlock>

                    <TrustNote
                      icon={UsersRound}
                      title={tr('Respectful, useful and concise', 'باوقار، مفید اور مختصر')}
                      text={tr('Avoid unnecessary private names, phone numbers or identity details in the family introduction.', 'خاندانی تعارف میں غیر ضروری نام، فون نمبر یا شناختی تفصیلات شامل نہ کریں۔')}
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Core partner preferences', 'شریکِ حیات کی بنیادی ترجیحات')}
                      help={tr('Keep filters broad enough to avoid missing otherwise suitable matches.', 'فلٹرز اتنے محدود نہ رکھیں کہ مناسب رشتے نظر انداز ہو جائیں۔')}
                    >
                      <div className="grid gap-4 md:grid-cols-3">
                        <SelectInput
                          label={tr('Preferred age', 'ترجیحی عمر')}
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
                          label={tr('Preferred education', 'ترجیحی تعلیم')}
                          name="expectedPartnerEducation"
                          value={formData.expectedPartnerEducation}
                          onChange={updateField}
                          options={partnerEducationOptions}
                          placeholder={tr('Select education', 'تعلیم منتخب کریں')}
                          required
                        />
                      </div>
                    </QuestionBlock>

                    <QuestionBlock
                      number="02"
                      title={tr('Searchable profile notes', 'سرچ میں استعمال ہونے والے پروفائل نوٹس')}
                      help={tr('These notes may be visible to authorised users when reviewing the profile.', 'یہ نوٹس مجاز صارفین کو پروفائل دیکھتے وقت نظر آ سکتے ہیں۔')}
                    >
                      <div className="space-y-4">
                        <TextAreaInput
                          label={tr('Important partner requirements', 'شریکِ حیات کی اہم ضروریات')}
                          name="requirements"
                          value={formData.requirements}
                          onChange={updateField}
                          placeholder={tr('Write only meaningful must-haves or important preferences…', 'صرف اہم ضروریات یا ترجیحات لکھیں…')}
                          rows={4}
                          maxLength={700}
                        />
                        <TextAreaInput
                          label={tr('Additional profile notes', 'اضافی پروفائل نوٹس')}
                          name="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={updateField}
                          placeholder={tr('Any useful, non-confidential information for profile search…', 'پروفائل سرچ کے لیے کوئی مفید غیر خفیہ معلومات…')}
                          rows={4}
                          maxLength={700}
                        />
                      </div>
                    </QuestionBlock>

                    <QuestionBlock
                      number="03"
                      title={tr('Confidential bureau notes', 'خفیہ بیورو نوٹس')}
                      help={tr('These notes are for your internal workflow and should not appear in normal profile search.', 'یہ نوٹس آپ کے اندرونی ورک فلو کے لیے ہیں اور عام سرچ میں نظر نہیں آنے چاہئیں۔')}
                    >
                      <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4 md:p-5">
                        <div className="mb-4 flex items-start gap-3">
                          <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                          <p className="text-sm leading-6 text-amber-900/75">
                            {tr('Use this area for follow-up context, client handling notes or verification reminders. Never store passwords or full CNIC numbers here.', 'یہ حصہ فالو اَپ، کلائنٹ ہینڈلنگ یا تصدیقی یاد دہانیوں کے لیے استعمال کریں۔ یہاں پاس ورڈ یا مکمل شناختی کارڈ نمبر نہ لکھیں۔')}
                          </p>
                        </div>
                        <TextAreaInput
                          label={tr('Bureau private notes', 'بیورو کے خفیہ نوٹس')}
                          name="bureauPrivateNotes"
                          value={formData.bureauPrivateNotes}
                          onChange={updateField}
                          placeholder={tr('Internal notes visible only in authorised bureau/admin workflows…', 'صرف مجاز بیورو/ایڈمن ورک فلو میں نظر آنے والے اندرونی نوٹس…')}
                          rows={5}
                          maxLength={1000}
                          tone="amber"
                        />
                      </div>
                    </QuestionBlock>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-7">
                    <QuestionBlock
                      number="01"
                      title={tr('Add one or two candidate photos', 'امیدوار کی ایک یا دو تصاویر شامل کریں')}
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
                          <p className="text-sm font-extrabold text-slate-900">{tr('Photo visibility', 'تصویر کی رازداری')}</p>
                          <PrivacyOption
                            name="photoVisibility"
                            value="public"
                            selected={formData.photoVisibility === 'public'}
                            onSelect={() => updateValue('photoVisibility', 'public')}
                            icon={Eye}
                            title={tr('Visible', 'نظر آئے')}
                            text={tr('Authorised users see the normal watermarked photo.', 'مجاز صارفین عام واٹر مارک تصویر دیکھ سکیں گے۔')}
                          />
                          <PrivacyOption
                            name="photoVisibility"
                            value="blurred"
                            selected={formData.photoVisibility === 'blurred'}
                            onSelect={() => updateValue('photoVisibility', 'blurred')}
                            icon={Camera}
                            title={tr('Blurred first', 'پہلے دھندلی')}
                            text={tr('A privacy-friendly preview is shown before approved reveal.', 'منظور شدہ نمائش سے پہلے دھندلا پری ویو دکھایا جائے گا۔')}
                            recommended
                          />
                          <PrivacyOption
                            name="photoVisibility"
                            value="hidden"
                            selected={formData.photoVisibility === 'hidden'}
                            onSelect={() => updateValue('photoVisibility', 'hidden')}
                            icon={EyeOff}
                            title={tr('Hidden', 'پوشیدہ')}
                            text={tr('Keep the photo hidden in normal profile previews.', 'عام پروفائل پری ویو میں تصویر پوشیدہ رہے گی۔')}
                          />
                        </div>
                      </div>
                    </QuestionBlock>

                    <TrustNote
                      icon={ShieldCheck}
                      title={tr('Bureau responsibility', 'بیورو کی ذمہ داری')}
                      text={tr('Upload photos only with the candidate or authorised family representative’s permission.', 'صرف امیدوار یا مجاز خاندانی نمائندے کی اجازت سے تصاویر اپ لوڈ کریں۔')}
                    />
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                          <CheckCircle2 className="h-6 w-6" />
                        </span>
                        <div>
                          <p className="font-bold text-emerald-950">{tr('Ready for final review', 'حتمی جائزے کے لیے تیار')}</p>
                          <p className="mt-1 text-sm leading-6 text-emerald-900/70">
                            {tr('Use Edit to return to any completed section without losing your answers.', 'جوابات ضائع کیے بغیر کسی مکمل حصے میں واپس جانے کے لیے ترمیم منتخب کریں۔')}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{tr('Completion', 'تکمیل')}</p>
                        <p className="text-2xl font-black text-emerald-700">{completionPercent}%</p>
                      </div>
                    </div>

                    <ReviewSection icon={UserRound} title={tr('Candidate', 'امیدوار')} onEdit={() => jumpToStep(0)} editLabel={tr('Edit', 'ترمیم')}>
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

                    <ReviewSection icon={MapPin} title={tr('Background & location', 'پس منظر اور مقام')} onEdit={() => jumpToStep(1)} editLabel={tr('Edit', 'ترمیم')}>
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

                    <ReviewSection icon={Briefcase} title={tr('Education & lifestyle', 'تعلیم اور طرزِ زندگی')} onEdit={() => jumpToStep(2)} editLabel={tr('Edit', 'ترمیم')}>
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

                    <ReviewSection icon={UsersRound} title={tr('Family', 'خاندان')} onEdit={() => jumpToStep(3)} editLabel={tr('Edit', 'ترمیم')}>
                      <ReviewGrid
                        items={[
                          [tr('Siblings', 'بہن بھائی'), `${formData.totalSiblings} total · ${formData.brothersCount} brothers · ${formData.sistersCount} sisters`],
                          [tr('Father', 'والد'), formData.fatherOccupation],
                          [tr('Mother', 'والدہ'), formData.motherOccupation],
                        ]}
                      />
                      {formData.familyDetails && <ReviewLongText label={tr('Family introduction', 'خاندان کا تعارف')} text={formData.familyDetails} />}
                    </ReviewSection>

                    <ReviewSection icon={Sparkles} title={tr('Preferences & notes', 'ترجیحات اور نوٹس')} onEdit={() => jumpToStep(4)} editLabel={tr('Edit', 'ترمیم')}>
                      <ReviewGrid
                        items={[
                          [tr('Preferred age', 'ترجیحی عمر'), formData.expectedPartnerAge],
                          [tr('Preferred location', 'ترجیحی مقام'), formData.expectedPartnerLocation],
                          [tr('Preferred education', 'ترجیحی تعلیم'), formData.expectedPartnerEducation],
                        ]}
                      />
                      {formData.requirements && <ReviewLongText label={tr('Requirements', 'ضروریات')} text={formData.requirements} />}
                      {formData.additionalNotes && <ReviewLongText label={tr('Additional profile notes', 'اضافی پروفائل نوٹس')} text={formData.additionalNotes} />}
                      {formData.bureauPrivateNotes && (
                        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                            <Lock className="h-4 w-4" />
                            {tr('Private bureau notes', 'خفیہ بیورو نوٹس')}
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-900/75">{formData.bureauPrivateNotes}</p>
                        </div>
                      )}
                    </ReviewSection>

                    <ReviewSection icon={ImageIcon} title={tr('Photos & privacy', 'تصاویر اور رازداری')} onEdit={() => jumpToStep(5)} editLabel={tr('Edit', 'ترمیم')}>
                      <div className="flex flex-wrap items-center gap-3">
                        {photoPreviews.map((preview) => (
                          <img
                            key={preview}
                            src={preview}
                            alt=""
                            className={`h-20 w-20 rounded-2xl border border-slate-200 object-cover object-top ${formData.photoVisibility === 'blurred' ? 'blur-sm' : ''}`}
                          />
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
                          <p className="font-bold text-amber-950">{tr('Before creating the profile', 'پروفائل بنانے سے پہلے')}</p>
                          <p className="mt-1 text-sm leading-6 text-amber-900/75">
                            {tr('Confirm that the candidate or authorised family representative has approved the information and photo sharing. The profile will be created as active.', 'تصدیق کریں کہ امیدوار یا مجاز خاندانی نمائندے نے معلومات اور تصاویر شیئر کرنے کی اجازت دی ہے۔ پروفائل فعال حالت میں بنے گی۔')}
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
                    {tr('Watermarked photos · bureau-owned profile', 'واٹر مارک تصاویر · بیورو کی پروفائل')}
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
                      {isSubmitting ? submissionStage || tr('Creating…', 'بنائی جا رہی ہے…') : tr('Create active profile', 'فعال پروفائل بنائیں')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>

      <PageAnimations />
    </div>
  );
}

type TextInputProps = {
  label: string;
  name: keyof ProfileFormData;
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
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        dir={dir}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

type SelectInputProps = {
  label: string;
  name: keyof ProfileFormData;
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
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ms-1 text-red-500">*</span>}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pe-11 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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
      fill="currentColor"
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type TextAreaInputProps = {
  label: string;
  name: keyof ProfileFormData;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  tone?: 'default' | 'amber';
};

function TextAreaInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  tone = 'default',
}: TextAreaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-800">
        <span>{label}</span>
        {maxLength && (
          <span className="text-xs font-semibold text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full resize-y rounded-2xl border px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          tone === 'amber'
            ? 'border-amber-200 bg-white focus:border-amber-400 focus:ring-amber-100'
            : 'border-slate-200 bg-white focus:border-emerald-400 focus:ring-emerald-100'
        }`}
      />
    </label>
  );
}

type ChoiceGridProps = {
  name: keyof ProfileFormData;
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
  columns = 'sm:grid-cols-2 xl:grid-cols-3',
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
            name={name}
            onClick={() => onSelect(option)}
            className={`group relative flex items-center gap-3 rounded-2xl border p-4 text-start transition-all ${
              large ? 'min-h-[98px]' : 'min-h-[68px]'
            } ${
              selected
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-100'
                : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40'
            }`}
          >
            {Icon && (
              <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-emerald-700'}`}>
                <Icon className="h-5 w-5" />
              </span>
            )}
            <span className="font-bold">{labels?.[option] || option}</span>
            <span className={`ms-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-transparent'}`}>
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
        <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-slate-950 px-2 text-xs font-black text-white">
          {number}
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-950 md:text-xl">{title}</h3>
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
    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/65 p-5">
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
  name: keyof ProfileFormData;
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
      name={name}
      value={value}
      onClick={onSelect}
      className={`relative flex w-full items-start gap-3 rounded-2xl border p-4 text-start transition-all ${
        selected
          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
          : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40'
      }`}
    >
      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-950">{title}</span>
          {recommended && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-800">
              Recommended
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-5 text-slate-500">{text}</span>
      </span>
      <span className={`ms-auto mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-transparent'}`}>
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
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
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-black text-slate-950">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
        >
          {editLabel}
        </button>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ReviewGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

function ReviewLongText({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function PatternLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bureau-profile-pattern" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M19 0v38M0 19h38" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
            <circle cx="19" cy="19" r="2" fill="white" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bureau-profile-pattern)" />
      </svg>
    </div>
  );
}

function PageAnimations() {
  return (
    <style jsx global>{`
      @keyframes mbnStepForward {
        from {
          opacity: 0;
          transform: translateX(24px) translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateX(0) translateY(0);
        }
      }

      @keyframes mbnStepBack {
        from {
          opacity: 0;
          transform: translateX(-24px) translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateX(0) translateY(0);
        }
      }

      @keyframes mbnSuccessOrbit {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-5px) rotate(2deg);
        }
      }

      .animate-step-forward {
        animation: mbnStepForward 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .animate-step-back {
        animation: mbnStepBack 360ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .success-orbit {
        animation: mbnSuccessOrbit 3.6s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-step-forward,
        .animate-step-back,
        .success-orbit {
          animation: none !important;
        }
      }
    `}</style>
  );
}
