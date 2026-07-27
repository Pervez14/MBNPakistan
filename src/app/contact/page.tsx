'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Facebook,
  FileQuestion,
  Globe2,
  Headphones,
  HelpCircle,
  Instagram,
  LifeBuoy,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

type InquiryType =
  | 'General Question'
  | 'Bureau Application'
  | 'Account Approval'
  | 'Profile Submission'
  | 'Technical Support'
  | 'Privacy Concern'
  | 'Partnership';

type ContactForm = {
  fullName: string;
  email: string;
  phone: string;
  bureauName: string;
  inquiryType: InquiryType;
  message: string;
};

const initialForm: ContactForm = {
  fullName: '',
  email: '',
  phone: '',
  bureauName: '',
  inquiryType: 'General Question',
  message: '',
};

const inquiryOptions: Array<{
  value: InquiryType;
  label: string;
  urdu: string;
  icon: ReactNode;
}> = [
  {
    value: 'General Question',
    label: 'General Question',
    urdu: 'عمومی سوال',
    icon: <HelpCircle className="h-5 w-5" />,
  },
  {
    value: 'Bureau Application',
    label: 'Bureau Application',
    urdu: 'بیورو درخواست',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    value: 'Account Approval',
    label: 'Account Approval',
    urdu: 'اکاؤنٹ منظوری',
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    value: 'Profile Submission',
    label: 'Profile Submission',
    urdu: 'پروفائل جمع کروانا',
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    value: 'Technical Support',
    label: 'Technical Support',
    urdu: 'تکنیکی معاونت',
    icon: <LifeBuoy className="h-5 w-5" />,
  },
  {
    value: 'Privacy Concern',
    label: 'Privacy Concern',
    urdu: 'رازداری سے متعلق مسئلہ',
    icon: <LockKeyhole className="h-5 w-5" />,
  },
  {
    value: 'Partnership',
    label: 'Partnership',
    urdu: 'شراکت داری',
    icon: <UsersRound className="h-5 w-5" />,
  },
];

const faqs = [
  {
    en: 'I submitted a bureau application. How do I ask about its status?',
    ur: 'میں نے بیورو کی درخواست جمع کروائی ہے، اس کی حیثیت کیسے معلوم کروں؟',
    answerEn:
      'Select “Account Approval”, enter the same email and phone number used in your application, and include your bureau name. This helps the team locate your record accurately.',
    answerUr:
      '“اکاؤنٹ منظوری” منتخب کریں، درخواست میں استعمال کیا گیا وہی ای میل اور فون نمبر درج کریں اور اپنے بیورو کا نام بھی لکھیں تاکہ ٹیم آپ کا ریکارڈ درست طور پر تلاش کر سکے۔',
  },
  {
    en: 'Can a family contact MBN Pakistan about a submitted profile?',
    ur: 'کیا خاندان جمع کروائی گئی پروفائل کے بارے میں رابطہ کر سکتا ہے؟',
    answerEn:
      'Yes. Select “Profile Submission” and mention the private profile reference number in your message. Do not send CNIC images or highly sensitive information through the message box.',
    answerUr:
      'جی ہاں۔ “پروفائل جمع کروانا” منتخب کریں اور اپنے پیغام میں نجی پروفائل ریفرنس نمبر درج کریں۔ پیغام کے خانے میں شناختی کارڈ کی تصاویر یا انتہائی حساس معلومات نہ بھیجیں۔',
  },
  {
    en: 'Where should I report a privacy or misuse concern?',
    ur: 'رازداری یا معلومات کے غلط استعمال کی شکایت کہاں درج کی جائے؟',
    answerEn:
      'Choose “Privacy Concern” and provide the profile code, relevant bureau name and a clear description of the concern. Avoid sharing unnecessary personal information.',
    answerUr:
      '“رازداری سے متعلق مسئلہ” منتخب کریں اور پروفائل کوڈ، متعلقہ بیورو کا نام اور مسئلے کی واضح تفصیل لکھیں۔ غیر ضروری ذاتی معلومات شامل نہ کریں۔',
  },
  {
    en: 'I am an approved bureau and cannot login. What should I include?',
    ur: 'میرا بیورو منظور شدہ ہے مگر لاگ اِن نہیں ہو رہا، کیا معلومات دوں؟',
    answerEn:
      'Select “Technical Support” and include your registered email, bureau name, the page where the issue occurs and the exact error message. Never send your password.',
    answerUr:
      '“تکنیکی معاونت” منتخب کریں اور رجسٹرڈ ای میل، بیورو کا نام، مسئلہ والی اسکرین اور اصل ایرر میسج لکھیں۔ اپنا پاس ورڈ کبھی نہ بھیجیں۔',
  },
];

