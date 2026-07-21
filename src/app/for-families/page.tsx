'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  HeartHandshake,
  Lock,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';

export default function ForFamiliesPage() {
  const { language, setLanguage, isUrdu } = useLanguage();

  const steps = [
    {
      title: isUrdu ? 'اپنی پروفائل جمع کروائیں' : 'Submit Your Profile',
      text: isUrdu
        ? 'آپ یا آپ کا خاندان secure form میں candidate کی معلومات، family details، preferences اور 1-2 photos جمع کرواتا ہے۔'
        : 'You or your family submits candidate details, family information, preferences and 1-2 photos through the secure form.',
      icon: <HeartHandshake className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'Review پہلے ہوتا ہے' : 'Review Comes First',
      text: isUrdu
        ? 'آپ کی پروفائل فوراً public نہیں ہوتی۔ MBN Pakistan پہلے معلومات review کرتا ہے۔'
        : 'Your profile is not published instantly. MBN Pakistan reviews the information first.',
      icon: <ShieldCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'مناسب team کو assign' : 'Assigned to a Suitable Team',
      text: isUrdu
        ? 'اگر profile suitable ہو تو اسے کسی verified bureau یا matchmaker کو assign کیا جا سکتا ہے۔'
        : 'If suitable, the profile may be assigned to a verified bureau or matchmaker.',
      icon: <UserCheck className="h-7 w-7" />,
    },
    {
      title: isUrdu ? 'Follow-up اور privacy' : 'Follow-up with Privacy',
      text: isUrdu
        ? 'Contact details اور photo privacy platform workflow کے مطابق handle ہوتی ہے۔'
        : 'Contact details and photo privacy are handled through the platform workflow.',
      icon: <Lock className="h-7 w-7" />,
    },
  ];

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader active="families" language={language} setLanguage={setLanguage} isUrdu={isUrdu} />

      <main>
        <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-[#137a4a]">
              <Users className="h-4 w-4" />
              {isUrdu ? 'افراد اور خاندانوں کے لیے' : 'For Individuals & Families'}
            </span>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight text-[#073b24] md:text-6xl">
              {isUrdu ? 'اپنی پروفائل محفوظ طریقے سے جمع کروائیں' : 'Submit Your Profile with Privacy and Confidence'}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {isUrdu
                ? 'MBN Pakistan ایسے خاندانوں کے لیے بنایا گیا ہے جو اپنی معلومات private رکھ کر professional matchmaking support حاصل کرنا چاہتے ہیں۔'
                : 'MBN Pakistan is built for families who want to share their information privately and receive professional matchmaking support.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/submit-profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b6e34] px-6 py-3.5 font-bold text-white hover:bg-[#07582a]">
                {isUrdu ? 'پروفائل جمع کروائیں' : 'Submit Your Profile'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b5f38] px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
                {isUrdu ? 'طریقہ کار دیکھیں' : 'See How It Works'}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-[1.5rem] bg-[#fbf4e9] p-6">
              <img src="/mbn-family-hero.png" alt="Family reviewing a marriage profile" className="h-72 w-full rounded-[1.25rem] object-cover object-[68%_42%]" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-black text-[#073b24] md:text-4xl">
              {isUrdu ? 'خاندانوں کے لیے مکمل procedure' : 'Complete Procedure for Families'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {isUrdu ? 'ہر step review-first workflow پر based ہے۔' : 'Every step follows a review-first workflow.'}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.title} number={String(index + 1).padStart(2, '0')} title={step.title} text={step.text} icon={step.icon} />
            ))}
          </div>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-black text-[#073b24]">
                {isUrdu ? 'آپ کو کیا تیار رکھنا چاہیے؟' : 'What Should You Prepare?'}
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {isUrdu
                  ? 'Profile submit karne se pehle ye details ready rakhna process ko fast aur accurate banata hai.'
                  : 'Preparing these details before submitting helps the review process move faster and more accurately.'}
              </p>
            </div>

            <div className="grid gap-4">
              <Bullet>{isUrdu ? 'Candidate name, gender, date of birth, marital status, height, complexion, body type aur language.' : 'Candidate name, gender, date of birth, marital status, height, complexion, body type and language.'}</Bullet>
              <Bullet>{isUrdu ? 'Religion, sect, caste/community, city, province, nationality aur residence status.' : 'Religion, sect, caste/community, city, province, nationality and residence status.'}</Bullet>
              <Bullet>{isUrdu ? 'Education, profession, employment, job type, industry aur income range.' : 'Education, profession, employment, job type, industry and income range.'}</Bullet>
              <Bullet>{isUrdu ? 'Family details: total siblings, brothers, sisters, father aur mother occupation.' : 'Family details: total siblings, brothers, sisters, father and mother occupation.'}</Bullet>
              <Bullet>{isUrdu ? 'Kam az kam 1 candidate photo, maximum 2 photos.' : 'At least 1 candidate photo, maximum 2 photos.'}</Bullet>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <InfoCard title={isUrdu ? 'Private submission' : 'Private Submission'} text={isUrdu ? 'Profile direct public search mein publish nahi hoti.' : 'Your profile is not directly published into public search.'} icon={<Lock className="h-6 w-6" />} />
            <InfoCard title={isUrdu ? 'Professional review' : 'Professional Review'} text={isUrdu ? 'MBN team information check kar ke suitable action leti hai.' : 'The MBN team reviews information before taking suitable action.'} icon={<ShieldCheck className="h-6 w-6" />} />
            <InfoCard title={isUrdu ? 'Follow-up support' : 'Follow-up Support'} text={isUrdu ? 'Agar suitable opportunities available hon to team contact kar sakti hai.' : 'If suitable opportunities are available, the team may contact you.'} icon={<MessageCircle className="h-6 w-6" />} />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-[#073f46] via-[#0b5f38] to-[#168135] p-8 text-center text-white md:p-12">
            <h2 className="font-heading text-3xl font-black md:text-4xl">
              {isUrdu ? 'اپنا profile review شروع کریں' : 'Start Your Profile Review'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-green-50/90">
              {isUrdu ? 'Form complete karein. MBN Pakistan aapki details review karega.' : 'Complete the form and MBN Pakistan will review your details.'}
            </p>
            <Link href="/submit-profile" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#073b24] hover:bg-green-50">
              {isUrdu ? 'ابھی پروفائل جمع کروائیں' : 'Submit Profile Now'}
              <ArrowRight className="h-4 w-4" />
            </Link>
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

