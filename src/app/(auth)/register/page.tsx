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
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Copy,
  FileCheck2,
  FileText,
  Globe2,
  Handshake,
  Link2,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
  UploadCloud,
  X,
  type LucideIcon,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

const DRAFT_KEY = 'mbn-bureau-application-draft-v4';
const DOCUMENT_BUCKET = 'bureau-verification-documents';
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const roles = ['Owner', 'Co-owner / Partner', 'Manager', 'Senior Matchmaker', 'Authorised Representative'];
const identityTypes = ['CNIC', 'NICOP', 'Passport'];
const bureauTypes = [
  'Registered company / organisation',
  'Sole proprietor',
  'Partnership',
  'Independent professional bureau',
  'Home-based bureau',
];
const yearsOptions = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];
const activeProfileOptions = ['Under 50', '50–200', '200–500', '500–1,000', '1,000+'];
const teamSizeOptions = ['Only me', '2–3 people', '4–10 people', '11–25 people', '25+ people'];
const monthlyProfileOptions = ['Under 10', '10–30', '31–75', '76–150', '150+'];
const serviceModels = ['In-person', 'Online', 'Hybrid — online and in-person'];
const registrationStatuses = [
  'Registered with SECP / government authority',
  'Registered as a sole proprietor / tax filer',
  'Registration in progress',
  'Not formally registered',
];
const officeOptions = ['Yes — dedicated office', 'Home-based workspace', 'No physical office'];
const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'Gilgit-Baltistan', 'Overseas'];
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
const countries = [
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
  'Other',
];
const spokenLanguages = ['Urdu', 'English', 'Punjabi', 'Saraiki', 'Sindhi', 'Pashto', 'Balochi', 'Arabic', 'Other'];
const specialisationOptions = [
  'Local Pakistan matches',
  'Overseas Pakistani matches',
  'Educated professionals',
  'Business families',
  'Second marriage',
  'Divorcee / widow / widower',
  'Religious families',
  'Elite / premium families',
  'People with disabilities',
  'General matchmaking',
];
const profileSourceOptions = [
  'Direct family registrations',
  'Existing client referrals',
  'Community referrals',
  'Social media enquiries',
  'Partner marriage bureaus',
  'Professional / alumni networks',
];
const verificationMethodOptions = [
  'CNIC / NICOP / passport review',
  'Phone or WhatsApp confirmation',
  'Candidate consent confirmation',
  'Family reference check',
  'Video call',
  'In-person meeting',
  'Education / employment document review',
];
const consentProcessOptions = [
  'Written or digitally recorded consent',
  'WhatsApp / email confirmation retained',
  'Verbal consent with internal record',
  'No formal consent process yet',
];
const feeModels = [
  'One-time registration fee',
  'Monthly / quarterly membership',
  'Successful-match service fee',
  'Custom package by client',
  'Free and paid service options',
];
const refundOptions = ['Yes — written policy', 'Handled case by case', 'No refund policy', 'Not applicable'];


const optionUrdu: Record<string, string> = {
  Owner: 'مالک',
  'Co-owner / Partner': 'شریک مالک / کاروباری شراکت دار',
  Manager: 'منتظمِ دفتر',
  'Senior Matchmaker': 'سینئر رشتہ مشیر',
  'Authorised Representative': 'مجاز نمائندہ',
  CNIC: 'قومی شناختی کارڈ',
  NICOP: 'بیرونِ ملک پاکستانیوں کا قومی شناختی کارڈ',
  Passport: 'پاسپورٹ',
  'Registered company / organisation': 'رجسٹرڈ کمپنی / ادارہ',
  'Sole proprietor': 'انفرادی ملکیت کا کاروبار',
  Partnership: 'شراکتی کاروبار',
  'Independent professional bureau': 'آزاد پیشہ ور میرج بیورو',
  'Home-based bureau': 'گھر سے چلایا جانے والا میرج بیورو',
  'Less than 1 year': 'ایک سال سے کم',
  '1–3 years': '1 سے 3 سال',
  '3–5 years': '3 سے 5 سال',
  '5–10 years': '5 سے 10 سال',
  '10+ years': '10 سال یا اس سے زیادہ',
  'Under 50': '50 سے کم',
  '50–200': '50 سے 200',
  '200–500': '200 سے 500',
  '500–1,000': '500 سے 1,000',
  '1,000+': '1,000 سے زیادہ',
  'Only me': 'صرف میں',
  '2–3 people': '2 سے 3 افراد',
  '4–10 people': '4 سے 10 افراد',
  '11–25 people': '11 سے 25 افراد',
  '25+ people': '25 سے زیادہ افراد',
  'Under 10': '10 سے کم',
  '10–30': '10 سے 30',
  '31–75': '31 سے 75',
  '76–150': '76 سے 150',
  '150+': '150 سے زیادہ',
  'In-person': 'بالمشافہ',
  Online: 'آن لائن',
  'Hybrid — online and in-person': 'ہائبرڈ — آن لائن اور بالمشافہ',
  'Registered with SECP / government authority': 'SECP یا سرکاری ادارے کے ساتھ رجسٹرڈ',
  'Registered as a sole proprietor / tax filer': 'انفرادی کاروبار / ٹیکس فائلر کے طور پر رجسٹرڈ',
  'Registration in progress': 'رجسٹریشن کا عمل جاری ہے',
  'Not formally registered': 'باضابطہ رجسٹرڈ نہیں',
  'Yes — dedicated office': 'جی ہاں — مخصوص دفتر موجود ہے',
  'Home-based workspace': 'گھر سے قائم ورک اسپیس',
  'No physical office': 'کوئی فزیکل دفتر نہیں',
  Punjab: 'پنجاب',
  Sindh: 'سندھ',
  KPK: 'خیبر پختونخوا',
  Balochistan: 'بلوچستان',
  Islamabad: 'اسلام آباد',
  AJK: 'آزاد جموں و کشمیر',
  'Gilgit-Baltistan': 'گلگت بلتستان',
  Overseas: 'بیرونِ ملک',
  Pakistan: 'پاکستان',
  'United Kingdom': 'برطانیہ',
  'United Arab Emirates': 'متحدہ عرب امارات',
  'Saudi Arabia': 'سعودی عرب',
  'United States': 'امریکہ',
  Canada: 'کینیڈا',
  Australia: 'آسٹریلیا',
  Qatar: 'قطر',
  Oman: 'عمان',
  Germany: 'جرمنی',
  Other: 'دیگر',
  Urdu: 'اردو',
  English: 'انگریزی',
  Punjabi: 'پنجابی',
  Saraiki: 'سرائیکی',
  Sindhi: 'سندھی',
  Pashto: 'پشتو',
  Balochi: 'بلوچی',
  Arabic: 'عربی',
  'Local Pakistan matches': 'پاکستان کے اندر رشتے',
  'Overseas Pakistani matches': 'بیرونِ ملک پاکستانیوں کے رشتے',
  'Educated professionals': 'تعلیم یافتہ پیشہ ور افراد',
  'Business families': 'کاروباری خاندان',
  'Second marriage': 'دوسری شادی',
  'Divorcee / widow / widower': 'طلاق یافتہ / بیوہ / رنڈوا',
  'Religious families': 'دینی رجحان رکھنے والے خاندان',
  'Elite / premium families': 'پریمیم / ممتاز خاندان',
  'People with disabilities': 'خصوصی ضروریات رکھنے والے افراد',
  'General matchmaking': 'عمومی رشتہ سروس',
  'Direct family registrations': 'خاندانوں کی براہِ راست رجسٹریشن',
  'Existing client referrals': 'موجودہ کلائنٹس کی سفارشات',
  'Community referrals': 'برادری / کمیونٹی کی سفارشات',
  'Social media enquiries': 'سوشل میڈیا سے موصول ہونے والی درخواستیں',
  'Partner marriage bureaus': 'شراکت دار میرج بیوروز',
  'Professional / alumni networks': 'پیشہ ورانہ / سابق طلبہ نیٹ ورکس',
  'CNIC / NICOP / passport review': 'CNIC / NICOP / پاسپورٹ کی جانچ',
  'Phone or WhatsApp confirmation': 'فون یا واٹس ایپ کے ذریعے تصدیق',
  'Candidate consent confirmation': 'امیدوار کی رضامندی کی تصدیق',
  'Family reference check': 'خاندانی حوالہ کی جانچ',
  'Video call': 'ویڈیو کال',
  'In-person meeting': 'بالمشافہ ملاقات',
  'Education / employment document review': 'تعلیمی / ملازمت کے دستاویزات کی جانچ',
  'Written or digitally recorded consent': 'تحریری یا ڈیجیٹل طور پر محفوظ رضامندی',
  'WhatsApp / email confirmation retained': 'واٹس ایپ / ای میل کی تصدیق محفوظ کی جاتی ہے',
  'Verbal consent with internal record': 'زبانی رضامندی کے ساتھ اندرونی ریکارڈ',
  'No formal consent process yet': 'ابھی باقاعدہ رضامندی کا طریقہ موجود نہیں',
  'One-time registration fee': 'ایک مرتبہ رجسٹریشن فیس',
  'Monthly / quarterly membership': 'ماہانہ / سہ ماہی رکنیت',
  'Successful-match service fee': 'کامیاب رشتے پر سروس فیس',
  'Custom package by client': 'کلائنٹ کے مطابق خصوصی پیکیج',
  'Free and paid service options': 'مفت اور بامعاوضہ دونوں آپشنز',
  'Yes — written policy': 'جی ہاں — تحریری پالیسی موجود ہے',
  'Handled case by case': 'ہر کیس کے مطابق فیصلہ کیا جاتا ہے',
  'No refund policy': 'رقم واپسی کی پالیسی موجود نہیں',
  'Not applicable': 'لاگو نہیں',
};

function bilingualOption(value: string) {
  const urdu = optionUrdu[value];
  return urdu ? `${value} — ${urdu}` : value;
}