export default function ContactPage() {
  const { language, setLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage('');
  };

  const chooseInquiry = (value: InquiryType) => {
    setFormData((current) => ({ ...current, inquiryType: value }));
  };

  const submitMessage = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      if (!formData.fullName.trim()) {
        throw new Error(isUrdu ? 'براہِ کرم اپنا مکمل نام درج کریں۔' : 'Please enter your full name.');
      }
      if (!formData.email.trim()) {
        throw new Error(isUrdu ? 'براہِ کرم اپنا ای میل ایڈریس درج کریں۔' : 'Please enter your email address.');
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
        throw new Error(isUrdu ? 'براہِ کرم درست ای میل ایڈریس درج کریں۔' : 'Please enter a valid email address.');
      }
      if (formData.message.trim().length < 20) {
        throw new Error(
          isUrdu
            ? 'براہِ کرم کم از کم 20 حروف میں مسئلے کی واضح تفصیل لکھیں۔'
            : 'Please describe your request clearly using at least 20 characters.'
        );
      }

      const { error } = await supabase.from('contact_messages').insert({
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        bureau_name: formData.bureauName.trim() || null,
        inquiry_type: formData.inquiryType,
        message: formData.message.trim(),
        status: 'new',
      });

      if (error) throw error;

      setSuccessMessage(
        isUrdu
          ? 'آپ کا پیغام کامیابی سے موصول ہو گیا ہے۔ MBN Pakistan ٹیم اس کا جائزہ لے گی۔'
          : 'Your message has been received successfully. The MBN Pakistan team will review it.'
      );
      setFormData(initialForm);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : isUrdu
            ? 'پیغام ارسال نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔'
            : 'Your message could not be sent. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen overflow-x-hidden bg-[#f7faf8] text-slate-950">
      <PublicHeader
        language={language}
        setLanguage={setLanguage}
        isUrdu={isUrdu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main>
        <section className="relative overflow-hidden bg-[#073b2a] text-white">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.24),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(52,211,153,.3),transparent_30%)]" />
          <div className="absolute -left-24 top-1/2 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-emerald-200/15" />

          <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-50 backdrop-blur">
                <Headphones className="h-4 w-4" />
                {isUrdu ? 'MBN Pakistan معاونت' : 'MBN Pakistan Support'}
              </span>

              <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                {isUrdu ? 'آپ کے سوال کا درست راستہ، ایک ہی جگہ' : 'The right place for support, guidance and responsible contact'}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50/78 md:text-lg">
                {isUrdu
                  ? 'خاندانی پروفائل، بیورو درخواست، اکاؤنٹ منظوری، تکنیکی معاونت یا رازداری سے متعلق مسئلے کے لیے متعلقہ موضوع منتخب کریں اور واضح پیغام بھیجیں۔'
                  : 'Choose the relevant topic for a family profile, bureau application, account approval, technical support, privacy concern or professional partnership.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/923036684534"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#073b2a] shadow-lg transition hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isUrdu ? 'واٹس ایپ رابطہ' : 'Contact on WhatsApp'}
                </a>
                <a
                  href="tel:03036684534"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Phone className="h-4 w-4" /> 03036684534
                </a>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-white">{isUrdu ? 'محفوظ رابطہ رہنمائی' : 'Contact safely'}</p>
                  <p className="mt-1 text-xs text-emerald-100/70">
                    {isUrdu ? 'حساس معلومات پیغام میں شامل نہ کریں' : 'Do not include unnecessary sensitive information'}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <HeroCheck text={isUrdu ? 'اپنا پاس ورڈ کبھی شیئر نہ کریں' : 'Never share your password'} />
                <HeroCheck text={isUrdu ? 'پروفائل کے لیے صرف ریفرنس کوڈ درج کریں' : 'Use only the private reference code for profile queries'} />
                <HeroCheck text={isUrdu ? 'مسئلے کی واضح اور مختصر تفصیل لکھیں' : 'Provide a clear and relevant description'} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
          <div data-reveal className="reveal text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
              {isUrdu ? 'پہلے موضوع منتخب کریں' : 'Start with the right topic'}
            </span>
            <h2 className="mx-auto mt-3 max-w-3xl font-heading text-3xl font-black text-[#073b2a] md:text-4xl">
              {isUrdu ? 'آپ کس معاملے میں رابطہ کر رہے ہیں؟' : 'What can the MBN Pakistan team help you with?'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              {isUrdu
                ? 'صحیح موضوع منتخب کرنے سے آپ کا پیغام متعلقہ ریکارڈ کے ساتھ بہتر طور پر سمجھا جا سکتا ہے۔'
                : 'Selecting the right topic helps your message reach the relevant workflow with the correct context.'}
            </p>
          </div>

          <div data-reveal className="reveal mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {inquiryOptions.map((option) => {
              const selected = formData.inquiryType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => chooseInquiry(option.value)}
                  className={`group rounded-[22px] border p-4 text-left transition duration-300 ${
                    selected
                      ? 'border-emerald-700 bg-emerald-700 text-white shadow-lg shadow-emerald-900/10'
                      : 'border-slate-200 bg-white text-slate-800 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md'
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${selected ? 'bg-white/14 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    {option.icon}
                  </div>
                  <p className="mt-4 text-sm font-black">{option.label}</p>
                  <p dir="rtl" className={`mt-1 text-xs ${selected ? 'text-emerald-100/80' : 'text-slate-400'}`}>
                    {option.urdu}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8 md:pb-24">
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_390px]">
            <form
              data-reveal
              onSubmit={submitMessage}
              className="reveal overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.04]"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-6 md:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                      <MessageCircle className="h-3.5 w-3.5" /> {formData.inquiryType}
                    </span>
                    <h2 className="mt-4 font-heading text-2xl font-black text-slate-950 md:text-3xl">
                      {isUrdu ? 'اپنا پیغام بھیجیں' : 'Send a clear support message'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {isUrdu
                        ? 'ستارے (*) والے خانے لازمی ہیں۔ درست معلومات ٹیم کو آپ کا معاملہ بہتر طور پر سمجھنے میں مدد دیتی ہیں۔'
                        : 'Fields marked with an asterisk are required. Accurate information helps the team understand your request.'}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#073b2a] text-white">
                    <Send className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                {errorMessage && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <BilingualField label="Full Name" urdu="مکمل نام" required>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={updateField}
                      autoComplete="name"
                      className="field-control"
                      placeholder={isUrdu ? 'اپنا مکمل نام درج کریں' : 'Enter your full name'}
                    />
                  </BilingualField>

                  <BilingualField label="Email Address" urdu="ای میل ایڈریس" required>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={updateField}
                      autoComplete="email"
                      dir="ltr"
                      className="field-control"
                      placeholder="you@example.com"
                    />
                  </BilingualField>

                  <BilingualField label="Phone / WhatsApp" urdu="فون یا واٹس ایپ نمبر">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={updateField}
                      autoComplete="tel"
                      dir="ltr"
                      className="field-control"
                      placeholder="+92..."
                    />
                  </BilingualField>

                  <BilingualField label="Marriage Bureau Name" urdu="میرج بیورو کا نام" hint="Complete only when relevant">
                    <input
                      name="bureauName"
                      value={formData.bureauName}
                      onChange={updateField}
                      className="field-control"
                      placeholder={isUrdu ? 'اپنے بیورو کا نام' : 'Your bureau name'}
                    />
                  </BilingualField>

                  <div className="md:col-span-2">
                    <BilingualField label="Inquiry Type" urdu="رابطے کی نوعیت" required>
                      <div className="relative">
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={updateField}
                          className="field-control appearance-none pr-12"
                        >
                          {inquiryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} — {option.urdu}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </BilingualField>
                  </div>

                  <div className="md:col-span-2">
                    <BilingualField
                      label="How can we help?"
                      urdu="ہم آپ کی کیا مدد کر سکتے ہیں؟"
                      required
                      hint="Include a profile reference, bureau name or exact error only when relevant. Never include a password."
                    >
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={updateField}
                        rows={7}
                        className="field-control resize-none"
                        placeholder={
                          isUrdu
                            ? 'اپنے سوال یا مسئلے کی واضح تفصیل لکھیں۔ پاس ورڈ یا غیر ضروری حساس معلومات شامل نہ کریں۔'
                            : 'Describe your question or issue clearly. Do not include a password or unnecessary sensitive information.'
                        }
                      />
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{isUrdu ? 'کم از کم 20 حروف' : 'Minimum 20 characters'}</span>
                        <span dir="ltr">{formData.message.length}</span>
                      </div>
                    </BilingualField>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                    <div>
                      <p className="font-black text-amber-950">
                        {isUrdu ? 'حساس معلومات محفوظ رکھیں' : 'Keep sensitive information private'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-900/75">
                        {isUrdu
                          ? 'اس فارم میں پاس ورڈ، مکمل شناختی کارڈ نمبر، بینک معلومات یا غیر ضروری نجی تصاویر درج نہ کریں۔'
                          : 'Do not enter passwords, full identity-document numbers, banking information or unnecessary private images in this form.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSubmitting
                    ? isUrdu ? 'پیغام بھیجا جا رہا ہے…' : 'Sending message…'
                    : isUrdu ? 'محفوظ طریقے سے پیغام بھیجیں' : 'Send message securely'}
                </button>
              </div>
            </form>

            <aside data-reveal className="reveal space-y-5 lg:sticky lg:top-24">
              <ContactCard
                icon={<Phone className="h-5 w-5" />}
                title={isUrdu ? 'فون اور واٹس ایپ' : 'Phone & WhatsApp'}
                subtitle={isUrdu ? 'براہِ راست رابطہ' : 'Direct contact'}
              >
                <a href="tel:03036684534" dir="ltr" className="block text-lg font-black text-emerald-950 hover:text-emerald-700">
                  03036684534
                </a>
                <a
                  href="https://wa.me/923036684534"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-800"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </ContactCard>

              <ContactCard
                icon={<Globe2 className="h-5 w-5" />}
                title={isUrdu ? 'ویب سائٹ' : 'Website'}
                subtitle={isUrdu ? 'آفیشل پلیٹ فارم' : 'Official platform'}
              >
                <a href="https://www.mbnpakistan.com" target="_blank" rel="noreferrer" dir="ltr" className="font-black text-emerald-950 hover:text-emerald-700">
                  www.mbnpakistan.com
                </a>
              </ContactCard>

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                  {isUrdu ? 'سوشل میڈیا' : 'Official social channels'}
                </p>
                <div className="mt-4 space-y-3">
                  <SocialRow icon={<Instagram className="h-5 w-5" />} label="Instagram" value="MBNPakistan" />
                  <SocialRow icon={<Facebook className="h-5 w-5" />} label="Facebook" value="Marriage Bureau Network - MBN Pakistan" />
                </div>
              </div>

              <div className="rounded-[26px] bg-[#073b2a] p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-emerald-200" />
                  <p className="font-black">{isUrdu ? 'پیغام کا جائزہ' : 'Message review'}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-50/72">
                  {isUrdu
                    ? 'ہر پیغام متعلقہ معلومات کے ساتھ ٹیم کے جائزے کے لیے محفوظ کیا جاتا ہے۔ پیچیدہ معاملات میں مزید وضاحت طلب کی جا سکتی ہے۔'
                    : 'Messages are stored for team review with their relevant context. Complex requests may require additional clarification.'}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
            <div data-reveal className="reveal grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                  {isUrdu ? 'فوری رہنمائی' : 'Quick guidance'}
                </span>
                <h2 className="mt-3 font-heading text-3xl font-black text-[#073b2a] md:text-4xl">
                  {isUrdu ? 'پیغام بھیجنے سے پہلے' : 'Before you send a message'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {isUrdu
                    ? 'درست موضوع اور متعلقہ حوالہ شامل کرنے سے مسئلہ زیادہ واضح ہوتا ہے، مگر صرف اتنی معلومات دیں جتنی ضروری ہو۔'
                    : 'A relevant topic and reference make your request clearer, but only provide information necessary for the issue.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <GuidanceCard
                  icon={<FileQuestion className="h-5 w-5" />}
                  title={isUrdu ? 'پروفائل کا معاملہ' : 'Profile enquiry'}
                  text={isUrdu ? 'نجی ریفرنس یا پروفائل کوڈ شامل کریں۔' : 'Include the private reference or profile code.'}
                />
                <GuidanceCard
                  icon={<Building2 className="h-5 w-5" />}
                  title={isUrdu ? 'بیورو درخواست' : 'Bureau application'}
                  text={isUrdu ? 'رجسٹرڈ ای میل اور بیورو نام لکھیں۔' : 'Use the registered email and bureau name.'}
                />
                <GuidanceCard
                  icon={<LifeBuoy className="h-5 w-5" />}
                  title={isUrdu ? 'تکنیکی مسئلہ' : 'Technical issue'}
                  text={isUrdu ? 'صفحہ، عمل اور اصل ایرر میسج لکھیں۔' : 'Mention the page, action and exact error message.'}
                />
                <GuidanceCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title={isUrdu ? 'رازداری کا مسئلہ' : 'Privacy concern'}
                  text={isUrdu ? 'واقعے کی واضح مگر محدود تفصیل دیں۔' : 'Provide a clear but limited description of the concern.'}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-4 py-16 md:px-8 md:py-24">
          <div data-reveal className="reveal text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">FAQ</span>
            <h2 className="mt-3 font-heading text-3xl font-black text-[#073b2a] md:text-4xl">
              {isUrdu ? 'رابطے سے متعلق عام سوالات' : 'Common contact and support questions'}
            </h2>
          </div>

          <div data-reveal className="reveal mt-9 space-y-3">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.en} className={`overflow-hidden rounded-[22px] border bg-white transition ${open ? 'border-emerald-200 shadow-md' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left md:px-6"
                  >
                    <div>
                      <p className="font-black text-slate-900">{isUrdu ? faq.ur : faq.en}</p>
                      <p dir="rtl" className="mt-1 text-xs text-slate-400">{isUrdu ? faq.en : faq.ur}</p>
                    </div>
                    <ChevronDown className={`mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700 transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 md:px-6">
                        <p>{isUrdu ? faq.answerUr : faq.answerEn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-10 md:px-8 md:pb-16">
          <div data-reveal className="reveal mx-auto max-w-[1320px] overflow-hidden rounded-[34px] bg-gradient-to-br from-[#073b2a] to-[#168a58] px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald-200">
                  <Sparkles className="h-4 w-4" /> {isUrdu ? 'اگلا قدم' : 'Choose your next step'}
                </span>
                <h2 className="mt-3 font-heading text-3xl font-black md:text-4xl">
                  {isUrdu ? 'پروفائل جمع کروائیں یا پروفیشنل بیورو نیٹ ورک میں شامل ہوں' : 'Submit a private profile or apply to join the professional bureau network'}
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-emerald-900 hover:bg-emerald-50">
                  <UserRound className="h-4 w-4" /> {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit a Profile'}
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white hover:bg-white/15">
                  <Building2 className="h-4 w-4" /> {isUrdu ? 'بیورو کے طور پر درخواست دیں' : 'Apply as a Bureau'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} />

      <style jsx global>{`
        .field-control {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #dbe3df;
          background: #ffffff;
          padding: 0.9rem 1rem;
          color: #0f172a;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
        }
        .field-control::placeholder { color: #94a3b8; }
        .field-control:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
        }
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.is-visible { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
}

function BilingualField({
  label,
  urdu,
  required = false,
  hint,
  children,
}: {
  label: string;
  urdu: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-black text-slate-800">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          <span dir="rtl" className="mt-0.5 block text-xs text-emerald-700/70">{urdu}</span>
        </span>
        {hint && <span className="max-w-[190px] text-right text-[10px] leading-4 text-slate-400">{hint}</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function HeroCheck({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300 text-emerald-950">
        <Check className="h-3 w-3" />
      </span>
      <p className="text-sm font-semibold leading-6 text-emerald-50/85">{text}</p>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{icon}</div>
        <div>
          <p className="font-black text-slate-900">{title}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4">{children}</div>
    </div>
  );
}

function SocialRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <p dir="ltr" className="mt-0.5 break-words text-sm font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function GuidanceCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[#f8fbf9] p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/45">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">{icon}</div>
      <h3 className="mt-4 font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function PublicHeader({
  language,
  setLanguage,
  isUrdu,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  language: string;
  setLanguage: (language: string) => void;
  isUrdu: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const navItems = [
    { label: isUrdu ? 'ہوم' : 'Home', href: '/' },
    { label: isUrdu ? 'یہ کیسے کام کرتا ہے' : 'How It Works', href: '/how-it-works' },
    { label: isUrdu ? 'خاندانوں کے لیے' : 'For Families', href: '/for-families' },
    { label: isUrdu ? 'بیوروز کے لیے' : 'For Bureaus', href: '/for-bureaus' },
    { label: isUrdu ? 'ہمارے بارے میں' : 'About Us', href: '/about' },
    { label: isUrdu ? 'رابطہ کریں' : 'Contact', href: '/contact', active: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-12 w-auto max-w-[190px] object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-700 xl:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={item.active ? 'text-emerald-700' : 'transition hover:text-emerald-700'}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <Link href="/login" className="hidden rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-black text-emerald-800 hover:bg-emerald-50 sm:inline-flex">
            {isUrdu ? 'بیورو لاگ اِن' : 'Bureau Login'}
          </Link>
          <Link href="/submit-profile" className="hidden rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-800 md:inline-flex">
            {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Profile'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 xl:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 xl:hidden">
          <nav className="mx-auto grid max-w-[1440px] gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 md:hidden">
              <Link href="/login" className="rounded-xl border border-emerald-700 px-3 py-3 text-center text-sm font-black text-emerald-800">
                {isUrdu ? 'بیورو لاگ اِن' : 'Bureau Login'}
              </Link>
              <Link href="/submit-profile" className="rounded-xl bg-emerald-700 px-3 py-3 text-center text-sm font-black text-white">
                {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Profile'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ isUrdu }: { isUrdu: boolean }) {
  return (
    <footer className="bg-[#052e21] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div>
          <img src="/mbn-logo.png" alt="MBN Pakistan" className="h-16 w-auto rounded-xl bg-white p-2 object-contain" />
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/70">
            {isUrdu
              ? 'خاندانوں اور پروفیشنل میرج بیوروز کے لیے باوقار، منظم اور رازداری پر مبنی ڈیجیٹل نیٹ ورک۔'
              : 'A respectful, organised and privacy-focused digital network for families and professional marriage bureaus.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-emerald-50/75">
            <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" /> www.mbnpakistan.com</span>
            <span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> MBNPakistan</span>
            <span className="inline-flex items-center gap-2"><Facebook className="h-4 w-4" /> Marriage Bureau Network - MBN Pakistan</span>
            <span className="inline-flex items-center gap-2" dir="ltr"><Phone className="h-4 w-4" /> 03036684534</span>
          </div>
        </div>
        <p className="text-xs text-emerald-50/50">© {new Date().getFullYear()} MBN Pakistan. {isUrdu ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved.'}</p>
      </div>
    </footer>
  );
}
