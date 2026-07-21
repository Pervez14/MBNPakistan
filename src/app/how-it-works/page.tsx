'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Eye,
  HeartHandshake,
  Lock,
  Network,
  Search,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

export default function HowItWorksPage() {
  const { language, setLanguage, isUrdu } = useLanguage();

  const familySteps = [
    {
      title: isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Your Profile',
      text: isUrdu
        ? 'فرد یا خاندان اپنی معلومات، تعلیم، پیشہ، خاندانی تفصیل، ترجیحات اور تصویر محفوظ فارم کے ذریعے جمع کرواتا ہے۔'
        : 'An individual or family submits personal, education, career, family, preference and photo details through the secure form.',
      icon: <HeartHandshake className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'MBN ٹیم جائزہ لیتی ہے' : 'MBN Team Reviews',
      text: isUrdu
        ? 'سبمیشن فوراً پبلک نہیں ہوتی۔ MBN Pakistan معلومات کا جائزہ لیتا ہے اور ضرورت ہو تو مزید تفصیل کے لیے رابطہ کرتا ہے۔'
        : 'The submission is not published automatically. MBN Pakistan reviews it and may contact the submitter for more information.',
      icon: <ShieldCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'مناسب بیورو یا میچ میکر کو اسائنمنٹ' : 'Assignment to a Suitable Bureau',
      text: isUrdu
        ? 'ریویو کے بعد پروفائل کسی مناسب تصدیق شدہ میرج بیورو یا میچ میکر کو اسائن کی جا سکتی ہے۔'
        : 'After review, the profile may be assigned to a suitable verified marriage bureau or matchmaker.',
      icon: <UserCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'فالو اپ اور میچنگ' : 'Follow-up & Matching',
      text: isUrdu
        ? 'اسائن شدہ ٹیم مناسب رشتوں پر کام کرتی ہے، دلچسپی اور فالو اپ ریکارڈ کرتی ہے، اور خاندان کو ضرورت کے مطابق اپڈیٹ کرتی ہے۔'
        : 'The assigned team works on suitable matches, records interest and follow-ups, and updates the family when needed.',
      icon: <Clock className="h-7 w-7" />,
    },
  ];

  const bureauSteps = [
    {
      title: isUrdu ? 'بیورو درخواست دیتا ہے' : 'Bureau Applies',
      text: isUrdu
        ? 'میرج بیورو اپنی کاروباری معلومات، شہر، صوبہ، رابطہ نمبر، تجربہ، فعال پروفائلز اور حوالہ جات جمع کرواتا ہے۔'
        : 'A marriage bureau submits business details, city, province, contact numbers, experience, active profiles and references.',
      icon: <ClipboardCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'ایڈمن تصدیق کرتا ہے' : 'Admin Verification',
      text: isUrdu
        ? 'MBN Pakistan درخواست کو چیک کرتا ہے اور صرف سنجیدہ، مناسب اور تصدیق شدہ بیوروز کو نیٹ ورک تک رسائی دیتا ہے۔'
        : 'MBN Pakistan checks the application and gives network access only to serious, suitable and verified bureaus.',
      icon: <ShieldCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'پروفائل اپلوڈ اور سرچ' : 'Upload & Search Profiles',
      text: isUrdu
        ? 'منظور شدہ بیورو bride/groom profiles اپلوڈ کر سکتا ہے، photo privacy منتخب کر سکتا ہے، اور network میں search کر سکتا ہے۔'
        : 'Approved bureaus can upload bride/groom profiles, choose photo privacy, and search the network.',
      icon: <Upload className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'کانٹیکٹ ویو اور نگرانی' : 'Contact View & Tracking',
      text: isUrdu
        ? 'Contact details hidden رہتے ہیں۔ View Contact پر system record رکھتا ہے کہ کس بیورو نے کس پروفائل کا contact دیکھا۔'
        : 'Contact details stay hidden. When View Contact is used, the system records which bureau viewed which profile contact.',
      icon: <Eye className="h-7 w-7" />,
    },
  ];

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader
        active="how"
        language={language}
        setLanguage={setLanguage}
        isUrdu={isUrdu}
      />

      <main>
        <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-[#137a4a]">
              <CheckCircle className="h-4 w-4" />
              {isUrdu ? 'سادہ، محفوظ اور پیشہ ورانہ طریقہ' : 'Simple, secure and professional'}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight text-[#073b24] md:text-6xl">
              {isUrdu ? 'MBN Pakistan کیسے کام کرتا ہے؟' : 'How MBN Pakistan Works'}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {isUrdu
                ? 'MBN Pakistan دو راستے فراہم کرتا ہے: خاندان اپنی پروفائل نجی طور پر جمع کروا سکتے ہیں، اور تصدیق شدہ میرج بیوروز ایک محفوظ نیٹ ورک میں پروفائلز اپلوڈ، سرچ اور manage کر سکتے ہیں۔'
                : 'MBN Pakistan supports two workflows: families can submit profiles privately, and verified marriage bureaus can upload, search and manage profiles inside a secure network.'}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b6e34] px-6 py-3.5 font-bold text-white hover:bg-[#07582a]">
                {isUrdu ? 'اپنی پروفائل جمع کروائیں' : 'Submit Your Profile'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b5f38] px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'بیورو کے طور پر اپلائی کریں' : 'Apply as a Bureau'}
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-green-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#137a4a]">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#073b24]">
                    {isUrdu ? 'افراد اور خاندانوں کے لیے طریقہ کار' : 'Procedure for Individuals & Families'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isUrdu ? 'پروفائل private review کے بعد process ہوتی ہے۔' : 'Profiles go through private review before any action.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {familySteps.map((step, index) => (
                  <StepCard
                    key={step.title}
                    number={String(index + 1).padStart(2, '0')}
                    title={step.title}
                    text={step.text}
                    icon={step.icon}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-[#062f20] p-6 text-white shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-green-200">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-black">
                    {isUrdu ? 'میرج بیوروز کے لیے طریقہ کار' : 'Procedure for Marriage Bureaus'}
                  </h2>
                  <p className="text-sm text-green-50/80">
                    {isUrdu ? 'Approved bureaus secure dashboard استعمال کرتے ہیں۔' : 'Approved bureaus use a secure dashboard.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {bureauSteps.map((step, index) => (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-green-200">
                        {step.icon}
                      </div>
                      <span className="font-heading text-4xl font-black text-white/10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-green-50/80">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-heading text-3xl font-black text-[#073b24]">
                {isUrdu ? 'Privacy اور Accountability built-in ہے' : 'Privacy and Accountability Are Built In'}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {isUrdu
                  ? 'پروفائلز sensitive ہوتی ہیں، اس لیے MBN Pakistan contact details hidden رکھتا ہے، photo privacy options دیتا ہے، اور contact views کو admin monitoring کے لیے record کرتا ہے۔'
                  : 'Marriage profiles are sensitive, so MBN Pakistan keeps contact details hidden, provides photo privacy options, and records contact views for admin monitoring.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title={isUrdu ? 'Contact hidden' : 'Hidden Contacts'} text={isUrdu ? 'رابطہ معلومات approved workflow کے بغیر visible نہیں ہوتیں۔' : 'Contact information is not visible without the approved workflow.'} icon={<Lock className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Photo privacy' : 'Photo Privacy'} text={isUrdu ? 'Photo public, blurred یا hidden رکھی جا سکتی ہے۔' : 'Photos can be public, blurred or hidden.'} icon={<ShieldCheck className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Search filters' : 'Search Filters'} text={isUrdu ? 'City, gender, caste, education, profession اور مزید filters سے search ہوتی ہے۔' : 'Search by city, gender, caste, education, profession and more.'} icon={<Search className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Network tracking' : 'Network Tracking'} text={isUrdu ? 'Admin دیکھ سکتا ہے کہ کس نے کس profile کا contact view کیا۔' : 'Admin can see who viewed which profile contact.'} icon={<Network className="h-6 w-6" />} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-[#073f46] via-[#0b5f38] to-[#168135] p-8 text-center text-white md:p-12">
            <h2 className="font-heading text-3xl font-black md:text-4xl">
              {isUrdu ? 'اب اپنا راستہ منتخب کریں' : 'Choose Your Next Step'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-green-50/90">
              {isUrdu
                ? 'اگر آپ خاندان ہیں تو profile submit کریں۔ اگر آپ bureau ہیں تو membership apply کریں۔'
                : 'Families can submit a profile. Bureaus can apply for membership and start using the professional dashboard.'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Profile'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/for-bureaus" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10">
                {isUrdu ? 'بیوروز کے لیے معلومات' : 'For Bureaus'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isUrdu={isUrdu} />
    </div>
  );
}


function PublicHeader({
  active,
  language,
  setLanguage,
  isUrdu,
}: {
  active: 'home' | 'how' | 'families' | 'bureaus' | 'about' | 'contact';
  language: string;
  setLanguage: (language: string) => void;
  isUrdu: boolean;
}) {
  const navItems = [
    { key: 'home', label: isUrdu ? 'ہوم' : 'Home', href: '/' },
    { key: 'how', label: isUrdu ? 'یہ کیسے کام کرتا ہے' : 'How It Works', href: '/how-it-works' },
    { key: 'families', label: isUrdu ? 'خاندانوں کے لیے' : 'For Families', href: '/for-families' },
    { key: 'bureaus', label: isUrdu ? 'بیوروز کے لیے' : 'For Bureaus', href: '/for-bureaus' },
    { key: 'about', label: isUrdu ? 'ہمارے بارے میں' : 'About Us', href: '/about' },
    { key: 'contact', label: isUrdu ? 'رابطہ کریں' : 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="h-10 w-10 flex-shrink-0 object-contain sm:h-12 sm:w-12"
          />
          <div className="hidden leading-tight min-[390px]:block">
            <p className="font-heading text-base font-bold tracking-[0.1em] text-[#063d25] sm:text-xl sm:tracking-[0.12em]">
              MBN
            </p>
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#063d25] sm:text-xs sm:tracking-[0.2em]">
              PAKISTAN
            </p>
            <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">
              {isUrdu ? 'میرج بیورو نیٹ ورک' : 'Marriage Bureau Network'}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-900 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                active === item.key
                  ? 'border-b-2 border-[#137a4a] pb-2 text-[#073b24]'
                  : 'hover:text-[#137a4a]'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <LanguageToggle language={language} setLanguage={setLanguage} />

          <Link
            href="/login"
            className="hidden rounded-lg border border-[#0b5f38] px-5 py-2.5 text-sm font-bold text-[#073b24] hover:bg-green-50 sm:inline-flex"
          >
            {isUrdu ? 'بیورو لاگ اِن' : 'Bureau Login'}
          </Link>

          <Link
            href="/submit-profile"
            className="rounded-lg bg-[#0b6e34] px-3 py-2.5 text-xs font-bold leading-tight text-white shadow-sm hover:bg-[#07582a] sm:px-5 sm:text-sm"
          >
            {isUrdu ? 'اپنی پروفائل جمع کروائیں' : 'Submit Your Profile'}
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-2 xl:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-start gap-5 overflow-x-auto whitespace-nowrap px-4 text-xs font-semibold text-slate-600 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={active === item.key ? 'text-[#137a4a]' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}



function PublicFooter({
  isUrdu,
}: {
  isUrdu: boolean;
}) {
  return (
    <footer className="mt-8 bg-[#073b24] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/mbn-logo.png"
            alt="MBN Pakistan"
            className="h-11 w-11 rounded-lg bg-white p-1 object-contain"
          />
          <div>
            <p className="font-heading font-bold">MBN Pakistan</p>
            <p className="mt-1 max-w-xl text-xs text-green-50/70">
              {isUrdu
                ? 'افراد، خاندانوں اور پیشہ ور میرج بیوروز کے لیے قابلِ اعتماد نیٹ ورک۔'
                : 'A trusted, privacy-focused matchmaking network for individuals, families, and professional marriage bureaus.'}
            </p>
          </div>
        </div>

        <p className="text-xs text-green-50/60">
          © {new Date().getFullYear()} MBN Pakistan. {isUrdu ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}



function StepCard({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#137a4a]">
          {icon}
        </div>
        <span className="font-heading text-4xl font-black text-slate-100">
          {number}
        </span>
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function InfoCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#137a4a]">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Bullet({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#137a4a]" />
      <p className="text-sm leading-6 text-slate-700">{children}</p>
    </div>
  );
}