const stepDefinitions: Array<{
  title: string;
  urduTitle: string;
  shortTitle: string;
  urduShortTitle: string;
  description: string;
  urduDescription: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Applicant identity',
    urduTitle: 'درخواست دہندہ کی شناخت',
    shortTitle: 'Identity',
    urduShortTitle: 'شناخت',
    description: 'Tell us who is responsible for this bureau application.',
    urduDescription: 'اس درخواست کے ذمہ دار اور مجاز نمائندے کی تفصیلات فراہم کریں۔',
    icon: CircleUserRound,
  },
  {
    title: 'Bureau profile',
    urduTitle: 'بیورو کا تعارف',
    shortTitle: 'Bureau',
    urduShortTitle: 'بیورو',
    description: 'Help us understand the scale and structure of your work.',
    urduDescription: 'اپنے کام کی نوعیت، وسعت اور تنظیمی ڈھانچے سے آگاہ کریں۔',
    icon: Building2,
  },
  {
    title: 'Location & reach',
    urduTitle: 'مقام اور دائرۂ کار',
    shortTitle: 'Reach',
    urduShortTitle: 'دائرۂ کار',
    description: 'Where you operate and the communities you serve.',
    urduDescription: 'آپ کہاں خدمات فراہم کرتے ہیں اور کن علاقوں یا کمیونٹیز تک رسائی رکھتے ہیں۔',
    icon: MapPin,
  },
  {
    title: 'Professional standards',
    urduTitle: 'پیشہ ورانہ معیارات',
    shortTitle: 'Standards',
    urduShortTitle: 'معیارات',
    description: 'Your approach to consent, verification, privacy and complaints.',
    urduDescription: 'رضامندی، تصدیق، رازداری اور شکایات سے متعلق اپنے طریقۂ کار کی وضاحت کریں۔',
    icon: ShieldCheck,
  },
  {
    title: 'Presence & references',
    urduTitle: 'آن لائن موجودگی اور حوالہ جات',
    shortTitle: 'Trust',
    urduShortTitle: 'اعتماد',
    description: 'Online presence and professional references for manual review.',
    urduDescription: 'دستی جانچ کے لیے اپنی آن لائن موجودگی اور پیشہ ورانہ حوالہ جات فراہم کریں۔',
    icon: Handshake,
  },
  {
    title: 'Verification documents',
    urduTitle: 'تصدیقی دستاویزات',
    shortTitle: 'Documents',
    urduShortTitle: 'دستاویزات',
    description: 'Securely upload identity and business evidence.',
    urduDescription: 'شناخت اور کاروبار سے متعلق ثبوت محفوظ طریقے سے اپ لوڈ کریں۔',
    icon: FileCheck2,
  },
  {
    title: 'Review & declaration',
    urduTitle: 'جائزہ اور اقرار',
    shortTitle: 'Review',
    urduShortTitle: 'جائزہ',
    description: 'Review everything before submitting your application.',
    urduDescription: 'درخواست جمع کروانے سے پہلے تمام معلومات کا دوبارہ جائزہ لیں۔',
    icon: ClipboardCheck,
  },
];

type BureauApplicationForm = {
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  roleInBureau: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  identityType: string;
  identityNumber: string;
  identityExpiryDate: string;

  businessName: string;
  bureauType: string;
  yearsInBusiness: string;
  activeProfiles: string;
  monthlyNewProfiles: string;
  teamSize: string;
  serviceModel: string;
  businessRegistrationStatus: string;
  businessRegistrationNumber: string;
  ntnNumber: string;
  professionalMemberships: string;

  hasPhysicalOffice: string;
  officePhone: string;
  officeAddress: string;
  city: string;
  province: string;
  country: string;
  areasServed: string;
  countriesServed: string[];
  languagesSpoken: string[];

  specializations: string[];
  profileSources: string[];
  verificationMethods: string[];
  clientConsentProcess: string;
  dataPrivacyPractice: string;
  complaintHandlingProcess: string;
  feeStructure: string;
  refundPolicyAvailable: string;

  website: string;
  socialLink: string;
  googleBusinessLink: string;
  referenceName1: string;
  referenceRelationship1: string;
  referencePhone1: string;
  referenceName2: string;
  referenceRelationship2: string;
  referencePhone2: string;

  confirmProfessional: boolean;
  confirmAccurate: boolean;
  confirmConsent: boolean;
  agreeTerms: boolean;
};

type DocumentKey =
  | 'identityFront'
  | 'identityBack'
  | 'businessProof'
  | 'businessCard'
  | 'officePhoto';

type SelectedDocument = {
  file: File;
  previewUrl: string | null;
};

type DocumentsState = Record<DocumentKey, SelectedDocument | null>;
type FieldErrors = Record<string, string>;

const initialFormData: BureauApplicationForm = {
  fullName: '',
  fatherName: '',
  dateOfBirth: '',
  roleInBureau: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  identityType: 'CNIC',
  identityNumber: '',
  identityExpiryDate: '',

  businessName: '',
  bureauType: '',
  yearsInBusiness: '',
  activeProfiles: '',
  monthlyNewProfiles: '',
  teamSize: '',
  serviceModel: '',
  businessRegistrationStatus: '',
  businessRegistrationNumber: '',
  ntnNumber: '',
  professionalMemberships: '',

  hasPhysicalOffice: '',
  officePhone: '',
  officeAddress: '',
  city: '',
  province: '',
  country: 'Pakistan',
  areasServed: '',
  countriesServed: ['Pakistan'],
  languagesSpoken: ['Urdu'],

  specializations: [],
  profileSources: [],
  verificationMethods: [],
  clientConsentProcess: '',
  dataPrivacyPractice: '',
  complaintHandlingProcess: '',
  feeStructure: '',
  refundPolicyAvailable: '',

  website: '',
  socialLink: '',
  googleBusinessLink: '',
  referenceName1: '',
  referenceRelationship1: '',
  referencePhone1: '',
  referenceName2: '',
  referenceRelationship2: '',
  referencePhone2: '',

  confirmProfessional: false,
  confirmAccurate: false,
  confirmConsent: false,
  agreeTerms: false,
};

const initialDocuments: DocumentsState = {
  identityFront: null,
  identityBack: null,
  businessProof: null,
  businessCard: null,
  officePhoto: null,
};

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function ageFromDate(value: string) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDifference = today.getMonth() - date.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

function inputClass(hasError?: boolean) {
  return `w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
  }`;
}

function QuestionLabel({
  english,
  urdu,
  required = false,
}: {
  english: string;
  urdu: string;
  required?: boolean;
}) {
  return (
    <div className="mb-2">
      <p className="text-sm font-bold leading-5 text-slate-800">
        {english}{required ? ' *' : ''}
      </p>
      <p dir="rtl" lang="ur" className="mt-1 text-right text-[13px] font-semibold leading-6 text-emerald-800">
        {urdu}{required ? ' *' : ''}
      </p>
    </div>
  );
}

