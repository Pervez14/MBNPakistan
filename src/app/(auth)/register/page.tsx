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

const stepDefinitions: Array<{
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Applicant identity',
    shortTitle: 'Identity',
    description: 'Tell us who is responsible for this bureau application.',
    icon: CircleUserRound,
  },
  {
    title: 'Bureau profile',
    shortTitle: 'Bureau',
    description: 'Help us understand the scale and structure of your work.',
    icon: Building2,
  },
  {
    title: 'Location & reach',
    shortTitle: 'Reach',
    description: 'Where you operate and the communities you serve.',
    icon: MapPin,
  },
  {
    title: 'Professional standards',
    shortTitle: 'Standards',
    description: 'Your approach to consent, verification, privacy and complaints.',
    icon: ShieldCheck,
  },
  {
    title: 'Presence & references',
    shortTitle: 'Trust',
    description: 'Online presence and professional references for manual review.',
    icon: Handshake,
  },
  {
    title: 'Verification documents',
    shortTitle: 'Documents',
    description: 'Securely upload identity and business evidence.',
    icon: FileCheck2,
  },
  {
    title: 'Review & declaration',
    shortTitle: 'Review',
    description: 'Review everything before submitting your application.',
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
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-[#093f2c] md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

function ChoiceGrid({
  label,
  helper,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: {
  label: string;
  helper?: string;
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
        {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
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
              <span className="text-sm font-semibold leading-5">{option}</span>
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
  helper,
  options,
  values,
  onToggle,
  error,
}: {
  label: string;
  helper?: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
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
              <span className="text-sm font-semibold leading-5">{option}</span>
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
  description,
  required,
  document,
  onSelect,
  onRemove,
  error,
}: {
  id: string;
  title: string;
  description: string;
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
              <p className="font-bold text-slate-900">{title}</p>
              {required ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-rose-700">
                  Required
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Optional
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
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
            Choose image or PDF
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

function ReviewItem({ label, value }: { label: string; value: string | string[] | null | undefined }) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{displayValue || 'Not provided'}</p>
    </div>
  );
}

function ReviewCard({
  title,
  icon: Icon,
  onEdit,
  children,
}: {
  title: string;
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
          <h3 className="font-heading text-xl font-semibold text-[#0a4933]">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-800"
        >
          Edit
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
            title="Who is applying on behalf of the bureau?"
            description="Use the legal details of the person MBN can contact and verify. This person should be authorised to represent the bureau."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Full legal name *</label>
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Father / guardian name *</label>
              <input
                value={formData.fatherName}
                onChange={(event) => updateField('fatherName', event.target.value)}
                placeholder="Muhammad Aslam"
                className={inputClass(Boolean(fieldErrors.fatherName))}
              />
              <FieldError message={fieldErrors.fatherName} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Date of birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) => updateField('dateOfBirth', event.target.value)}
                className={inputClass(Boolean(fieldErrors.dateOfBirth))}
              />
              {applicantAge !== null && applicantAge >= 0 ? (
                <p className="mt-1.5 text-xs font-semibold text-emerald-700">Calculated age: {applicantAge} years</p>
              ) : null}
              <FieldError message={fieldErrors.dateOfBirth} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Role in bureau *</label>
              <select
                value={formData.roleInBureau}
                onChange={(event) => updateField('roleInBureau', event.target.value)}
                className={inputClass(Boolean(fieldErrors.roleInBureau))}
              >
                <option value="">Select your role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <FieldError message={fieldErrors.roleInBureau} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Mobile number *</label>
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
                <label className="block text-sm font-bold text-slate-800">WhatsApp number *</label>
                {formData.mobileNumber ? (
                  <button
                    type="button"
                    onClick={() => updateField('whatsappNumber', formData.mobileNumber)}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Same as mobile
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Professional email *</label>
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
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Approval and secure account-activation instructions will be sent to this address.
              </p>
              <FieldError message={fieldErrors.email} />
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 md:p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <p className="font-bold text-emerald-950">Government-issued identity</p>
                <p className="mt-1 text-sm leading-6 text-emerald-900/70">
                  Identity information is used for manual bureau verification. It will not appear on your public profile.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Document type *</label>
                <select
                  value={formData.identityType}
                  onChange={(event) => updateField('identityType', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.identityType))}
                >
                  {identityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <FieldError message={fieldErrors.identityType} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Document number *</label>
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
                <label className="mb-2 block text-sm font-bold text-slate-800">Expiry date</label>
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
            title="Build a credible bureau profile"
            description="These questions help MBN distinguish established professionals from casual or unverified operators. Approximate ranges are acceptable."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-800">Marriage bureau / business name *</label>
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Years in business *</label>
              <select
                value={formData.yearsInBusiness}
                onChange={(event) => updateField('yearsInBusiness', event.target.value)}
                className={inputClass(Boolean(fieldErrors.yearsInBusiness))}
              >
                <option value="">Select experience</option>
                {yearsOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.yearsInBusiness} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Approximate active profiles *</label>
              <select
                value={formData.activeProfiles}
                onChange={(event) => updateField('activeProfiles', event.target.value)}
                className={inputClass(Boolean(fieldErrors.activeProfiles))}
              >
                <option value="">Select a range</option>
                {activeProfileOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.activeProfiles} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">New profiles added per month *</label>
              <select
                value={formData.monthlyNewProfiles}
                onChange={(event) => updateField('monthlyNewProfiles', event.target.value)}
                className={inputClass(Boolean(fieldErrors.monthlyNewProfiles))}
              >
                <option value="">Select a range</option>
                {monthlyProfileOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.monthlyNewProfiles} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Team size *</label>
              <select
                value={formData.teamSize}
                onChange={(event) => updateField('teamSize', event.target.value)}
                className={inputClass(Boolean(fieldErrors.teamSize))}
              >
                <option value="">Select team size</option>
                {teamSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.teamSize} />
            </div>
          </div>

          <div className="mt-7 space-y-7">
            <ChoiceGrid
              label="How is your bureau structured? *"
              options={bureauTypes}
              value={formData.bureauType}
              onChange={(value) => updateField('bureauType', value)}
              error={fieldErrors.bureauType}
            />

            <ChoiceGrid
              label="How do you normally serve families? *"
              options={serviceModels}
              value={formData.serviceModel}
              onChange={(value) => updateField('serviceModel', value)}
              columns={3}
              error={fieldErrors.serviceModel}
            />

            <ChoiceGrid
              label="Business registration status *"
              helper="Formal registration is not the only approval factor, but all declarations must be accurate."
              options={registrationStatuses}
              value={formData.businessRegistrationStatus}
              onChange={(value) => updateField('businessRegistrationStatus', value)}
              error={fieldErrors.businessRegistrationStatus}
            />
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Registration number / reference</label>
              <input
                value={formData.businessRegistrationNumber}
                onChange={(event) => updateField('businessRegistrationNumber', event.target.value)}
                placeholder="SECP, trade licence or registration reference"
                className={inputClass(Boolean(fieldErrors.businessRegistrationNumber))}
              />
              <FieldError message={fieldErrors.businessRegistrationNumber} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">NTN / tax number</label>
              <input
                value={formData.ntnNumber}
                onChange={(event) => updateField('ntnNumber', event.target.value)}
                placeholder="Optional"
                className={inputClass()}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-800">Professional memberships or awards</label>
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
            title="Where do you meet and support families?"
            description="Clear location and service-area information helps MBN route suitable enquiries and verify your professional presence."
          />

          <ChoiceGrid
            label="Do you operate from a physical office? *"
            options={officeOptions}
            value={formData.hasPhysicalOffice}
            onChange={(value) => updateField('hasPhysicalOffice', value)}
            columns={3}
            error={fieldErrors.hasPhysicalOffice}
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Office phone / landline</label>
              <input
                dir="ltr"
                value={formData.officePhone}
                onChange={(event) => updateField('officePhone', event.target.value)}
                placeholder="061-1234567"
                className={inputClass()}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">City *</label>
              <input
                value={formData.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder="Multan"
                className={inputClass(Boolean(fieldErrors.city))}
              />
              <FieldError message={fieldErrors.city} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Province / region *</label>
              <select
                value={formData.province}
                onChange={(event) => updateField('province', event.target.value)}
                className={inputClass(Boolean(fieldErrors.province))}
              >
                <option value="">Select province / region</option>
                {provinces.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.province} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Country *</label>
              <select
                value={formData.country}
                onChange={(event) => updateField('country', event.target.value)}
                className={inputClass(Boolean(fieldErrors.country))}
              >
                {countries.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <FieldError message={fieldErrors.country} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-800">
                {formData.hasPhysicalOffice === 'Home-based workspace'
                  ? 'Workspace locality / area'
                  : 'Office address'}
              </label>
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Cities, communities or regions mainly served *</label>
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
              options={countries}
              values={formData.countriesServed}
              onToggle={(value) => toggleArrayValue('countriesServed', value)}
              error={fieldErrors.countriesServed}
            />
            <MultiChoiceGrid
              label="Languages your team can use with families *"
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
            title="Show how you protect families and profiles"
            description="Strong matrimonial platforms make consent, identity checks, privacy and complaint handling visible—not just promises in marketing copy."
          />

          <div className="space-y-8">
            <MultiChoiceGrid
              label="Main match types handled by your bureau *"
              helper="Select all that genuinely represent your current service."
              options={specialisationOptions}
              values={formData.specializations}
              onToggle={(value) => toggleArrayValue('specializations', value)}
              error={fieldErrors.specializations}
            />

            <MultiChoiceGrid
              label="Where do your profiles normally come from? *"
              helper="MBN may ask for evidence that candidates or their families have authorised profile use."
              options={profileSourceOptions}
              values={formData.profileSources}
              onToggle={(value) => toggleArrayValue('profileSources', value)}
              error={fieldErrors.profileSources}
            />

            <MultiChoiceGrid
              label="Which checks do you currently perform? *"
              options={verificationMethodOptions}
              values={formData.verificationMethods}
              onToggle={(value) => toggleArrayValue('verificationMethods', value)}
              error={fieldErrors.verificationMethods}
            />

            <ChoiceGrid
              label="How do you record permission to use a client profile? *"
              options={consentProcessOptions}
              value={formData.clientConsentProcess}
              onChange={(value) => updateField('clientConsentProcess', value)}
              error={fieldErrors.clientConsentProcess}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">How do you protect client data and photos? *</label>
                <textarea
                  rows={6}
                  value={formData.dataPrivacyPractice}
                  onChange={(event) => updateField('dataPrivacyPractice', event.target.value)}
                  placeholder="For example: restricted staff access, hidden photos, contact sharing only after approval, secure files and profile deletion requests."
                  className={`${inputClass(Boolean(fieldErrors.dataPrivacyPractice))} resize-none`}
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">{formData.dataPrivacyPractice.length} characters</p>
                <FieldError message={fieldErrors.dataPrivacyPractice} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">How do you handle complaints or suspected misuse? *</label>
                <textarea
                  rows={6}
                  value={formData.complaintHandlingProcess}
                  onChange={(event) => updateField('complaintHandlingProcess', event.target.value)}
                  placeholder="Explain who receives complaints, how access is paused, what records are checked and how families are informed."
                  className={`${inputClass(Boolean(fieldErrors.complaintHandlingProcess))} resize-none`}
                />
                <p className="mt-1.5 text-right text-xs text-slate-400">{formData.complaintHandlingProcess.length} characters</p>
                <FieldError message={fieldErrors.complaintHandlingProcess} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Primary fee structure *</label>
                <select
                  value={formData.feeStructure}
                  onChange={(event) => updateField('feeStructure', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.feeStructure))}
                >
                  <option value="">Select fee model</option>
                  {feeModels.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <FieldError message={fieldErrors.feeStructure} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Refund / cancellation policy *</label>
                <select
                  value={formData.refundPolicyAvailable}
                  onChange={(event) => updateField('refundPolicyAvailable', event.target.value)}
                  className={inputClass(Boolean(fieldErrors.refundPolicyAvailable))}
                >
                  <option value="">Select policy status</option>
                  {refundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
            title="Add your professional footprint and references"
            description="A website is not compulsory. Genuine office listings, active social pages and references can help the review team understand your bureau history."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">Website</label>
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Facebook / Instagram / LinkedIn</label>
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
              <label className="mb-2 block text-sm font-bold text-slate-800">Google Business / Maps link</label>
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
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Provide at least one person who can confirm your bureau work. Do not list a close family member unless they are a genuine professional partner.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Reference 1 — name / organisation *</label>
                <input
                  value={formData.referenceName1}
                  onChange={(event) => updateField('referenceName1', event.target.value)}
                  placeholder="Name or organisation"
                  className={inputClass(Boolean(fieldErrors.referenceName1))}
                />
                <FieldError message={fieldErrors.referenceName1} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Relationship to your work *</label>
                <input
                  value={formData.referenceRelationship1}
                  onChange={(event) => updateField('referenceRelationship1', event.target.value)}
                  placeholder="e.g. client family, community leader, partner bureau"
                  className={inputClass(Boolean(fieldErrors.referenceRelationship1))}
                />
                <FieldError message={fieldErrors.referenceRelationship1} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-800">Reference 1 — contact number *</label>
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
                <label className="mb-2 block text-sm font-bold text-slate-800">Reference 2 — name / organisation</label>
                <input
                  value={formData.referenceName2}
                  onChange={(event) => updateField('referenceName2', event.target.value)}
                  placeholder="Optional second reference"
                  className={inputClass()}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Relationship to your work</label>
                <input
                  value={formData.referenceRelationship2}
                  onChange={(event) => updateField('referenceRelationship2', event.target.value)}
                  placeholder="Professional relationship"
                  className={inputClass()}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-800">Reference 2 — contact number</label>
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
            title="Secure verification, without public exposure"
            description="Uploads are used only for MBN’s manual review. Identity documents are never intended for the public bureau directory or profile search."
          />

          <div className="mb-7 grid gap-3 md:grid-cols-3">
            {[
              [LockKeyhole, 'Private storage', 'No public document URL'],
              [ShieldCheck, 'Manual access', 'For authorised review only'],
              [FileCheck2, 'Accepted formats', 'JPG, PNG, WebP or PDF'],
            ].map(([Icon, title, description]) => {
              const TypedIcon = Icon as LucideIcon;
              return (
                <div key={title as string} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <TypedIcon className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-sm font-bold text-emerald-950">{title as string}</p>
                  <p className="mt-1 text-xs text-emerald-900/65">{description as string}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <DocumentUploader
              id="identity-front"
              title={`${formData.identityType} front / main page`}
              description="Clear, uncropped image showing the applicant’s name and document number."
              required
              document={documents.identityFront}
              onSelect={(event) => handleDocumentSelect('identityFront', event)}
              onRemove={() => removeDocument('identityFront')}
              error={fieldErrors.identityFront}
            />
            <DocumentUploader
              id="identity-back"
              title={`${formData.identityType} back / supporting page`}
              description="For a passport, upload the relevant supporting or residence page."
              required
              document={documents.identityBack}
              onSelect={(event) => handleDocumentSelect('identityBack', event)}
              onRemove={() => removeDocument('identityBack')}
              error={fieldErrors.identityBack}
            />
            <DocumentUploader
              id="business-proof"
              title="Business registration / tax proof"
              description="SECP certificate, trade licence, NTN evidence or another official document."
              required={businessProofRequired}
              document={documents.businessProof}
              onSelect={(event) => handleDocumentSelect('businessProof', event)}
              onRemove={() => removeDocument('businessProof')}
              error={fieldErrors.businessProof}
            />
            <DocumentUploader
              id="office-photo"
              title="Office photograph"
              description="A recent exterior or reception/workspace photo; avoid showing client documents."
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
                description="Optional supporting evidence showing the bureau name and professional contact details."
                document={documents.businessCard}
                onSelect={(event) => handleDocumentSelect('businessCard', event)}
                onRemove={() => removeDocument('businessCard')}
                error={fieldErrors.businessCard}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Your text draft is saved automatically in this browser. For privacy, selected identity files are <strong>not</strong> saved in the browser and must be selected again after a refresh.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={submitApplication}>
        <SectionIntro
          eyebrow="Step 7 · Final review"
          title="Review before you submit"
          description="Accuracy matters. MBN may reject or suspend applications containing false identities, copied business claims, unauthorised profiles or misleading verification statements."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <ReviewCard title="Applicant" icon={CircleUserRound} onEdit={() => jumpToStep(0)}>
            <ReviewItem label="Name" value={formData.fullName} />
            <ReviewItem label="Role" value={formData.roleInBureau} />
            <ReviewItem label="Mobile" value={formData.mobileNumber} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="Identity" value={`${formData.identityType}: ${formData.identityNumber}`} />
          </ReviewCard>

          <ReviewCard title="Bureau profile" icon={Building2} onEdit={() => jumpToStep(1)}>
            <ReviewItem label="Bureau" value={formData.businessName} />
            <ReviewItem label="Structure" value={formData.bureauType} />
            <ReviewItem label="Experience" value={formData.yearsInBusiness} />
            <ReviewItem label="Active profiles" value={formData.activeProfiles} />
            <ReviewItem label="Registration" value={formData.businessRegistrationStatus} />
          </ReviewCard>

          <ReviewCard title="Reach" icon={MapPin} onEdit={() => jumpToStep(2)}>
            <ReviewItem label="Office" value={formData.hasPhysicalOffice} />
            <ReviewItem label="Location" value={`${formData.city}, ${formData.province}, ${formData.country}`} />
            <ReviewItem label="Areas served" value={formData.areasServed} />
            <ReviewItem label="Countries" value={formData.countriesServed} />
            <ReviewItem label="Languages" value={formData.languagesSpoken} />
          </ReviewCard>

          <ReviewCard title="Professional standards" icon={ShieldCheck} onEdit={() => jumpToStep(3)}>
            <ReviewItem label="Specialisations" value={formData.specializations} />
            <ReviewItem label="Profile sources" value={formData.profileSources} />
            <ReviewItem label="Verification" value={formData.verificationMethods} />
            <ReviewItem label="Consent process" value={formData.clientConsentProcess} />
            <ReviewItem label="Refund policy" value={formData.refundPolicyAvailable} />
          </ReviewCard>

          <ReviewCard title="References" icon={Handshake} onEdit={() => jumpToStep(4)}>
            <ReviewItem label="Reference 1" value={formData.referenceName1} />
            <ReviewItem label="Relationship" value={formData.referenceRelationship1} />
            <ReviewItem label="Contact" value={formData.referencePhone1} />
            <ReviewItem label="Reference 2" value={formData.referenceName2} />
          </ReviewCard>

          <ReviewCard title="Documents" icon={FileCheck2} onEdit={() => jumpToStep(5)}>
            <ReviewItem label="Identity front" value={documents.identityFront?.file.name} />
            <ReviewItem label="Identity back" value={documents.identityBack?.file.name} />
            <ReviewItem label="Business proof" value={documents.businessProof?.file.name} />
            <ReviewItem label="Office photo" value={documents.officePhoto?.file.name} />
            <ReviewItem label="Business card" value={documents.businessCard?.file.name} />
          </ReviewCard>
        </div>

        <div className="mt-7 rounded-[30px] border border-emerald-100 bg-emerald-50/60 p-5 md:p-7">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
            <div>
              <h3 className="font-heading text-2xl font-semibold text-[#0a4933]">Professional declaration</h3>
              <p className="mt-1 text-sm leading-6 text-emerald-900/70">
                These confirmations support a safer network for families and professional bureaus.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                field: 'confirmProfessional' as const,
                label: 'I confirm that I am an authorised professional marriage bureau operator or representative.',
              },
              {
                field: 'confirmAccurate' as const,
                label: 'I confirm that the application, references and uploaded documents are genuine and accurate.',
              },
              {
                field: 'confirmConsent' as const,
                label: 'I will not upload or share a candidate profile without the candidate or authorised family’s consent.',
              },
              {
                field: 'agreeTerms' as const,
                label: 'I agree to use MBN only for lawful matrimonial purposes and to follow MBN Pakistan’s Terms of Service, privacy rules and professional code of conduct.',
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
                  <span className="text-sm font-medium leading-6 text-slate-700">{item.label}</span>
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
                  Clear questionnaire
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
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Membership questionnaire</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-700">{stepDefinitions[currentStep].description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Save className="h-4 w-4 text-emerald-600" />
                  Auto-saved
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
                  Back
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#07533a] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#06452f]"
                >
                  Continue
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
