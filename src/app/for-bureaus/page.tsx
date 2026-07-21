'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  ClipboardCheck,
  Eye,
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

export default function ForBureausPage() {
  const { language, setLanguage, isUrdu } = useLanguage();

  const steps = [
    {
      title: isUrdu ? 'Membership application' : 'Membership Application',
      text: isUrdu
        ? 'Bureau apni business details, owner/contact information, city, province, experience aur references submit karta hai.'
        : 'The bureau submits business details, owner/contact information, city, province, experience and references.',
      icon: <ClipboardCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'Admin verification' : 'Admin Verification',
      text: isUrdu
        ? 'MBN Pakistan application review karta hai aur sirf verified bureaus ko approve karta hai.'
        : 'MBN Pakistan reviews the application and approves only verified bureaus.',
      icon: <ShieldCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'Dashboard access' : 'Dashboard Access',
      text: isUrdu
        ? 'Approval ke baad bureau login kar ke profiles upload, edit, search aur manage kar sakta hai.'
        : 'After approval, the bureau can login to upload, edit, search and manage profiles.',
      icon: <Building2 className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'Search and follow-up' : 'Search and Follow-up',
      text: isUrdu
        ? 'Bureau suitable profiles search karta hai, contact view workflow use karta hai aur follow-up ko professional rakhta hai.'
        : 'The bureau searches suitable profiles, uses the contact view workflow and keeps follow-up professional.',
      icon: <Search className="h-7 w-7" />,
    },
  ];

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader active="bureaus" language={language} setLanguage={setLanguage} isUrdu={isUrdu} />

      <main>
        <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-[#137a4a]">
              <Building2 className="h-4 w-4" />
              {isUrdu ? 'میرج بیوروز کے لیے' : 'For Marriage Bureaus'}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight text-[#073b24] md:text-6xl">
              {isUrdu ? 'اپنا matchmaking network professional بنائیں' : 'Build a More Professional Matchmaking Network'}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {isUrdu
                ? 'MBN Pakistan verified marriage bureaus ko ek secure dashboard deta hai jahan profiles upload, search, contact workflow aur follow-ups organized rehte hain.'
                : 'MBN Pakistan gives verified marriage bureaus a secure dashboard for profile upload, search, contact workflow and organized follow-ups.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b6e34] px-6 py-3.5 font-bold text-white hover:bg-[#07582a]">
                {isUrdu ? 'بیورو کے طور پر اپلائی کریں' : 'Apply as a Bureau'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b5f38] px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'بیورو لاگ اِن' : 'Bureau Login'}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#063f2a] p-6 shadow-sm">
            <img src="/mbn-bureau-dashboard.png" alt="MBN bureau dashboard" className="h-80 w-full rounded-[1.25rem] object-cover object-[72%_50%]" />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-black text-[#073b24] md:text-4xl">
              {isUrdu ? 'بیورو onboarding procedure' : 'Bureau Onboarding Procedure'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {isUrdu ? 'Application se dashboard access tak process clear aur controlled hai.' : 'From application to dashboard access, the process is clear and controlled.'}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.title} number={String(index + 1).padStart(2, '0')} title={step.title} text={step.text} icon={step.icon} />
            ))}
          </div>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-heading text-3xl font-black text-[#073b24]">
                {isUrdu ? 'Dashboard mein kya milega?' : 'What You Get in the Dashboard'}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {isUrdu
                  ? 'Dashboard bureau ko scattered WhatsApp aur manual lists se nikal kar ek organized professional workflow deta hai.'
                  : 'The dashboard moves bureaus away from scattered WhatsApp and manual lists into one organized professional workflow.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title={isUrdu ? 'Profile upload' : 'Profile Upload'} text={isUrdu ? 'Bride aur groom profiles detailed required fields ke saath add karein.' : 'Add bride and groom profiles with detailed required fields.'} icon={<Upload className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Smart search' : 'Smart Search'} text={isUrdu ? 'Gender, city, caste, education, profession aur keywords se search.' : 'Search by gender, city, caste, education, profession and keywords.'} icon={<Search className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Contact workflow' : 'Contact Workflow'} text={isUrdu ? 'Contact hidden rehta hai aur view activity admin track karta hai.' : 'Contacts stay hidden and view activity is tracked by admin.'} icon={<Eye className="h-6 w-6" />} />
              <InfoCard title={isUrdu ? 'Case follow-up' : 'Case Follow-up'} text={isUrdu ? 'Assigned public profiles par notes, work status aur follow-ups manage karein.' : 'Manage notes, work status and follow-ups on assigned public profiles.'} icon={<BarChart3 className="h-6 w-6" />} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="font-heading text-3xl font-black text-[#073b24]">
                {isUrdu ? 'Approval ke liye kya chahiye?' : 'What Is Needed for Approval?'}
              </h2>
              <div className="mt-6 space-y-4">
                <Bullet>{isUrdu ? 'Bureau ka legal/business name aur owner/contact person.' : 'Bureau legal/business name and owner/contact person.'}</Bullet>
                <Bullet>{isUrdu ? 'Mobile, WhatsApp, email, city, province aur office/address details.' : 'Mobile, WhatsApp, email, city, province and office/address details.'}</Bullet>
                <Bullet>{isUrdu ? 'Experience, active profiles, specializations aur service areas.' : 'Experience, active profiles, specializations and service areas.'}</Bullet>
                <Bullet>{isUrdu ? 'References ya social/business links jahan available hon.' : 'References or social/business links where available.'}</Bullet>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-[#062f20] p-8 text-white shadow-sm">
              <h2 className="font-heading text-3xl font-black">
                {isUrdu ? 'Professional rules' : 'Professional Rules'}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-5 w-5 text-green-300" /><p className="text-sm leading-6 text-green-50/90">{isUrdu ? 'Profiles ka misuse ya unauthorized sharing allowed nahi.' : 'Profile misuse or unauthorized sharing is not allowed.'}</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-5 w-5 text-green-300" /><p className="text-sm leading-6 text-green-50/90">{isUrdu ? 'Contact view activity admin monitor karta hai.' : 'Contact view activity is monitored by admin.'}</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-5 w-5 text-green-300" /><p className="text-sm leading-6 text-green-50/90">{isUrdu ? 'Only serious, verified bureaus network ka hissa ban sakte hain.' : 'Only serious, verified bureaus can become part of the network.'}</p></div>
                <div className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-5 w-5 text-green-300" /><p className="text-sm leading-6 text-green-50/90">{isUrdu ? 'Families ki privacy aur dignity ko priority di jati hai.' : 'Family privacy and dignity are treated as a priority.'}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-[#073f46] via-[#0b5f38] to-[#168135] p-8 text-center text-white md:p-12">
            <h2 className="font-heading text-3xl font-black md:text-4xl">
              {isUrdu ? 'MBN Pakistan network join karein' : 'Join the MBN Pakistan Network'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-green-50/90">
              {isUrdu ? 'Application submit karein. Approval ke baad aap professional dashboard use kar sakenge.' : 'Submit your application. After approval, you can start using the professional dashboard.'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'Membership apply karein' : 'Apply for Membership'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10">
                {isUrdu ? 'سوال پوچھیں' : 'Ask a Question'}
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