function BilingualHelper({ english, urdu }: { english: string; urdu: string }) {
  return (
    <div className="mt-1.5 space-y-0.5 text-xs leading-5 text-slate-500">
      <p>{english}</p>
      <p dir="rtl" lang="ur" className="text-right text-emerald-800/75">{urdu}</p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

function SectionIntro({
  eyebrow,
  urduEyebrow,
  title,
  urduTitle,
  description,
  urduDescription,
}: {
  eyebrow: string;
  urduEyebrow: string;
  title: string;
  urduTitle: string;
  description: string;
  urduDescription: string;
}) {
  return (
    <div className="mb-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
        <span className="hidden h-1 w-1 rounded-full bg-emerald-300 sm:block" />
        <p dir="rtl" lang="ur" className="text-right text-sm font-bold text-emerald-800">{urduEyebrow}</p>
      </div>
      <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[#093f2c] md:text-4xl">
        {title}
      </h2>
      <p dir="rtl" lang="ur" className="mt-2 max-w-2xl text-right text-xl font-semibold leading-9 text-emerald-800 md:text-2xl">
        {urduTitle}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
      <p dir="rtl" lang="ur" className="mt-1.5 max-w-2xl text-right text-sm leading-7 text-slate-600 md:text-base">{urduDescription}</p>
    </div>
  );
}

function ChoiceGrid({
  label,
  urduLabel,
  helper,
  urduHelper,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: {
  label: string;
  urduLabel: string;
  helper?: string;
  urduHelper?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
  error?: string;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p dir="rtl" lang="ur" className="mt-1 text-right text-[13px] font-semibold leading-6 text-emerald-800">{urduLabel}</p>
        {helper ? <p className="mt-1.5 text-xs leading-5 text-slate-500">{helper}</p> : null}
        {urduHelper ? <p dir="rtl" lang="ur" className="mt-0.5 text-right text-xs leading-5 text-emerald-800/75">{urduHelper}</p> : null}
      </div>
      <div className={`grid gap-3 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`group flex min-h-[72px] items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 ${
                selected
                  ? 'border-emerald-700 bg-emerald-950 text-white shadow-[0_12px_28px_rgba(5,78,55,0.18)]'
                  : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-5">{option}</span>
                {optionUrdu[option] ? (
                  <span dir="rtl" lang="ur" className={`mt-1 block text-right text-xs leading-5 ${selected ? 'text-emerald-100' : 'text-emerald-800/75'}`}>
                    {optionUrdu[option]}
                  </span>
                ) : null}
              </span>
              <span
                className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                  selected
                    ? 'border-white/30 bg-white/15'
                    : 'border-slate-200 bg-slate-50 group-hover:border-emerald-300'
                }`}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function MultiChoiceGrid({
  label,
  urduLabel,
  helper,
  urduHelper,
  options,
  values,
  onToggle,
  error,
}: {
  label: string;
  urduLabel: string;
  helper?: string;
  urduHelper?: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p dir="rtl" lang="ur" className="mt-1 text-right text-[13px] font-semibold leading-6 text-emerald-800">{urduLabel}</p>
        {helper ? <p className="mt-1.5 text-xs leading-5 text-slate-500">{helper}</p> : null}
        {urduHelper ? <p dir="rtl" lang="ur" className="mt-0.5 text-right text-xs leading-5 text-emerald-800/75">{urduHelper}</p> : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const selected = values.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                selected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                  selected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-5">{option}</span>
                {optionUrdu[option] ? (
                  <span dir="rtl" lang="ur" className="mt-1 block text-right text-xs leading-5 text-emerald-800/75">
                    {optionUrdu[option]}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function DocumentUploader({
  id,
  title,
  urduTitle,
  description,
  urduDescription,
  required,
  document,
  onSelect,
  onRemove,
  error,
}: {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  urduDescription: string;
  required?: boolean;
  document: SelectedDocument | null;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  error?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-white transition ${
        error ? 'border-red-300' : document ? 'border-emerald-300 shadow-sm' : 'border-slate-200'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div>
                <p className="font-bold text-slate-900">{title}</p>
                <p dir="rtl" lang="ur" className="mt-1 text-right text-sm font-semibold text-emerald-800">{urduTitle}</p>
              </div>
              {required ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-rose-700">
                  Required · لازمی
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Optional · اختیاری
                </span>
              )}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
            <p dir="rtl" lang="ur" className="mt-0.5 text-right text-xs leading-5 text-emerald-800/75">{urduDescription}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {document ? (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
            {document.previewUrl ? (
              <img
                src={document.previewUrl}
                alt="Selected document preview"
                className="h-16 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-white text-rose-700 shadow-sm">
                <FileText className="h-7 w-7" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{document.file.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {(document.file.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-red-600"
              aria-label={`Remove ${title}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-5 text-sm font-bold text-emerald-800 transition hover:border-emerald-500 hover:bg-emerald-50"
          >
            <UploadCloud className="h-5 w-5" />
            Choose image or PDF · تصویر یا PDF منتخب کریں
          </label>
        )}

        <input
          id={id}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={onSelect}
        />
        <FieldError message={error} />
      </div>
    </div>
  );
}

function ReviewItem({
  label,
  urduLabel,
  value,
}: {
  label: string;
  urduLabel?: string;
  value: string | string[] | null | undefined;
}) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        {urduLabel ? <p dir="rtl" lang="ur" className="text-right text-xs font-semibold text-emerald-700">{urduLabel}</p> : null}
      </div>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{displayValue || 'Not provided'}</p>
    </div>
  );
}

function ReviewCard({
  title,
  urduTitle,
  icon: Icon,
  onEdit,
  children,
}: {
  title: string;
  urduTitle?: string;
  icon: LucideIcon;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#0a4933]">{title}</h3>
            {urduTitle ? <p dir="rtl" lang="ur" className="mt-0.5 text-right text-sm font-semibold text-emerald-700">{urduTitle}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-800"
        >
          Edit · ترمیم
        </button>
      </div>
      <div className="pt-2">{children}</div>
    </section>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<BureauApplicationForm>(initialFormData);
  const [documents, setDocuments] = useState<DocumentsState>(initialDocuments);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bureauRegistrationNumber, setBureauRegistrationNumber] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const [copied, setCopied] = useState(false);
  const pageTopRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<DocumentsState>(initialDocuments);

  const applicantAge = useMemo(() => ageFromDate(formData.dateOfBirth), [formData.dateOfBirth]);
  const progress = Math.round(((currentStep + 1) / stepDefinitions.length) * 100);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (!savedDraft) return;

      const parsed = JSON.parse(savedDraft) as {
        formData?: Partial<BureauApplicationForm>;
        currentStep?: number;
        maxVisitedStep?: number;
      };

      if (parsed.formData) {
        setFormData((previous) => ({ ...previous, ...parsed.formData }));
        setCurrentStep(Math.min(parsed.currentStep ?? 0, stepDefinitions.length - 1));
        setMaxVisitedStep(Math.min(parsed.maxVisitedStep ?? 0, stepDefinitions.length - 1));
        setDraftRestored(true);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            formData,
            currentStep,
            maxVisitedStep,
            savedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Draft saving is a convenience only.
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [formData, currentStep, maxVisitedStep]);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  useEffect(() => {
    return () => {
      Object.values(documentsRef.current).forEach((document) => {
        if (document?.previewUrl) URL.revokeObjectURL(document.previewUrl);
      });
    };
  }, []);

  const updateField = <K extends keyof BureauApplicationForm>(
    field: K,
    value: BureauApplicationForm[K]
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const toggleArrayValue = (
    field:
      | 'countriesServed'
      | 'languagesSpoken'
      | 'specializations'
      | 'profileSources'
      | 'verificationMethods',
    value: string
  ) => {
    const values = formData[field];
    updateField(
      field,
      values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
    );
  };

  const validateStep = (step: number) => {
    const errors: FieldErrors = {};

    if (step === 0) {
      if (formData.fullName.trim().length < 3) errors.fullName = 'Enter the applicant’s full legal name.';
      if (!formData.fatherName.trim()) errors.fatherName = 'Enter father / guardian name.';
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
      if (applicantAge !== null && applicantAge < 18) errors.dateOfBirth = 'Applicant must be at least 18 years old.';
      if (!formData.roleInBureau) errors.roleInBureau = 'Select your role in the bureau.';
      if (!isValidPhone(formData.mobileNumber)) errors.mobileNumber = 'Enter a valid mobile number.';
      if (!isValidPhone(formData.whatsappNumber)) errors.whatsappNumber = 'Enter a valid WhatsApp number.';
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email address.';
      if (!formData.identityType) errors.identityType = 'Select an identity document type.';
      if (formData.identityNumber.replace(/\s/g, '').length < 6) errors.identityNumber = 'Enter a valid identity number.';
    }

    if (step === 1) {
      if (formData.businessName.trim().length < 2) errors.businessName = 'Enter your bureau or business name.';
      if (!formData.bureauType) errors.bureauType = 'Select the bureau structure.';
      if (!formData.yearsInBusiness) errors.yearsInBusiness = 'Select years in business.';
      if (!formData.activeProfiles) errors.activeProfiles = 'Select the approximate active profile count.';
      if (!formData.monthlyNewProfiles) errors.monthlyNewProfiles = 'Select monthly new profile volume.';
      if (!formData.teamSize) errors.teamSize = 'Select your team size.';
      if (!formData.serviceModel) errors.serviceModel = 'Select a service model.';
      if (!formData.businessRegistrationStatus) errors.businessRegistrationStatus = 'Select the registration status.';
      if (
        formData.businessRegistrationStatus.startsWith('Registered') &&
        !formData.businessRegistrationNumber.trim()
      ) {
        errors.businessRegistrationNumber = 'Enter the registration number or reference.';
      }
    }

    if (step === 2) {
      if (!formData.hasPhysicalOffice) errors.hasPhysicalOffice = 'Select your office arrangement.';
      if (!formData.city.trim()) errors.city = 'City is required.';
      if (!formData.province) errors.province = 'Province / region is required.';
      if (!formData.country) errors.country = 'Country is required.';
      if (formData.hasPhysicalOffice === 'Yes — dedicated office' && !formData.officeAddress.trim()) {
        errors.officeAddress = 'Enter the dedicated office address.';
      }
      if (!formData.areasServed.trim()) errors.areasServed = 'Describe the cities or communities you mainly serve.';
      if (formData.countriesServed.length === 0) errors.countriesServed = 'Select at least one country served.';
      if (formData.languagesSpoken.length === 0) errors.languagesSpoken = 'Select at least one working language.';
    }

    if (step === 3) {
      if (formData.specializations.length === 0) errors.specializations = 'Select at least one specialisation.';
      if (formData.profileSources.length === 0) errors.profileSources = 'Select at least one source of profiles.';
      if (formData.verificationMethods.length === 0) errors.verificationMethods = 'Select at least one verification method.';
      if (!formData.clientConsentProcess) errors.clientConsentProcess = 'Select how client consent is recorded.';
      if (formData.dataPrivacyPractice.trim().length < 30) errors.dataPrivacyPractice = 'Briefly explain how client data and photos are protected.';
      if (formData.complaintHandlingProcess.trim().length < 30) errors.complaintHandlingProcess = 'Briefly explain how complaints and misuse reports are handled.';
      if (!formData.feeStructure) errors.feeStructure = 'Select the main fee model.';
      if (!formData.refundPolicyAvailable) errors.refundPolicyAvailable = 'Select the refund-policy status.';
    }

    if (step === 4) {
      if (!isValidUrl(formData.website)) errors.website = 'Enter a complete URL beginning with http:// or https://.';
      if (!isValidUrl(formData.socialLink)) errors.socialLink = 'Enter a complete social profile URL.';
      if (!isValidUrl(formData.googleBusinessLink)) errors.googleBusinessLink = 'Enter a complete Google Business URL.';
      if (!formData.referenceName1.trim()) errors.referenceName1 = 'At least one professional reference is required.';
      if (!formData.referenceRelationship1.trim()) errors.referenceRelationship1 = 'Explain how this reference knows your work.';
      if (!isValidPhone(formData.referencePhone1)) errors.referencePhone1 = 'Enter a valid reference contact number.';
    }

    if (step === 5) {
      if (!documents.identityFront) errors.identityFront = 'Upload the front / main page of the identity document.';
      if (!documents.identityBack) errors.identityBack = 'Upload the back / supporting page of the identity document.';
      if (
        formData.businessRegistrationStatus.startsWith('Registered') &&
        !documents.businessProof
      ) {
        errors.businessProof = 'Upload registration or tax evidence for the registered bureau.';
      }
      if (formData.hasPhysicalOffice === 'Yes — dedicated office' && !documents.officePhoto) {
        errors.officePhoto = 'Upload a clear office photograph.';
      }
    }

    if (step === 6) {
      if (!formData.confirmProfessional) errors.confirmProfessional = 'Professional operator confirmation is required.';
      if (!formData.confirmAccurate) errors.confirmAccurate = 'Accuracy confirmation is required.';
      if (!formData.confirmConsent) errors.confirmConsent = 'Client consent and privacy commitment is required.';
      if (!formData.agreeTerms) errors.agreeTerms = 'You must accept the terms and privacy policy.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const scrollToFormTop = () => {
    window.requestAnimationFrame(() => {
      pageTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const goNext = () => {
    setServerError('');
    if (!validateStep(currentStep)) return;

    if (currentStep < stepDefinitions.length - 1) {
      setDirection('forward');
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxVisitedStep((previous) => Math.max(previous, nextStep));
      scrollToFormTop();
    }
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setDirection('back');
    setCurrentStep((previous) => previous - 1);
    scrollToFormTop();
  };

  const jumpToStep = (step: number) => {
    if (step > maxVisitedStep || step === currentStep) return;
    setDirection(step > currentStep ? 'forward' : 'back');
    setCurrentStep(step);
    scrollToFormTop();
  };

  const clearDraft = () => {
    if (!window.confirm('Clear all entered information and start again?')) return;

    Object.values(documents).forEach((document) => {
      if (document?.previewUrl) URL.revokeObjectURL(document.previewUrl);
    });

    setFormData(initialFormData);
    setDocuments(initialDocuments);
    setCurrentStep(0);
    setMaxVisitedStep(0);
    setFieldErrors({});
    setServerError('');
    localStorage.removeItem(DRAFT_KEY);
  };

  const handleDocumentSelect = (key: DocumentKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
      setFieldErrors((previous) => ({
        ...previous,
        [key]: 'Use JPG, PNG, WebP or PDF format.',
      }));
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      setFieldErrors((previous) => ({
        ...previous,
        [key]: 'Each file must be 5 MB or smaller.',
      }));
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    setDocuments((previous) => {
      if (previous[key]?.previewUrl) URL.revokeObjectURL(previous[key]!.previewUrl!);
      return { ...previous, [key]: { file, previewUrl } };
    });

    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const removeDocument = (key: DocumentKey) => {
    setDocuments((previous) => {
      if (previous[key]?.previewUrl) URL.revokeObjectURL(previous[key]!.previewUrl!);
      return { ...previous, [key]: null };
    });
  };

  const uploadDocument = async (
    applicationId: string,
    key: DocumentKey,
    selectedDocument: SelectedDocument | null
  ) => {
    if (!selectedDocument) return null;

    const extension = selectedDocument.file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${applicationId}/${key}-${Date.now()}-${generateUuid().slice(0, 8)}.${extension}`;

    const { error } = await supabase.storage
      .from(DOCUMENT_BUCKET)
      .upload(path, selectedDocument.file, {
        cacheControl: '3600',
        upsert: false,
        contentType: selectedDocument.file.type,
      });

    if (error) throw new Error(`Could not upload ${selectedDocument.file.name}: ${error.message}`);
    return path;
  };

  const submitApplication = async (event: FormEvent) => {
    event.preventDefault();
    setServerError('');

    if (!validateStep(6)) return;

    setIsSubmitting(true);
    const applicationId = generateUuid();

    try {
      setSubmissionMessage('Securing your verification documents…');

      const [identityFrontPath, identityBackPath, businessProofPath, businessCardPath, officePhotoPath] =
        await Promise.all([
          uploadDocument(applicationId, 'identityFront', documents.identityFront),
          uploadDocument(applicationId, 'identityBack', documents.identityBack),
          uploadDocument(applicationId, 'businessProof', documents.businessProof),
          uploadDocument(applicationId, 'businessCard', documents.businessCard),
          uploadDocument(applicationId, 'officePhoto', documents.officePhoto),
        ]);

      setSubmissionMessage('Submitting your bureau for manual review…');

      const { error } = await supabase.from('bureau_applications').insert({
        id: applicationId,

        full_name: formData.fullName.trim(),
        applicant_father_name: formData.fatherName.trim(),
        applicant_date_of_birth: formData.dateOfBirth || null,
        role_in_bureau: formData.roleInBureau,
        mobile_number: formData.mobileNumber.trim(),
        whatsapp_number: formData.whatsappNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        cnic: formData.identityNumber.trim(),
        identity_type: formData.identityType,
        identity_expiry_date: formData.identityExpiryDate || null,

        business_name: formData.businessName.trim(),
        bureau_type: formData.bureauType,
        years_in_business: formData.yearsInBusiness,
        active_profiles: formData.activeProfiles,
        monthly_new_profiles: formData.monthlyNewProfiles,
        team_size: formData.teamSize,
        service_model: formData.serviceModel,
        business_registration_status: formData.businessRegistrationStatus,
        business_registration_number: formData.businessRegistrationNumber.trim() || null,
        ntn_number: formData.ntnNumber.trim() || null,
        professional_memberships: formData.professionalMemberships.trim() || null,

        has_physical_office: formData.hasPhysicalOffice,
        office_phone: formData.officePhone.trim() || null,
        office_address: formData.officeAddress.trim() || null,
        city: formData.city.trim(),
        province: formData.province,
        country: formData.country,
        areas_served: formData.areasServed.trim(),
        countries_served: formData.countriesServed,
        languages_spoken: formData.languagesSpoken,

        specializations: formData.specializations,
        profile_sources: formData.profileSources,
        verification_methods: formData.verificationMethods,
        client_consent_process: formData.clientConsentProcess,
        data_privacy_practice: formData.dataPrivacyPractice.trim(),
        complaint_handling_process: formData.complaintHandlingProcess.trim(),
        fee_structure: formData.feeStructure,
        refund_policy_available: formData.refundPolicyAvailable,

        website: formData.website.trim() || null,
        social_link: formData.socialLink.trim() || null,
        google_business_link: formData.googleBusinessLink.trim() || null,
        reference_name_1: formData.referenceName1.trim(),
        reference_relationship_1: formData.referenceRelationship1.trim(),
        reference_phone_1: formData.referencePhone1.trim(),
        reference_name_2: formData.referenceName2.trim() || null,
        reference_relationship_2: formData.referenceRelationship2.trim() || null,
        reference_phone_2: formData.referencePhone2.trim() || null,

        identity_front_path: identityFrontPath,
        identity_back_path: identityBackPath,
        business_proof_path: businessProofPath,
        business_card_path: businessCardPath,
        office_photo_path: officePhotoPath,
        declarations_accepted_at: new Date().toISOString(),
        application_version: 'bureau-questionnaire-v4',
        status: 'pending',
      });

      if (error) throw error;

      setSubmissionMessage('Generating your private application reference…');

      const { data: registrationNumber } = await supabase.rpc('get_bureau_registration_number', {
        p_application_id: applicationId,
      });

      setBureauRegistrationNumber(
        typeof registrationNumber === 'string' && registrationNumber.trim()
          ? registrationNumber
          : applicationId
      );
      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof (error as { message?: unknown }).message === 'string'
            ? (error as { message: string }).message
            : 'The application could not be submitted. Please try again.';

      setServerError(message);
    } finally {
      setIsSubmitting(false);
      setSubmissionMessage('');
    }
  };

  const copyRegistrationNumber = async () => {
    if (!bureauRegistrationNumber) return;

    try {
      await navigator.clipboard.writeText(bureauRegistrationNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (submitted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f7f7f1] px-4 py-10 md:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <section className="w-full overflow-hidden rounded-[36px] border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(14,70,49,0.14)]">
            <div className="bg-[#074c35] px-6 py-10 text-center text-white md:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/12 ring-1 ring-white/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-200" />
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                Application received
              </p>
              <h1 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">Thank you for applying</h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-50/80 md:text-base">
                Your bureau details and private verification documents have been submitted for manual review.
              </p>
            </div>

            <div className="p-6 md:p-10">
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-center text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  Private application reference
                </p>
                <p dir="ltr" className="mt-3 break-all font-mono text-2xl font-black md:text-3xl">
                  {bureauRegistrationNumber}
                </p>
                <button
                  type="button"
                  onClick={copyRegistrationNumber}
                  className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/15"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy reference'}
                </button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ['01', 'Manual review', 'Identity, bureau history and submitted evidence are assessed.'],
                  ['02', 'Verification contact', 'MBN may call the applicant or professional references.'],
                  ['03', 'Secure activation', 'Approved bureaus receive account-activation instructions.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="rounded-2xl border border-slate-200 bg-[#fbfbf7] p-4">
                    <span className="text-xs font-black text-emerald-700">{number}</span>
                    <p className="mt-2 text-sm font-bold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  Your identity documents are stored in a private verification bucket and are not part of your public bureau profile.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to homepage
                </Link>
                <Link
                  href="/login"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900"
                >
                  Bureau sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div>
          <SectionIntro
            eyebrow="Step 1 · Applicant"
            urduEyebrow="مرحلہ 1 · درخواست دہندہ"
            title="Who is applying on behalf of the bureau?"
            urduTitle="بیورو کی جانب سے درخواست کون دے رہا ہے؟"
            description="Use the legal details of the person MBN can contact and verify. This person should be authorised to represent the bureau."
            urduDescription="اس شخص کی قانونی معلومات درج کریں جس سے MBN رابطہ اور تصدیق کر سکے۔ یہ شخص بیورو کی نمائندگی کے لیے مجاز ہونا چاہیے۔"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <QuestionLabel english="Full legal name" urdu="درخواست دہندہ کا مکمل قانونی نام" required />
              <input
                value={formData.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Muhammad Ahmad"
                autoComplete="name"
                className={inputClass(Boolean(fieldErrors.fullName))}
              />
              <FieldError message={fieldErrors.fullName} />
            </div>

            <div>
              <QuestionLabel english="Father / guardian name" urdu="والد / سرپرست کا نام" required />
              <input
                value={formData.fatherName}
                onChange={(event) => updateField('fatherName', event.target.value)}
                placeholder="Muhammad Aslam"
                className={inputClass(Boolean(fieldErrors.fatherName))}
              />
              <FieldError message={fieldErrors.fatherName} />
            </div>

            <div>
              <QuestionLabel english="Date of birth" urdu="تاریخِ پیدائش" required />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) => updateField('dateOfBirth', event.target.value)}
                className={inputClass(Boolean(fieldErrors.dateOfBirth))}
              />
              {applicantAge !== null && applicantAge >= 0 ? (
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-emerald-700">
                  <span>Calculated age: {applicantAge} years</span>
                  <span dir="rtl" lang="ur">حساب شدہ عمر: {applicantAge} سال</span>
                </div>
              ) : null}
              <FieldError message={fieldErrors.dateOfBirth} />
            </div>

            <div>
              <QuestionLabel english="Role in bureau" urdu="بیورو میں آپ کی ذمہ داری / عہدہ" required />
              <select
                value={formData.roleInBureau}
                onChange={(event) => updateField('roleInBureau', event.target.value)}
                className={inputClass(Boolean(fieldErrors.roleInBureau))}
              >
                <option value="">Select your role — اپنا عہدہ منتخب کریں</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{bilingualOption(role)}</option>
                ))}
              </select>
              <FieldError message={fieldErrors.roleInBureau} />
            </div>

            <div>
              <QuestionLabel english="Mobile number" urdu="موبائل نمبر" required />
              <input
                type="tel"
                dir="ltr"
                value={formData.mobileNumber}
                onChange={(event) => updateField('mobileNumber', event.target.value)}
                placeholder="+92 300 1234567"
                autoComplete="tel"
                className={inputClass(Boolean(fieldErrors.mobileNumber))}
              />
              <FieldError message={fieldErrors.mobileNumber} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <QuestionLabel english="WhatsApp number" urdu="واٹس ایپ نمبر" required />
                {formData.mobileNumber ? (
                  <button
                    type="button"
                    onClick={() => updateField('whatsappNumber', formData.mobileNumber)}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Same as mobile · موبائل نمبر کے مطابق
                  </button>
                ) : null}
              </div>
              <input
                type="tel"
                dir="ltr"
                value={formData.whatsappNumber}
                onChange={(event) => updateField('whatsappNumber', event.target.value)}
                placeholder="+92 300 1234567"
                className={inputClass(Boolean(fieldErrors.whatsappNumber))}
              />
              <FieldError message={fieldErrors.whatsappNumber} />
            </div>

            <div className="md:col-span-2">
              <QuestionLabel english="Professional email" urdu="پیشہ ورانہ ای میل" required />
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@yourbureau.com"
                  autoComplete="email"
                  className={`${inputClass(Boolean(fieldErrors.email))} pl-11`}
                />
              </div>
              <BilingualHelper
                english="Approval and secure account-activation instructions will be sent to this address."
                urdu="منظوری اور محفوظ اکاؤنٹ ایکٹیویشن کی ہدایات اسی ای میل پتے پر بھیجی جائیں گی۔"
              />
              <FieldError message={fieldErrors.email} />
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 md:p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <p className="font-bold text-emerald-950">Government-issued identity</p>
                <p dir="rtl" lang="ur" className="mt-1 text-right text-sm font-semibold text-emerald-800">سرکاری شناختی دستاویز</p>
                <p className="mt-2 text-sm leading-6 text-emerald-900/70">
                  Identity information is used for manual bureau verification. It will not appear on your public profile.
                </p>
                <p dir="rtl" lang="ur" className="mt-1 text-right text-sm leading-7 text-emerald-900/70">
                  شناختی معلومات صرف بیورو کی دستی تصدیق کے لیے استعمال ہوں گی اور آپ کے عوامی پروفائل پر ظاہر نہیں کی جائیں گی۔
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <QuestionLabel english="Document type" urdu="شناختی دستاویز کی قسم" required />
                <select
                  value={formData.identityType}
                  onChange={(event) => updateField('identityType', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.identityType))}
                >
                  {identityTypes.map((type) => <option key={type} value={type}>{bilingualOption(type)}</option>)}
                </select>
                <FieldError message={fieldErrors.identityType} />
              </div>
              <div>
                <QuestionLabel english="Document number" urdu="شناختی دستاویز کا نمبر" required />
                <input
                  dir="ltr"
                  value={formData.identityNumber}
                  onChange={(event) => updateField('identityNumber', event.target.value)}
                  placeholder={formData.identityType === 'CNIC' ? '12345-1234567-1' : 'Document number'}
                  className={inputClass(Boolean(fieldErrors.identityNumber))}
                />
                <FieldError message={fieldErrors.identityNumber} />
              </div>
              <div>
                <QuestionLabel english="Expiry date" urdu="میعاد ختم ہونے کی تاریخ" />
                <input
                  type="date"
                  value={formData.identityExpiryDate}
                  onChange={(event) => updateField('identityExpiryDate', event.target.value)}
                  className={inputClass()}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div>
          <SectionIntro
            eyebrow="Step 2 · Bureau"
            urduEyebrow="مرحلہ 2 · بیورو"
            title="Build a credible bureau profile"
            urduTitle="اپنے بیورو کا قابلِ اعتماد تعارف تیار کریں"
            description="These questions help MBN distinguish established professionals from casual or unverified operators. Approximate ranges are acceptable."
            urduDescription="یہ سوالات MBN کو باقاعدہ پیشہ ور بیوروز اور غیر تصدیق شدہ آپریٹرز میں فرق کرنے میں مدد دیتے ہیں۔ اندازاً درست حدود قابلِ قبول ہیں۔"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <QuestionLabel english="Marriage bureau / business name" urdu="میرج بیورو / کاروبار کا نام" required />
              <div className="relative">
                <Store className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={formData.businessName}
                  onChange={(event) => updateField('businessName', event.target.value)}
                  placeholder="e.g. Al-Noor Marriage Bureau"
                  className={`${inputClass(Boolean(fieldErrors.businessName))} pl-12`}
                />
              </div>
              <FieldError message={fieldErrors.businessName} />
            </div>

            <div>
              <QuestionLabel english="Years in business" urdu="بیورو چلانے کا تجربہ" required />
              <select
                value={formData.yearsInBusiness}
                onChange={(event) => updateField('yearsInBusiness', event.target.value)}
                className={inputClass(Boolean(fieldErrors.yearsInBusiness))}
              >
                <option value="">Select experience — تجربہ منتخب کریں</option>
                {yearsOptions.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.yearsInBusiness} />
            </div>

            <div>
              <QuestionLabel english="Approximate active profiles" urdu="تقریباً فعال پروفائلز کی تعداد" required />
              <select
                value={formData.activeProfiles}
                onChange={(event) => updateField('activeProfiles', event.target.value)}
                className={inputClass(Boolean(fieldErrors.activeProfiles))}
              >
                <option value="">Select a range — مناسب حد منتخب کریں</option>
                {activeProfileOptions.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.activeProfiles} />
            </div>

            <div>
              <QuestionLabel english="New profiles added per month" urdu="ہر ماہ شامل کیے جانے والے نئے پروفائلز" required />
              <select
                value={formData.monthlyNewProfiles}
                onChange={(event) => updateField('monthlyNewProfiles', event.target.value)}
                className={inputClass(Boolean(fieldErrors.monthlyNewProfiles))}
              >
                <option value="">Select a range — مناسب حد منتخب کریں</option>
                {monthlyProfileOptions.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.monthlyNewProfiles} />
            </div>

            <div>
              <QuestionLabel english="Team size" urdu="آپ کی ٹیم میں افراد کی تعداد" required />
              <select
                value={formData.teamSize}
                onChange={(event) => updateField('teamSize', event.target.value)}
                className={inputClass(Boolean(fieldErrors.teamSize))}
              >
                <option value="">Select team size — ٹیم کا حجم منتخب کریں</option>
                {teamSizeOptions.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.teamSize} />
            </div>
          </div>

          <div className="mt-7 space-y-7">
            <ChoiceGrid
              label="How is your bureau structured? *"
              urduLabel="آپ کے بیورو کا قانونی یا انتظامی ڈھانچہ کیا ہے؟ *"
              options={bureauTypes}
              value={formData.bureauType}
              onChange={(value) => updateField('bureauType', value)}
              error={fieldErrors.bureauType}
            />

            <ChoiceGrid
              label="How do you normally serve families? *"
              urduLabel="آپ عموماً خاندانوں کو کس طریقے سے خدمات فراہم کرتے ہیں؟ *"
              options={serviceModels}
              value={formData.serviceModel}
              onChange={(value) => updateField('serviceModel', value)}
              columns={3}
              error={fieldErrors.serviceModel}
            />

            <ChoiceGrid
              label="Business registration status *"
              urduLabel="کاروباری رجسٹریشن کی موجودہ حیثیت کیا ہے؟ *"
              helper="Formal registration is not the only approval factor, but all declarations must be accurate."
              urduHelper="باضابطہ رجسٹریشن منظوری کا واحد معیار نہیں، تاہم دی گئی ہر معلومات درست ہونا ضروری ہے۔"
              options={registrationStatuses}
              value={formData.businessRegistrationStatus}
              onChange={(value) => updateField('businessRegistrationStatus', value)}
              error={fieldErrors.businessRegistrationStatus}
            />
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <QuestionLabel english="Registration number / reference" urdu="رجسٹریشن نمبر / حوالہ" />
              <input
                value={formData.businessRegistrationNumber}
                onChange={(event) => updateField('businessRegistrationNumber', event.target.value)}
                placeholder="SECP, trade licence or registration reference"
                className={inputClass(Boolean(fieldErrors.businessRegistrationNumber))}
              />
              <FieldError message={fieldErrors.businessRegistrationNumber} />
            </div>
            <div>
              <QuestionLabel english="NTN / tax number" urdu="این ٹی این / ٹیکس نمبر" />
              <input
                value={formData.ntnNumber}
                onChange={(event) => updateField('ntnNumber', event.target.value)}
                placeholder="Optional"
                className={inputClass()}
              />
            </div>
            <div className="md:col-span-2">
              <QuestionLabel english="Professional memberships or awards" urdu="پیشہ ورانہ رکنیتیں یا اعزازات" />
              <textarea
                rows={3}
                value={formData.professionalMemberships}
                onChange={(event) => updateField('professionalMemberships', event.target.value)}
                placeholder="Mention relevant associations, community roles, awards or recognised professional memberships."
                className={`${inputClass()} resize-none`}
              />
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <SectionIntro
            eyebrow="Step 3 · Reach"
            urduEyebrow="مرحلہ 3 · دائرۂ کار"
            title="Where do you meet and support families?"
            urduTitle="آپ خاندانوں سے کہاں ملاقات اور معاونت کرتے ہیں؟"
            description="Clear location and service-area information helps MBN route suitable enquiries and verify your professional presence."
            urduDescription="مقام اور خدمات کے علاقوں کی واضح معلومات MBN کو مناسب درخواستیں آپ تک پہنچانے اور آپ کی پیشہ ورانہ موجودگی کی تصدیق میں مدد دیتی ہیں۔"
          />

          <ChoiceGrid
            label="Do you operate from a physical office? *"
            urduLabel="کیا آپ باقاعدہ فزیکل دفتر سے کام کرتے ہیں؟ *"
            options={officeOptions}
            value={formData.hasPhysicalOffice}
            onChange={(value) => updateField('hasPhysicalOffice', value)}
            columns={3}
            error={fieldErrors.hasPhysicalOffice}
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <QuestionLabel english="Office phone / landline" urdu="دفتر کا فون / لینڈ لائن" />
              <input
                dir="ltr"
                value={formData.officePhone}
                onChange={(event) => updateField('officePhone', event.target.value)}
                placeholder="061-1234567"
                className={inputClass()}
              />
            </div>
            <div>
              <QuestionLabel english="Province / region" urdu="صوبہ / خطہ" required />
              <select
                value={formData.province}
                onChange={(event) => {
                  updateField('province', event.target.value);
                  updateField('city', '');
                }}
                className={inputClass(Boolean(fieldErrors.province))}
              >
                <option value="">Select province / region — صوبہ / خطہ منتخب کریں</option>
                {provinces.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.province} />
            </div>
            <div>
              <QuestionLabel english="City" urdu="شہر" required />
              <input
                list="bureau-city-options"
                value={formData.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder={formData.province ? 'Select or type your city — شہر منتخب یا درج کریں' : 'Select province first — پہلے صوبہ منتخب کریں'}
                disabled={!formData.province}
                className={inputClass(Boolean(fieldErrors.city))}
              />
              <datalist id="bureau-city-options">
                {(citiesByProvince[formData.province] || []).map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Choose from the suggestions or type your city if it is not listed.
                <span dir="rtl" className="ml-2 inline-block">اگر آپ کا شہر فہرست میں نہ ہو تو اسے خود درج کر سکتے ہیں۔</span>
              </p>
              <FieldError message={fieldErrors.city} />
            </div>
            <div>
              <QuestionLabel english="Country" urdu="ملک" required />
              <select
                value={formData.country}
                onChange={(event) => updateField('country', event.target.value)}
                className={inputClass(Boolean(fieldErrors.country))}
              >
                {countries.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
              </select>
              <FieldError message={fieldErrors.country} />
            </div>
            <div className="md:col-span-2">
              <QuestionLabel
                english={formData.hasPhysicalOffice === 'Home-based workspace' ? 'Workspace locality / area' : 'Office address'}
                urdu={formData.hasPhysicalOffice === 'Home-based workspace' ? 'گھر پر قائم ورک اسپیس کا علاقہ / مقام' : 'دفتر کا مکمل پتہ'}
                required={formData.hasPhysicalOffice !== 'No physical office'}
              />
              <textarea
                rows={3}
                value={formData.officeAddress}
                onChange={(event) => updateField('officeAddress', event.target.value)}
                placeholder={
                  formData.hasPhysicalOffice === 'Home-based workspace'
                    ? 'You may provide locality/area rather than a private home address.'
                    : 'Building, street, area and city'
                }
                className={`${inputClass(Boolean(fieldErrors.officeAddress))} resize-none`}
              />
              <FieldError message={fieldErrors.officeAddress} />
            </div>
            <div className="md:col-span-2">
              <QuestionLabel english="Cities, communities or regions mainly served" urdu="وہ شہر، کمیونٹیز یا علاقے جہاں آپ زیادہ تر خدمات دیتے ہیں" required />
              <textarea
                rows={3}
                value={formData.areasServed}
                onChange={(event) => updateField('areasServed', event.target.value)}
                placeholder="e.g. Multan division, South Punjab, overseas Pakistanis in the UK"
                className={`${inputClass(Boolean(fieldErrors.areasServed))} resize-none`}
              />
              <FieldError message={fieldErrors.areasServed} />
            </div>
          </div>

          <div className="mt-7 space-y-7">
            <MultiChoiceGrid
              label="Countries your bureau currently serves *"
              urduLabel="آپ کا بیورو اس وقت کن ممالک میں خدمات فراہم کرتا ہے؟ *"
              options={countries}
              values={formData.countriesServed}
              onToggle={(value) => toggleArrayValue('countriesServed', value)}
              error={fieldErrors.countriesServed}
            />
            <MultiChoiceGrid
              label="Languages your team can use with families *"
              urduLabel="آپ کی ٹیم خاندانوں سے کن زبانوں میں رابطہ کر سکتی ہے؟ *"
              options={spokenLanguages}
              values={formData.languagesSpoken}
              onToggle={(value) => toggleArrayValue('languagesSpoken', value)}
              error={fieldErrors.languagesSpoken}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <SectionIntro
            eyebrow="Step 4 · Standards"
            urduEyebrow="مرحلہ 4 · معیارات"
            title="Show how you protect families and profiles"
            urduTitle="واضح کریں کہ آپ خاندانوں اور پروفائلز کا تحفظ کیسے کرتے ہیں"
            description="Strong matrimonial platforms make consent, identity checks, privacy and complaint handling visible—not just promises in marketing copy."
            urduDescription="قابلِ اعتماد میرج پلیٹ فارمز رضامندی، شناختی جانچ، رازداری اور شکایات کے طریقۂ کار کو واضح بناتے ہیں، محض تشہیری دعوے نہیں کرتے۔"
          />

          <div className="space-y-8">
            <MultiChoiceGrid
              label="Main match types handled by your bureau *"
              urduLabel="آپ کا بیورو زیادہ تر کن اقسام کے رشتوں پر کام کرتا ہے؟ *"
              helper="Select all that genuinely represent your current service."
              urduHelper="صرف وہ آپشنز منتخب کریں جو واقعی آپ کی موجودہ خدمات کی نمائندگی کرتے ہوں۔"
              options={specialisationOptions}
              values={formData.specializations}
              onToggle={(value) => toggleArrayValue('specializations', value)}
              error={fieldErrors.specializations}
            />

            <MultiChoiceGrid
              label="Where do your profiles normally come from? *"
              urduLabel="آپ کے پاس پروفائلز عموماً کن ذرائع سے آتے ہیں؟ *"
              helper="MBN may ask for evidence that candidates or their families have authorised profile use."
              urduHelper="MBN یہ ثبوت طلب کر سکتا ہے کہ امیدوار یا اس کے خاندان نے پروفائل استعمال کرنے کی اجازت دی ہے۔"
              options={profileSourceOptions}
              values={formData.profileSources}
              onToggle={(value) => toggleArrayValue('profileSources', value)}
              error={fieldErrors.profileSources}
            />

            <MultiChoiceGrid
              label="Which checks do you currently perform? *"
              urduLabel="آپ اس وقت پروفائلز کی کون کون سی تصدیق کرتے ہیں؟ *"
              options={verificationMethodOptions}
              values={formData.verificationMethods}
              onToggle={(value) => toggleArrayValue('verificationMethods', value)}
              error={fieldErrors.verificationMethods}
            />

            <ChoiceGrid
              label="How do you record permission to use a client profile? *"
              urduLabel="آپ کلائنٹ کا پروفائل استعمال کرنے کی اجازت کس طرح ریکارڈ کرتے ہیں؟ *"
              options={consentProcessOptions}
              value={formData.clientConsentProcess}
              onChange={(value) => updateField('clientConsentProcess', value)}
              error={fieldErrors.clientConsentProcess}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <QuestionLabel english="How do you protect client data and photos?" urdu="آپ کلائنٹس کے ڈیٹا اور تصاویر کا تحفظ کیسے کرتے ہیں؟" required />
                <textarea
                  rows={6}
                  value={formData.dataPrivacyPractice}
                  onChange={(event) => updateField('dataPrivacyPractice', event.target.value)}
                  placeholder="For example: restricted staff access, hidden photos, contact sharing only after approval... / مثال: محدود اسٹاف رسائی، پوشیدہ تصاویر، منظوری کے بعد رابطہ شیئر کرنا..."
                  className={`${inputClass(Boolean(fieldErrors.dataPrivacyPractice))} resize-none`}
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">{formData.dataPrivacyPractice.length} characters</p>
                <FieldError message={fieldErrors.dataPrivacyPractice} />
              </div>

              <div>
                <QuestionLabel english="How do you handle complaints or suspected misuse?" urdu="آپ شکایات یا مشتبہ غلط استعمال سے کیسے نمٹتے ہیں؟" required />
                <textarea
                  rows={6}
                  value={formData.complaintHandlingProcess}
                  onChange={(event) => updateField('complaintHandlingProcess', event.target.value)}
                  placeholder="Explain who receives complaints, how access is paused... / وضاحت کریں کہ شکایت کون وصول کرتا ہے، رسائی کیسے روکی جاتی ہے..."
                  className={`${inputClass(Boolean(fieldErrors.complaintHandlingProcess))} resize-none`}
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">{formData.complaintHandlingProcess.length} characters</p>
                <FieldError message={fieldErrors.complaintHandlingProcess} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <QuestionLabel english="Primary fee structure" urdu="بنیادی فیس کا طریقۂ کار" required />
                <select
                  value={formData.feeStructure}
                  onChange={(event) => updateField('feeStructure', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.feeStructure))}
                >
                  <option value="">Select fee model — فیس کا طریقہ منتخب کریں</option>
                  {feeModels.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
                </select>
                <FieldError message={fieldErrors.feeStructure} />
              </div>
              <div>
                <QuestionLabel english="Refund / cancellation policy" urdu="رقم واپسی / منسوخی کی پالیسی" required />
                <select
                  value={formData.refundPolicyAvailable}
                  onChange={(event) => updateField('refundPolicyAvailable', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.refundPolicyAvailable))}
                >
                  <option value="">Select policy status — پالیسی کی حیثیت منتخب کریں</option>
                  {refundOptions.map((option) => <option key={option} value={option}>{bilingualOption(option)}</option>)}
                </select>
                <FieldError message={fieldErrors.refundPolicyAvailable} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div>
          <SectionIntro
            eyebrow="Step 5 · Trust"
            urduEyebrow="مرحلہ 5 · اعتماد"
            title="Add your professional footprint and references"
            urduTitle="اپنی پیشہ ورانہ موجودگی اور حوالہ جات شامل کریں"
            description="A website is not compulsory. Genuine office listings, active social pages and references can help the review team understand your bureau history."
            urduDescription="ویب سائٹ لازمی نہیں۔ حقیقی دفتر کی لسٹنگ، فعال سوشل صفحات اور معتبر حوالہ جات جائزہ ٹیم کو آپ کے بیورو کی سابقہ سرگرمی سمجھنے میں مدد دیتے ہیں۔"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <QuestionLabel english="Website" urdu="ویب سائٹ" />
              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(event) => updateField('website', event.target.value)}
                  placeholder="https://yourbureau.com"
                  className={`${inputClass(Boolean(fieldErrors.website))} pl-11`}
                />
              </div>
              <FieldError message={fieldErrors.website} />
            </div>

            <div>
              <QuestionLabel english="Facebook / Instagram / LinkedIn" urdu="فیس بک / انسٹاگرام / لنکڈ اِن" />
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={formData.socialLink}
                  onChange={(event) => updateField('socialLink', event.target.value)}
                  placeholder="https://facebook.com/yourbureau"
                  className={`${inputClass(Boolean(fieldErrors.socialLink))} pl-11`}
                />
              </div>
              <FieldError message={fieldErrors.socialLink} />
            </div>

            <div className="md:col-span-2">
              <QuestionLabel english="Google Business / Maps link" urdu="گوگل بزنس / میپس لنک" />
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={formData.googleBusinessLink}
                  onChange={(event) => updateField('googleBusinessLink', event.target.value)}
                  placeholder="https://maps.google.com/..."
                  className={`${inputClass(Boolean(fieldErrors.googleBusinessLink))} pl-11`}
                />
              </div>
              <FieldError message={fieldErrors.googleBusinessLink} />
            </div>
          </div>

          <div className="mt-8 rounded-[30px] border border-slate-200 bg-[#fbfbf7] p-5 md:p-7">
            <div className="flex items-start gap-3">
              <Handshake className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <h3 className="font-heading text-2xl font-semibold text-[#0a4933]">Professional references</h3>
                <p dir="rtl" lang="ur" className="mt-1 text-right text-lg font-semibold text-emerald-800">پیشہ ورانہ حوالہ جات</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Provide at least one person who can confirm your bureau work. Do not list a close family member unless they are a genuine professional partner.
                </p>
                <p dir="rtl" lang="ur" className="mt-1 text-right text-sm leading-7 text-slate-600">
                  کم از کم ایک ایسے شخص کا حوالہ دیں جو آپ کے بیورو کے کام کی تصدیق کر سکے۔ قریبی رشتہ دار کو صرف اسی صورت درج کریں جب وہ واقعی آپ کا پیشہ ورانہ شراکت دار ہو۔
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <QuestionLabel english="Reference 1 — name / organisation" urdu="حوالہ نمبر 1 — نام / ادارہ" required />
                <input
                  value={formData.referenceName1}
                  onChange={(event) => updateField('referenceName1', event.target.value)}
                  placeholder="Name or organisation"
                  className={inputClass(Boolean(fieldErrors.referenceName1))}
                />
                <FieldError message={fieldErrors.referenceName1} />
              </div>
              <div>
                <QuestionLabel english="Relationship to your work" urdu="آپ کے کام سے تعلق کی نوعیت" required />
                <input
                  value={formData.referenceRelationship1}
                  onChange={(event) => updateField('referenceRelationship1', event.target.value)}
                  placeholder="e.g. client family, community leader, partner bureau"
                  className={inputClass(Boolean(fieldErrors.referenceRelationship1))}
                />
                <FieldError message={fieldErrors.referenceRelationship1} />
              </div>
              <div className="md:col-span-2">
                <QuestionLabel english="Reference 1 — contact number" urdu="حوالہ نمبر 1 — رابطہ نمبر" required />
                <input
                  dir="ltr"
                  value={formData.referencePhone1}
                  onChange={(event) => updateField('referencePhone1', event.target.value)}
                  placeholder="+92 300 1234567"
                  className={inputClass(Boolean(fieldErrors.referencePhone1))}
                />
                <FieldError message={fieldErrors.referencePhone1} />
              </div>

              <div className="md:col-span-2 my-1 h-px bg-slate-200" />

              <div>
                <QuestionLabel english="Reference 2 — name / organisation" urdu="حوالہ نمبر 2 — نام / ادارہ" />
                <input
                  value={formData.referenceName2}
                  onChange={(event) => updateField('referenceName2', event.target.value)}
                  placeholder="Optional second reference"
                  className={inputClass()}
                />
              </div>
              <div>
                <QuestionLabel english="Relationship to your work" urdu="آپ کے کام سے تعلق کی نوعیت" />
                <input
                  value={formData.referenceRelationship2}
                  onChange={(event) => updateField('referenceRelationship2', event.target.value)}
                  placeholder="Professional relationship"
                  className={inputClass()}
                />
              </div>
              <div className="md:col-span-2">
                <QuestionLabel english="Reference 2 — contact number" urdu="حوالہ نمبر 2 — رابطہ نمبر" />
                <input
                  dir="ltr"
                  value={formData.referencePhone2}
                  onChange={(event) => updateField('referencePhone2', event.target.value)}
                  placeholder="+92 300 1234567"
                  className={inputClass()}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      const businessProofRequired = formData.businessRegistrationStatus.startsWith('Registered');
      const officePhotoRequired = formData.hasPhysicalOffice === 'Yes — dedicated office';

      return (
        <div>
          <SectionIntro
            eyebrow="Step 6 · Documents"
            urduEyebrow="مرحلہ 6 · دستاویزات"
            title="Secure verification, without public exposure"
            urduTitle="عوامی نمائش کے بغیر محفوظ تصدیق"
            description="Uploads are used only for MBN’s manual review. Identity documents are never intended for the public bureau directory or profile search."
            urduDescription="اپ لوڈ شدہ دستاویزات صرف MBN کی دستی جانچ کے لیے استعمال ہوں گی۔ شناختی دستاویزات عوامی بیورو ڈائریکٹری یا پروفائل سرچ میں ظاہر نہیں کی جائیں گی۔"
          />

          <div className="mb-7 grid gap-3 md:grid-cols-3">
            {[
              [LockKeyhole, 'Private storage', 'نجی اسٹوریج', 'No public document URL', 'کوئی عوامی دستاویزی لنک نہیں'],
              [ShieldCheck, 'Manual access', 'محدود دستی رسائی', 'For authorised review only', 'صرف مجاز جانچ کے لیے'],
              [FileCheck2, 'Accepted formats', 'قابلِ قبول فارمیٹس', 'JPG, PNG, WebP or PDF', 'JPG، PNG، WebP یا PDF'],
            ].map(([Icon, title, urduTitle, description, urduDescription]) => {
              const TypedIcon = Icon as LucideIcon;
              return (
                <div key={title as string} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <TypedIcon className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-sm font-bold text-emerald-950">{title as string}</p>
                  <p dir="rtl" lang="ur" className="mt-1 text-right text-xs font-semibold text-emerald-800">{urduTitle as string}</p>
                  <p className="mt-2 text-xs text-emerald-900/65">{description as string}</p>
                  <p dir="rtl" lang="ur" className="mt-0.5 text-right text-xs text-emerald-900/65">{urduDescription as string}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <DocumentUploader
              id="identity-front"
              title={`${formData.identityType} front / main page`}
              urduTitle={`${optionUrdu[formData.identityType] ?? formData.identityType} کا سامنے والا حصہ / مرکزی صفحہ`}
              description="Clear, uncropped image showing the applicant’s name and document number."
              urduDescription="درخواست دہندہ کا نام اور دستاویز نمبر واضح دکھانے والی مکمل اور غیر کٹی ہوئی تصویر اپ لوڈ کریں۔"
              required
              document={documents.identityFront}
              onSelect={(event) => handleDocumentSelect('identityFront', event)}
              onRemove={() => removeDocument('identityFront')}
              error={fieldErrors.identityFront}
            />
            <DocumentUploader
              id="identity-back"
              title={`${formData.identityType} back / supporting page`}
              urduTitle={`${optionUrdu[formData.identityType] ?? formData.identityType} کا پچھلا حصہ / معاون صفحہ`}
              description="For a passport, upload the relevant supporting or residence page."
              urduDescription="پاسپورٹ کی صورت میں متعلقہ معاون یا رہائشی صفحہ اپ لوڈ کریں۔"
              required
              document={documents.identityBack}
              onSelect={(event) => handleDocumentSelect('identityBack', event)}
              onRemove={() => removeDocument('identityBack')}
              error={fieldErrors.identityBack}
            />
            <DocumentUploader
              id="business-proof"
              title="Business registration / tax proof"
              urduTitle="کاروباری رجسٹریشن / ٹیکس کا ثبوت"
              description="SECP certificate, trade licence, NTN evidence or another official document."
              urduDescription="SECP سرٹیفکیٹ، تجارتی لائسنس، NTN ثبوت یا کوئی دوسری سرکاری دستاویز اپ لوڈ کریں۔"
              required={businessProofRequired}
              document={documents.businessProof}
              onSelect={(event) => handleDocumentSelect('businessProof', event)}
              onRemove={() => removeDocument('businessProof')}
              error={fieldErrors.businessProof}
            />
            <DocumentUploader
              id="office-photo"
              title="Office photograph"
              urduTitle="دفتر کی تصویر"
              description="A recent exterior or reception/workspace photo; avoid showing client documents."
              urduDescription="دفتر کے بیرونی حصے، استقبالیہ یا ورک اسپیس کی حالیہ تصویر دیں؛ کلائنٹس کی دستاویزات تصویر میں نہ آئیں۔"
              required={officePhotoRequired}
              document={documents.officePhoto}
              onSelect={(event) => handleDocumentSelect('officePhoto', event)}
              onRemove={() => removeDocument('officePhoto')}
              error={fieldErrors.officePhoto}
            />
            <div className="md:col-span-2">
              <DocumentUploader
                id="business-card"
                title="Business card or bureau letterhead"
                urduTitle="بزنس کارڈ یا بیورو لیٹر ہیڈ"
                description="Optional supporting evidence showing the bureau name and professional contact details."
                urduDescription="اختیاری ثبوت جس پر بیورو کا نام اور پیشہ ورانہ رابطہ معلومات واضح ہوں۔"
                document={documents.businessCard}
                onSelect={(event) => handleDocumentSelect('businessCard', event)}
                onRemove={() => removeDocument('businessCard')}
                error={fieldErrors.businessCard}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p>
                Your text draft is saved automatically in this browser. For privacy, selected identity files are <strong>not</strong> saved in the browser and must be selected again after a refresh.
              </p>
              <p dir="rtl" lang="ur" className="mt-1 text-right">
                آپ کے تحریری جوابات اس براؤزر میں خودکار طور پر محفوظ ہوتے ہیں۔ رازداری کے لیے منتخب شناختی فائلیں براؤزر میں محفوظ <strong>نہیں</strong> ہوتیں اور صفحہ ریفریش ہونے کے بعد دوبارہ منتخب کرنا ضروری ہوگا۔
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={submitApplication}>
        <SectionIntro
          eyebrow="Step 7 · Final review"
          urduEyebrow="مرحلہ 7 · حتمی جائزہ"
          title="Review before you submit"
          urduTitle="درخواست جمع کرنے سے پہلے مکمل جائزہ لیں"
          description="Accuracy matters. MBN may reject or suspend applications containing false identities, copied business claims, unauthorised profiles or misleading verification statements."
          urduDescription="درست معلومات نہایت اہم ہیں۔ جعلی شناخت، نقل شدہ کاروباری دعووں، غیر مجاز پروفائلز یا گمراہ کن تصدیقی بیانات والی درخواست مسترد یا معطل کی جا سکتی ہے۔"
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <ReviewCard title="Applicant" urduTitle="درخواست دہندہ" icon={CircleUserRound} onEdit={() => jumpToStep(0)}>
            <ReviewItem label="Name" urduLabel="نام" value={formData.fullName} />
            <ReviewItem label="Role" urduLabel="عہدہ" value={formData.roleInBureau} />
            <ReviewItem label="Mobile" urduLabel="موبائل" value={formData.mobileNumber} />
            <ReviewItem label="Email" urduLabel="ای میل" value={formData.email} />
            <ReviewItem label="Identity" urduLabel="شناخت" value={`${formData.identityType}: ${formData.identityNumber}`} />
          </ReviewCard>

          <ReviewCard title="Bureau profile" urduTitle="بیورو کا تعارف" icon={Building2} onEdit={() => jumpToStep(1)}>
            <ReviewItem label="Bureau" urduLabel="بیورو" value={formData.businessName} />
            <ReviewItem label="Structure" urduLabel="ڈھانچہ" value={formData.bureauType} />
            <ReviewItem label="Experience" urduLabel="تجربہ" value={formData.yearsInBusiness} />
            <ReviewItem label="Active profiles" urduLabel="فعال پروفائلز" value={formData.activeProfiles} />
            <ReviewItem label="Registration" urduLabel="رجسٹریشن" value={formData.businessRegistrationStatus} />
          </ReviewCard>

          <ReviewCard title="Reach" urduTitle="دائرۂ کار" icon={MapPin} onEdit={() => jumpToStep(2)}>
            <ReviewItem label="Office" urduLabel="دفتر" value={formData.hasPhysicalOffice} />
            <ReviewItem label="Location" urduLabel="مقام" value={`${formData.city}, ${formData.province}, ${formData.country}`} />
            <ReviewItem label="Areas served" urduLabel="خدمات کے علاقے" value={formData.areasServed} />
            <ReviewItem label="Countries" urduLabel="ممالک" value={formData.countriesServed} />
            <ReviewItem label="Languages" urduLabel="زبانیں" value={formData.languagesSpoken} />
          </ReviewCard>

          <ReviewCard title="Professional standards" urduTitle="پیشہ ورانہ معیارات" icon={ShieldCheck} onEdit={() => jumpToStep(3)}>
            <ReviewItem label="Specialisations" urduLabel="خصوصی خدمات" value={formData.specializations} />
            <ReviewItem label="Profile sources" urduLabel="پروفائل کے ذرائع" value={formData.profileSources} />
            <ReviewItem label="Verification" urduLabel="تصدیق" value={formData.verificationMethods} />
            <ReviewItem label="Consent process" urduLabel="رضامندی کا طریقہ" value={formData.clientConsentProcess} />
            <ReviewItem label="Refund policy" urduLabel="رقم واپسی کی پالیسی" value={formData.refundPolicyAvailable} />
          </ReviewCard>

          <ReviewCard title="References" urduTitle="حوالہ جات" icon={Handshake} onEdit={() => jumpToStep(4)}>
            <ReviewItem label="Reference 1" urduLabel="حوالہ 1" value={formData.referenceName1} />
            <ReviewItem label="Relationship" urduLabel="تعلق" value={formData.referenceRelationship1} />
            <ReviewItem label="Contact" urduLabel="رابطہ" value={formData.referencePhone1} />
            <ReviewItem label="Reference 2" urduLabel="حوالہ 2" value={formData.referenceName2} />
          </ReviewCard>

          <ReviewCard title="Documents" urduTitle="دستاویزات" icon={FileCheck2} onEdit={() => jumpToStep(5)}>
            <ReviewItem label="Identity front" urduLabel="شناختی دستاویز کا سامنے والا حصہ" value={documents.identityFront?.file.name} />
            <ReviewItem label="Identity back" urduLabel="شناختی دستاویز کا پچھلا حصہ" value={documents.identityBack?.file.name} />
            <ReviewItem label="Business proof" urduLabel="کاروباری ثبوت" value={documents.businessProof?.file.name} />
            <ReviewItem label="Office photo" urduLabel="دفتر کی تصویر" value={documents.officePhoto?.file.name} />
            <ReviewItem label="Business card" urduLabel="بزنس کارڈ" value={documents.businessCard?.file.name} />
          </ReviewCard>
        </div>

        <div className="mt-7 rounded-[30px] border border-emerald-100 bg-emerald-50/60 p-5 md:p-7">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
            <div>
              <h3 className="font-heading text-2xl font-semibold text-[#0a4933]">Professional declaration</h3>
              <p dir="rtl" lang="ur" className="mt-1 text-right text-lg font-semibold text-emerald-800">پیشہ ورانہ اقرار</p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/70">
                These confirmations support a safer network for families and professional bureaus.
              </p>
              <p dir="rtl" lang="ur" className="mt-1 text-right text-sm leading-7 text-emerald-900/70">
                یہ تصدیقات خاندانوں اور پیشہ ور میرج بیوروز کے لیے زیادہ محفوظ نیٹ ورک قائم کرنے میں مدد دیتی ہیں۔
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                field: 'confirmProfessional' as const,
                label: 'I confirm that I am an authorised professional marriage bureau operator or representative.',
                urduLabel: 'میں تصدیق کرتا/کرتی ہوں کہ میں ایک مجاز پیشہ ور میرج بیورو آپریٹر یا نمائندہ ہوں۔',
              },
              {
                field: 'confirmAccurate' as const,
                label: 'I confirm that the application, references and uploaded documents are genuine and accurate.',
                urduLabel: 'میں تصدیق کرتا/کرتی ہوں کہ درخواست، حوالہ جات اور اپ لوڈ شدہ دستاویزات اصلی اور درست ہیں۔',
              },
              {
                field: 'confirmConsent' as const,
                label: 'I will not upload or share a candidate profile without the candidate or authorised family’s consent.',
                urduLabel: 'میں امیدوار یا مجاز خاندان کی رضامندی کے بغیر کوئی پروفائل اپ لوڈ یا شیئر نہیں کروں گا/گی۔',
              },
              {
                field: 'agreeTerms' as const,
                label: 'I agree to use MBN only for lawful matrimonial purposes and to follow MBN Pakistan’s Terms of Service, privacy rules and professional code of conduct.',
                urduLabel: 'میں MBN کو صرف قانونی ازدواجی مقاصد کے لیے استعمال کرنے اور MBN Pakistan کی شرائط، رازداری کے اصولوں اور پیشہ ورانہ ضابطۂ اخلاق کی پابندی سے اتفاق کرتا/کرتی ہوں۔',
              },
            ].map((item) => (
              <div key={item.field}>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 transition hover:border-emerald-300">
                  <input
                    type="checkbox"
                    checked={formData[item.field]}
                    onChange={(event) => updateField(item.field, event.target.checked)}
                    className="mt-1 h-4 w-4 accent-emerald-700"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-6 text-slate-700">{item.label}</span>
                    <span dir="rtl" lang="ur" className="mt-1 block text-right text-sm font-medium leading-7 text-emerald-800">{item.urduLabel}</span>
                  </span>
                </label>
                <FieldError message={fieldErrors[item.field]} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            No password is collected at this stage. An approved bureau will receive a separate secure account-activation process, preventing an unapproved application from becoming an active account.
          </p>
        </div>

        {serverError ? (
          <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{serverError}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#07533a] px-6 py-4 text-base font-black text-white shadow-[0_18px_36px_rgba(6,78,55,0.22)] transition hover:-translate-y-0.5 hover:bg-[#06452f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
          {isSubmitting ? submissionMessage || 'Submitting application…' : 'Submit for bureau verification'}
        </button>
      </form>
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f7f1] text-slate-900">
      <style jsx global>{`
        @keyframes mbnStepForward {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes mbnStepBack {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes mbnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .mbn-step-forward { animation: mbnStepForward 360ms cubic-bezier(.2,.8,.2,1) both; }
        .mbn-step-back { animation: mbnStepBack 360ms cubic-bezier(.2,.8,.2,1) both; }
        .mbn-float { animation: mbnFloat 5s ease-in-out infinite; }
      `}</style>

      <div className="relative overflow-hidden border-b border-emerald-100 bg-[#064a34] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-32 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="absolute -right-20 top-4 h-80 w-80 rounded-full bg-amber-200/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
              <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-10 w-auto object-contain" />
            </span>
            <div>
              <p className="font-heading text-xl font-semibold leading-none">MBN Pakistan</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200">
                Professional bureau network
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/how-it-works"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/15"
            >
              Sign in
            </Link>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-100">
              <Sparkles className="h-4 w-4" />
              Verified membership application
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] md:text-6xl">
              Join a more credible marriage bureau network
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50/75 md:text-lg">
              A guided application built around identity, professional history, client consent, privacy practices and real verification—not just a name and phone number.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-emerald-50/85">
              {['Private CNIC upload', 'Manual application review', 'Professional references', 'Secure activation after approval'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 ring-1 ring-white/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mbn-float rounded-[34px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Application journey</p>
                <p className="mt-2 font-heading text-2xl font-semibold">Approximately 8–12 minutes</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Clock3 className="h-6 w-6 text-emerald-100" />
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ['01', 'Tell us about you and the bureau'],
                ['02', 'Explain consent and verification practices'],
                ['03', 'Upload private identity evidence'],
                ['04', 'Receive a manual review decision'],
              ].map(([number, text]) => (
                <div key={number} className="flex items-center gap-3 rounded-2xl bg-black/10 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-200/15 text-xs font-black text-emerald-100">{number}</span>
                  <p className="text-sm font-semibold text-white/85">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={pageTopRef} className="scroll-mt-4" />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {draftRestored ? (
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <Save className="h-4 w-4" />
              Your saved questionnaire draft has been restored.
            </span>
            <button type="button" onClick={() => setDraftRestored(false)} className="text-xs font-bold underline underline-offset-2">
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="mb-5 flex items-center justify-between gap-4 lg:hidden">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
              Step {currentStep + 1} of {stepDefinitions.length}
            </p>
            <p className="mt-1 font-heading text-xl font-semibold text-[#0a4933]">
              {stepDefinitions[currentStep].title}
            </p>
            <p dir="rtl" lang="ur" className="mt-0.5 text-right text-sm font-semibold text-emerald-700">
              {stepDefinitions[currentStep].urduTitle}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">{progress}%</span>
        </div>
        <div className="mb-7 h-2 overflow-hidden rounded-full bg-slate-200 lg:hidden">
          <div className="h-full rounded-full bg-emerald-700 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:sticky lg:top-6 lg:block">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(17,68,50,0.08)]">
              <div className="bg-[#0a4c36] p-6 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Your progress</p>
                  <span className="text-sm font-black">{progress}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-emerald-200 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-4 text-xs leading-5 text-white/65">Your written answers are saved automatically on this device.</p>
              </div>

              <div className="p-3">
                {stepDefinitions.map((step, index) => {
                  const Icon = step.icon;
                  const active = index === currentStep;
                  const complete = index < currentStep || (index <= maxVisitedStep && index !== currentStep);
                  const accessible = index <= maxVisitedStep;

                  return (
                    <button
                      key={step.title}
                      type="button"
                      disabled={!accessible}
                      onClick={() => jumpToStep(index)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        active
                          ? 'bg-emerald-50 text-emerald-950'
                          : accessible
                            ? 'text-slate-600 hover:bg-slate-50'
                            : 'cursor-not-allowed text-slate-300'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                          active
                            ? 'border-emerald-200 bg-emerald-700 text-white'
                            : complete
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        {complete && !active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-wider opacity-60">Step {index + 1}</span>
                        <span className="mt-0.5 block truncate text-sm font-bold">{step.shortTitle}</span>
                        <span dir="rtl" lang="ur" className="mt-0.5 block truncate text-right text-xs font-semibold text-emerald-700/80">{step.urduShortTitle}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 p-4">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  Clear questionnaire · سوالنامہ صاف کریں
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_75px_rgba(17,68,50,0.09)]">
            <div className="border-b border-slate-100 px-5 py-4 md:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    {(() => {
                      const Icon = stepDefinitions[currentStep].icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Membership questionnaire · رکنیت کا سوالنامہ</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-700">{stepDefinitions[currentStep].description}</p>
                    <p dir="rtl" lang="ur" className="mt-0.5 text-right text-xs font-semibold text-emerald-700">{stepDefinitions[currentStep].urduDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Save className="h-4 w-4 text-emerald-600" />
                  Auto-saved · خودکار محفوظ
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8 lg:p-10">
              {serverError && currentStep !== 6 ? (
                <div className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>{serverError}</p>
                </div>
              ) : null}

              <div key={currentStep} className={direction === 'forward' ? 'mbn-step-forward' : 'mbn-step-back'}>
                {renderStep()}
              </div>
            </div>

            {currentStep < 6 ? (
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-[#fbfbf8] px-5 py-5 md:px-8">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back · واپس
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#07533a] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#06452f]"
                >
                  Continue · آگے بڑھیں
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </section>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>Private bureau membership application · MBN Pakistan</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold hover:text-emerald-700">Home</Link>
            <Link href="/how-it-works" className="font-semibold hover:text-emerald-700">How it works</Link>
            <Link href="/login" className="font-semibold hover:text-emerald-700">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
